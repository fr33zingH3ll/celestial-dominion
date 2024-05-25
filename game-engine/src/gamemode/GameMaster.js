import { Scene } from "./Scene.js";
import Matter from "matter-js";
import * as decomp from 'poly-decomp';
import { Entity } from "../entity/Entity.js";

class GameMaster extends Scene {
    constructor() {
        super();
        // module aliases
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Bodies = Matter.Bodies;
        this.Body = Matter.Body;
        this.Vector = Matter.Vector;
        this.Composite = Matter.Composite;
        this.Events = Matter.Events;
        Matter.Common.setDecomp(decomp);

        // create an engine
        this.engine = this.Engine.create();
        this.engine.gravity.scale = 0;

        // Accès au monde physique dans Matter.js
        this.world = this.engine.world;
    }

    start() {
        super.start();
    }

    addPool(entity) {
        super.addPool(entity);

        if (entity.body) this.Composite.add(this.world, entity.body);
    }

    removePool(entity) {
        if (entity.body) this.Composite.remove(this.world, entity.body);

        super.removePool(entity);
    }

    update(delta) {
        super.update(delta);

        this.Engine.update(this.engine, delta);
    }
}

export { GameMaster };
