import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { BackGameMaster } from "game-engine/src/gamemode/BackGameMaster.js";


/**
 * FrontGameMaster instance.
 * Elle hérite des propriétés de BackGameMaster puisqu'elle doit elle aussi géré sa propre simulation. 
 * Mais elle ne gérera pas toute les updates elle ne feras qu'appliqué ce que le backend lui ordonne.
 * @type {THREE.Scene}
 */
class FrontGameMaster extends BackGameMaster {
    constructor() {
        super();
        /**
         * THREE.Scene instance
         * @type {THREE.Scene}
         */
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xc8ad7f);
        this.scene.add(new THREE.AmbientLight(0x404040));

        /**
         * WebGLRenderer instance.
         * @type {WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        /**
         * PerspectiveCamera instance.
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.rotation.set(0.2, 0, 0);
        this.camera.position.set(0, 2, 5);

        /**
         * Boolean instance.
         * Permet de lancer le debug mode de l'application.
         * Par défault le debug mode est désactivé.
         * @type {Boolean}
         */
        this.debug = false;
        this.inBack = false;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Met à jour la scène en appelant la méthode update de la classe parente GameMaster
     * et en rendant la scène avec le rendu WebGL.
     * @param {number} delta - Delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        super.update(delta);
        for (const entity of this.pool) {
            entity.update_front(delta);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

export { FrontGameMaster };
