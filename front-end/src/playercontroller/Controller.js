class Controller {
    constructor() {
        this.keybind = {right: 'ArrowRight', left: 'ArrowLeft', up: 'ArrowUp', down: 'ArrowDown'};
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

    getMoveVector() {
        // Initialise les composantes du vecteur à 0
        let x = 0;
        let y = 0;

        // Vérifie les touches enfoncées et met à jour les composantes du vecteur en conséquence
        if (this.control.left) {
            x -= 1;
        }
        if (this.control.right) {
            x += 1;
        }
        if (this.control.up) {
            y -= 1;
        }
        if (this.control.down) {
            y += 1;
        }

        // Assurez-vous que les valeurs sont comprises entre -1 et 1
        x = Math.min(1, Math.max(-1, x));
        y = Math.min(1, Math.max(-1, y));

        // Retourne le vecteur résultant
        return [x, y];
    }
}

export { Controller };