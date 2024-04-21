import { Scene } from "./Scene.js";
import Matter from "matter-js";
import * as decomp from 'poly-decomp';
import { Entity } from "../entity/Entity.js";

class GameMaster extends Scene {
    constructor () {
        super();
        this.pool_body = [];
        // module aliases
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Runner = Matter.Runner;
        this.Bodies = Matter.Bodies;
        this.Body = Matter.Body;
        this.Vector = Matter.Vector;
        this.Composite = Matter.Composite;
        this.Events = Matter.Events;
        Matter.Common.setDecomp(decomp);

        // create an engine
        this.engine = this.Engine.create();
        this.engine.gravity.scale = 0;
    }

    start() {
        super.start();
        // add all of the bodies to the world
        this.Composite.add(this.engine.world, this.pool_body);
        
        // create runner
        this.runner = this.Runner.create();
        
        this.Events.on(this.runner, "tick", event => {
            this.update(this.runner.delta);
        });
        
        // run the engine
        this.Runner.run(this.runner, this.engine);
    }

    destroy() {
        super.destroy();

        for (const body of this.pool_body) {
            this.removePool(body, this.pool_body);
        }
    }

    update(delta) {
        super.update(delta);

        this.Engine.update(this.engine, delta);
    }
}

export { GameMaster };
