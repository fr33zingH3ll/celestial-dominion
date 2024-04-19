import { BackGameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";

const server = new Server(new BackGameMaster());
