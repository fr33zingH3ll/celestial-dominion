import * as THREE from 'three'; // Importation de la bibliothèque Three.js

/**
 * Contrôleur pour gérer les entrées utilisateur et le mouvement de la caméra.
 */
class Controller {
    /**
     * Crée une instance du contrôleur.
     * @param {Game} game - L'instance du jeu.
     */
    constructor(game) {
        this.game = game;

        this.keybind_player = {right: 'd', left: 'q', up: 'z', down: 's', orbit: 'a', left_click: 'mouseLeft', debug_mode: 'F1', open_menu : 'Escape'};
        this.control_player = {right: false, left: false, up: false, down: false, orbit: false, left_click: false, open_menu: null};

        this.keybind_hud = {left_click: 'mouseLeft'};
        this.control_hud = {left_click: false};

        this.mouseSensitivity = 0.002; // Sensibilité de la souris pour le mouvement horizontal
        this.rotation = 0; // Rotation actuelle sur l'axe horizontal

        // Ajout de l'événement click pour demander le verrouillage du pointeur
        this.game.renderer.domElement.addEventListener('click', () => {
            this.game.renderer.domElement.requestPointerLock();
        });

        this.setupEventListeners();
    }

    /**
    * Sets up event listeners for keyboard and mouse input.
    */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('pointerlockchange', this.handlePointerLockChange);
    }

    /**
    * Removes event listeners for keyboard and mouse input.
    */
    removeEventListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    }

    /**
    * Handles keydown events for player movement and shooting.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyDown = (event) => {
        if(this.control_player.open_menu == null || this.control_player.open_menu == false){

            if (event.key === this.keybind_player.left) {
                this.control_player.left = true;
            } else if (event.key === this.keybind_player.right) {
                this.control_player.right = true;
            }
            if (event.key === this.keybind_player.up) {
                this.control_player.up = true;
            } else if (event.key === this.keybind_player.down) {
                this.control_player.down = true;
            }
            if (event.key === this.keybind_player.left_click) {
                this.control_player.left_click = true;
            }

        }else if(this.control_player.open_menu == true){

        }
    }

    /**
    * Handles keyup events to stop player movement.
    * @param {KeyboardEvent} event - The keyboard event object.
    */
    handleKeyUp = (event) => {
        if(this.control_player.open_menu == null || this.control_player.open_menu == false){
            if (event.key === this.keybind_player.left) {
                this.control_player.left = false;
            } else if (event.key === this.keybind_player.right) {
                this.control_player.right = false;
            }
            if (event.key === this.keybind_player.up) {
                this.control_player.up = false;
            } else if (event.key === this.keybind_player.down) {
                this.control_player.down = false;
            }
            if (event.key === this.keybind_player.orbit) {
                this.control_player.orbit = !this.control_player.orbit;
                console.log(this.control_player.orbit);
                this.game.server.sendClientOrbit(this.control_player.orbit);
            }
            if (event.key === this.keybind_player.debug_mode) {
                this.game.debug = !this.game.debug;
            }
            if (event.key === this.keybind_player.left_click) {
                this.control_player.left_click = false;
            }
        }else if(this.control_player.open_menu == true){

        }
    }

        /**
    * Handles mousedown events for shooting.
    * @param {MouseEvent} event - The mouse event object.
    */
    handleMouseDown = (event) => {
        if(this.control_player.open_menu == null || this.control_player.open_menu == false){
            if (event.button === 0) { // Left mouse button
                this.control_player.left_click = true;
            }
        }else if(this.control_player.open_menu == true){
            if (event.button === 0) { // Left mouse button
                this.control_hud.left_click = true;
            }
        }
    }

    /**
    * Handles mouseup events to stop shooting.
    * @param {MouseEvent} event - The mouse event object.
    */
    handleMouseUp = (event) => {
        if(this.control_player.open_menu == null || this.control_player.open_menu == false){
            if (event.button === 0) { // Left mouse button
                this.control_player.left_click = false;
            }
        }else if(this.control_player.open_menu == true){
            if (event.button === 0) { // Left mouse button
                this.control_hud.left_click = false;
            }
        }
    }

    /**
    * Handles pointer lock state changes.
    */
    handlePointerLockChange = () => {
        if(this.control_player.open_menu == null){
            this.control_player.open_menu = false;
        } else{
            this.control_player.open_menu = !this.control_player.open_menu;
        }
        if (document.pointerLockElement === this.game.renderer.domElement) {
            console.log('Pointer lock active');
            document.addEventListener('mousemove', this.handleMouseMove, false);
            window.addEventListener('mousedown', this.handleMouseDown);
            window.addEventListener('mouseup', this.handleMouseUp);
        } else {
            console.log('Pointer lock inactive');
            document.removeEventListener('mousemove', this.handleMouseMove, false);
        }
    }

    /**
    * Handles mousemove events to track mouse movement.
    * @param {MouseEvent} event - The mouse event object.
    */
    handleMouseMove = (event) => {
        const movementX = event.movementX;

        this.rotation += movementX * this.mouseSensitivity;
    }

    /**
    * Calculates the rotation angle based on mouse movement.
    */
    calculateRotationAngle() {
        return this.rotation;
    }



    /**
    * Gets the movement vector based on the current control state and camera orientation.
    * @param {THREE.Spherical} spherical - The spherical coordinates of the camera.
    */
    getMoveVector(spherical) {
        const azimuth = spherical.theta;

        let x = 0;
        let y = 0;

        if (this.control_player.up) {
            y += 1;
        }
        if (this.control_player.down) {
            y -= 1;
        }
        if (this.control_player.right) {
            x += 1;
        }
        if (this.control_player.left) {
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