import Express from 'express';
import cors from 'cors';
import * as argon2 from "argon2";
import { randomUUID } from 'node:crypto';
import DBManager from './DB.js';
import { JsonWebTokenAuth } from './jwt.js';
import http from 'http'; // Module http inclus avec Node.js
import WebSocket, { WebSocketServer } from 'ws';
import protobuf from 'protobufjs';
import { fileURLToPath } from 'node:url';
import { Event } from 'game-engine/src/utils/Event.js';
import { EventDispatcher } from 'game-engine/src/utils/EventDispatcher.js';
import { logServerError } from './guard.js';
import 'dotenv/config';

const PROTO_PATH = fileURLToPath(new URL('../../proto/game.proto', import.meta.url));

const API_PATH = "/api/v1";
const API_AUTH_PATH = API_PATH + "/auth";
const DEFAULT_CORS_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173,https://galactic-seeker.freezinghell.net';

/**
 * @param {Express.Response} res
 * @param {number} status
 * @param {string} message
 */
function sendError(res, status, message) {
    return res.status(status).json({ error: message, erreur: message });
}

/**
 * Class representing the server.
 */
class Server {
    constructor() {
        /**
         * Event dispatcher instance.
         * @type {EventDispatcher}
         */
        this.emitter = new EventDispatcher();
        /**
         * Database manager instance.
         * @type {DBManager}
         */
        this.db = new DBManager();
        /**
         * Object to hold player connections.
         * @type {Object<string, Object>}
         */
        this.players = {};
        /**
         * Array to hold message queues.
         * @type {Array}
         */
        this.message_queues = [];

        this.app = Express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server, maxPayload: 16 * 1024 });
        this.jwtService = new JsonWebTokenAuth(this.db);

        this.port = 3000;
        const origins = (process.env.CORS_ORIGINS || DEFAULT_CORS_ORIGINS)
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean);
        this.app.use(cors({ origin: origins }));
        this.app.use(Express.json({ limit: '8kb' }));

        // Définir les routes ici
        this.app.get('/api/hello', this.handleHelloRequest.bind(this));

        this.app.post(API_AUTH_PATH + "/login", async (req, res) => {
            const body = req.body;

            if (!body.username || !body.password) {
                return sendError(res, 400, "Un des champs est vide");
            }

            try {
                const users = await this.db.query(
                    'SELECT id, username, password FROM `user` WHERE username = ? LIMIT 1',
                    [body.username]
                );
                const result = users[0];
                if (!result || !await argon2.verify(result.password, body.password)) {
                    return sendError(res, 401, "Mauvais mot de passe");
                }

                return res.status(200).json({
                    token: this.jwtService.jwtSign({ sub: result.id }, { expiresIn: "1h" }),
                });
            } catch (error) {
                return sendError(res, 500, "Erreur de connexion à la base de données");
            }
        });

        this.app.post(API_AUTH_PATH + "/register", async (req, res) => {
            const body = req.body;

            if (!body.username || !body.password) {
                return sendError(res, 400, "Un des champs est vide");
            }

            try {
                const users = await this.db.query(
                    'SELECT id FROM `user` WHERE username = ? LIMIT 1',
                    [body.username]
                );
                if (users.length) {
                    return sendError(res, 409, "Utilisateur déjà existant");
                }

                const password = await argon2.hash(body.password);
                await this.db.query(
                    'INSERT INTO `user` (id, username, password) VALUES (?, ?, ?)',
                    [randomUUID(), body.username, password]
                );
                return res.status(201).json({ res: "Enregistrement terminé" });
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    return sendError(res, 409, "Utilisateur déjà existant");
                }
                return sendError(res, 500, "Erreur de connexion à la base de données");
            }
        });

        this.app.post(API_PATH + "/report", this.requireAuth.bind(this), async (req, res) => {
            const body = req.body;

            if (!body.type || !body.description) {
                return sendError(res, 400, "Le report n'est pas complet. Erreur dans l'enregistrement de votre report.");
            }

            const type = body.type;
            const description = body.description;
            try {
                await this.db.query(
                    'INSERT INTO report (id, type, description) VALUES (?, ?, ?)',
                    [randomUUID(), type, description]
                );
            } catch (error) {
                return sendError(res, 500, "Une erreur est survenue lors de l'enregistrement de votre votre report.");
            }

            return res.status(201).json({ succes: "L'enregistrement de votre report a bien été effectué." }); // 201 Created
        });

        // Gérez les connexions WebSocket
        this.wss.on('connection', this.handleWebSocketConnection.bind(this));
        this.wss.on('error', (error) => logServerError('websocket-server', error));

        // Dernier recours HTTP : une route async qui jette doit répondre, pas tuer le processus.
        this.app.use((error, req, res, next) => {
            logServerError('http', error);
            if (res.headersSent) {
                next(error);
                return;
            }
            const invalid = error?.type === 'entity.parse.failed';
            sendError(res, invalid ? 400 : 500, invalid ? 'Requête illisible' : 'Erreur interne');
        });
    }

    /**
     * Ouvre le port même si la base ou le proto manquent.
     * @returns {Promise<boolean>} vrai si le port écoute.
     */
    async start() {
        try {
            await this.db.connecting;
        } catch (error) {
            logServerError('database', error);
        }

        try {
            this.proto = await protobuf.load(PROTO_PATH);
        } catch (error) {
            logServerError('proto', error);
            this.proto = null;
        }

        this.listening = await this.listen();
        return this.listening;
    }

    /**
     * @returns {Promise<boolean>}
     */
    listen() {
        return new Promise((resolve) => {
            const onError = (error) => {
                logServerError('http', error);
                resolve(false);
            };
            this.server.once('error', onError);
            this.server.listen(this.port, '127.0.0.1', () => {
                this.server.off('error', onError);
                this.server.on('error', (error) => logServerError('http', error));
                console.log(`Server is running at http://localhost:${this.port}`);
                resolve(true);
            });
        });
    }

    /**
     * Exige un JWT Bearer. Le front envoie déjà Authorization.
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {Express.NextFunction} next
     */
    async requireAuth(req, res, next) {
        try {
            const header = req.headers.authorization || '';
            const token = header.startsWith('Bearer ') ? header.slice(7) : '';
            if (!token) {
                return sendError(res, 401, 'Jeton manquant');
            }

            const result = await this.jwtService.jwtVerify(token);
            if (result.error) {
                return sendError(res, 401, result.error);
            }

            req.user = result.sub;
            next();
        } catch (error) {
            logServerError('auth', error);
            if (!res.headersSent) {
                sendError(res, 500, 'Erreur interne');
            }
        }
    }

    /**
     * Handle a hello request.
     * @param {Express.Request} req - The request object.
     * @param {Express.Response} res - The response object.
     */
    handleHelloRequest(req, res) {
        res.json({ message: 'Hello from your API!' });
    }

    /**
     * Handle a WebSocket connection.
     * @param {WebSocket} ws - The WebSocket connection.
     */
    handleWebSocketConnection(ws) {
        ws.on('error', (error) => logServerError('websocket', error));
        if (!this.proto) {
            ws.close();
            return;
        }

        console.log('WebSocket connected');
        const wrap = this.proto.lookupType('MessageWrapper');

        let connection;

        // Écoutez les messages WebSocket
        ws.on('message', async (message) => {
            try {
                const msg = wrap.decode(message);
                const keys = Object.keys(msg);
                const firstKey = keys[0];
                if (firstKey === 'handshakeRequest') {
                    const result = await this.jwtService.jwtVerify(msg[firstKey].token);
                    if (result.error) {
                        console.warn("Closing connection for invalid token.");
                        const error = this.proto.lookupType('Error');
                        this.sendMessage(ws, { error: error.create({ message: result.error }) }, () => {
                            ws.close();
                        });
                        return;
                    }
                    const previous = this.players[result.sub.username];
                    if (previous && previous.webSocket !== ws) {
                        previous.replaced = true;
                        delete this.players[previous.username];
                        this.emitter.dispatchEvent(new Event('playerDisconnected', previous));
                        previous.webSocket.close();
                    }

                    connection = {
                        username: result.sub.username,
                        webSocket: ws,
                    };
                    this.players[connection.username] = connection;

                    this.emitter.dispatchEvent(new Event('loginSuccess', connection));
                }

                if (connection) {
                    this.emitter.dispatchEvent(new Event(firstKey, { message: msg[firstKey], connection }));
                } else {
                    console.warn("Closing connection for invalid handshake");
                    const error = this.proto.lookupType('Error');
                    this.sendMessage(ws, { error: error.create({ message: 'Poignée de main manquante' }) }, () => {
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

            try {
                if (!connection || connection.replaced) return;
                if (this.players[connection.username] === connection) {
                    delete this.players[connection.username];
                }
                this.emitter.dispatchEvent(new Event('playerDisconnected', connection));
            } catch (error) {
                logServerError('websocket-close', error);
            }
        });
    }

    /**
     * Send handshake response to a client.
     * @param {Object} connection - The client connection object.
     * @param {string} userId - The user ID.
     * @param {Object} initialPosition - The initial position.
     * @param {Object} initialRotation - The initial rotation.
     */
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

    /**
     * Broadcast the removal of an entity.
     * @param {Object} entity - The entity to remove.
     */
    broadcastRemovedEntity(entity) {
        const del = this.proto.lookupType('ServerEntityDelete');
        this.broadcastMessage({ serverEntityDelete: del.create({ entityId: entity.id }) });
    }

    /**
     * Broadcast new entities to all connected clients.
     * @param {Array<Object>} entities - The entities to broadcast.
     */
    broadcastNewEntities(entities) {
        for (const player of Object.values(this.players)) {
            this.sendNewEntities(player.webSocket, entities);
        }
    }

    /**
     * Send new entities to a specific client.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {Array<Object>} entities - The entities to send.
     */
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

    /**
     * Broadcast updates of entities to all connected clients.
     * @param {Array<Object>} entities - The entities to update.
     */
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

    /**
     * Broadcast a message to all connected clients.
     * @param {Object} msg - The message to broadcast.
     */
    broadcastMessage(msg) {
        for (const player of Object.values(this.players)) {
            this.sendMessage(player.webSocket, msg);
        }
    }

    /**
     * Send a message to a specific client.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {Object} msg - The message to send.
     * @param {Function} [cb] - Optional callback to execute after sending the message.
     */
    sendMessage(ws, msg, cb) {
        if (!this.proto || !ws || ws.readyState !== WebSocket.OPEN) return;

        try {
            const wrap = this.proto.lookupType('MessageWrapper');
            ws.send(wrap.encode(wrap.create(msg)).finish(), cb);
        } catch (error) {
            logServerError('websocket-send', error);
        }
    }
}

export { Server };
