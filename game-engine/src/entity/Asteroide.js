import { StaticEntity } from "game-engine/src/entity/StaticEntity.js";

/**
 * Représente un astéroïde dans le jeu, héritant de la classe StaticEntity.
 */
class Asteroide extends StaticEntity {
    /**
     * Crée une instance d'Asteroide.
     * @param {Object} game - L'instance du jeu.
     */
    /**
     * @param {Object} game
     * @param {string} prototypeName
     */
    constructor(game, prototypeName) {
        super(game, prototypeName);
    }

    /**
     * Choisit un prototype avec le générateur fourni.
     * @param {() => number} rng
     * @returns {string}
     */
    static pickPrototype(rng) {
        const names = Object.keys(Asteroide.getPrototypes());
        const index = Math.min(names.length - 1, Math.floor(rng() * names.length));
        return names[index];
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
                static: true,
            },
            asteroide_2: {
                model: "Asteroid_2.glb",
                height: 5,
                width: 5,
                static: true,
            },
            asteroide_3: {
                model: "Asteroid_3.glb",
                height: 5,
                width: 5,
                static: true,
            },
            asteroide_4: {
                model: "Asteroid_4.glb",
                height: 5,
                width: 5,
                static: true,
            },
        };
    }
}

export { Asteroide };
