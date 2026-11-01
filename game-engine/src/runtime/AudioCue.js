/**
 * Demandes de son. La sortie vers un haut-parleur n'est pas ici.
 */
export class AudioCue {
    constructor() {
        this.cues = [];
    }

    play(id) {
        this.#add(id, 'play');
    }

    stop(id) {
        this.#add(id, 'stop');
    }

    drain() {
        const cues = this.cues;
        this.cues = [];
        return cues;
    }

    #add(id, action) {
        if (typeof id !== 'string' || id.length === 0) {
            throw new Error('son requis');
        }
        this.cues.push({ id, action });
    }
}
