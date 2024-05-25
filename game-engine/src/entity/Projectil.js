import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

/**
 * Représente un projectile dans le jeu, héritant de la classe LivingEntity.
 */
class Projectile extends LivingEntity {
    /**
     * Crée une instance de Projectile.
     * @param {Object} game - L'instance du jeu.
     * @param {string} prototyName - Le nom du prototype de l'entité.
     * @param {number} id - L'identifiant du propriétaire du projectile.
     */
    constructor(game, prototyName, id) {
        super(game, prototyName);

        // Initialise les propriétés spécifiques du projectile
        this.owner = id;
        this.startPosition = { x: this.body.position.x, y: this.body.position.y };
        this.distanceTraveled = 0;
        this.track = null;

        // Écoute les événements de collision
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

    /**
     * Met à jour le projectile.
     * @param {number} delta - Le temps écoulé depuis la dernière mise à jour.
     */
    update(delta) { 
        super.update(delta);

        // Si le projectile a une trajectoire définie, le déplace dans cette direction
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

    /**
     * Retourne les prototypes de projectile disponibles.
     * @returns {Object} - Les prototypes de projectile.
     */
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

export { Projectile };
