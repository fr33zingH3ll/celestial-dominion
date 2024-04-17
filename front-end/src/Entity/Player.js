import { PlayerEntity } from 'game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";
import protobuf from 'protobufjs';

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.controller = new Controller();

        this.timeSinceLastSend = 0;
        this.timeBetweenSends = 2000; // 1000 ms = 1 seconde
    }

    update(delta) {
        // Mettez à jour la position et l'angle selon votre logique
        this.setPosition(this.controller.getMoveVector());
        this.setAngle(this.controller.getRotateVector());
    
        // Mettez à jour le temps écoulé depuis la dernière exécution
        this.timeSinceLastSend += delta;
    
        // Vérifiez si le temps écoulé est supérieur au temps entre les envois
        if (this.timeSinceLastSend >= this.timeBetweenSends) {

            this.sendStatus();
            // Réinitialisez le temps écoulé
            this.timeSinceLastSend = 0;
        }
        // Mettre à jour la position et l'angle du modèle en fonction des changements dans votre jeu
        // Exemple de mise à jour de l'angle
        if (this.modelObject) {
            this.modelObject.rotation.set(0, -this.body.angle, 0); // Mettez la logique de mise à jour de l'angle ici
            this.modelObject.position.set(this.body.position.x, 0, this.body.position.y);
            this.game.camera.position.set(this.body.position.x, 50, this.body.position.y+100);
        }
        
    }

    sendStatus() {

        const position = this.body.position;
        const angle = this.body.angle;

        const wrap = this.game.server.proto.lookupType('MessageWrapper');
        
        this.game.server.sendMessage({ 
            clientPlayerUpdate: {
                status: { hp: this.hp, hpMax: this.hp_max, speed: this.speed, force: this.force }, 
                playerMove: { position: { x: position.x, y: position.y }, rotation: angle }
            }
        }, wrap );
    }
}

export { Player };