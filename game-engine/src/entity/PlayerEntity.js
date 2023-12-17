import { LivingEntity } from "./LivingEntity";

class PlayerEntity extends LivingEntity {
    constructor(game, options) {
        super(game, options);
        this.setupController();
    }

    setupController() {}
}

export { PlayerEntity };