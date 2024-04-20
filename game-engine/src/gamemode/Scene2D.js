import * as THREE from 'three';
import { GameMaster } from './GameMaster.js';

class Scene2D extends GameMaster {
    constructor() {
        super();
        // Création de la scène Three.js
        this.scene = new THREE.Scene();

        // Création d'un rendu WebGL et ajout au DOM
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Création d'un fond noir pour la scène
        this.scene.background = new THREE.Color(0xc8ad7f);

        // Création d'une caméra PerspectiveCamera
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.set( 0.2, 0, 0 );

        // Ajout d'une lumière ambiante à la scène
        this.scene.add( new THREE.AmbientLight( 0x404040 ) );

        // Création d'un rectangle transparent
        const geometry = new THREE.PlaneGeometry(5, 3); // Dimensions du rectangle
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 }); // Matériau transparent
        const rectangle = new THREE.Mesh(geometry, material);
        this.scene.add(rectangle);
    }

    update(delta) {
        super.update(delta);
        
        this.renderer.render(this.scene, this.camera); // Rendu de la scène avec la caméra
    }
}

export { Scene2D };
