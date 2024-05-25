import Matter from "matter-js";
import { GameMaster } from "game-engine/src/gamemode/GameMaster.js";
import { PlayerEntity } from "game-engine/src/entity/PlayerEntity.js";
import { Asteroide } from "game-engine/src/entity/Asteroide.js";
import { Server } from "./api.js";
import { Projectil } from "game-engine/src/entity/Projectil.js";
import { LivingEntity } from "game-engine/src/entity/LivingEntity.js";

class BackGameMaster extends GameMaster {
    constructor() {
        super();

        this.server = new Server();

        // Écoute des événements de collision
        this.Events.on(this.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            // Boucle sur les paires de corps en collision
            pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                
                if (bodyA.label == "PlayerEntity" && bodyB.label == "Projectil" || bodyB.label == "PlayerEntity" && bodyA.label == "Projectil") {
                    console.log('Collision detected between:', bodyA.label, bodyB.label);
                    const entityA = this.pool.find(e => e.body === bodyA);
                    const entityB = this.pool.find(e => e.body === bodyB);
                    if (entityA && entityB) {
                        entityA.damage(entityB.force);
                        entityB.damage(entityA.force);
                    }
                }
            });
        });

        // Création d'une instance de Asteriode avec des paramètres spécifiques et ajout à la scène
        for (let index = 0; index < 60; index++) {
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
            this.server.players[event.message.username].id = newPlayer.id;

            this.server.callbackHandshake(event.message, newPlayer.id, newPlayer.body.position, newPlayer.body.angle);
        });

        this.server.emitter.addEventListener('ServerEntityDelete', event => {
            this.removePool(event.message.entity);
        });

        this.server.emitter.addEventListener('clientPlayerMove', event => {
            const { message: { position, rotation }, connection: { entity } } = event.message;

            this.Body.setPosition(entity.body, position);
            this.Body.setAngle(entity.body, rotation);
            entity.dirty = true;
        });

        this.server.emitter.addEventListener('clientShot', event => {
            const newProjectil = new Projectil(this, "base", event.message.connection.id);
            this.addPool(newProjectil);
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
        const entitiesToDelete = this.pool.filter((e) => e instanceof LivingEntity && e.hp <= 0);

        for (const entity of entitiesToDelete) {
            this.removePool(entity);
        }

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
        this.server.broadcastRemovedEntity(entity);
        
        super.removePool(entity);
    }
}

export { BackGameMaster };