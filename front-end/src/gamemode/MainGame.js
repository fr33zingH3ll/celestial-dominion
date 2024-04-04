import { GameMode } from "../../../game-engine/src/gamemode/GameMode";
import { Asteriode } from "../Entity/Asteroide";
import { Player } from "../Entity/Player";
import * as THREE from 'three';

class MainGame extends GameMode {
    constructor(server) {
        super();
        this.server = server;

        // Création de la scène
        this.scene = new THREE.Scene();

        // Création d'une caméra
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.camera.position.z = 5;

        // Création d'un rendu WebGL
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Création d'un fond noir pour la scène
        this.scene.background = new THREE.Color(0x000000);

        // Création d'une sphère
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Blanc
        this.sphere = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.sphere);


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
    
        this.sphere.rotation.x += 0.01;
        this.sphere.rotation.y += 0.01;
    
        this.renderer.render(this.scene, this.camera);
    }
    
    start() {
        super.start()
    }

}



export { MainGame };