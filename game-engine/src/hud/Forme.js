class forme{
    constructor(game){
        this.game = game;
        this.canvas = document.getElementById("hud");
        this.context = this.canvas.getContext('2d');
        this.position = {x:0,y:0};
    }

    load() {
        this.draw();
    }

    update() {}
}


class Rectangle extends forme{
    constructor(width,height,posX,posY,colorbox) {
        super();
        this.colorbox = colorbox;
        this.posX = posX;
        this.posY = posY
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.colorbox;//sous forme rgba(0, 0, 0, 0.5) ou 0.5 est la transparence
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

}

class Circle extends forme {
    constructor(radius,color) {
        super();
        this.radius = radius;

        this.color = color;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;

        this.context.beginPath();

        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

        this.context.fill();
    }


}

class Vertex extends forme{
    constructor(vertices, color) {
        super();

        this.vertices = vertices;
        this.color = color;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;

        this.context.beginPath();
        this.context.moveTo(this.position.x + this.vertices[0].x, this.position.y + this.vertices[0].y);

        for (const position of this.vertices) {
            this.context.lineTo(this.position.x + position.x, this.position.y + position.y);
        }
        
        this.context.closePath();
        this.context.fill();
    }


}

export { Rectangle, Circle, Vertex };