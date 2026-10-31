import { Scene3D } from 'game-engine/src/gamemode/Scene3D.js';
import { MAX_FRAME_MS } from 'game-engine/src/sim/tick.js';
import entityNames from 'game-engine/src/entity/EntityList';
import { Controller } from '../playercontroller/Controller';
import { EntityView } from '../view/EntityView.js';

/**
 * Partie côté client. La physique affichée vient du serveur.
 */
class MainGame extends Scene3D {
    /**
     * @param {import('../../api.js').Socket} server
     */
    constructor(server) {
        super();
        this.server = server;
        this.view = new EntityView(this);
        this.stepSimulation = false;
        this.playerId = undefined;
        this.playerEntity = undefined;

        this.server.emitter.addEventListener('handshakeResponse', event => {
            this.playerId = event.message.userId;
        });

        this.server.emitter.addEventListener('serverEntityCreate', (event) => {
            for (const datum of event.message.data) {
                const entityConstructor = entityNames[datum.type];
                if (!entityConstructor) continue;

                const entity = new entityConstructor(this, datum.prototype);
                entity.id = datum.entityId;
                entity.deserializeState(datum.state);
                this.addPool(entity);

                if (entity.id === this.playerId) {
                    this.playerEntity = entity;
                    this.playerEntity.controller = new Controller(this);
                }
            }
        });

        this.server.emitter.addEventListener('serverEntityUpdate', (event) => {
            for (const datum of event.message.data) {
                const entity = this.pool.find((candidate) => candidate.id === datum.entityId);
                if (entity) {
                    entity.deserializeState(datum.state);
                }
            }
        });

        this.server.emitter.addEventListener('serverEntityDelete', event => {
            const entity = this.getEntityById(event.message.entityId);
            if (entity) {
                this.removePool(entity);
            } else {
                console.warn("Told to delete unknown entity", event.message.entityId);
            }
        });
    }

    /**
     * @param {Object} entity
     */
    addPool(entity) {
        super.addPool(entity);
        this.view.attach(entity);
    }

    /**
     * @param {Object} entity
     */
    removePool(entity) {
        this.view.detach(entity);
        entity.destroy();
        super.removePool(entity);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        super.update(delta);

        if (this.playerEntity?.controller) {
            const controller = this.playerEntity.controller;
            this.server.sendPlayerMove(controller.getMoveVector(), controller.calculateRotationAngle());
            if (controller.control.left_click) {
                this.server.sendClientShot();
            }
        }
    }

    start() {
        super.start();
        let previous = performance.now();
        const run = (now) => {
            window.requestAnimationFrame(run);
            const delta = Math.min(MAX_FRAME_MS, now - previous);
            previous = now;
            this.update(delta);
        };
        window.requestAnimationFrame(run);
    }
}

export { MainGame };
