import { PlayerEntity } from '../../../game-engine/src/entity/PlayerEntity';
import { Controller } from "../playercontroller/Controller";

class Player extends PlayerEntity {
    constructor(game, options) {
        super(game, options);
        this.controller = new Controller();
    }

    update(delta) {
        this.setPosition(this.controller.getMoveVector());
        this.setAngle(this.controller.getRotateVector(), 50);

        const position = this.body.position;
        const angle = this.body.angle;

        const hs = this.game.server.proto.lookupType("clientPlayerMove");
        const wrap = this.game.server.proto.lookupType('MessageWrapper');

        this.game.server.sendMessage(wrap.create({ clientPlayerMove: hs.create({ position, angle }) }), wrap);
    }
}

export { Player };