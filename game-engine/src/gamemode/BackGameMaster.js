import { Scene } from "./Scene.js";
import Matter from "matter-js";
import * as decomp from 'poly-decomp';
import { Entity } from "../entity/Entity.js";
import { PlayerEntity } from "../entity/PlayerEntity.js";

class BackGameMaster extends Scene {
    constructor() {
        super();
        // Alias pour les modules Matter.js
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Bodies = Matter.Bodies;
        this.Body = Matter.Body;
        this.Vector = Matter.Vector;
        this.Composite = Matter.Composite;
        this.Events = Matter.Events;
        Matter.Common.setDecomp(decomp);

        this.engine = this.Engine.create();
        this.engine.gravity.scale = 0;

        this.world = this.engine.world;

        this.maxDistance = 10; // La distance maximale pour qu'une entité soit considérée comme visible

    }

    start() {
        super.start();
    }

    /**
     * Ajoute une entité au pool et son corps physique au monde physique.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        super.addPool(entity);

        if (entity.body) this.Composite.add(this.world, entity.body);
    }

    /**
     * Supprime une entité du pool et son corps physique du monde physique.
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        if (entity.body) this.Composite.remove(this.world, entity.body);

        super.removePool(entity);
    }

    /**
     * Met à jour le jeu en mettant à jour le moteur physique de Matter.js.
     * @param {number} delta - Delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        for (const entity of this.pool) {
            entity.update_back(delta);
        }

        this.Engine.update(this.engine, delta);
    }
}

export { BackGameMaster };
