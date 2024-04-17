import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Importation du chargeur GLTFLoader de Three.js
import * as THREE from 'three'; // Importation de la bibliothèque Three.js

class Entity {
    constructor(game, options) {
        this.game = game;
        if (options.vertices) {
            this.body = this.game.Bodies.fromVertices(options.x, options.y, options.vertices, {restitution: options.restitution} );
        } else {
            this.body = this.game.Bodies.rectangle(options.x, options.y, options.height, options.width, { isStatic: options.isStatic });
        }
        this.model = options.model;
        this.loader = new GLTFLoader();
        this.target = new EventTarget();
    }

    load() {
        this.loader.load(
            '/assets/models/' + this.model, // Chemin du fichier GLB
            (gltf) => {
                // Créez un nouvel objet Object3D
                this.modelObject = new THREE.Object3D();

                // Ajoutez la scène chargée à l'objet Object3D
                this.modelObject.add(gltf.scene);

                // Position initiale du modèle
                this.modelObject.position.set(0, 0, 0); // Mettez les coordonnées x, y, z que vous souhaitez

                // Rotation initiale du modèle
                this.modelObject.rotation.set(0, Math.PI / 2, 0); // Mettez les angles d'Euler que vous souhaitez

                // Ajoutez l'objet Object3D à la scène
                this.game.scene.add(this.modelObject);
            },
            undefined,
            ( error ) => {
                console.log(error); // Gestionnaire d'erreur
            }   
        );
    }

    initListener() {
        this.game.emitter.on('clientPlayerUpdate', (event) => {
            console.log('Événement Node.js déclenché:', event.detail.message);
        });
    }

    // Méthode pour nettoyer l'écouteur d'événements lorsque l'entité est détruite
    destroy() {}

    update(delta) {}
}

export { Entity };
