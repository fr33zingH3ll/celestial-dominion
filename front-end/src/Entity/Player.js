import { PlayerEntity } from '../../../game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.controller = new Controller();
    }

    update(delta) {
        const moveVector = this.controller.getMoveVector();
        this.setPosition(moveVector[0], moveVector[1]);
    }
}

export { Player };