import Express from 'express';
import * as argon2 from "argon2";
import r from 'rethinkdb';
import { JsonWebTokenAuth } from './jwt.js';
import http from 'http'; // Module http inclus avec Node.js
import WebSocket, { WebSocketServer } from 'ws';
import protobuf from 'protobufjs';
import { Event } from 'game-engine/src/utils/Event.js';
import { EventDispatcher } from 'game-engine/src/utils/EventDispatcher.js';

const API_AUTH_PATH = "/api/v1/auth";

class Server {
    constructor() {
        this.emitter = new EventDispatcher();
        this.players = {};
        this.message_queues = [];

        this.app = Express();
        this.server = http.createServer(this.app); // Créez un serveur HTTP
        this.wss = new WebSocketServer({ server: this.server }); // Créez un serveur WebSocket
        this.jwtService = new JsonWebTokenAuth();
        this.connect();

        this.port = 3000;

        // Middleware pour traiter le corps des requêtes en JSON
        this.app.use(Express.json());

        // Définir les routes ici
        this.app.get('/api/hello', this.handleHelloRequest.bind(this));

        this.app.post(API_AUTH_PATH+"/login", async (req, res) => {
            const body = req.body;

            if (!body.username || !body.password) {
                res.json({erreur: "un des champs est vide"});
                return;
            }

            const users = await r.table('user').filter({ username: body.username }).run(this.conn);
            let result;
            try {
                result = await users.next(); 
            } catch (error) {
                res.json({ erreur: error.msg });
                return;
            }

            if (!await argon2.verify(result.password, body.password)) {
                res.json({ erreur: "mauvais mot de passe." });
                return;
            }

            const options = {
                expiresIn: "1h"
            };

            res.json({ token: this.jwtService.jwtSign({ sub: result.id }, options) });
        });

        this.app.post(API_AUTH_PATH+"/register", async (req, res) => {
            const body = req.body;

            if (!body.username || !body.password) {
                res.json({erreur: "un des champs est vide"});
                return;
            }

            const users = await r.table('user').filter({ username: body.username }).run(this.conn);
            let result;
            try {
                result = await users.next();
                res.json({ erreur: "utilisateur déjà existant." });
                return;
            } catch (error) {  }

            const password = await argon2.hash(body.password);
            r.table('user').insert({ username: body.username, password: password }).run(this.conn);
            res.json({ res: "enregistrement terminé." });
        });

        // Gérez les connexions WebSocket
        this.wss.on('connection', this.handleWebSocketConnection.bind(this));
    }

    async connect () {
        this.conn = await r.connect({ host: 'localhost', port: 28015, db: 'galactik-seeker', user: 'fr33zingH3ll', password: 'ziJY2jq6329MBu' });
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
        ws.on('message', (message) => {
            try {
                const msg = wrap.decode(message);
                console.debug('Got message', msg);
                const keys = Object.keys(msg);
                const firstKey = keys[0];

                if (firstKey === 'handshakeRequest') {
                    connection = {
                        username: msg[firstKey].token,
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