import { MainGame } from './src/gamemode/MainGame.js';
import protobuf from 'protobufjs';

class Socket {
    constructor(url) {
        this.socket = new WebSocket(url);
        this.socket.addEventListener("message", (event) => {
            try {
                const msg = MessageWrapper.decode(message);
                console.log(msg);
            } catch (e) {
                console.error(e);
                ws.close();
            }
        });
    }

    async init() {
        this.proto = await (new protobuf.Root().load("/game.proto"));
        await this.awaitOpen();
    }

    async sendHandshake(token) {
        const hs = this.proto.lookupType("HandshakeRequest");
        const wrap = this.proto.lookupType('MessageWrapper');

        this.sendMessage(wrap.create({ handshakeRequest: hs.create({ token }) }), wrap);
    }

    /**
     * @param {protobuf.Message} msg 
     * @param {protobuf.Type} type
     */
    sendMessage(msg, type) {
        this.socket.send(type.encode(msg).finish());
    }

    awaitOpen() {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            this.socket.addEventListener("open", () => {
                resolve();
            });
        });
    }
}

export { Socket };