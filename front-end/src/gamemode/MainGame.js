import { Asteriode } from "../Entity/Asteroide"; // Importation de la classe Asteroide depuis le fichier correspondant
import { Player } from "../Entity/Player"; // Importation de la classe Player depuis le fichier correspondant
import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Importation du chargeur GLTFLoader de Three.js
import { GameMaster } from "../../../game-engine/src/gamemode/GameMaster"; // Importation de la classe GameMaster depuis le chemin spécifié

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

        // Création d'une caméra PerspectiveCamera
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.camera.position.set( 0, 20, 100 ); // Positionnement de la caméra

        // Création d'un fond noir pour la scène
        this.scene.background = new THREE.Color(0xFFFFFF);

        // Ajout d'une lumière ambiante à la scène
        const light = new THREE.AmbientLight( 0x404040 ); // Lumière blanche douce
        this.scene.add( light );

        // Chargement du modèle GLB 'vaisseau_heal.glb'
        var vaisseau_heal = new GLTFLoader();
        vaisseau_heal.load(
            '/assets/models/vaisseau_heal.glb', // Chemin du fichier GLB
            (gltf) => {
                this.scene.add(gltf.scene); // Ajout du modèle à la scène lorsque le chargement est terminé
            },
            undefined,
            ( error ) => {
                console.log( 'An error happened' ); // Gestionnaire d'erreur
            }
        );

        // Chargement du modèle GLB 'tank.glb'
        var tank = new GLTFLoader();
        tank.load(
            '/assets/models/tank.glb', // Chemin du fichier GLB
            (gltf) => {
                this.scene.add(gltf.scene); // Ajout du modèle à la scène lorsque le chargement est terminé
            },
            undefined,
            ( error ) => {
                console.log( 'An error happened' ); // Gestionnaire d'erreur
            }
        );

        // Création d'une instance de Player avec des paramètres spécifiques et ajout à la scène
        new Player(this, {
            x: 400,
            y: 200,
            vertices: [{x: 0, y: 0},{x: -50, y: 200},{x: 0, y: 150},{x: 50, y: 200}],
            restitution: 0.5,
            stat: {
                hp: 1,
                max_hp: 1,
                speed: 10,
                force: 10
            }
        });

        // Création d'une instance de Asteriode avec des paramètres spécifiques et ajout à la scène
        new Asteriode(this, {
            x: 450,
            y: 50,
            height: 80,
            width: 80
        });
    }

    update() {
        super.update(); // Appel de la méthode update() de la classe parente GameMaster
        for (const entity of this.pool) {
            entity.update(); // Appel de la méthode update() pour chaque entité dans le pool
        }
        this.renderer.render(this.scene, this.camera); // Rendu de la scène avec la caméra
    }
    
    start() {
        super.start(); // Appel de la méthode start() de la classe parente GameMaster
    }
}

export { MainGame }; // Exportation de la classe MainGame pour une utilisation dans d'autres fichiers
