/**
 * Une image affiche la scène et envoie les coups en attente.
 * Le delta n'avance aucune physique.
 */
export class Loop {
    constructor({ frames, renderer, scene, channel, outgoing }) {
        if (!frames || typeof frames.start !== 'function' || !renderer || typeof renderer.show !== 'function') {
            throw new Error('boucle incomplète');
        }
        if (!scene || !channel || !Array.isArray(outgoing)) {
            throw new Error('boucle incomplète');
        }
        this.frames = frames;
        this.renderer = renderer;
        this.scene = scene;
        this.channel = channel;
        this.outgoing = outgoing;
        this.started = false;
    }

    start() {
        if (this.started) {
            throw new Error('boucle déjà lancée');
        }
        this.started = true;
        this.frames.start(() => {
            this.renderer.show(this.scene);
            while (this.outgoing.length > 0) {
                this.channel.send(JSON.stringify(this.outgoing[0]));
                this.outgoing.shift();
            }
        });
    }

    stop() {
        if (!this.started) {
            return;
        }
        this.frames.stop();
        this.started = false;
    }
}
