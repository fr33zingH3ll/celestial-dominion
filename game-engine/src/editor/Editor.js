/**
 * Coque d'éditeur. La partie est arrêtée : un affichage, pas une boucle.
 */
export class Editor {
    constructor(files) {
        this.running = false;
        this.files = new Map(Object.entries(files));
        this.buffers = new Map(this.files);
        this.selected = null;
    }

    select(path) {
        if (!this.files.has(path)) {
            throw new Error('fichier absent');
        }
        this.selected = path;
        return this.buffers.get(path);
    }

    edit(text) {
        if (!this.selected) {
            throw new Error('aucun fichier');
        }
        this.buffers.set(this.selected, String(text));
    }

    play() {
        if (this.running) {
            throw new Error('boucle déjà lancée');
        }
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    showOnce(renderer, scene) {
        if (this.running) {
            throw new Error('la partie ne doit pas tourner');
        }
        renderer.show(scene);
    }
}
