import { Entity } from "./Entity";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = 1;
        this.max_hp = 1;
        this.speed = 1500;
        this.force = 1;
    }

    setPosition(x, y) {
        if (x === 0 && y === 0) {
            return
        }
        const radians = Math.atan2(x, y);
        const velocity = this.game.Vector.create(Math.sin(radians) / this.speed, Math.cos(radians) / this.speed);
        console.log(velocity);
        this.game.Body.applyForce(this.body, this.body.position, velocity);
    }
}

export { LivingEntity };