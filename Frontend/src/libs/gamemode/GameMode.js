import Matter from "matter-js";
import { Application } from "pixi.js";
import { Socket } from "../../../api";

/**
 * Classe représentant un mode de jeu générique utilisant Matter.js et PIXI.js.
 */
class GameMode {
    /**
     * Crée une instance de GameMode.
     */
    constructor(app) {
        this.app = app;
        this.socket = new Socket("ws://localhost:3001");
        // Pool d'entités (à des fins potentielles d'optimisation)
        this.pool = [];
    }

    /**
     * Démarre le mode de jeu en ajoutant une fonction de mise à jour à la boucle de rendu.
     */
    start() {
        this.socket.app.ticker.add(() => this.update(this.app.ticker.deltaMS));
    }

    /**
     * Ajoute une entité au pool et son corps physique à la liste des corps.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        this.pool.push(entity);
        this.bodies.push(entity.body);
    }

    getPool() {
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
    }

    update(delta) {
        for(const entity of this.pool) {
			entity.update();
		}
    }
}

/**
 * Représente une entité générique dans le jeu.
 * @typedef {Object} Entity
 * @property {Matter.Body} body - Corps physique associé à l'entité.
 */

export { GameMode };