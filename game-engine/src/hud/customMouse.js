import { Circle } from './Forme';
import * as THREE from 'three'; // Importation de la bibliothèque Three.js

class CustomMouse {
    constructor(game) {
        this.game = game;
        this.body = new Circle(2, 0 , 0 , 'rgba(0, 0, 0, 0.5)');
        this.body.position = new THREE.Vector2( this.center_X(), this.center_Y());
        this.targetPosition = new THREE.Vector2();
        this.previousVector = new THREE.Vector2();
        this.lerpFactor = 0.1; // Ajustez ce facteur pour modifier la vitesse d'interpolation
        
    }

    center_X(){
        return this.body.canvas.width / 2;
    }
    center_Y(){
        return this.body.canvas.height / 2;
    }

    update() { 
        let vecteur = this.game.playerEntity.controller.calculateMovementCustomMouse();

        let vector = new THREE.Vector2( vecteur.x, vecteur.y );
        
        const distance = vector.distanceTo(this.previousVector);
        
        
        
        if (Math.abs(distance) > 0.5) { 
            
            this.targetPosition.set(
                this.body.position.x + vector.x ,
                this.body.position.y + vector.y 
            )

            this.body.position.lerp(this.targetPosition,this.lerpFactor);
        }
           
        this.body.draw();
        this.previousVector.copy(vector);

    }
}

export { CustomMouse };
