import { Graphics } from "pixi.js";
import { Entity } from "./Entity";

/**
 * Classe représentant un joueur dans le jeu, héritant de la classe Entity.
 */
class Player extends Entity {
    /**
     * Crée une instance de Player.
     * @param {object} game - Instance du jeu (GameMode) auquel le joueur appartient.
     * @param {string} texturePath - Chemin vers la texture du joueur.
     * @param {number} x - Position x initiale du joueur.
     * @param {number} y - Position y initiale du joueur.
     * @param {number} scale - Échelle du joueur.
     * @param {number} restitution - Coefficient de restitution physique du joueur.
     */
    constructor(game, texturePath, x, y, scale, restitution) {
        // Appelle le constructeur de la classe parente (Entity)
        super(game, texturePath, x, y, scale, restitution);

        // Référence à l'instance du jeu
        this.game = game;

        // Variables de contrôle du clavier
        this.isLeftKeyDown = false;
        this.isRightKeyDown = false;
        this.isUpKeyDown = false;
        this.isDownKeyDown = false;

        // Vitesse du joueur
        this.speed = 0.3;

        // Position de la souris
        this.mouse_pos = [];

        // Configuration du mode d'événement pour le sprite PIXI.js
        this.sprite.interactive = true;

        // Ajout d'un événement pour suivre la position de la souris
        this.sprite.on('mousemove', (event) => {
            this.mouse_pos = [event.global.x, event.global.y];
        });

        // Configuration des écouteurs d'événements
        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements pour les touches du clavier.
     */
    setupEventListeners() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    /**
     * Supprime les écouteurs d'événements du clavier.
     */
    removeEventListeners() {
        window.removeEventListener('keydown', (event) => this.handleKeyDown(event));
        window.removeEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    /**
     * Gère l'appui sur une touche du clavier.
     * @param {object} event - Événement de touche du clavier.
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.isLeftKeyDown = true;
                break;
            case 'ArrowRight':
                this.isRightKeyDown = true;
                break;
            case 'ArrowUp':
                this.isUpKeyDown = true;
                break;
            case 'ArrowDown':
                this.isDownKeyDown = true;
                break;
        }
    }

    /**
     * Gère le relâchement d'une touche du clavier.
     * @param {object} event - Événement de touche du clavier.
     */
    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.isLeftKeyDown = false;
                break;
            case 'ArrowRight':
                this.isRightKeyDown = false;
                break;
            case 'ArrowUp':
                this.isUpKeyDown = false;
                break;
            case 'ArrowDown':
                this.isDownKeyDown = false;
                break;
        }
    }

    /**
     * Calcule l'angle du joueur en fonction de la position de la souris.
     */
    calculeAngle() {
        const angle = Math.atan2(this.mouse_pos[1] - this.body.position.y, this.mouse_pos[0] - this.body.position.x) + Math.PI / 2;
        this.body.angle = angle;
    }

    /**
     * Met à jour la position du joueur en fonction des touches du clavier et synchronise avec PIXI.js et Matter.js.
     */
    update() {
        if (this.isLeftKeyDown && this.body.position.x - this.speed >= 0) {
            this.body.position.x -= this.speed;
        }
        if (this.isRightKeyDown && this.body.position.x + this.sprite.width + this.speed <= this.game.app.renderer.width) {
            this.body.position.x += this.speed;
        }
        if (this.isUpKeyDown && this.body.position.y - this.speed >= 0) {
            this.body.position.y -= this.speed;
        }
        if (this.isDownKeyDown && this.body.position.y + this.sprite.height + this.speed <= this.game.app.renderer.height) {
            this.body.position.y += this.speed;
        }
        
        // Calcule et applique l'angle en fonction de la position de la souris
        this.calculeAngle();

        // Appelle la méthode update de la classe parente (Entity)
        super.update();
    }
}

export { Player };