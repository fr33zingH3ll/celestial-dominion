import { GameMode } from "../libs/gamemode/GameMode.js"; 
import { Player } from "../Entity/Player.js";

/**
 * Classe représentant le mode de jeu principal qui étend la classe GameMode.
 */
class MainGame extends GameMode {
    /**
     * Crée une instance de MainGame.
     */
    constructor(app) {
        // Appelle le constructeur de la classe GameMode avec la taille spécifiée
        super(app);
    }

    /**
     * Démarre le mode de jeu en créant des entités et en lançant le moteur Matter.js.
     */
    start() {
        // Crée les entités du jeu
        this.createEntities();
        // Appelle la méthode start de la classe parente
		super.start();
    }

    /**
     * Crée les entités initiales du jeu.
     */
	createEntities() {
		// Ajoute un joueur à la position (700, 700) avec une vitesse de 0.1
		this.addPool(new Player(this, './ship/ship.png', 700, 700, 0.1));
		
		// Ajoute un autre joueur à la position (500, 500) avec une vitesse de 0.1
		this.addPool(new Player(this, './ship/ship.png', 500, 500, 0.1));
	}
}

export { MainGame };