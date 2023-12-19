import Matter from "matter-js";
import { Entity } from "../entity/Entity";
import { StaticEntity } from "../entity/StaticEntity";
import { PlayerEntity } from "../entity/PlayerEntity";

/**
 * Classe représentant un mode de jeu générique utilisant Matter.js et PIXI.js.
 */
class GameMode {
    /**
     * Crée une instance de GameMode.
     */
    constructor() {
        // module aliases
        this.Engine = Matter.Engine,
        this.Render = Matter.Render,
        this.Runner = Matter.Runner,
        this.Bodies = Matter.Bodies,
        this.Composite = Matter.Composite;
        this.Events = Matter.Events;

        this.pool_body = [];
        this.pool = [];

        // create an engine
        this.engine = this.Engine.create();

        // create a renderer
        this.render = this.Render.create({
            element: document.body,
            engine: this.engine
        });
        
        new StaticEntity(this, { x: 0, y: 600, height: 1600, width: 10, isStatic: true });
        new StaticEntity(this, { x: 0, y: 0, height: 10, width: 1200, isStatic: true });
        new StaticEntity(this, { x: 800, y: 0, height: 10, width: 1200, isStatic: true });
        new StaticEntity(this, { x: 0, y: 0, height: 1600, width: 10, isStatic: true });
    }

    /**
     * Démarre le mode de jeu en ajoutant une fonction de mise à jour à la boucle de rendu.
     */
    start() {
        // add all of the bodies to the world
        this.Composite.add(this.engine.world, this.pool_body);
        // run the renderer
        this.Render.run(this.render);

        // create runner
        this.runner = this.Runner.create();

        this.Events.on(this.runner, "tick", event => {
            this.update(this.runner.delta);
        });

        // run the engine
        this.Runner.run(this.runner, this.engine);
    }

    /**
     * Ajoute une entité au pool et son corps physique à la liste des corps.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        this.pool.push(entity);
        this.pool_body.push(entity.body);
    }

    getPool(entity) {
        return this.pool.indexOf(entity);
    }

    /**
     * Supprime une entité du pool (non implémenté dans cet exemple).
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        const index = this.pool.indexOf(entity);
        if (index !== -1) {
            this.pool.splice(index, 1);
        }
        if (index !== -1) {
            this.pool_body.splice(index, 1);
        }
    }

    update(delta) {
        this.Engine.update(this.engine, delta);
    }
}

/**
 * Représente une entité générique dans le jeu.
 * @typedef {Object} Entity
 * @property {Matter.Body} body - Corps physique associé à l'entité.
 */

export { GameMode };