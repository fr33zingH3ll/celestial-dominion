import { BackGameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";

(async () => {
	const server = new Server(new BackGameMaster());
	await server.start();
})();
