import Matter from "matter-js";
import { Graphics, Sprite, Texture } from "pixi.js";

/**
 * Classe représentant une entité générique dans le jeu, liant PIXI.js et Matter.js.
 */
class Entity {
    /**
     * Crée une instance de Entity.
     * @param {object} game - Instance du jeu (GameMode) auquel l'entité appartient.
     * @param {string} texturePath - Chemin vers la texture de l'entité.
     * @param {number} x - Position x initiale de l'entité.
     * @param {number} y - Position y initiale de l'entité.
     * @param {number} [scale=1] - Échelle de l'entité (par défaut: 1).
     * @param {number} [restitution=0.5] - Coefficient de restitution physique (par défaut: 0.5).
     */
    constructor(game, texturePath, x, y, scale = 1, restitution = 0.5) {
        // Instance du jeu auquel l'entité appartient
        this.game = game;

        // Texture de l'entité
        this.texture = Texture.from(texturePath);

        // Sprite PIXI.js associé à l'entité
        this.sprite = new Sprite(this.texture);
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(x, y);
        this.sprite.scale.set(scale);

        // Vertices décrivant la forme de l'entité (en coordonnées locales par rapport au sprite)
        this.vertices = [
            {x: 0, y: -800 * scale},
            {x: -800 * scale, y: 300 * scale},
            {x: -800 * scale, y: 800 * scale},
            {x: 800 * scale, y: 800 * scale},
            {x: 800 * scale, y: 300 * scale}
        ];

        // Corps Matter.js créé à partir des vertices
        this.body = Matter.Bodies.fromVertices(x, y, this.vertices, { restitution });

        // Synchronisation de la position et de la rotation entre PIXI.js et Matter.js
        this.syncPixiToMatter();

        // Ajout du sprite au rendu PIXI.js
        this.game.app.stage.addChild(this.sprite);
    }

    /**
     * Synchronise la position et la rotation du sprite avec celles du corps Matter.js.
     */
    syncPixiToMatter() {
        this.sprite.position.set(this.body.position.x, this.body.position.y);
        this.sprite.rotation = this.body.angle;
    }

    /**
     * Met à jour l'entité à chaque image en synchronisant la position et la rotation.
     */
    update() {
        this.syncPixiToMatter();
    }
}

export { Entity };