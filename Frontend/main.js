import "./style.css";
import { MainGame } from "./src/gameMode/MainGame.js";
import { Application } from "pixi.js";
import { Socket } from "./api.js";

const app = new Application({ resizeTo: window });
// Append the canvas element to the body
document.body.appendChild(app.view);
const game = new MainGame(app);
