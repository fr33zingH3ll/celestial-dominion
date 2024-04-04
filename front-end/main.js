import "./style.css";
import { MainGame } from "./src/gamemode/MainGame.js";
import { Socket } from "./api";



const game = new MainGame(new Socket('ws://127.0.0.1:3001/'));
game.start();




