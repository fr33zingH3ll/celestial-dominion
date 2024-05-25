import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

class PlayerEntity extends LivingEntity {
    constructor(game, prototypeName) {
        super(game, prototypeName);
        this.cooldown = 500;
        this.tempo_delta = 0;
        this.can_shot = false;
        this.addEventListener();
    }

    addEventListener() {
        this.game.emitter.addEventListener("clientEntityUpdate", (event) => {
            console.trace();
            console.log(event);
        });
    }

    sendMove() {
        const position = this.body.position;
        const angle = this.body.angle;

        this.game.server.sendMessage({
            clientEntityUpdate: {
                position,
                rotation: angle,
            }
        });
    }

    shot(boolean, shot) {
        if (boolean && shot) {
            this.game.server.sendClientShot();
            this.tempo_delta = 0;
        }
    }

    destroy() {
        super.destroy();

        if (this.controller) {
            this.controller.removeEventListeners();
        }
    }

    update(delta) {
        super.update(delta);
        if (this.tempo_delta < this.cooldown) {
            this.tempo_delta += delta;
        }
        this.can_shot = this.tempo_delta >= this.cooldown ? true : false;
        // Mettez à jour la position et l'angle selon votre logique
        if (this.controller) {
            this.move(this.controller.getMoveVector(this.spherical));
            this.shot(this.can_shot, this.controller.control.left_click);
        }
    }

    static getPrototypes() {
        return {
            base: {
                hpMax: 100,
                speed: 0.5,
                force: 10,
                model: "vaisseau_heal.glb",
                vertices: Vertices.fromPath('15 0 15 15 0 15 0 0'),
                restitution: 0,
            },
        };
    }
}

export { PlayerEntity };