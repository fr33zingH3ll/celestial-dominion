import { BackGameMaster } from "./src/gamemaster.js";
import { MAX_CATCHUP_STEPS, SERVER_TICK_MS } from "game-engine/src/sim/tick.js";

(async () => {
	const game = new BackGameMaster();
	await game.start();
	let last = Date.now();
	let accumulator = 0;
	setInterval(() => {
		const now = Date.now();
		accumulator += now - last;
		last = now;
		let steps = 0;
		while (accumulator >= SERVER_TICK_MS && steps < MAX_CATCHUP_STEPS) {
			game.update(SERVER_TICK_MS);
			accumulator -= SERVER_TICK_MS;
			steps += 1;
		}
		if (steps === MAX_CATCHUP_STEPS) {
			accumulator = 0;
		}
	}, SERVER_TICK_MS);
})();
