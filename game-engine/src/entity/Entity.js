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

    /**
     * Charge le modèle de l'entité.
     */
    load() {
        if (this.model) {
            // Chargement du modèle via le GLTFLoader
            this.loader.load(
                '/assets/models/' + this.model, // Chemin du fichier glTF/GLB
                (gltf) => {
                    this.modelObject = gltf.scene;

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
            this.game.scene.remove(this.modelObject);
            this.game.scene.remove(this.collideBox);
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

    /**
     * Met à jour l'entité à chaque itération de la boucle de jeu.
     * @param {number} delta - Le temps écoulé depuis la dernière mise à jour.
     */
    update(delta) {
        // Vérifie si le corps physique de l'entité existe
        if (!this.body) return;

        // Vérifie si l'entité est en mouvement
        this.isMoving();

        // Récupère les coordonnées x et y de la position de l'entité
        const { x, y } = this.body.position;

        // Stocke temporairement la position dans l'attribut tempo_position
        this.tempo_position = { x, y };

        // Vérifie si l'objet de modèle 3D existe
        if (!this.modelObject) return;

        // Positionne l'objet de modèle 3D aux coordonnées de l'entité
        // avec la prise en compte de la différence de coordonnées entre les mondes Three.js et Matter.js
        this.modelObject.position.set(x, 0, y);

        // Si l'entité est le joueur, effectue une rotation de la caméra autour du joueur
        if (this.id == this.game.playerEntity.id) {
            this.rotateCameraAroundPlayer(this.game.camera, this.modelObject, 75, this.game.playerEntity.controller.calculateRotationAngle());
        }

        // Applique la rotation de l'objet de modèle 3D en fonction de l'angle du corps physique de l'entité
        this.modelObject.setRotationFromEuler(new THREE.Euler(0, -this.body.angle, 0));

        // Vérifie si la boîte de collision existe et si le mode de débogage est activé
        if (!this.collideBox) return;
        if (this.collideBox && this.game.debug) {
            // Positionne et oriente la boîte de collision en fonction de l'angle du corps physique de l'entité
            this.collideBox.visible = true;
            this.collideBox.position.set(x, 0, y);
            this.collideBox.rotation.z = this.body.angle;
        } else {
            // Masque la boîte de collision si le mode de débogage n'est pas activé
            this.collideBox.visible = false;
        }
    }
}

export { Entity };