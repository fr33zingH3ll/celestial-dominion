import { PlayerEntity } from '../../../game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.setupController();
    }

    setupController() {
        this.controller = new Controller();
    }

    update(delta) {
        const moveVector = this.controller.getMoveVector();
        this.getMoveVector(moveVector[0], moveVector[1]);
    }
}

export { Player };