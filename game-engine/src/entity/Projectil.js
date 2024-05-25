import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

class Projectil extends LivingEntity {
    constructor(game, prototyName, id) {
        super(game, prototyName);
        this.owner = id;
    }

    update(delta) { 
        super.update(delta);
    }

    static getPrototypes() {
        return {
            base: {
                hpMax: 1,
                speed: 10,
                force: 80,
                model: "Asteroid_1.glb",
                vertices: Vertices.fromPath('2 0 2 2 0 2 0 0'),
                restitution: 0,
            },
        };
    }
}

export { Projectil };