import Matter from "matter-js";
import { GameMaster } from "game-engine/src/gamemode/GameMaster.js";
import { PlayerEntity } from "game-engine/src/entity/PlayerEntity.js";
import { Asteroide } from "game-engine/src/entity/Asteroide.js";
import { Server } from "./api.js";

class BackGameMaster extends GameMaster {
    constructor() {
        super();

        this.server = new Server();

        // Utilisation de Matter.js pour la simulation physique
        this.matter = Matter;

        // Création d'un moteur Matter.js
        this.engine = Matter.Engine.create();

        // Accès au monde physique dans Matter.js
        this.world = this.engine.world;

        // Désactive la gravité pour ce mode de jeu
        this.engine.gravity.scale = 0;

        // Écouteur d'événement pour la détection de collision
        this.matter.Events.on(this.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
            }
        });

        // Création d'une instance de Asteriode avec des paramètres spécifiques et ajout à la scène
        const asteroid = new Asteroide(this, "asteroide_1");
        this.addPool(asteroid);

        this.server.emitter.addEventListener('loginSuccess', (event) => {
            this.server.sendNewEntities(event.message.webSocket, this.pool);

            const newPlayer = new PlayerEntity(this, "base");

            newPlayer.body.position = { x: Math.random() * 100, y: Math.random() * 100 };

            newPlayer.connection = event.message;
            this.addPool(newPlayer);
        });
    }

    async start() {
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
}

export { BackGameMaster };