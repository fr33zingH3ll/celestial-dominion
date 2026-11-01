/**
 * Charge et retire des modules. Un échec de load ne laisse pas le module enregistré.
 */
export class Modules {
    constructor() {
        this.loaded = new Map();
    }

    load(module, context) {
        if (!module || typeof module.name !== 'string' || module.name.length === 0) {
            throw new Error('nom de module requis');
        }
        if (this.loaded.has(module.name)) {
            throw new Error('module déjà chargé');
        }
        module.load(context);
        this.loaded.set(module.name, module);
    }

    unload(name, context) {
        const module = this.loaded.get(name);
        if (!module) {
            throw new Error('module absent');
        }
        module.unload(context);
        this.loaded.delete(name);
    }

    has(name) {
        return this.loaded.has(name);
    }
}
