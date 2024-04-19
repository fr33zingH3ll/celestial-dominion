import { Entity } from "../entity/Entity.js";
import { EventDispatcher } from "../utils/EventDispatcher.js";


/**
 * Classe représentant un mode de jeu générique utilisant Matter.js et PIXI.js.
 */
class GameMode {
    /**
     * Crée une instance de GameMode.
     */
    constructor() {
        this.pool = [];
        this.emitter = new EventDispatcher();
    }

    /**
     * Démarre le mode de jeu en ajoutant une fonction de mise à jour à la boucle de rendu.
     */
    start() {}

    /**
     * Ajoute une entité au pool et son corps physique à la liste des corps.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        this.pool.push(entity);
        this.pool_body.push(entity.body);
    }

    getPool(entity) {
        return this.pool.indexOf(entity);
    }

    /**
     * Supprime une entité du pool (non implémenté dans cet exemple).
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        const index = this.pool.indexOf(entity);
        if (index !== -1) {
            this.pool.splice(index, 1);
        }
        if (index !== -1) {
            this.pool_body.splice(index, 1);
        }
    }

    update(delta) {}
}

export { GameMode };