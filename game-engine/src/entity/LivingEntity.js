import { Vector } from "matter-js";
import { Entity } from "./Entity";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = options.stat.hp;
        this.max_hp = options.stat.max_hp;
        this.speed = options.stat.speed;
        this.force = options.stat.force;
    }

    setPosition(vector) {
        if (vector.x === 0 && vector.y === 0) {
            return
        }
        const radians = Math.atan2(vector.x, vector.y);
        const velocity = this.game.Vector.create(Math.sin(radians) / 1500 * this.speed, Math.cos(radians) / 1500 * this.speed);
        this.game.Body.applyForce(this.body, this.body.position, velocity);
    }

    setAngle(angle) {
        if (angle === 0) {
            return;
        }
        this.game.Body.setAngularVelocity(this.body, angle / 50);
    }
}
 
export { LivingEntity };