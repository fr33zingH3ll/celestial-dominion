import { Circle } from './Forme';
class CustomMouse {
    constructor(game) {
        this.game = game;
        this.body = new Circle(2, 0 , 0 , 'rgba(0, 0, 0, 0.5)');
        this.body.position = {x : this.center_X(),y : this.center_Y()};
        this.targetPosition = { x: 0, y: 0 };
        this.lerpFactor = 0.25; // Ajustez ce facteur pour modifier la vitesse d'interpolation
    }

    normaliserVecteur(x, y) {
        let norme = Math.sqrt(x * x + y * y);
        if (norme === 0) return { x: 0, y: 0 };
        
        return {
            x: x / norme,
            y: y / norme
        };
    }

    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    center_X(){
        return this.body.canvas.width / 2;
    }
    center_Y(){
        return this.body.canvas.height / 2;
    }

    update() { 
        if (!this.previousVector) this.previousVector = {x : 0, y : 0};

        let vector = this.game.playerEntity.controller.calculateMovementCustomMouse();
       
        if (Math.abs(vector.x) >= 0.1 || Math.abs(vector.y) >= 0.1) { 
            console.log(vector);
            //vector = this.normaliserVecteur(vector.x, vector.y); 
            this.targetPosition = {
                x: this.body.position.x + vector.x * 20,
                y: this.body.position.y + vector.y * 20
            };
        } 
       
        // Interpoler entre la position actuelle et la position cible
        this.body.position.x = this.lerp(this.body.position.x, this.targetPosition.x, this.lerpFactor);
        this.body.position.y = this.lerp(this.body.position.y, this.targetPosition.y, this.lerpFactor);

        this.body.draw();
        this.previousVector = vector;
    }
}

export { CustomMouse };
