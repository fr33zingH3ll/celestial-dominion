import Express from 'express';
import http from 'http'; // Module http inclus avec Node.js
import WebSocket, { WebSocketServer } from 'ws';
import protobuf from 'protobufjs';
import { EventEmitter } from 'events';

const proto = protobuf.loadSync('../proto/game.proto');
const MessageWrapper = proto.lookupType('MessageWrapper');

class Server {
    constructor(game_master) {
        this.gamemaster = game_master;
        this.players = {};
        this.message_queues = [];
        // Créez un émetteur d'événements personnalisé
        this.emitter = new EventEmitter();

        this.app = Express();
        // Middleware pour ajouter l'en-tête CSP
        this.app.use((req, res, next) => {
            res.append('Access-Control-Allow-Origin', "http://192.168.1.82:5174");
            next();
        });
        this.server = http.createServer(this.app); // Créez un serveur HTTP
        this.wss = new WebSocketServer({ server: this.server }); // Créez un serveur WebSocket

        this.port = 3000;

        // Middleware pour traiter le corps des requêtes en JSON
        this.app.use(Express.json());

        // Définir les routes ici
        this.app.get('/api/hello', this.handleHelloRequest.bind(this));

        // Gérez les connexions WebSocket
        this.wss.on('connection', this.handleWebSocketConnection.bind(this));

        // Lance le serveur
        this.server.listen(this.port, () => {
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

        // Écoutez les messages WebSocket
        ws.on('message', (message) => {
            try {
                const msg = MessageWrapper.decode(message);
                const keys = Object.keys(msg);
                const firstKey = keys[0];
                this.emitter.emit(firstKey, msg[firstKey]);
                console.log(msg)
            } catch (e) {
                console.error(e);
                ws.close();
            }
        });

        // Gérez la fermeture de la connexion WebSocket
        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    }
}

export { Server };