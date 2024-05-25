import { StaticEntity } from "game-engine/src/entity/StaticEntity.js";

class Asteroide extends StaticEntity {
    constructor(game) {
        const prototypeName = Asteroide.getRandomPrototypeName();
        super(game, prototypeName);
    }

    static getRandomPrototypeName() {
        const prototypes = Object.keys(Asteroide.getPrototypes());
        const randomIndex = Math.floor(Math.random() * prototypes.length);
        return prototypes[randomIndex];
    }

    static getPrototypes() {
        return {
            asteroide_1: {
                model: "Asteroid_1.glb",
                height: 5,
                width: 5,
            },
            asteroide_2: {
                model: "Asteroid_2.glb",
                height: 5,
                width: 5,
            },
            asteroide_3: {
                model: "Asteroid_3.glb",
                height: 5,
                width: 5,
            },
            asteroide_4: {
                model: "Asteroid_4.glb",
                height: 5,
                width: 5,
            },
        };
    }
}

export { Asteroide };
