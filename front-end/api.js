import { MainGame } from './src/gamemode/MainGame.js';
import protobuf from 'protobufjs';

class Socket {
    constructor(url) {
        this.socket = new WebSocket(url);

        this.sendHandshake("blabla");
    }

    async sendHandshake(token) {
        await this.awaitOpen();

        this.proto = await (new protobuf.Root().load("game.proto"));

        const hs = this.proto.lookupType('HandshakeRequest');
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