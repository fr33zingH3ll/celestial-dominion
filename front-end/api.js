import { MainGame } from './src/gamemode/MainGame.js';

class Socket {
    constructor(URL, app) {
        this.socket = new WebSocket(URL);
        this.app = app;
        this.setupScoketListener();
        // Connection opened
        this.socket.addEventListener("open", (event) => {
            this.socket.send("Hello server !");
        });
                
        // Listen for messages
        this.socket.addEventListener("message", (event) => {
        });
    }
}

export { Socket };