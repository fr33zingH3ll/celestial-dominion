import { Entity } from "./Entity.js";

class LivingEntity extends Entity {
    constructor(game, prototypeName) {
        super(game, prototypeName);

        this.hpMax = this.prototype.hpMax;
        this.hp = this.hpMax;
        this.speed = this.prototype.speed;
        this.force = this.prototype.force;
    }

    damage(damage) {
        this.hp -= damage;
    }

    move(vector) {
        if (vector.x === 0 && vector.y === 0) {
            return;
        }
    
        // Calcule l'angle en radians en fonction du vecteur de direction
        const radians = Math.atan2(vector.y, vector.x);
    
        // Crée un vecteur de vitesse en utilisant l'angle et la vitesse souhaitée
        const forceMagnitude = this.speed / this.body.mass; // Ajuste la force en fonction de la masse
        const velocity = this.game.Vector.create(
            Math.cos(radians) / 20000 * forceMagnitude,
            Math.sin(radians) / 20000 * forceMagnitude
        );
    
        // Applique la force ajustée au corps
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

    update(delta) {
        super.update(delta);
    }
}

export { LivingEntity };