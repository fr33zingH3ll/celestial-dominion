import { PlayerEntity } from "../../../game-engine/src/entity/PlayerEntity";
import { Controller } from "../playercontroller/Controller";

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
    }

    setupController() {
        this.controller = new Controller();
    }

    update() {
        const moveVector = this.controller.getMoveVector();

        // Obtient les composantes x et y du vecteur de mouvement
        const [cos, sin] = moveVector;

        // Multiplie par la vitesse
        const velocityX = cos * this.speed;
        const velocityY = sin * this.speed;

        // Met à jour la vélocité du corps avec Matter.js
        this.body.setVelocity(this.body, Vector.create(velocityX, velocityY));
    }
}

export { Player };