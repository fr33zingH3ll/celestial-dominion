import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GameMaster } from "game-engine/src/gamemode/GameMaster.js";

class Scene3D extends GameMaster {
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
        this.camera.rotation.set(0.2, 0, 0); // Rotation de la caméra
        this.camera.position.set(0, 2, 5); // Position de la caméra

        // Ajout d'une lumière ambiante à la scène
        this.scene.add(new THREE.AmbientLight(0x404040));

        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            // Mise à jour de la perspective de la caméra
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            // Redimensionnement du rendu WebGL
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Met à jour la scène en appelant la méthode update de la classe parente GameMaster
     * et en rendant la scène avec le rendu WebGL.
     * @param {number} delta - Delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        // Appel de la méthode update de la classe parente GameMaster
        super.update(delta);
        // Rendu de la scène avec la caméra
        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene3D };
