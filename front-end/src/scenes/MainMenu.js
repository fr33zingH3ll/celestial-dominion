import { Scene2D } from "game-engine/src/gamemode/Scene2D.js";

/**
 * Classe représentant le menu principal du jeu.
 * Étend la classe Scene2D du moteur de jeu.
 */
class MainMenu extends Scene2D {
    /**
     * Crée une instance de MainMenu.
     * @param {Socket} server - Le socket pour la communication avec le serveur.
     */
    constructor(server) {
        super();
        this.server = server;
    }
    
    /**
     * Met à jour le menu principal.
     * @param {number} delta - Le delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        super.update(delta); // Appel de la méthode update() de la classe parente Scene2D

        for (const entity of this.pool) {
            entity.update(delta); // Appel de la méthode update() pour chaque entité dans le pool
        }
    }
    
    /**
     * Démarre le menu principal.
     */
    start() {
        super.start(); // Appel de la méthode start() de la classe parente Scene2D
    }
}

export { MainMenu };
