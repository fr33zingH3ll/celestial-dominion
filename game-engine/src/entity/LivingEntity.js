import matter from "matter-js";
const { Vector } = matter;
import { Entity } from "./Entity.js";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = options.stat.hp;
        this.hpMax = options.stat.hpMax;
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

    serializeState() {
        return {
            hp: this.hp,
            hpMax: this.hpMax,
            speed: this.speed,
            force: this.force,

            ...super.serializeState(),
        };
    }
}

export { LivingEntity };