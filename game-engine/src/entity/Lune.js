import { StaticEntity } from "./StaticEntity.js";

class Lune extends StaticEntity {
    constructor(game, scale) {
        super(game, 'lune', scale);
        this.scale = 5;
    }

    static getPrototypes() {
        return {
            lune: {
                model: "lune.glb",
                height: 100,
                width: 100,
            },
        };
    }
}

export { Lune };