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

        // Écoute des événements de collision
        this.game.Events.on(this.game.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            // Boucle sur les paires de corps en collision
            pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                const entityA = this.game.pool.find(e => e.body === bodyA);
                const entityB = this.game.pool.find(e => e.body === bodyB);

                if (entityA !== this && entityB !== this) {
                    return;
                }

                let other;

                if (entityA !== this) other = entityA;
                else if (entityB !== this) other = entityB;

                if (other.damage) {
                    other.damage(this.force);
                    this.onDeath();
                }
            });
        });
    }

    update(delta) { 
        super.update(delta);
        if (this.track) {
            // Crée un vecteur de vitesse en utilisant l'angle et la vitesse souhaitée
            const forceMagnitude = 10; // Ajuste la force en fonction de la masse
            const velocity = this.game.Vector.mult(this.game.Vector.create(
                Math.cos(this.track),
                Math.sin(this.track)
            ), forceMagnitude);
        
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