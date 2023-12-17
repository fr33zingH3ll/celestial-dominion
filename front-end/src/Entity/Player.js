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
        
    }
}

export { Player };