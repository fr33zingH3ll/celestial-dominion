import { StaticEntity } from "./StaticEntity.js";

class Lune extends StaticEntity {
    constructor(game, scale) {
        super(game, 'lune', scale);
    }

    static getPrototypes() {
        return {
            lune: {
                model: "lune.glb",
                radius: 60,
                static: true
            },
        };
    }
}

export { Lune };