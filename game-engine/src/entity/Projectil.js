import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

class Projectil extends LivingEntity {
    constructor(game, prototyName, id) {
        super(game, prototyName);
        this.owner = id;
        this.startPosition = { x: this.body.position.x, y: this.body.position.y };
        this.distanceTraveled = 0;
        this.track = null;
    }

    setTrack (radians) {
        this.track = radians;
    }

    update(delta) { 
        super.update(delta);
        if (this.track != null) {
            // Crée un vecteur de vitesse en utilisant l'angle et la vitesse souhaitée
            const forceMagnitude = this.speed / this.body.mass; // Ajuste la force en fonction de la masse
            const velocity = this.game.Vector.create(
                Math.cos(this.track) / 20000 * forceMagnitude,
                Math.sin(this.track) / 20000 * forceMagnitude
            );
        
            // Applique la force ajustée au corps
            this.game.Body.setVelocity(this.body, velocity);
        }
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