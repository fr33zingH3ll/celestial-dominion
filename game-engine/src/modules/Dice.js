import { createRng } from '../core/maths/Rng.js';
import { Rule } from '../runtime/Rule.js';
import { Module } from './Module.js';

/**
 * Face entre 1 et `faces`, inclus.
 */
export function roll(faces, rng) {
    if (!Number.isInteger(faces) || faces < 2) {
        throw new Error('dé invalide');
    }
    if (typeof rng !== 'function') {
        throw new Error('générateur requis');
    }
    return 1 + Math.floor(rng() * faces);
}

export class DiceModule extends Module {
    constructor(seed) {
        super('dés');
        if (!Number.isInteger(seed)) {
            throw new Error('graine requise');
        }
        this.rng = createRng(seed);
        this.rule = null;
    }

    load(context) {
        const dice = {
            roll: (faces) => roll(faces, this.rng),
        };
        this.rule = new Rule({
            name: 'lancer un dé',
            legal: (_state, move) => move.type !== 'lancer-dé' || (Number.isInteger(move.faces) && move.faces >= 2),
            apply: (state, move) => {
                if (move.type !== 'lancer-dé') {
                    return null;
                }
                const previous = state.lastRoll;
                state.lastRoll = dice.roll(move.faces);
                return { previous };
            },
            undo: (state, effect) => {
                if (!effect) {
                    return;
                }
                state.lastRoll = effect.previous;
            },
        });
        context.dice = dice;
        context.rules.add(this.rule);
    }

    unload(context) {
        context.rules.remove(this.rule);
        this.rule = null;
        delete context.dice;
    }
}
