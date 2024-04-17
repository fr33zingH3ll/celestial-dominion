import "./style.css";
import { MainGame } from "./src/gamemode/MainGame.js";
import { Socket } from "./api";

(async () => {
    const socket = new Socket('ws://127.0.0.1:3000/');
    await socket.init();
    await socket.sendHandshake("blabla");
    const game = new MainGame(socket);
    game.start();
})();


