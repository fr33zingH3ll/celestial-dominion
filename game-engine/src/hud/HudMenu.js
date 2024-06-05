import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class HudMenu {
    constructor(game) {
        this.game = game;
        
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000,transparent: true, opacity: 0.5 });
        this.geometry = new THREE.PlaneGeometry(100, 50);
        this.model = new THREE.Mesh(this.geometry, this.material);
    }

    load(){
        this.game.scene.add(this.model);
    }

      /**
     * Fait tourner la caméra autour du joueur selon un rayon et des radians spécifiés.
     * @param {THREE.Object3D} player - Le joueur autour duquel la caméra doit tourner.
     * @param {number} radius - Le rayon de rotation de la caméra par rapport au joueur.
     * @param {number} radians - Les radians de rotation autour du joueur.
     */
      rotateHudAroundPlayer(player, radius, radians) {
        if(!player)return;
        this.game.playerEntity.hud_spherical.radius = radius;
        this.game.playerEntity.hud_spherical.theta = -radians; // l'angle horizontal
        //this.game.playerEntity.hud_spherical.phi = Math.PI / 2.5; // angle vertical (90 degrés pour rester à hauteur du joueur)

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.game.playerEntity.hud_spherical);
        newPosition.add(player.position); // déplace la position relative au joueur

        this.model.position.copy(newPosition);
        this.model.lookAt(player.position);
    }

    update() {

            this.model.rotation.y = -this.game.playerEntity.body.angle;
            this.rotateHudAroundPlayer(this.game.playerEntity.modelObject,10,this.game.playerEntity.controller.calculateRotationAngle());
            

            //his.model.rotation.x = Math.PI/2;
            if ( !this.model.visible ) this.model.visible = true;
        
    } 


}

export { HudMenu };