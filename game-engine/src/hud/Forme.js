class forme{
    constructor(game,canvas){
        this.game = game;
        this.canvas = document.getElementById("hud");
        this.context = this.canvas.getContext('2d');
        this.position = {x:0,y:0}
    }
}


class rectangle extends forme{
    constructor(width,height,posX,posY,colorbox) {
        super();
        this.colorbox = colorbox;
        this.posX = posX;
        this.posY = posY
        this.width = width;
        this.height = height
        this.draw();
    }
    draw() {
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.colorbox;//sous forme rgba(0, 0, 0, 0.5) ou 0.5 et la transparence
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

}
export { rectangle };


class Circle extends forme {
    constructor(radius,color) {
        super();
        this.radius = radius;

        this.color = color;
        this.draw();
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.context.fill();
    }


}

export { Circle };

class vertex extends forme{
    constructor(vertices, color) {
        super();

        this.vertices = vertices;
        this.color = color;

        this.draw();
    }

    draw() {
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        

        this.context.beginPath();
        this.context.moveTo(this.position.x + this.vertices[0].x, this.position.y + this.vertices[0].y);

        for (let i = 1; i < this.vertices.length; i++) {
            this.context.lineTo(this.position.x + this.vertices[i].x, this.position.y + this.vertices[i].y);
        }
        this.context.closePath();
        this.context.fill();
    }


}

export { vertex };