import { Scene } from "./Scene.js";
import Matter from "matter-js";
import * as decomp from 'poly-decomp';
import { Entity } from "../entity/Entity.js";

class GameMaster extends Scene {
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
        // Configuration de la décomposition des formes complexes
        Matter.Common.setDecomp(decomp);

        // Création d'un moteur physique
        this.engine = this.Engine.create();
        // Configuration de la gravité à zéro pour un espace sans gravité
        this.engine.gravity.scale = 0;

        // Accès au monde physique de Matter.js
        this.world = this.engine.world;
        this.authoritative = false;
        this.hitQueue = [];

        this.Events.on(this.engine, 'collisionStart', (event) => {
            if (!this.authoritative) return;

            for (const pair of event.pairs) {
                this.queueHit(pair.bodyA.entity, pair.bodyB.entity);
                this.queueHit(pair.bodyB.entity, pair.bodyA.entity);
            }
        });
    }

    /**
     * Mémorise un impact de projectile. Le traitement a lieu après le pas physique.
     * @param {Entity} projectile
     * @param {Entity} other
     */
    queueHit(projectile, other) {
        if (!projectile?.isProjectile || !other || projectile === other || projectile.spent) return;
        if (other.id === projectile.owner) return;

        projectile.spent = true;
        this.hitQueue.push({ projectile, other });
    }

    flushHits() {
        const hits = this.hitQueue;
        this.hitQueue = [];

        for (const { projectile, other } of hits) {
            if (!this.pool.includes(projectile)) continue;
            if (this.pool.includes(other) && typeof other.damage === 'function' && other.id !== projectile.owner) {
                other.damage(projectile.force);
            }
            if (this.pool.includes(projectile)) {
                projectile.onDeath();
            }
        }
    }

    start() {
        // Appel de la méthode start de la classe parente Scene
        super.start();
    }

    /**
     * Ajoute une entité au pool et son corps physique au monde physique.
     * @param {Entity} entity - Entité à ajouter au pool.
     */
    addPool(entity) {
        // Appel de la méthode addPool de la classe parente Scene
        super.addPool(entity);
        // Si l'entité a un corps physique, l'ajoute au monde physique
        if (entity.body) this.Composite.add(this.world, entity.body);
    }

    /**
     * Supprime une entité du pool et son corps physique du monde physique.
     * @param {Entity} entity - Entité à supprimer du pool.
     */
    removePool(entity) {
        // Si l'entité a un corps physique, le supprime du monde physique
        if (entity.body) this.Composite.remove(this.world, entity.body);
        // Appel de la méthode removePool de la classe parente Scene
        super.removePool(entity);
    }

    /**
     * Met à jour le jeu en appelant la méthode update de la classe parente Scene
     * et en mettant à jour le moteur physique de Matter.js.
     * @param {number} delta - Delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        // Appel de la méthode update de la classe parente Scene
        super.update(delta);
        this.Engine.update(this.engine, delta);
        this.flushHits();
    }
}

export { GameMaster };
