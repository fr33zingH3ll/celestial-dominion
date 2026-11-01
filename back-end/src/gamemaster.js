import Matter from "matter-js";
import { GameMaster } from "game-engine/src/gamemode/GameMaster.js";
import { PlayerEntity } from "game-engine/src/entity/PlayerEntity.js";
import { Asteroide } from "game-engine/src/entity/Asteroide.js";
import { Server } from "./api.js";
import { Projectil } from "game-engine/src/entity/Projectil.js";
import { clampMove } from "game-engine/src/sim/move.js";
import { applyPlayerCommand } from "game-engine/src/sim/command.js";
import { createRng } from "game-engine/src/utils/Rng.js";

const ASTEROID_COUNT = 60;
const ASTEROID_SEED = 0xC0FFEE;
const ASTEROID_SPAN = 400;
const ASTEROID_CLEAR_RADIUS = 80;
const PROJECTILE_SPAWN_OFFSET = 30;

/**
 * Partie autoritaire.
 * Un message de déplacement ne fait que mémoriser `entity.command`.
 * `update` applique cette intention une fois par pas et la garde
 * si le message suivant n'arrive pas.
 * @extends GameMaster
 */
class BackGameMaster extends GameMaster {
    constructor() {
        super();
        this.authoritative = true;

        /**
         * The server instance.
         * @type {Server}
         */
        this.server = new Server();

        const rng = createRng(ASTEROID_SEED);
        for (let index = 0; index < ASTEROID_COUNT; index++) {
            const asteroid = new Asteroide(this, Asteroide.pickPrototype(rng));
            let x = 0;
            let y = 0;
            do {
                x = rng() * ASTEROID_SPAN * 2 - ASTEROID_SPAN;
                y = rng() * ASTEROID_SPAN * 2 - ASTEROID_SPAN;
            } while (Math.hypot(x, y) < ASTEROID_CLEAR_RADIUS);
            Matter.Body.setPosition(asteroid.body, { x, y });
            this.addPool(asteroid);
        }
        
        this.server.emitter.addEventListener('loginSuccess', (event) => {
            this.server.sendNewEntities(event.message.webSocket, this.pool);
            const newPlayer = new PlayerEntity(this, "base");

            newPlayer.connection = event.message;
            event.message.entity = newPlayer;
            this.addPool(newPlayer);
            this.server.players[event.message.username].id = newPlayer.id;

            this.server.callbackHandshake(event.message, newPlayer.id, newPlayer.body.position, newPlayer.body.angle);
        });

        this.server.emitter.addEventListener('playerDisconnected', (event) => {
            const entity = event.message.entity;
            if (!entity) return;
            this.removePool(entity);
            entity.destroy();
        });

        this.server.emitter.addEventListener('clientPlayerMove', event => {
            const entity = event.message.connection.entity;
            if (!entity?.body) return;

            // Dernière intention connue. Elle n'est pas appliquée ici :
            // le pas serveur s'en charge une seule fois.
            entity.command = {
                move: clampMove(event.message.message.move),
                rotation: Number(event.message.message.rotation),
            };
        });

        this.server.emitter.addEventListener('clientShot', event => {
            const player = event.message.connection.entity;
            if (!player?.tryShot()) return;

            const newProjectil = new Projectil(this, "base", player.id);
            const playerPosition = player.body.position;

            newProjectil.track = player.body.angle;
            const offset = this.Vector.rotate({ x: 0, y: -PROJECTILE_SPAWN_OFFSET }, newProjectil.track);
            newProjectil.track -= Math.PI / 2;

            this.Body.setPosition(newProjectil.body, this.Vector.add(playerPosition, offset));
            this.addPool(newProjectil);
        });
    }

    /**
     * Applique la dernière intention de chaque joueur connecté.
     * Elle n'est pas effacée : une touche maintenue continue d'agir
     * même si un message WebSocket a été perdu.
     */
    applyCommands() {
        for (const player of Object.values(this.server.players)) {
            if (!player.entity?.command) continue;
            applyPlayerCommand(this.Body, player.entity, player.entity.command);
        }
    }

    /**
     * Start the game master and server.
     * @returns {Promise<void>}
     */
    async start() {
        super.start();
        await this.server.start();
    }

    /**
     * Update the game state.
     * @param {number} delta - The time since the last update.
     */
    update(delta) {
        this.applyCommands();
        super.update(delta);

        // Gestion des entités à mettre à jour
        const entitiesToUpdate = this.pool.filter((e) => e.dirty);
        this.server.broadcastUpdates(entitiesToUpdate);
        entitiesToUpdate.forEach(e => e.dirty = false);

        // Gestion des entités à créer
        const newbornEntities = this.pool.filter((e) => e.newborn);
        if (newbornEntities.length !== 0) {
            this.server.broadcastNewEntities(newbornEntities);
            newbornEntities.forEach(e => e.newborn = false);
        }
    }

    /**
     * Remove an entity from the pool and broadcast its removal.
     * @param {Object} entity - The entity to remove.
     */
    removePool(entity) {
        this.server.broadcastRemovedEntity(entity);
        super.removePool(entity);
    }
}

export { BackGameMaster };