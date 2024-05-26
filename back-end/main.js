import { GameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";

(async () => {
	const game = new GameMaster();
	await game.start();
	let previousTime = Date.now();
	setInterval(() => {
		game.update(Date.now() - previousTime);
		previousTime = Date.now();
	}, 1/30*1000);	
})();
