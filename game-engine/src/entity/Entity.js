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
        this.angle = 0;
        this.spherical = new THREE.Spherical();
        this.collideBox;
        this.tempo_position = { x: 0, y: 0 };
        this.prototype = this.constructor.getPrototypes()[prototypeName];
        console.assert(this.prototype, `prototype ${prototypeName} not found`);

        this.id = ID_COUNTER++;

        // Création du corps physique de l'entité avec Matter.js
        if (this.prototype.vertices) {
            this.body = this.game.Bodies.fromVertices(0, 0, this.prototype.vertices, { restitution: this.prototype.restitution ?? 0 });
        } else {
            this.body = this.game.Bodies.rectangle(0, 0, this.prototype.height, this.prototype.width, { static: this.prototype.static ?? false });
        }

        this.body.label = `${this.constructor.name}`;

        this.model = this.prototype.model;
        this.textMesh = "";
        this.loader = new GLTFLoader();
        this.modelObject = new THREE.Object3D();
    }

    /**
     * Vérifie si l'entité est en mouvement.
     */
    isMoving() {
        const velocityThreshold = 0.05;

        const previous = new THREE.Vector3(this.tempo_position.x, 0, this.tempo_position.y);
        const next = new THREE.Vector3(this.body.position.x, 0, this.body.position.y);

        this.dirty = previous.distanceTo(next) > velocityThreshold;
    }

    /**
     * Obtient la position de l'entité.
     * @returns {THREE.Vector2} La position de l'entité.
     */
    getPosition() {
        return this.body.position;
    }

    getModelObject() {
        return this.modelObject;
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
                    this.modelObject.add(gltf.scene);

                    // Création d'une géométrie pour la collision
                    const vertices = this.body.vertices.map(v => ({ x: v.x, y: v.y }));
                    const shape = new THREE.Shape(vertices);
                    const extrudeSettings = { steps: 2, depth: 10, bevelEnabled: false };
                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    geometry.center();

                    // Création d'un maillage pour la collision
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
     * Fait tourner la caméra autour du joueur selon un rayon et des radians spécifiés.
     * @param {THREE.Camera} camera - La caméra à faire tourner.
     * @param {THREE.Object3D} player - Le joueur autour duquel la caméra doit tourner.
     * @param {number} radius - Le rayon de rotation de la caméra par rapport au joueur.
     * @param {number} radians - Les radians de rotation autour du joueur.
     */
    rotateCameraAroundPlayer(camera, player, radius, radians) {
        this.spherical.radius = radius;
        this.spherical.theta = -radians; // l'angle horizontal
        this.spherical.phi = Math.PI / 2.5; // angle vertical (90 degrés pour rester à hauteur du joueur)

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.spherical);
        newPosition.add(player.position); // déplace la position relative au joueur

        this.game.Body.setAngle(this.body, -this.spherical.theta);
        camera.position.copy(newPosition);
        camera.lookAt(player.position);
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
        if (this.collideBox && this.game.debug) {
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
        if (!this.body) return;
        this.isMoving();

        const { x, y } = this.body.position;
        this.tempo_position = { x, y };
    }
}

export { Entity };