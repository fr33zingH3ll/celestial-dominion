import Express from 'express';
import cors from 'cors';
import * as argon2 from "argon2";
import r from 'rethinkdb';
import DBManager from './DB.js';
import { JsonWebTokenAuth } from './jwt.js';
import http from 'http'; // Module http inclus avec Node.js
import WebSocket, { WebSocketServer } from 'ws';
import protobuf from 'protobufjs';
import { Event } from 'game-engine/src/utils/Event.js';
import { EventDispatcher } from 'game-engine/src/utils/EventDispatcher.js';

const API_PATH = "/api/v1";
const API_AUTH_PATH = API_PATH+"/auth";

class Server {
    constructor() {
        this.emitter = new EventDispatcher();
        this.db = new DBManager();
        this.players = {};
        this.message_queues = [];

        this.app = Express();
        this.server = http.createServer(this.app); // Créez un serveur HTTP
        this.wss = new WebSocketServer({ server: this.server }); // Créez un serveur WebSocket
        this.jwtService = new JsonWebTokenAuth();

        this.port = 3000;
        this.app.use(cors());
        // Middleware pour traiter le corps des requêtes en JSON
        this.app.use(Express.json());

        // Définir les routes ici
        this.app.get('/api/hello', this.handleHelloRequest.bind(this));

        this.app.post(API_AUTH_PATH + "/login", async (req, res) => {
            const body = req.body;
        
            if (!body.username || !body.password) {
                return res.status(400).json({ erreur: "Un des champs est vide" }); // Bad Request
            }
        
            const users = await r.table('user').filter({ username: body.username }).run(this.db.conn);
            let result;
            try {
                result = await users.next();
            } catch (error) {
                return res.status(500).json({ erreur: error.msg }); // Internal Server Error
            }
        
            if (!await argon2.verify(result.password, body.password)) {
                return res.status(401).json({ erreur: "Mauvais mot de passe" }); // Unauthorized
            }
        
            const options = {
                expiresIn: "1h"
            };
        
            return res.status(200).json({ token: this.jwtService.jwtSign({ sub: result.id }, options) });
        });
        
        this.app.post(API_AUTH_PATH + "/register", async (req, res) => {
            const body = req.body;
        
            if (!body.username || !body.password) {
                return res.status(400).json({ erreur: "Un des champs est vide" }); // Bad Request
            }
        
            const users = await r.table('user').filter({ username: body.username }).run(this.db.conn);
            let result;
            try {
                result = await users.next();
                return res.status(409).json({ erreur: "Utilisateur déjà existant" }); // 409 Conflict
            } catch (error) { }
        
            const password = await argon2.hash(body.password);
            await r.table('user').insert({ username: body.username, password: password }).run(this.db.conn);
            return res.status(201).json({ res: "Enregistrement terminé" }); // 201 Created
        });
        
        this.app.post(API_PATH + "/report", async (req, res) => {
            const body = req.body;
        
            if (!body.type || !body.description) {
                return res.status(400).json({ error: "Le report n'est pas complet. Erreur dans l'enregistrement de votre report." }); // Bad Request
            }
        
            const type = body.type;
            const description = body.description;
            try {
                await r.table('report').insert({ type: type, description: description }).run(this.db.conn);    
            } catch(error) {
                return res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement de votre votre report." })
            }
            
            return res.status(201).json({ succes: "L'enregistrement de votre report a bien été effectué." }); // 201 Created
        });
        

        // Gérez les connexions WebSocket
        this.wss.on('connection', this.handleWebSocketConnection.bind(this));
    }

    async start() {
        this.proto = await protobuf.load('../proto/game.proto');

        this.server.listen(this.port, '127.0.0.1', () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        });
    }

    handleHelloRequest(req, res) {
        res.json({ message: 'Hello from your API!' });
    }

    /**
     * @param {WebSocket} ws 
     */
    handleWebSocketConnection(ws) {
        console.log('WebSocket connected');
        const wrap = this.proto.lookupType('MessageWrapper');

        let connection;

        // Écoutez les messages WebSocket
        ws.on('message', async (message) => {
            try {
                const msg = wrap.decode(message);
                console.log('Got message', msg);
                const keys = Object.keys(msg);
                const firstKey = keys[0];

                if (firstKey === 'handshakeRequest') {
                    const result = await this.jwtService.jwtVerify(msg[firstKey].token);
                    if (result.error) {
                        console.warn("Closing connection for invalid token.");
                        const error = this.proto.lookupType('Error');
                        this.sendMessage(ws, { error: error.create({ error: result.error }) }, () => {
                            ws.close();
                        });
                        return;
                    }
                    connection = {
                        username: result.sub.username,
                        webSocket: ws,
                    };
                    // FIXME id in jwt as key
                    this.players[connection.username] = connection;

                    this.emitter.dispatchEvent(new Event('loginSuccess', connection));
                }

                if (connection) {
                    this.emitter.dispatchEvent(new Event(firstKey, { message: msg[firstKey], connection }));
                } else {
                    console.warn("Closing connection for invalid handshake");
                    const error = this.proto.lookupType('Error');
                    this.sendMessage(ws, { error }, () => {
                        ws.close();
                    });
                }
            } catch (e) {
                console.error(e);
                ws.close();
            }
        });

        // Gérez la fermeture de la connexion WebSocket
        ws.on('close', () => {
            console.log('WebSocket disconnected');

            if (connection) {
                this.emitter.dispatchEvent(new Event('playerDisconnected', connection));
                delete this.players[connection.username];
            }
        });
    }

    callbackHandshake(connection, userId, initialPosition, initialRotation) {
        const res = this.proto.lookupType('HandshakeResponse');
        console.log(connection.username)

        this.sendMessage(connection.webSocket, {
            handshakeResponse: res.create({
                username: connection.username,
                userId,
                initialPosition,
                initialRotation,
            })
        });
    }

    broadcastRemovedEntity(entity) {
        const del = this.proto.lookupType('ServerEntityDelete');
        this.broadcastMessage({ serverEntityDelete: del.create({ entityId: entity.id }) });
    }

    broadcastNewEntities(entities) {
        for (const player of Object.values(this.players)) {
            this.sendNewEntities(player.webSocket, entities);
        }
    }

    sendNewEntities(ws, entities) {
        const toSend = [];
        const datum = this.proto.lookupType('ServerEntityCreateDatum');
        const data = this.proto.lookupType('ServerEntityCreate');

        for (const entity of entities) {
            toSend.push(datum.create({
                entityId: entity.id,
                type: entity.constructor.name,
                prototype: entity.prototypeName,
                state: entity.serializeState(),
            }));
        }

        this.sendMessage(ws, { serverEntityCreate: data.create({ data: toSend }) });
    }

    broadcastUpdates(entities) {
        const toSend = [];
        const datum = this.proto.lookupType('ServerEntityUpdateDatum');
        const data = this.proto.lookupType('ServerEntityUpdate');

        for (const entity of entities) {
            toSend.push(datum.create({
                entityId: entity.id,
                state: entity.serializeState(),
            }));
        }

        this.broadcastMessage({ serverEntityUpdate: data.create({ data: toSend }) });
    }

    broadcastMessage(msg) {
        for (const player of Object.values(this.players)) {
            this.sendMessage(player.webSocket, msg);
        }
    }

    sendMessage(ws, msg, cb) {
        const wrap = this.proto.lookupType('MessageWrapper');

        ws.send(wrap.encode(wrap.create(msg)).finish(), cb);
    }
}

export { Server };