import { PlayerEntity } from '../../../game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.controller = new Controller();
    }

    update(delta) {
        this.setPosition(this.controller.getMoveVector());
        this.setAngle(this.controller.getRotateVector(), 50);
    }
}

export { Player };