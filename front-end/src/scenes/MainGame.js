import { Scene3D } from 'game-engine/src/gamemode/Scene3D.js';
import entityNames from 'game-engine/src/entity/EntityList';
import { Controller } from '../playercontroller/Controller';
import { Socket } from '../../api';
import { PlayerEntity } from 'game-engine/src/entity/PlayerEntity';

class MainGame extends Scene3D {
    /**
     * @type {Socket}
     */
    server;

    /**
     * @type {number}
     */
    playerId;

    /**
     * @type {string}
     */
    playerName;

    /**
     * @type {PlayerEntity}
     */
    playerEntity;

    constructor(server) {
        super(); 
        this.server = server;

        this.server.emitter.addEventListener('handshakeResponse', event => {
            this.playerId = event.message.userId;
        });

        this.server.emitter.addEventListener('serverEntityCreate', (event) => {
            for (const datum of event.message.data) {
                const entityConstrutor = entityNames[datum.type];
                const entity = new entityConstrutor(this, datum.prototype);
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
                if (datum.entityId === this.playerId) {
                    datum.state.position = { ...this.playerEntity.body.position };
                    datum.state.angle = this.playerEntity.body.angle;
                } else {
                    const entity = this.pool.filter((e) => e.id === datum.entityId)[0];
                    entity.deserializeState(datum.state);
                }
            }
        });

        this.server.emitter.addEventListener('serverEntityDelete', event => {
            const entity = this.getEntityById(event.message.entityId);
            if (entity) {
                this.removePool(entity);
                entity.destroy();
            } else {
                console.warn("Told to delete unknown entity", event.message.id);
            }
            console.log("suuprimer ? : "+ this.pool.find(e => e.id == event.message.id));
        });
    }

    addPool(entity) {
        super.addPool(entity);
        entity.load();
    }

    update(delta) {
        super.update(delta); // Appel de la méthode update() de la classe parente GameMaster
        
        if (this.playerEntity) {
            this.server.sendPlayerMove(this.playerEntity.body.position, this.playerEntity.body.angle);
        }
    }
    
    start() {
        super.start(); // Appel de la méthode start() de la classe parente GameMaster

        const run = () => {
            window.requestAnimationFrame(run);
            this.update(1000 / 60);
        };

        run();
    }
}

export { MainGame }; // Exportation de la classe MainGame pour une utilisation dans d'autres fichiers
