import { LivingEntity } from "./LivingEntity";

class PlayerEntity extends LivingEntity {
    constructor(game, options) {
        super(game, options);
        this.addEventListener();
    }

    addEventListener() {
        this.game.emitter.addEventListener("clientPlayerUpdate", (event) => {
            console.trace();
            console.log(event);
        });
    }


}

export { PlayerEntity };