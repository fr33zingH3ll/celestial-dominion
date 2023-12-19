import { GameMode } from "../../../game-engine/src/gamemode/GameMode";
import { Asteriode } from "../Entity/Asteroide";
import { Player } from "../Entity/Player";
import { Application } from "pixi.js";

class MainGame extends GameMode {
    constructor() {
        super();
        // create two boxes and a ground
        new Player(this, {x: 400, y: 200, 
            vertices: 
            [{x: 0, y: 0},{x: -50, y: 200},{x: 0, y: 150},{x: 50, y: 200}], 
            restitution: 0.5, 
            stat: {
                hp: 1,
                max_hp: 1,
                speed: 10,
                force: 10
            }});
        new Asteriode(this, {x: 450, y: 50, height: 80, width: 80});
    }


    update() {
        for (const entity of this.pool) {
            entity.update();
        }
    }
    
}



export { MainGame };