import { StaticEntity } from "game-engine/src/entity/StaticEntity.js";

/**
 * Représente un astéroïde dans le jeu, héritant de la classe StaticEntity.
 */
class Asteroide extends StaticEntity {
    /**
     * Crée une instance d'Asteroide.
     * @param {Object} game - L'instance du jeu.
     */
    constructor(game) {
        const prototypeName = Asteroide.getRandomPrototypeName();
        super(game, prototypeName);
    }

    /**
     * Récupère un nom de prototype d'astéroïde aléatoire parmi les prototypes disponibles.
     * @returns {string} - Le nom du prototype sélectionné.
     */
    static getRandomPrototypeName() {
        const prototypes = Object.keys(Asteroide.getPrototypes());
        const randomIndex = Math.floor(Math.random() * prototypes.length);
        return prototypes[randomIndex];
    }

    /**
     * Obtient les prototypes d'astéroïdes disponibles avec leurs modèles, hauteur et largeur.
     * @returns {Object} - Les prototypes d'astéroïdes.
     */
    static getPrototypes() {
        return {
            asteroide_1: {
                model: "Asteroid_1.glb",
                height: 5,
                width: 5,
            },
            asteroide_2: {
                model: "Asteroid_2.glb",
                height: 5,
                width: 5,
            },
            asteroide_3: {
                model: "Asteroid_3.glb",
                height: 5,
                width: 5,
            },
            asteroide_4: {
                model: "Asteroid_4.glb",
                height: 5,
                width: 5,
            },
        };
    }
}

export { Asteroide };
