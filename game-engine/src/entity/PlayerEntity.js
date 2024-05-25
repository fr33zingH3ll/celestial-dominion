import { LivingEntity } from "./LivingEntity.js";
import Matter from "matter-js";
const { Vertices } = Matter;

/**
 * Représente une entité joueur dans le jeu, héritant de la classe LivingEntity.
 */
class PlayerEntity extends LivingEntity {
    /**
     * Crée une instance de PlayerEntity.
     * @param {Object} game - L'instance du jeu.
     * @param {string} prototypeName - Le nom du prototype de l'entité.
     */
    constructor(game, prototypeName) {
        super(game, prototypeName);

        // Initialise les propriétés spécifiques du joueur
        this.cooldown = 500;
        this.tempo_delta = 0;
        this.can_shot = false;

        // Ajoute les écouteurs d'événements
        this.addEventListener();
    }

    /**
     * Ajoute les écouteurs d'événements pour les mises à jour des entités client.
     */
    addEventListener() {
        this.game.emitter.addEventListener("clientEntityUpdate", (event) => {
            console.trace();
            console.log(event);
        });
    }

    /**
     * Envoie les données de déplacement du joueur au serveur.
     */
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

    /**
     * Gère le tir du joueur.
     * @param {boolean} boolean - Indique si le joueur peut tirer.
     * @param {boolean} shot - Indique si le joueur est en train de tirer.
     */
    shot(boolean, shot) {
        if (boolean && shot) {
            this.game.server.sendClientShot();
            this.tempo_delta = 0;
        }
    }

    /**
     * Détruit l'entité joueur, en supprimant également les écouteurs d'événements du contrôleur si présent.
     */
    destroy() {
        super.destroy();

        if (this.controller) {
            this.controller.removeEventListeners();
        }
    }

    /**
     * Met à jour l'entité joueur.
     * @param {number} delta - Le temps écoulé depuis la dernière mise à jour.
     */
    update(delta) {
        super.update(delta);
        
        // Incrémente le délai entre les tirs
        if (this.tempo_delta < this.cooldown) {
            this.tempo_delta += delta;
        }
        
        // Vérifie si le joueur peut tirer
        this.can_shot = this.tempo_delta >= this.cooldown ? true : false;
        
        // Met à jour la position et l'angle du joueur en fonction de la logique du contrôleur
        if (this.controller) {
            this.move(this.controller.getMoveVector(this.spherical));
            this.shot(this.can_shot, this.controller.control.left_click);
        }
    }

    /**
     * Retourne les prototypes d'entité joueur disponibles.
     * @returns {Object} - Les prototypes d'entité joueur.
     */
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
