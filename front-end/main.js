import "./style.css";
import { Socket } from "./api";
import { MainGame } from "./src/scenes/MainGame.js";

(async () => {
    const socket = new Socket('wss://galactic-seeker-api.freezinghell.net/');
    await socket.init();
    await socket.sendHandshake(new String(Math.random()));
    const game = new MainGame(socket);
    game.start();
})();
