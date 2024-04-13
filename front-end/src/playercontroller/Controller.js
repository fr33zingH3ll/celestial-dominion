class Controller {
    constructor() {
        this.keybind = {right: 'd', left: 'q', up: 'z', down: 's', turnLeft: 'ArrowLeft', turnRight: 'ArrowRight'};
        this.control = {right: false, left: false, up: false, down: false};
        this.setupEventListeners();
    }
    /**
    * Sets up event listeners for keyboard input.
    */
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    /**
    * Removes event listeners for keyboard input.
    */
    removeEventListener() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
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
        if (event.key === this.keybind.turnLeft) {
            this.control.turnLeft = true;
        } else if (event.key === this.keybind.turnRight) {
            this.control.turnRight = true;
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
        if (event.key === this.keybind.turnLeft) {
            this.control.turnLeft = false;
        } else if (event.key === this.keybind.turnRight) {
            this.control.turnRight = false;
        }
    }

    getRotateVector() {
        let angle = 0;

        if (this.control.turnLeft) {
            angle += -0.1;
        }
        if (this.control.turnRight) {
            angle += 0.1;
        }
        return angle
    }

    getMoveVector() {
        // Initialise les composantes du vecteur à 0
        let value_x = 0;
        let value_y = 0;

        // Vérifie les touches enfoncées et met à jour les composantes du vecteur en conséquence
        if (this.control.left) {
            value_x -= 1;
        }
        if (this.control.right) {
            value_x += 1;
        }
        if (this.control.up) {
            value_y -= 1;
        }
        if (this.control.down) {
            value_y += 1;
        }

        // Assurez-vous que les valeurs sont comprises entre -1 et 1
        value_x = Math.min(1, Math.max(-1, value_x));
        value_y = Math.min(1, Math.max(-1, value_y));

        // Retourne le vecteur résultant
        return { x: value_x, y: value_y };
    }
}

export { Controller };