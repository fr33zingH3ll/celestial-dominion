import { Target, matchesTarget } from './Target.js';

/**
 * Une règle dit si un coup est permis, l'applique, puis sait l'annuler.
 * `legal`, `apply` et `undo` reçoivent `(state, move)` ; `undo` reçoit l'effet renvoyé par `apply`.
 */
export class Rule {
    constructor({
        name,
        description = '',
        priority = 0,
        enabled = true,
        target = Target.ALL,
        legal,
        apply,
        undo,
    }) {
        if (!name) {
            throw new Error('nom de règle requis');
        }
        if (typeof legal !== 'function' || typeof apply !== 'function' || typeof undo !== 'function') {
            throw new Error('règle incomplète');
        }
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.enabled = enabled;
        this.target = target;
        this.legal = legal;
        this.apply = apply;
        this.undo = undo;
    }

    concerns(move) {
        if (this.target === Target.ALL) {
            return true;
        }
        return matchesTarget(this.target, move.actor, move.subject);
    }

    isLegal(state, move) {
        if (!this.enabled || !this.concerns(move)) {
            return true;
        }
        return this.legal(state, move) === true;
    }
}
