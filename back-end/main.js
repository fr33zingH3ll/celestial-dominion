/**
 * Le serveur ouvre les comptes et l'API.
 * La partie de plateau n'a pas encore de session : rien ne simule un jeu ici.
 */
import { Server } from "./src/api.js";
import { installProcessGuards, logServerError } from "./src/guard.js";

installProcessGuards();

const server = new Server();
server.start().catch((error) => logServerError('start', error));
