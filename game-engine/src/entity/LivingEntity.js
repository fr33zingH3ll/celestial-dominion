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
        if (x === 0 && y === 0) {
            return
        }
        const radians = Math.atan2(x, y);
        const offset = this.game.Vector.create(Math.sin(radians), Math.cos(radians));
        this.game.Body.setPosition(this.body, this.game.Vector.add(this.body.position, offset));
    }
}

export { LivingEntity };