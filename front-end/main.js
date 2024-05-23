import "./public/assets/css/main.css";
import { Socket } from "./api";
import { MainGame } from "./src/scenes/MainGame.js";

const token = localStorage.getItem('token');
if (token && token != "undefined") {
    (async () => {
        const socket = new Socket('ws://galactic-seeker-api.freezinghell.net/');
        await socket.init();
        await socket.sendHandshake(token);
        const game = new MainGame(socket);
        game.start();
    })();
} else {
    window.location.replace('/home.html');
}

