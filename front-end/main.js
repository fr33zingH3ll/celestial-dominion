import "./style.css";
import { Socket } from "./api";
import { MainGame } from "./src/scenes/MainGame.js";

const token = localStorage.getItem('token');
if (token && token != "undefined") {
    (async () => {
        const socket = new Socket('wss://galactic-seeker-api.freezinghell.net/');
        await socket.init();
        await socket.sendHandshake(localStorage.getItem('token'));
        const game = new MainGame(socket);
        game.start();
    })();
} else {
    window.location.replace('http://localhost:5173/home.html');
}

