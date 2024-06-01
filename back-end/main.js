import { GameMaster } from "./src/gamemaster.js";
import { Server } from "./src/api.js";
import DBManager from "./src/DB.js";

(async () => {
	const BDDManager = new DBManager();
	const game = new GameMaster(BDDManager);
	await game.start();
	let previousTime = Date.now();
	setInterval(() => {
		game.update(Date.now() - previousTime);
		previousTime = Date.now();
	}, 1/30*1000);	
})();
