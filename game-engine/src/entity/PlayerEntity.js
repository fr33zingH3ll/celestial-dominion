import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

class PlayerEntity extends LivingEntity {
    constructor(game, prototypeName) {
        super(game, prototypeName);
        this.addEventListener();
    }

    addEventListener() {
        this.game.emitter.addEventListener("clientPlayerMove", (event) => {
            console.trace();
            console.log(event);
        });
    }

    sendMove() {
        const position = this.body.position;
        const angle = this.body.angle;

        this.game.server.sendMessage({
            clientPlayerMove: {
                position,
                rotation: angle,
            }
        });
    }

    update(delta) {
        super.update(delta);
        // Mettez à jour la position et l'angle selon votre logique
        if (this.controller) {
            this.move(this.controller.getMoveVector(this.spherical));
            // this.move(this.controller.getMoveVector(this.game.camera));
        }
    }

    static getPrototypes() {
        return {
            base: {
                hpMax: 100,
                speed: 0.5,
                model: "vaisseau_heal.glb",
                vertices: Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50'),
                restitution: 0,
            },
        };
    }
}

export { PlayerEntity };