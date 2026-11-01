import * as THREE from 'three';
import { GameMaster } from "./GameMaster.js";

/**
 * Affichage Three.js branché sur un `GameMaster` séparé.
 * `stepSimulation === false` n'avance pas Matter.js : la partie en ligne
 * se contente d'afficher les états reçus du serveur.
 */
class Scene3D {
    constructor() {
        this.simulation = new GameMaster();
        this.pool = this.simulation.pool;
        this.emitter = this.simulation.emitter;
        this.Engine = this.simulation.Engine;
        this.Render = this.simulation.Render;
        this.Bodies = this.simulation.Bodies;
        this.Body = this.simulation.Body;
        this.Vector = this.simulation.Vector;
        this.Composite = this.simulation.Composite;
        this.Events = this.simulation.Events;
        this.engine = this.simulation.engine;
        this.world = this.simulation.world;
        this.debug = false;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0xc8ad7f);
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.set(0.2, 0, 0);
        this.camera.position.set(0, 2, 5);
        this.scene.add(new THREE.AmbientLight(0x404040));

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    addPool(entity) {
        this.simulation.addPool(entity);
    }

    removePool(entity) {
        this.simulation.removePool(entity);
    }

    getEntityById(id) {
        return this.simulation.getEntityById(id);
    }

    start() {
        this.simulation.start();
    }

    /**
     * Avance la physique seulement si `stepSimulation` n'est pas false, puis dessine.
     * @param {number} delta
     */
    update(delta) {
        if (this.stepSimulation !== false) {
            this.simulation.update(delta);
        }
        if (this.view) {
            this.view.syncAll(this.pool);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

export { Scene3D };
