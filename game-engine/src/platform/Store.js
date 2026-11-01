/**
 * Stockage clé-valeur. Les valeurs passent en chaîne, comme localStorage.
 */
export class Store {
    constructor(storage) {
        if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
            throw new Error('stockage requis');
        }
        this.storage = storage;
    }

    get(key) {
        this.#key(key);
        return this.storage.getItem(key);
    }

    set(key, value) {
        this.#key(key);
        this.storage.setItem(key, String(value));
    }

    remove(key) {
        this.#key(key);
        this.storage.removeItem(key);
    }

    #key(key) {
        if (typeof key !== 'string' || key.length === 0) {
            throw new Error('clé requise');
        }
    }
}
