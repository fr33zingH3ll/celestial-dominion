import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

const CAMERA_RADIUS = 75;
const CAMERA_PHI = Math.PI / 2.5;

/**
 * Affiche les entités. Le serveur ne charge pas ce module.
 */
class EntityView {
    /**
     * @param {Object} game
     */
    constructor(game) {
        this.game = game;
        this.loader = new GLTFLoader();
        this.byEntity = new Map();
        this.spherical = new THREE.Spherical();
    }

    /**
     * @param {Object} entity
     */
    attach(entity) {
        if (!entity.model || this.byEntity.has(entity)) return;

        const record = { model: null, collide: null };
        this.byEntity.set(entity, record);

        this.loader.load(
            '/assets/models/' + entity.model,
            (gltf) => {
                if (!this.byEntity.has(entity)) return;

                record.model = gltf.scene;
                const vertices = entity.body.vertices.map((vertex) => ({ x: vertex.x, y: vertex.y }));
                const shape = new THREE.Shape(vertices);
                const geometry = new THREE.ExtrudeGeometry(shape, { steps: 2, depth: 10, bevelEnabled: false });
                geometry.center();
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
                record.collide = new THREE.Mesh(geometry, material);
                record.collide.rotateX(Math.PI / 2);
                record.collide.visible = false;
                this.game.scene.add(record.collide);
                this.game.scene.add(record.model);
            },
            undefined,
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * @param {Object} entity
     */
    detach(entity) {
        const record = this.byEntity.get(entity);
        if (!record) return;
        this.byEntity.delete(entity);

        if (record.model) {
            this.game.scene.remove(record.model);
            record.model.traverse((child) => {
                if (!child.isMesh) return;
                child.geometry.dispose();
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => this.disposeMaterial(material));
            });
        }

        if (record.collide) {
            this.game.scene.remove(record.collide);
            record.collide.geometry.dispose();
            const materials = Array.isArray(record.collide.material) ? record.collide.material : [record.collide.material];
            materials.forEach((material) => this.disposeMaterial(material));
        }
    }

    /**
     * @param {Array<Object>} pool
     */
    syncAll(pool) {
        for (const entity of pool) {
            this.sync(entity);
        }
    }

    /**
     * @param {Object} entity
     */
    sync(entity) {
        const record = this.byEntity.get(entity);
        if (!record?.model || !entity.body) return;

        const { x, y } = entity.body.position;
        record.model.position.set(x, 0, y);

        if (entity === this.game.playerEntity && entity.controller) {
            this.rotateCamera(entity.controller.calculateRotationAngle(), record.model);
        }

        record.model.setRotationFromEuler(new THREE.Euler(0, -entity.body.angle, 0));

        if (!record.collide) return;
        record.collide.visible = Boolean(this.game.debug);
        if (this.game.debug) {
            record.collide.position.set(x, 0, y);
            record.collide.rotation.z = entity.body.angle;
        }
    }

    /**
     * @param {number} radians
     * @param {THREE.Object3D} playerModel
     */
    rotateCamera(radians, playerModel) {
        this.spherical.radius = CAMERA_RADIUS;
        this.spherical.theta = -radians;
        this.spherical.phi = CAMERA_PHI;

        const newPosition = new THREE.Vector3();
        newPosition.setFromSpherical(this.spherical);
        newPosition.add(playerModel.position);
        this.game.camera.position.copy(newPosition);
        this.game.camera.lookAt(playerModel.position);
    }

    /**
     * @param {THREE.Material} material
     */
    disposeMaterial(material) {
        if (!material) return;
        for (const key in material) {
            if (material[key] && material[key].isTexture) {
                material[key].dispose();
            }
        }
        material.dispose();
    }
}

export { EntityView };
