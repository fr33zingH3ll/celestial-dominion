import { Entity } from "./Entity";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = 1;
        this.max_hp = 1;
        this.speed = 10;
        this.force = 1;
    }

    setPosition(x, y) {
        this.body.x = x;
        this.body.y = y;
    }
}

export { LivingEntity };