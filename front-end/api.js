import protobuf from 'protobufjs';
import { EventDispatcher } from 'game-engine/src/utils/EventDispatcher';
import { Event } from 'game-engine/src/utils/Event';

class Socket {
    constructor(url) {
        this.socket = new WebSocket(url);
        this.emitter = new EventDispatcher();
        this.socket.binaryType = 'arraybuffer';
        this.socket.addEventListener("message", (event) => {
            try {
                const wrap = this.proto.lookupType('MessageWrapper');
                const msg = wrap.decode(new Uint8Array(event.data));
                console.debug(msg);
                const type = Object.keys(msg)[0];
                const message = msg[type];
                this.emitter.dispatchEvent(new Event(type, message));
            } catch (e) {
                console.error(e);
                this.socket.close();
            }
        });
    }

    async init() {
        this.proto = await (new protobuf.Root().load("/game.proto"));
        await this.awaitOpen();
    }

    sendHandshake(token) {
        const hs = this.proto.lookupType("HandshakeRequest");

        this.sendMessage({ handshakeRequest: hs.create({ token })});
    }

    /**
     * @param {protobuf.Message} msg 
     * @param {protobuf.Type} type
     */
    sendMessage(msg) {
        const wrap = this.proto.lookupType('MessageWrapper');

        this.socket.send(wrap.encode(wrap.create(msg)).finish());
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