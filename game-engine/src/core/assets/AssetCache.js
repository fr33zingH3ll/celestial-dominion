/**
 * Références stables par clé. Le décodage Pixi n'est pas ici :
 * le cœur reste chargeable par le serveur, et Pixi n'est pas encore une dépendance.
 */
export class AssetCache {
    constructor() {
        this.entries = new Map();
    }

    set(key, asset) {
        if (typeof key !== 'string' || key.length === 0) {
            throw new Error('clé requise');
        }
        if (asset === undefined) {
            throw new Error('asset requis');
        }
        this.entries.set(key, asset);
        return asset;
    }

    has(key) {
        return this.entries.has(key);
    }

    get(key) {
        if (!this.entries.has(key)) {
            throw new Error(`asset absent: ${key}`);
        }
        return this.entries.get(key);
    }

    delete(key) {
        return this.entries.delete(key);
    }
}
