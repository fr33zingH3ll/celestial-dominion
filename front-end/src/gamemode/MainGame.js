import { Asteriode } from "../Entity/Asteroide";
import { Player } from "../Entity/Player";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GameMaster } from "../../../game-engine/src/gamemode/GameMaster";

class MainGame extends GameMaster {
    constructor(server) {
        super();
        this.server = server;

        // Création de la scène
        this.scene = new THREE.Scene();

        // Création d'un rendu WebGL
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Création d'une caméra
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        //controls.update() must be called after any manual changes to the camera's transform
        this.camera.position.set( 0, 20, 100 );
        this.controls.update();

        

        // Création d'un fond noir pour la scène
        this.scene.background = new THREE.Color(0xFFFFFF);

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light );

        // Chargement du modèle GLB
        var vaisseau_heal = new GLTFLoader();
        vaisseau_heal.load(
            // Chemin du fichier JSON
            '/assets/models/vaisseau_heal.glb',
            // Callback appelé lorsque le chargement est terminé
            (gltf) => {
                this.scene.add(gltf.scene);
            },undefined,
            // called when loading has errors
            ( error ) => {

                console.log( 'An error happened' );

            }
        );

        // Chargement du modèle GLB
        var tank = new GLTFLoader();
        tank.load(
            // Chemin du fichier JSON
            '/assets/models/tank.glb',
            // Callback appelé lorsque le chargement est terminé
            (gltf) => {
                this.scene.add(gltf.scene);
            },undefined,
            // called when loading has errors
            ( error ) => {

                console.log( 'An error happened' );

            }
        );


        // create two boxes and a ground
        new Player(this, {x: 400, y: 200, 
            vertices: 
            [{x: 0, y: 0},{x: -50, y: 200},{x: 0, y: 150},{x: 50, y: 200}], 
            restitution: 0.5, 
            stat: {
                hp: 1,
                max_hp: 1,
                speed: 10,
                force: 10
            }});
        new Asteriode(this, {x: 450, y: 50, height: 80, width: 80});
    }


    update() {
        super.update()
        for (const entity of this.pool) {
            entity.update();
        }
    
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
    
    start() {
        super.start()
    }

}



export { MainGame };