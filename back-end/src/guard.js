/**
 * Empêche une erreur isolée d'arrêter le processus.
 * Rien ici ne relance la partie : le pas suivant reprend l'horloge,
 * et les routes continuent de répondre.
 */

/**
 * @param {string} label
 * @param {unknown} error
 */
export function logServerError(label, error) {
    console.error(`[${label}]`, error);
}

/**
 * Dernier filet. Un listener empêche Node d'arrêter le processus.
 * Les fautes connues sont déjà attrapées plus près de leur source.
 */
export function installProcessGuards() {
    process.on('uncaughtException', (error) => {
        logServerError('uncaughtException', error);
    });
    process.on('unhandledRejection', (reason) => {
        logServerError('unhandledRejection', reason);
    });
}

/**
 * Convertit le temps écoulé en pas fixes.
 * Si `update` jette, le pas est quand même consommé et la fonction revient.
 * @param {{ update: (delta: number) => void }} game
 * @param {number} accumulator
 * @param {number} elapsed
 * @param {number} tickMs
 * @param {number} maxSteps
 * @returns {number}
 */
export function advanceGame(game, accumulator, elapsed, tickMs, maxSteps) {
    let acc = accumulator + elapsed;
    let steps = 0;

    while (acc >= tickMs && steps < maxSteps) {
        try {
            game.update(tickMs);
        } catch (error) {
            logServerError('tick', error);
        }
        acc -= tickMs;
        steps += 1;
    }

    if (steps === maxSteps) {
        acc = 0;
    }

    return acc;
}
