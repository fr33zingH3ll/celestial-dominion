import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HudMenu } from './HudMenu.js';

class HudButton {
    constructor(hud) {
        this.hud = hud;
        
        this.buttonMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733,transparent: true, opacity: 1 });
        this.buttonGeometry = new THREE.PlaneGeometry( 10, 10);
        this.buttonModel = new THREE.Mesh(this.buttonGeometry, this.buttonMaterial);
        this.buttonModel.position.set(0,0,0);
        this.load();
    }

    load(){
        this.hud.model.add(this.buttonModel);
        
    }

    update(){  }
}
export { HudButton };