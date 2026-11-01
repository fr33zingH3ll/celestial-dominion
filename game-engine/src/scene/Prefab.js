import { Piece } from './Piece.js';
import { Scene } from './Scene.js';

/**
 * Modèle réutilisable. `createPiece` fabrique une pièce, `createScene` un plateau vide.
 */
export class Prefab {
    constructor(name, spec = {}) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error('nom de prefab requis');
        }
        this.name = name;
        this.spec = spec;
    }

    createPiece(id) {
        return new Piece(id, this);
    }

    createScene() {
        return new Scene(this.spec.width, this.spec.height);
    }
}
