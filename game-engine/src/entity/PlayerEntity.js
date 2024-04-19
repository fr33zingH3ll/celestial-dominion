import { LivingEntity } from "./LivingEntity.js";

class PlayerEntity extends LivingEntity {
    constructor(game, options) {
        super(game, options);
        this.addEventListener();
    }

    addEventListener() {
        this.game.emitter.addEventListener("clientPlayerMove", (event) => {
            console.trace();
            console.log(event);
        });
    }

    sendMove() {
        const position = this.body.position;
        const angle = this.body.angle;

        this.game.server.sendMessage({
            clientPlayerMove: {
                position,
                rotation: angle,
            }
        });
    }

    update(delta) {
        // Mettez à jour la position et l'angle selon votre logique
        if (this.controller) {
            this.setPosition(this.controller.getMoveVector());
            this.setAngle(this.controller.getRotateVector());
        }

        // Mettre à jour la position et l'angle du modèle en fonction des changements dans votre jeu
        // Exemple de mise à jour de l'angle
        if (this.modelObject) {
            this.modelObject.rotation.set(0, -this.body.angle, 0); // Mettez la logique de mise à jour de l'angle ici
            this.modelObject.position.set(this.body.position.x, 0, this.body.position.y);
            this.game.camera.position.set(this.body.position.x, 50, this.body.position.y + 100);
        }
    }

}

export { PlayerEntity };