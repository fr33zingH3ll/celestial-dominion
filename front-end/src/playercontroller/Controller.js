import * as THREE from 'three'; // Importation de la bibliothèque Three.js

/**
 * Classe représentant le contrôleur du joueur.
 */
class Controller {
    /**
     * Crée une instance de Controller.
     * @param {Game} game - L'instance du jeu.
     */
    constructor(game) {
        this.game = game;
        this.keybind = {right: 'd', left: 'q', up: 'z', down: 's', left_click: 'mouseLeft', debug_mode: '²'};
        this.control = {right: false, left: false, up: false, down: false, left_click: false};
        this.mouseSensitivity = 0.002; // Sensibilité de la souris pour le mouvement horizontal
        this.rotation = 0; // Rotation actuelle sur l'axe horizontal

        // Ajout de l'événement click pour demander le verrouillage du pointeur
        this.game.renderer.domElement.addEventListener('click', () => {
            this.game.renderer.domElement.requestPointerLock();
        });

        this.setupEventListeners();
    }

    /**
     * Configure les écouteurs d'événements pour les entrées clavier et souris.
     */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('pointerlockchange', this.handlePointerLockChange);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * Supprime les écouteurs d'événements pour les entrées clavier et souris.
     */
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * Gère les événements de touche enfoncée pour le mouvement du joueur et le tir.
     * @param {KeyboardEvent} event - L'objet d'événement clavier.
     */
    handleKeyDown = (event) => {
        // Gestion du mouvement horizontal
        if (event.key === this.keybind.left) {
            this.control.left = true;
        } else if (event.key === this.keybind.right) {
            this.control.right = true;
        }
        // Gestion du mouvement vertical
        if (event.key === this.keybind.up) {
            this.control.up = true;
        } else if (event.key === this.keybind.down) {
            this.control.down = true;
        }
        // Gestion du clic gauche de la souris
        if (event.key === this.keybind.left_click) {
            this.control.left_click = true;
        }
    }

    /**
     * Gère les événements de touche relâchée pour arrêter le mouvement du joueur.
     * @param {KeyboardEvent} event - L'objet d'événement clavier.
     */
    handleKeyUp = (event) => {
        // Arrêter le mouvement horizontal
        if (event.key === this.keybind.left) {
            this.control.left = false;
        } else if (event.key === this.keybind.right) {
            this.control.right = false;
        }
        // Arrêter le mouvement vertical
        if (event.key === this.keybind.up) {
            this.control.up = false;
        } else if (event.key === this.keybind.down) {
            this.control.down = false;
        }
        // Activer/désactiver le mode de débogage
        if (event.key === this.keybind.debug_mode) {
            this.game.debug = !this.game.debug;
            console.log(this.game.debug);
        }
        // Arrêter le clic gauche de la souris
        if (event.key === this.keybind.left_click) {
            this.control.left_click = false;
        }
    }

    // Méthodes supplémentaires et gestionnaires d'événements...
}

export { Controller };
