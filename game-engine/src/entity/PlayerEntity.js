import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

/** Délai minimum entre deux tirs, en millisecondes. */
const SHOT_COOLDOWN_MS = 500;

/**
 * Représente une entité joueur dans le jeu, héritant de la classe LivingEntity.
 */
class PlayerEntity extends LivingEntity {
    /**
     * @param {Object} game
     * @param {string} prototypeName
     */
    constructor(game, prototypeName) {
        super(game, prototypeName);
        this.cooldown = SHOT_COOLDOWN_MS;
        this.tempo_delta = 0;
        this.can_shot = false;
    }

    /**
     * Autorise un tir si le délai est écoulé. À appeler côté serveur.
     * @returns {boolean}
     */
    tryShot() {
        if (this.tempo_delta < this.cooldown) return false;
        this.tempo_delta = 0;
        this.can_shot = false;
        return true;
    }

    destroy() {
        super.destroy();
        if (this.controller) {
            this.controller.removeEventListeners();
        }
    }

    /**
     * Avance le délai entre deux tirs.
     * Un contrôleur local envoie le tir. Le joueur du serveur n'en a pas :
     * son tir arrive par le message réseau et `tryShot`.
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        if (this.tempo_delta < this.cooldown) {
            this.tempo_delta += delta;
        }
        this.can_shot = this.tempo_delta >= this.cooldown;

        if (this.controller && this.can_shot && this.controller.control.left_click) {
            this.game.server.sendClientShot();
            this.tempo_delta = 0;
            this.can_shot = false;
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
