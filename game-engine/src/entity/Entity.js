import Matter from 'matter-js';

var ID_COUNTER = 0;

const VELOCITY_THRESHOLD = 0.05;

class Entity {
    /**
     * Indique si l'état de l'entité a été modifié durant ce tick.
     * @type {boolean}
     */
    dirty;

    /**
     * Indique si l'entité est nouvelle et doit être envoyée aux clients.
     * @type {boolean}
     */
    newborn = true;

    /**
     * @type {Matter.Body}
     */
    body;

    /**
     * @param {Object} game
     * @param {string} prototypeName
     */
    constructor(game, prototypeName) {
        this.game = game;
        this.prototypeName = prototypeName;
        this.angle = 0;
        this.tempo_position = { x: 0, y: 0 };
        this.prototype = this.constructor.getPrototypes()[prototypeName];
        console.assert(this.prototype, `prototype ${prototypeName} not found`);

        this.id = ID_COUNTER++;

        const options = {
            restitution: this.prototype.restitution ?? 0,
            static: this.prototype.static ?? false,
        };

        if (this.prototype.vertices) {
            this.body = this.game.Bodies.fromVertices(0, 0, this.prototype.vertices, options);
        } else {
            this.body = this.game.Bodies.rectangle(0, 0, this.prototype.height, this.prototype.width, options);
        }

        this.body.label = `${this.constructor.name}`;
        this.body.entity = this;
        this.model = this.prototype.model;
    }

    isMoving() {
        const dx = this.body.position.x - this.tempo_position.x;
        const dy = this.body.position.y - this.tempo_position.y;
        this.dirty = Math.hypot(dx, dy) > VELOCITY_THRESHOLD;
    }

    getPosition() {
        return this.body.position;
    }

    destroy() {}

    serializeState() {
        return {
            position: this.body.position,
            angle: this.body.angle,
            velocity: this.body.velocity,
            angularVelocity: this.body.angularVelocity,
        };
    }

    deserializeState(state) {
        this.game.Body.setPosition(this.body, state.position);
        this.game.Body.setAngle(this.body, state.angle);
        this.game.Body.setVelocity(this.body, state.velocity);
        this.game.Body.setAngularVelocity(this.body, state.angularVelocity);
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        if (!this.body) return;

        this.isMoving();
        const { x, y } = this.body.position;
        this.tempo_position = { x, y };
    }
}

export { Entity };
