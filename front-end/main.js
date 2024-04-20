import "./style.css";
import { Socket } from "./api";
import { MainGame } from "./src/scenes/MainGame.js";

(async () => {
    const socket = new Socket('ws://127.0.0.1:3000/');
    await socket.init();
    await socket.sendHandshake(new String(Math.random()));
    const game = new MainGame(socket);
    game.start();
})();
