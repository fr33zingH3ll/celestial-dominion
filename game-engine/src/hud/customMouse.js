import * as THREE from 'three'; // Importation de la bibliothèque Three.js

class CustomMouse {
    constructor(game) {
        this.game = game;

        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000,transparent: true, opacity: 0.5 });
        const width = window.innerWidth * 0.5; // 95% de la largeur de la fenêtre
        const height = window.innerHeight * 0.5; // 95% de la hauteur de la fenêtre
        //console.log(width,height);
        this.geometry = new THREE.PlaneGeometry( 5, 5);
        this.model = new THREE.Mesh(this.geometry, this.material);
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
        this.game.playerEntity.hud_spherical.phi = Math.PI / 2.5; // angle vertical (90 degrés pour rester à hauteur du joueur)

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.game.playerEntity.hud_spherical);
        newPosition.add(player.position); // déplace la position relative au joueur

        
        this.model.position.copy(newPosition);
        this.model.lookAt(this.game.camera.position);
    }

    load(){
        this.game.scene.add(this.model);
    }

    update() {
        if ( !this.model.visible ) this.model.visible = true;
        if (this.game.playerEntity.isMoving()){
            this.model.rotation.y = -this.game.playerEntity.body.angle;
            this.rotateHudAroundPlayer(this.game.playerEntity.modelObject, 10, this.game.playerEntity.tempo_rotation.x);
        }
        
    } 


}

export { CustomMouse };