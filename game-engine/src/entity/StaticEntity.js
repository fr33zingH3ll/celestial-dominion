import { Entity } from "./Entity.js";

/**
 * Représente une entité statique dans le jeu, héritant de la classe Entity.
 */
class StaticEntity extends Entity {
    /**
     * Crée une instance de StaticEntity.
     * @param {Object} game - L'instance du jeu.
     * @param {string} prototypeName - Le nom du prototype de l'entité.
     */
    constructor(game, prototypeName) {
        super(game, prototypeName);
    }
}

export { StaticEntity };
