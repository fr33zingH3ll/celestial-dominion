import { Module } from './Module.js';
import { Rule } from '../runtime/Rule.js';

export class Card {
    constructor(id, face) {
        if (id === undefined || id === null || id === '') {
            throw new Error('identifiant requis');
        }
        if (face === undefined || face === null || face === '') {
            throw new Error('face requise');
        }
        this.id = id;
        this.face = face;
    }
}

/**
 * Mélange une copie. Le paquet d'origine ne change pas.
 * `rng` vient de core et rend un nombre dans [0, 1).
 */
export function shuffle(cards, rng) {
    if (!Array.isArray(cards)) {
        throw new Error('paquet requis');
    }
    if (typeof rng !== 'function') {
        throw new Error('générateur requis');
    }
    const next = cards.slice();
    for (let index = next.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(rng() * (index + 1));
        const current = next[index];
        next[index] = next[swap];
        next[swap] = current;
    }
    return next;
}

export class CardsModule extends Module {
    constructor() {
        super('cartes');
        this.rule = null;
    }

    load(context) {
        this.rule = new Rule({
            name: 'jouer une carte',
            legal: (state, move) => {
                if (move.type !== 'jouer-carte') {
                    return true;
                }
                const hand = state.hands?.[move.playerId] ?? [];
                return hand.some((card) => card.id === move.cardId);
            },
            apply: (state, move) => {
                if (move.type !== 'jouer-carte') {
                    return null;
                }
                const hand = state.hands[move.playerId];
                const index = hand.findIndex((card) => card.id === move.cardId);
                const [card] = hand.splice(index, 1);
                state.table = state.table ?? [];
                state.table.push(card);
                return { playerId: move.playerId, card };
            },
            undo: (state, effect) => {
                if (!effect) {
                    return;
                }
                const index = state.table.findIndex((card) => card.id === effect.card.id);
                state.table.splice(index, 1);
                state.hands[effect.playerId].push(effect.card);
            },
        });
        context.rules.add(this.rule);
    }

    unload(context) {
        context.rules.remove(this.rule);
        this.rule = null;
    }
}
