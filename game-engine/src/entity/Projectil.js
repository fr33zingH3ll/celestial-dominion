import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

/**
 * Représente un projectile dans le jeu, héritant de la classe LivingEntity.
 */
class Projectil extends LivingEntity {
    /**
     * Crée une instance de Projectile.
     * @param {Object} game - L'instance du jeu.
     * @param {string} prototyName - Le nom du prototype de l'entité.
     * @param {number} id - L'identifiant du propriétaire du projectile.
     */
    constructor(game, prototyName, id) {
        super(game, prototyName);

        this.owner = id;
        this.isProjectile = true;
        this.spent = false;
        this.startPosition = { x: this.body.position.x, y: this.body.position.y };
        this.distanceTraveled = 0;
        this.track = null;
    }

    /**
     * Met à jour le projectile.
     * @param {number} delta - Le temps écoulé depuis la dernière mise à jour.
     */
    update(delta) { 
        super.update(delta);

        // Si le projectile a une trajectoire définie, le déplace dans cette direction
        if (this.track) {
            const projectileSpeed = 10;
            const velocity = this.game.Vector.mult(this.game.Vector.create(
                Math.cos(this.track),
                Math.sin(this.track)
            ), projectileSpeed);
        
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

export { Projectil };
