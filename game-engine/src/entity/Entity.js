import Matter from 'matter-js';
import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var ID_COUNTER = 0;

class Entity {
    /**
     * Indique si l'état de l'entité a été modifié durant ce tick.
     *
     * @type {boolean}
     */
    dirty;

    /**
     * Indique si l'entité est nouvelle et doit être envoyée aux clients.
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

    /**
     * Crée une instance de l'entité.
     * @param {Game} game - L'instance du jeu.
     * @param {string} prototypeName - Le nom du prototype de l'entité.
     */
    constructor(game, prototypeName) {
        this.game = game;
        this.prototypeName = prototypeName;
        this.entity_type = this.constructor.name;
        this.angle = 0;
        this.spherical = new THREE.Spherical();
        this.collideBox;
        this.tempo_position = { x: 0, y: 0 };
        this.prototype = this.constructor.getPrototypes()[prototypeName];
        console.assert(this.prototype, `prototype ${prototypeName} not found`);

        let static_body = false;
        let mass = 1;

        this.id = ID_COUNTER++;
        if (this.prototype.static) static_body = true;
        if (this.prototype.mass) mass = this.prototype.mass;

        // Création du corps physique de l'entité avec Matter.js
        if (this.prototype.vertices) {
            this.body = this.game.Bodies.fromVertices(0, 0, this.prototype.vertices, { isStatic: static_body, mass: mass });
        } else if (this.prototype.radius) {
            this.body = this.game.Bodies.circle(0, 0, this.prototype.radius, { isStatic: static_body, mass: mass });
            this.scale = this.prototype.radius;
        } else {
            this.body = this.game.Bodies.rectangle(0, 0, this.prototype.height, this.prototype.width, { isStatic: static_body, mass: mass });
        }

        this.body.label = `${this.constructor.name}`;

        this.model = this.prototype.model;
        this.textMesh = "";
        this.loader = new GLTFLoader();
        
    }

    /**
     * Vérifie si l'entité est en mouvement.
     */
    isMoving() {
        const velocityThreshold = 0.05;
        const previous = new THREE.Vector3(this.tempo_position.x, 0, this.tempo_position.y);
        const next = new THREE.Vector3(this.body.position.x, 0, this.body.position.y);
        this.dirty = previous.distanceTo(next) > velocityThreshold;
        return previous.distanceTo(next) > velocityThreshold;
    }

    /**
     * Charge le modèle de l'entité.
     */
    load() {
        if (this.model) {
            // Chargement du modèle via le GLTFLoader
            this.loader.load(
                '/assets/models/' + this.model, // Chemin du fichier glTF/GLB
                (gltf) => {
                    if (this.scale) gltf.scene.scale.set(this.scale || 1, this.scale || 1, this.scale || 1);
                    const box = new THREE.Box3( ).setFromObject( gltf.scene );
                    const c = box.getCenter( new THREE.Vector3( ) );
                    gltf.scene.position.set( -c.x, - c.y, -c.z ); // center the gltf scene
                    this.modelObject = new THREE.Object3D();
                    this.modelObject.add(gltf.scene);

                    const vertices = this.body.vertices.map(v => ({ x: v.x, y: v.y }));
                    
                    const shape = new THREE.Shape(vertices);
                    const extrudeSettings = { steps: 2, depth: 10, bevelEnabled: false };

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    geometry.computeBoundingBox();

                    const center = new THREE.Vector3();
                    geometry.boundingBox.getCenter(center);
                    geometry.translate(-center.x, -center.y, -center.z);

                    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
                    const mesh = new THREE.Mesh(geometry, material);
                    this.collideBox = mesh;
                    this.collideBox.rotateX(Math.PI / 2);

                    // Ajout du maillage de collision et du modèle à la scène Three.js
                    this.game.scene.add(this.collideBox);
                    this.game.scene.add(this.modelObject);
                },
                undefined,
                (error) => {
                    console.log(error); // Gestion des erreurs lors du chargement
                }
            );
        }
        // 
    }

    /**
     * Nettoie l'entité lorsqu'elle est détruite.
     */
    destroy() {
        // Suppression du modèle de la scène
        if (this.game.scene) {
            this.game.scene.remove(this.collideBox);
            this.game.scene.remove(this.modelObject);
        }

        if (this.modelObject) {
            // Libération des ressources du modèle
            this.modelObject.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => this.disposeMaterial(material));
                    } else {
                        this.disposeMaterial(child.material);
                    }
                }
            });
            this.modelObject = null;
        }

        if (this.collideBox) {
            this.collideBox.geometry.dispose();
            if (Array.isArray(this.collideBox.material)) {
                this.collideBox.material.forEach(material => this.disposeMaterial(material));
            } else {
                this.collideBox.material.dispose();
            }
            this.collideBox = null;
        }
    }

    /**
     * Libère les ressources d'un matériau.
     * @param {THREE.Material} material - Le matériau à libérer.
     */
    disposeMaterial(material) {
        for (const key in material) {
            if (material[key] && material[key].isTexture) {
                material[key].dispose();
            }
        }
        material.dispose();
    }

    /**
     * Sérialise l'état de l'entité.
     * @returns {object} L'état sérialisé de l'entité.
     */
    serializeState() {
        return {
            position: this.body.position,
            angle: this.body.angle,
            velocity: this.body.velocity,
            angularVelocity: this.body.angularVelocity,
        };
    }

    /**
     * Déserialise l'état de l'entité.
     * @param {object} state - L'état sérialisé de l'entité.
     */
    deserializeState(state) {
        this.game.Body.setPosition(this.body, state.position);
        this.game.Body.setAngle(this.body, state.angle);
        this.game.Body.setVelocity(this.body, state.velocity);
        this.game.Body.setAngularVelocity(this.body, state.angularVelocity);
    }

    update_front() {
        if (!this.modelObject || !this.body) return;
        const { x, y } = this.body.position;
        this.modelObject.position.set(this.tempo_position.x, 0, this.tempo_position.y);

        this.modelObject.setRotationFromEuler(new THREE.Euler(0, -this.body.angle, 0));

        if (!this.collideBox) return;
        if (this.game.debug) {
            this.collideBox.visible = true;
            this.collideBox.position.set(x, 0, y);
            this.collideBox.rotation.z = this.body.angle;
        } else {
            this.collideBox.visible = false;
        }
    }

    /**
     * Met à jour l'entité à chaque itération de la boucle de jeu.
     * @param {number} delta - Le temps écoulé depuis la dernière mise à jour.
     */
    update_back(delta) {
        if (!this.body && !this.game.inBack) return;
        this.isMoving();

        const { x, y } = this.body.position;
        this.tempo_position = { x, y };
    }
}

export { Entity };