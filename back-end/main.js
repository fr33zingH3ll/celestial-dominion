import { BackGameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";

(async () => {
	const game = new BackGameMaster();
	await game.start();
	let previousTime = Date.now();
	setInterval(() => {
		game.update(Date.now() - previousTime);
		previousTime = Date.now();
	}, 1/30*1000);	
})();
