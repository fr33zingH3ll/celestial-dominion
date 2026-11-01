import { GameObject } from '../core/objects/GameObject.js';

/**
 * Pièce identifiée. Elle occupe une case ou une zone, jamais les deux.
 */
export class Piece extends GameObject {
    constructor(id, prefab = null) {
        super(id);
        this.prefab = prefab;
        this.cell = null;
        this.zone = null;
    }
}
