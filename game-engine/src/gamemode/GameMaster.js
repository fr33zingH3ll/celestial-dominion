import { GameMode } from "./GameMode.js";
import Matter from "matter-js";
import * as decomp from 'poly-decomp';

class GameMaster extends GameMode {
    constructor () {
        super();
        // module aliases
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Runner = Matter.Runner;
        this.Bodies = Matter.Bodies;
        this.Body = Matter.Body;
        this.Vector = Matter.Vector;
        this.Composite = Matter.Composite;
        this.Events = Matter.Events;
        this.decomp = decomp;

        // create an engine
        this.engine = this.Engine.create();
        this.engine.gravity.scale = 0;

        // create a renderer
        //this.render = this.Render.create({
        //    element: document.body,
        //    engine: this.engine
        //});
    }

    start() {
        super.start();
        // add all of the bodies to the world
        this.Composite.add(this.engine.world, this.pool_body);
        
        // run the renderer
        //this.Render.run(this.render);
        
        // create runner
        this.runner = this.Runner.create();
        
        this.Events.on(this.runner, "tick", event => {
            this.update(this.runner.delta);
        });
        
        // run the engine
        this.Runner.run(this.runner, this.engine);
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

export { GameMaster };