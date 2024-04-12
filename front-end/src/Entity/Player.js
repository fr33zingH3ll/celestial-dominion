import { PlayerEntity } from 'game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.controller = new Controller();
        this.timeSinceLastSend = 0;
        this.timeBetweenSends = 1000; // 1000 ms = 1 seconde
 
    }

    update(delta) {
        // Mettez à jour la position et l'angle selon votre logique
        this.setPosition(this.controller.getMoveVector());
        this.setAngle(this.controller.getRotateVector(), 50);
    
        // Mettez à jour le temps écoulé depuis la dernière exécution
        this.timeSinceLastSend += delta;
    
        // Vérifiez si le temps écoulé est supérieur au temps entre les envois
        if (this.timeSinceLastSend >= this.timeBetweenSends) {
            const position = this.body.position;
            const angle = this.body.angle;
    
            const hs = this.game.server.proto.lookupType("ClientPlayerMove");
            const wrap = this.game.server.proto.lookupType('MessageWrapper');
    
            this.game.server.sendMessage(wrap.create({ clientPlayerMove: hs.create({ position, angle }) }), wrap);
    
            // Réinitialisez le temps écoulé
            this.timeSinceLastSend = 0;
        }
    }
}

export { Player };