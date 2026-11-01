/**
 * Taille de la fenêtre et navigation. Les écouteurs restent ceux du navigateur.
 */
export class WindowView {
    constructor(target) {
        if (!target?.location || typeof target.location.replace !== 'function' || typeof target.addEventListener !== 'function') {
            throw new Error('fenêtre requise');
        }
        this.target = target;
    }

    get width() {
        return this.target.innerWidth;
    }

    get height() {
        return this.target.innerHeight;
    }

    go(url) {
        if (typeof url !== 'string' || url.length === 0) {
            throw new Error('adresse requise');
        }
        this.target.location.replace(url);
    }

    on(type, listener) {
        this.target.addEventListener(type, listener);
    }

    off(type, listener) {
        this.target.removeEventListener(type, listener);
    }
}
