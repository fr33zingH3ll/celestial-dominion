import { StaticEntity } from "game-engine/src/entity/StaticEntity.js";

class Asteroide extends StaticEntity {
    constructor(game, prototypeName) {
        super(game, prototypeName);
    }

    static getPrototypes() {
        return {
            asteroide_1: {
                model: "Asteroid_1.glb",
                height: 80,
                width: 80,
            },
            asteroide_2: {
                model: "Asteroid_2.glb",
                height: 80,
                width: 80,
            },
            asteroide_3: {
                model: "Asteroid_3.glb",
                height: 80,
                width: 80,
            },
            asteroide_4: {
                model: "Asteroid_4.glb",
                height: 80,
                width: 80,
            },
        };
    }
}

export { Asteroide };
