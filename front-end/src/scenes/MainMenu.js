import { Scene2D } from "game-engine/src/gamemode/Scene2D.js";

class MainMenu extends Scene2D {
    constructor(server) {
        super();
        this.server = server;
    }
    
    update(delta) {
        super.update(delta); // Appel de la méthode update() de la classe parente GameMaster

        for (const entity of this.pool) {
            entity.update(delta); // Appel de la méthode update() pour chaque entité dans le pool
        }
    }
    
    start() {
        super.start(); // Appel de la méthode start() de la classe parente GameMaster
    }
}

export { MainMenu };