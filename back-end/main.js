/**
 * Boucle du serveur de jeu.
 * Le temps réel est accumulé, puis converti en pas fixes de SERVER_TICK_MS.
 * Au-delà de MAX_CATCHUP_STEPS, le retard est abandonné pour éviter
 * une suite de pas qui ne rattrape jamais l'horloge.
 */
import { BackGameMaster } from "./src/gamemaster.js";
import { advanceGame, installProcessGuards, logServerError } from "./src/guard.js";
import { MAX_CATCHUP_STEPS, SERVER_TICK_MS } from "game-engine/src/sim/tick.js";

/**
 * Le processus reste là si le démarrage ou un pas échoue.
 * La boucle ne redémarre pas toute seule.
 */
installProcessGuards();

(async () => {
	let game;
	try {
		game = new BackGameMaster();
		const listening = await game.start();
		if (!listening) return;

		let last = Date.now();
		let accumulator = 0;
		setInterval(() => {
			const now = Date.now();
			const elapsed = now - last;
			last = now;
			accumulator = advanceGame(game, accumulator, elapsed, SERVER_TICK_MS, MAX_CATCHUP_STEPS);
		}, SERVER_TICK_MS);
	} catch (error) {
		logServerError('start', error);
	}
})();
