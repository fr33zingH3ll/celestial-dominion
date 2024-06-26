import { StaticEntity } from "./StaticEntity.js";

class Lune extends StaticEntity {
    constructor(game, scale) {
        super(game, 'lune', scale);
    }

    static getPrototypes() {
        return {
            lune: {
                mass: 20,
                model: "lune.glb",
                radius: 60,
                static: true,
                entity_type: "lune"
            },
        };
    }
}

export { Lune };