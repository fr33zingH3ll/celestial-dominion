import { Entity } from "../entity/Entity.js";
import { EventDispatcher } from "../utils/EventDispatcher.js";

/**
 * Classe représentant un mode de jeu générique utilisant Matter.js et Three.js.
 * C'est une classe qui regroupe toutes les fonctions de mise a jour de la pool et du jeu en lui même.
 */
class Scene {
    /**
     * Crée une instance de GameMode.
     */
    constructor() {
        /**
         * Array instance.
         * Permet de stocker les entités du jeu.
         * @type {Array}
         */
        this.pool = [];

        /**
         * Event dispatcher instance.
         * @type {EventDispatcher}
         */
        this.emitter = new EventDispatcher();
    }

    /**
     * Démarre le mode de jeu en ajoutant une fonction de mise à jour à la boucle de rendu.
     */
    start() { }

    /**
     * Ajoute une entité au pool et son corps physique à la liste des corps.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        // Ajoute l'entité au pool
        this.pool.push(entity);
    }

    /**
     * Supprime une entité du pool.
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        const indexEntity = this.pool.indexOf(entity);

        if (indexEntity !== -1) {
            this.pool.splice(indexEntity, 1);
        }
    }

    /**
     * Récupère une entité du pool par son identifiant.
     * @param {number} id - Identifiant de l'entité à récupérer.
     * @returns {Entity|null} - L'entité correspondante ou null si elle n'existe pas.
     */
    getEntityById(id) {
        const entities = this.pool.filter(e => e.id == id);

        return entities.length ? entities[0] : null;
    }



    /**
     * Détruit toutes les entités présentes dans le pool.
     */
    destroy() {
        for (const entity of this.pool) {
            this.removePool(entity);
        }
    }
}

export { Scene };
