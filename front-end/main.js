/**
 * Point d'entrée du client.
 * Un jeton dans localStorage ouvre la partie. Sinon, la page d'accueil.
 * L'adresse du WebSocket vient de VITE_WEB_SOCKET_URI.
 */
import "./main.css";
import { Socket } from "./api";
import { MainGame } from "./src/scenes/MainGame.js";

const token = localStorage.getItem('token');
if (token && token != "undefined") {
    (async () => {
        const socket = new Socket(import.meta.env.VITE_WEB_SOCKET_URI);
        // const socket = new Socket('ws://localhost:3000/');
        await socket.init();
        await socket.sendHandshake(token);
        const game = new MainGame(socket);
        game.start();
    })();
} else {
    window.location.replace('/home.html');
}

