class Entity {
    constructor(game, options) {
        this.game = game;
        if (options.vertices) {
            this.body = this.game.Bodies.fromVertices(options.x, options.y, options.vertices, {retitutions: options.retitutions} );
        } else {
            this.body = this.game.Bodies.rectangle(options.x, options.y, options.height, options.width, { isStatic: options.isStatic });
        }
        
        this.game.addPool(this.body);
    }

    update(delta) {}
}

export { Entity };