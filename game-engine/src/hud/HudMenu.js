import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class HudMenu {
    constructor(game) {
        this.game = game;
        
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.geometry = new THREE.PlaneGeometry(100, 50);
        this.model = new THREE.Mesh(this.geometry, this.material);
        
    }

    load(){
        this.game.scene.add(this.model);
    }

    update() {
        this.model.position.set(this.game.playerEntity.body.position.x,0,this.game.playerEntity.body.position.y);
        this.model.rotation.y = -this.game.playerEntity.body.angle;
    } 
}

export { HudMenu };