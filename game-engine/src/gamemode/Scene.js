import { Entity } from "../entity/Entity.js";
import { EventDispatcher } from "../utils/EventDispatcher.js";

/**
 * Classe représentant un mode de jeu générique utilisant Matter.js et PIXI.js.
 */
class Scene {
    /**
     * Crée une instance de GameMode.
     */
    constructor() {
        // Initialise le pool d'entités à vide
        this.pool = [];
        // Initialise un émetteur d'événements pour gérer les événements
        this.emitter = new EventDispatcher();
        // Initialise le mode débogage à false par défaut
        this.debug = false;
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
     * Récupère une entité du pool par son identifiant.
     * @param {number} id - Identifiant de l'entité à récupérer.
     * @returns {Entity|null} - L'entité correspondante ou null si elle n'existe pas.
     */
    getEntityById(id) {
        // Filtrer le pool d'entités pour trouver l'entité avec l'ID donné
        const entities = this.pool.filter(e => e.id == id);
        // Retourne la première entité trouvée ou null si aucune entité n'a cet ID
        return entities.length ? entities[0] : null;
    }

    /**
     * Supprime une entité du pool.
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        // Trouve l'index de l'entité dans le pool
        const indexEntity = this.pool.indexOf(entity);
        // Si l'entité est présente dans le pool, la supprime
        if (indexEntity !== -1) {
            this.pool.splice(indexEntity, 1);
        }
    }

    /**
     * Détruit toutes les entités présentes dans le pool.
     */
    destroy() {
        // Parcourt toutes les entités dans le pool et les supprime une par une
        for (const entity of this.pool) {
            this.removePool(entity);
        }
    }

    /**
     * Met à jour toutes les entités dans le pool.
     * @param {number} delta - Delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        // Parcourt toutes les entités dans le pool et met à jour chacune d'entre elles
        for (const entity of this.pool) {
            entity.update(delta);
        }
    }
}

export { Scene };
