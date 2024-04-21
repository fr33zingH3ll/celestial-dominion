import matter from "matter-js";
import { Entity } from "./Entity.js";

class LivingEntity extends Entity {
    constructor(game, prototypeName) {
        super(game, prototypeName);

        this.hpMax = this.prototype.hpMax;
        this.hp = this.hpMax;
    }

    move(vector) {
        if (vector.x === 0 && vector.y === 0) {
            return;
        }

        const radians = Math.atan2(vector.x, vector.y);
        const velocity = this.game.Vector.create(Math.sin(radians) / 1500 * this.speed, Math.cos(radians) / 1500 * this.speed);
        this.game.Body.applyForce(this.body, this.body.position, velocity);
    }

    setAngularVelocity(angle) {
        if (angle === 0) {
            return;
        }

        this.game.Body.setAngularVelocity(this.body, angle / 50);
    }

    serializeState() {
        return {
            livingEntity: {
                hp: this.hp,
                hpMax: this.hpMax,
                speed: this.speed,
                force: this.force,
            },

            ...super.serializeState(),
        };
    }

    deserializeState(state) {
        super.deserializeState(state);
        this.hp = state.livingEntity.hp;
        this.hpMax = state.livingEntity.hpMax;
        this.speed = state.livingEntity.speed;
        this.force = state.livingEntity.force;
    }
}

export { LivingEntity };