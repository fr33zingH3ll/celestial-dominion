/**
 * Identité stable et cycle de vie. L'identifiant est fourni par l'appelant
 * pour rester le même d'un serveur à l'autre.
 */
export class GameObject {
    constructor(id) {
        if (id === undefined || id === null || id === '') {
            throw new Error('identifiant requis');
        }
        this.id = id;
        this.destroyed = false;
    }

    destroy() {
        this.destroyed = true;
    }
}
