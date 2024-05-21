import Matter from "matter-js";
import { GameMaster } from "game-engine/src/gamemode/GameMaster.js";
import { PlayerEntity } from "game-engine/src/entity/PlayerEntity.js";
import { Asteroide } from "game-engine/src/entity/Asteroide.js";
import { Server } from "./api.js";

class BackGameMaster extends GameMaster {
    constructor() {
        super();

        this.server = new Server();

        // Écouteur d'événement pour la détection de collision
        this.Events.on(this.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
            }
        });

        // Création d'une instance de Asteriode avec des paramètres spécifiques et ajout à la scène
        for (let index = 0; index < 10; index++) {
            const asteroid = new Asteroide(this);
            const x = this.getRandomPosition(-100, 0);
            const y = this.getRandomPosition(-100, 0);
            Matter.Body.setPosition(asteroid.body, { x, y });
            this.addPool(asteroid);    
        }
        

        this.server.emitter.addEventListener('loginSuccess', (event) => {
            this.server.sendNewEntities(event.message.webSocket, this.pool);
            const newPlayer = new PlayerEntity(this, "base");

            newPlayer.connection = event.message;
            event.message.entity = newPlayer;
            this.addPool(newPlayer);

            this.server.callbackHandshake(event.message, newPlayer.id, newPlayer.body.position, newPlayer.body.angle);
        });

        this.server.emitter.addEventListener('playerDisconnected', event => {
            this.removePool(event.message.entity);
        });

        this.server.emitter.addEventListener('clientPlayerMove', event => {
            const { message: { position, rotation }, connection: { entity } } = event.message;

            this.Body.setPosition(entity.body, position);
            this.Body.setAngle(entity.body, rotation);
            entity.dirty = true;
        });
    }
    
    // Fonction pour générer un nombre aléatoire entre deux valeurs
    getRandomPosition(min, max) {
        return Math.random() * (max - min) + min;
    }

    async start() {
        super.start();
        await this.server.start();
    }

    update(delta) {
        super.update(delta);
        const entitiesToUpdate = this.pool.filter((e) => e.dirty);

        if (entitiesToUpdate.length !== 0) {
            this.server.broadcastUpdates(entitiesToUpdate);

            entitiesToUpdate.forEach(e => e.dirty = false);
        }

        const newbornEntities = this.pool.filter((e) => e.newborn);

        if (newbornEntities.length !== 0) {
            this.server.broadcastNewEntities(newbornEntities);

            newbornEntities.forEach(e => e.newborn = false);
        }
    }

    removePool(entity) {
        super.removePool(entity);

        this.server.broadcastRemovedEntity(entity);
    }
}

export { BackGameMaster };