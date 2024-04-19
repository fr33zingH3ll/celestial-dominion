import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GameMaster } from "game-engine/src/gamemode/GameMaster"; // Importation de la classe GameMaster depuis le chemin spécifié

class MainGame extends GameMaster { // Définition de la classe MainGame qui étend GameMaster
    constructor(server) { // Constructeur de la classe MainGame avec le paramètre 'server'
        super(); // Appel du constructeur de la classe parente GameMaster
        this.server = server; // Assignation du paramètre 'server' à la propriété 'server' de MainGame
        
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
    }

    addPool(entity) {
        super.addPool(entity);
        entity.load();
    }

    update(delta) {
        super.update(); // Appel de la méthode update() de la classe parente GameMaster
        for (const entity of this.pool) {
            entity.update(delta); // Appel de la méthode update() pour chaque entité dans le pool
            if (entity instanceof Player) this.renderer.render(this.scene, this.camera); // Rendu de la scène avec la caméra
        }
    }
    
    start() {
        super.start(); // Appel de la méthode start() de la classe parente GameMaster
    }
}

export { MainGame }; // Exportation de la classe MainGame pour une utilisation dans d'autres fichiers
