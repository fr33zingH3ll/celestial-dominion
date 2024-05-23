import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Importation du chargeur GLTFLoader de Three.js
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import Matter from 'matter-js';

var ID_COUNTER = 0;

class Entity {
    /**
     * Indique si l'état de l'entité a été modifié durant ce tick.
     *
     * @type {boolean}
     */
    dirty;

    /**
     * Indique si l'entitée est nouvelle et doit être envoyée aux clients.
     * 
     * @type {boolean}
     */
    newborn = true;

    /**
     * @type {THREE.Object3D}
     */
    modelObject;

    /**
     * @type {Matter.Body}
     */
    body;

    constructor(game, prototypeName) {
        this.game = game;
        this.prototypeName = prototypeName;
        this.angle = 0;
        this.spherical = new THREE.Spherical();
        this.prototype = this.constructor.getPrototypes()[prototypeName];
        console.assert(this.prototype, `prototype ${prototypeName} not found`);

        this.id = ID_COUNTER++;

        if (this.prototype.vertices) {
            this.body = this.game.Bodies.fromVertices(0, 0, this.prototype.vertices, { restitution: this.prototype.restitution ?? 0 });
        } else {
            this.body = this.game.Bodies.rectangle(0, 0, this.prototype.height, this.prototype.width, { static: this.prototype.static ?? false });
        }

        this.body.label = `${this.constructor.name}`;

        this.model = this.prototype.model;
        this.textMesh = "";
        this.loader = new GLTFLoader();
    }

    rotateCameraAroundPlayer(camera, player, radius, radians) {
        this.spherical.radius = radius;
        this.spherical.theta = -radians; // l'angle horizontal
        this.spherical.phi = Math.PI / 2.5; // angle vertical (90 degrés pour rester à hauteur du joueur)
    
        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.spherical);
        newPosition.add(player.position); // déplace la position relative au joueur
    
        camera.position.copy(newPosition);
    
        camera.lookAt(player.position);
    }

    load() {
        if (this.model) {
            this.loader.load(
                '/assets/models/' + this.model, // Chemin du fichier glTF/GLB
                (gltf) => {
                    this.modelObject = gltf.scene;
                    console.log(this.modelObject);

                    

                    // Ajoutez l'objet Group à la scène
                    this.game.scene.add(this.modelObject);
                },
                undefined,
                (error) => {
                    console.log(error); // Gestionnaire d'erreur
                }
            );
            
        }
    }

    // Méthode pour nettoyer l'écouteur d'événements lorsque l'entité est détruite
    destroy() {
        this.game.scene.remove(this.modelObject);
    }

    serializeState() {
        return {
            position: this.body.position,
            angle: this.body.angle,
            velocity: this.body.velocity,
        };
    }

    deserializeState(state) {
        this.game.Body.setPosition(this.body, state.position);
        this.game.Body.setAngle(this.body, state.angle);
        this.game.Body.setVelocity(this.body, state.velocity);
    }

    update(delta) {
        if (!this.body || !this.modelObject) return;

        const { x, y } = this.body.position;
        
        this.angle += 0.1;
        
        // dans le monde de Three, y est le haut, mais dans le monde de Matter, y est l'horizontal
        this.modelObject.position.set(x, 0, y);
        this.rotateCameraAroundPlayer(this.game.camera, this.modelObject, 75, this.game.playerEntity.controller.calculateRotationAngle());
        this.modelObject.setRotationFromEuler(new THREE.Euler(0, -this.body.angle, 0)); // TODO vérifier si l'ordre est correct
    }
}

export { Entity };
