import * as THREE from 'three'; // Importation de la bibliothèque Three.js

class Controller {
    constructor(game) {
        this.game = game;
        this.keybind = {right: 'd', left: 'q', up: 'z', down: 's'};
        this.control = {right: false, left: false, up: false, down: false};
        this.lastMouseX = null;
        this.mouse = {x: 0, y: 0}; // Stocke les positions de la souris
        this.mouseSensitivity = 10; // Sensibilité de la souris pour le mouvement horizontal
        this.mouseSpeedX = null;
        this.rotation = 0; // Rotation actuelle sur l'axe horizontal
        this.setupEventListeners();
    }

    /**
    * Sets up event listeners for keyboard and mouse input.
    */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    /**
    * Removes event listeners for keyboard and mouse input.
    */
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
    }

    /**
    * Handles keydown events for player movement and shooting.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyDown = (event) => {
        if (event.key === this.keybind.left) {
            this.control.left = true;
        } else if (event.key === this.keybind.right) {
            this.control.right = true;
        }
        if (event.key === this.keybind.up) {
            this.control.up = true;
        } else if (event.key === this.keybind.down) {
            this.control.down = true;
        }
    }

    /**
    * Handles keyup events to stop player movement.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyUp = (event) => {
        if (event.key === this.keybind.left) {
            this.control.left = false;
        } else if (event.key === this.keybind.right) {
            this.control.right = false;
        }
        if (event.key === this.keybind.up) {
            this.control.up = false;
        } else if (event.key === this.keybind.down) {
            this.control.down = false;
        }
    }

    /**
    * Handles mousemove events to track mouse movement.
    * @param {MouseEvent} event - The mouse event object.
    */
    handleMouseMove = (event) => {  
        const currentMouseX = event.clientX;
    
        // Si c'est la première fois, définissez simplement la dernière position de la souris
        if (this.lastMouseX === null) {
            this.lastMouseX = currentMouseX;
        }
    
        const deltaX = currentMouseX - this.lastMouseX;
    
        this.mouseSpeedX += deltaX * this.mouseSensitivity;
    
        this.lastMouseX = currentMouseX;
    }

    calculateRotationAngle() {
        return (this.mouseSpeedX / (this.mouseSensitivity * window.innerWidth)) * (2 * Math.PI);
    }

    getRotateVector() {
        let angle = this.rotation;

        if (this.control.turnLeft) {
            angle += -1;
        }
        if (this.control.turnRight) {
            angle += 1;
        }
        return angle;
    }

    getMoveVector(spherical) {
        const azimuth = spherical.theta;

        let x = 0;
        let y = 0;

        if (this.control.up) {
            y += 1;
        }
        if (this.control.down) {
            y -= 1;
        }
        if (this.control.right) {
            x += 1;
        }
        if (this.control.left) {
            x -= 1;
        }

        const controlVector = new THREE.Vector2(x, y).normalize();

        const moveVector = new THREE.Vector2();
        moveVector.y = controlVector.x * -Math.sin(azimuth) - controlVector.y * Math.cos(azimuth);
        moveVector.x = controlVector.x * Math.cos(azimuth) + controlVector.y * -Math.sin(azimuth);

        return moveVector;
    }
}

export { Controller };
