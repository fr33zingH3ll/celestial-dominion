import { BackGameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";

(async () => {
	const game = new BackGameMaster();
	await game.start();
})();
