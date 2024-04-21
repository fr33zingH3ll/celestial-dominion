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

        this.addPool(new PlayerEntity(this, {
            x: 0,
            y: 0,
            vertices: [{ x: 0, y: 0 }, { x: -50, y: 200 }, { x: 0, y: 150 }, { x: 50, y: 200 }],
            restitution: 0.5,
            stat: {
                hp: 1,
                hpMax: 2,
                speed: 4,
                force: 10
            },
            model: "vaisseau_heal.glb"
        }));

        // Création d'une instance de Asteriode avec des paramètres spécifiques et ajout à la scène
        this.addPool(new Asteroide(this, {
            x: 0,
            y: 0,
            height: 80,
            width: 80,
            model: "Asteroid_1.glb"
        }));

        this.server.emitter.addEventListener('loginSuccess', (event) => {
            this.server.sendInitialPool(event.message.webSocket, this.pool);
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

            entitiesToUpdate.forEach((e) => {
                e.dirty = false;
            });
        }
    }
}

export { BackGameMaster };