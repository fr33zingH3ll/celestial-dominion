import { GameMode } from "../../../game-engine/src/gamemode/GameMode";
import { Asteriode } from "../Entity/Astéroide";
import { Player } from "../Entity/Player";

class MainGame extends GameMode {
    constructor() {
        super();
        // create two boxes and a ground
        new Player(this, {x: 400, y: 200, vertices: [
            {x: 0, y: 30},{x: 30, y: 30},
            {x: 30, y: 0},{x: 0, y: 0}], restitution: 0.5 });
        new Asteriode(this, {x: 450, y: 50, height: 80, width: 80});
    }
}

export { MainGame };