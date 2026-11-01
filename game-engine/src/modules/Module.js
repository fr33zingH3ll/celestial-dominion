/**
 * Règles optionnelles. `load` les pose, `unload` les retire, sans modifier le cœur.
 */
export class Module {
    constructor(name) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('nom de module requis');
        }
        this.name = name;
    }

    load() {
        throw new Error('chargement non implémenté');
    }

    unload() {
        throw new Error('déchargement non implémenté');
    }
}
