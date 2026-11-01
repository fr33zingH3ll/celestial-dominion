/**
 * Ordre des joueurs et phases. La dernière phase ferme le tour et passe au joueur suivant.
 */
export class Turn {
    constructor(players, phases = ['jeu']) {
        if (!Array.isArray(players) || players.length === 0) {
            throw new Error('joueurs requis');
        }
        if (!Array.isArray(phases) || phases.length === 0) {
            throw new Error('phases requises');
        }
        this.players = players.slice();
        this.phases = phases.slice();
        this.playerIndex = 0;
        this.phaseIndex = 0;
        this.over = false;
    }

    get player() {
        return this.players[this.playerIndex];
    }

    get phase() {
        return this.phases[this.phaseIndex];
    }

    nextPhase() {
        if (this.over) {
            throw new Error('partie terminée');
        }
        if (this.phaseIndex + 1 < this.phases.length) {
            this.phaseIndex += 1;
            return;
        }
        this.endTurn();
    }

    endTurn() {
        if (this.over) {
            throw new Error('partie terminée');
        }
        this.phaseIndex = 0;
        this.playerIndex = (this.playerIndex + 1) % this.players.length;
    }

    finish() {
        this.over = true;
    }
}
