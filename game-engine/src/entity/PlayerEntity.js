import * as THREE from 'three';
import Matter from "matter-js";

import { LivingEntity } from "./LivingEntity.js";
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

        this.controller = null;
        this.managerHud = null;
        this.hud_spherical = new THREE.Spherical();

        // Initialise les propriétés spécifiques du joueur
        this.cooldown = 500;
        this.tempo_delta = 0;
        this.tempo_rotation = { x: 0, y: 0 };
        this.can_shot = false;
    }

    /**
     * Fait tourner la caméra autour du joueur selon un rayon et des radians spécifiés.
     * @param {THREE.Camera} camera - La caméra à faire tourner.
     * @param {THREE.Object3D} player - Le joueur autour duquel la caméra doit tourner.
     * @param {number} radius - Le rayon de rotation de la caméra par rapport au joueur.
     * @param {number} radians - Les radians de rotation autour du joueur.
     */
    rotateCameraAroundPlayer(camera, player, radius, radians) {
        this.spherical.radius = radius;
        this.spherical.theta = -radians; // l'angle horizontal
        this.spherical.phi = Math.PI / 2.5; // angle vertical (90 degrés pour rester à hauteur du joueur)

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.spherical);
        newPosition.add(player.position); // déplace la position relative au joueur

        this.game.Body.setAngle(this.body, -this.spherical.theta);
        camera.position.copy(newPosition);
        camera.lookAt(player.position);
    }

    /**
     * Envoie les données de déplacement du joueur au serveur.
     */
    sendMove() {
        const position = this.body.position;
        const rotation = this.body.angle;

        this.game.server.sendMessage({
            clientEntityUpdate: {
                position,
                rotation,
            }
        });
    }

    /**
     * Gère le tir du joueur.
     * @param {boolean} boolean - Indique si le joueur peut tirer.
     * @param {boolean} shot - Indique si le joueur est en train de tirer.
     */
    canShot() {
        return this.can_shot;
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

    update_back(delta) { 
        super.update_back(delta);
        if (!this.game.inBack) return;
        this.tempo_delta += delta;
        this.can_shot = this.tempo_delta >= this.cooldown;
    }

    update_front(delta) {
        super.update_front(delta);
        if (this.game.inBack) return;


        if (this.controller) {
            const vector = this.game.playerEntity.controller.calculateRotationAngle();
            if(this.controller.control_player.open_menu == null || this.controller.control_player.open_menu == false){
                if (this.game.playerEntity && this.id == this.game.playerEntity.id && this.modelObject) {
                    this.rotateCameraAroundPlayer(this.game.camera, this.modelObject, 75, vector.x);
                    this.tempo_rotation = { ...vector };
                }
                this.move(this.controller.getMoveVector(this.spherical));
                if (this.controller.control_player.left_click) {
                    this.game.server.sendClientShot();
                }
                this.managerHud.disableVisible();
            }else if(this.controller.control_player.open_menu == true){
                if(this.managerHud && this.id == this.managerHud.owner)this.managerHud.update();
                if (this.game.playerEntity && this.id == this.game.playerEntity.id && this.modelObject) {
                    this.rotateCameraAroundPlayer(this.game.camera, this.modelObject, 75, this.tempo_rotation.x);
                    this.controller.rotation = { ...this.tempo_rotation };
                }
                this.managerHud.enableVisible();
                
            } 
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
