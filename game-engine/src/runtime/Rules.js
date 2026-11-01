/**
 * Les règles de plus forte priorité passent en premier.
 * Un coup refusé ne change pas l'état. Un échec pendant l'application annule ce qui vient d'être posé.
 */
export class Rules {
    constructor() {
        this.rules = [];
    }

    add(rule) {
        this.rules.push(rule);
        this.rules.sort((left, right) => right.priority - left.priority);
    }

    list() {
        return this.rules.slice();
    }

    isLegal(state, move) {
        return this.rules.every((rule) => rule.isLegal(state, move));
    }

    apply(state, move) {
        if (!this.isLegal(state, move)) {
            throw new Error('coup illégal');
        }
        const active = this.rules.filter((rule) => rule.enabled && rule.concerns(move));
        const effects = [];
        try {
            for (const rule of active) {
                effects.push({ rule, effect: rule.apply(state, move) });
            }
        } catch (error) {
            this.undo(state, effects);
            throw error;
        }
        return effects;
    }

    undo(state, effects) {
        for (let index = effects.length - 1; index >= 0; index -= 1) {
            const { rule, effect } = effects[index];
            rule.undo(state, effect);
        }
    }
}
