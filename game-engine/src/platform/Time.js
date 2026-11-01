/**
 * Horloge et images. Le premier pas a un delta nul : il n'y a pas encore de frame précédente.
 */
export class Clock {
    constructor(now = () => Date.now()) {
        if (typeof now !== 'function') {
            throw new Error('horloge requise');
        }
        this.read = now;
    }

    now() {
        return this.read();
    }
}

export class Frames {
    constructor(requestFrame, cancelFrame = () => {}) {
        if (typeof requestFrame !== 'function') {
            throw new Error('temps requis');
        }
        this.requestFrame = requestFrame;
        this.cancelFrame = cancelFrame;
        this.handle = null;
        this.running = false;
    }

    start(step) {
        if (this.running) {
            throw new Error('boucle déjà lancée');
        }
        if (typeof step !== 'function') {
            throw new Error('pas requis');
        }
        this.running = true;
        let previous = null;
        const tick = (now) => {
            if (!this.running) {
                return;
            }
            const delta = previous === null ? 0 : now - previous;
            previous = now;
            step(delta, now);
            if (this.running) {
                this.handle = this.requestFrame(tick);
            }
        };
        this.handle = this.requestFrame(tick);
    }

    stop() {
        this.running = false;
        if (this.handle !== null) {
            this.cancelFrame(this.handle);
            this.handle = null;
        }
    }
}
