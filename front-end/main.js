import "./style.css";
import { Application } from "pixi.js";
import { MainGame } from "./src/gamemode/MainGame.js";
import { Socket } from "./api";

new Socket('ws://127.0.0.1:3001/', undefined);

const game = new MainGame();
game.start();




