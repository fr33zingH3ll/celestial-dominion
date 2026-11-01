/**
 * Interpolation numérique. `t` est ramené dans [0, 1] : une pièce s'arrête sur la case d'arrivée.
 */
export class Interpolation {
    constructor(start, end, duration) {
        if (typeof start !== 'number' || typeof end !== 'number' || !(duration > 0)) {
            throw new Error('interpolation invalide');
        }
        this.start = start;
        this.end = end;
        this.duration = duration;
    }

    interpolate(t) {
        const clamped = Math.min(1, Math.max(0, t));
        return this.start + (this.end - this.start) * clamped;
    }

    at(elapsed) {
        return this.interpolate(elapsed / this.duration);
    }
}
