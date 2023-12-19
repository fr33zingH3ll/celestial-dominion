import { Entity } from "./Entity";

class LivingEntity extends Entity {
    constructor(game, options) {
        super(game, options);
        this.hp = 1;
        this.max_hp = 1;
        this.speed = 10;
        this.force = 1;
    }

    getMoveVector(x, y) {
        var x = 0.5;
        var y = -0.5;

        // Calculer l'angle en radians
        var angleRadians = Math.atan2(y, x);
        console.log(angleRadians);
    }
}

export { LivingEntity };