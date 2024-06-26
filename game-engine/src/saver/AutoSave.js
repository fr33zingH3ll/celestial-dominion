import { Saver } from "./Saver.js";

class AutoSave extends Saver {
    constructor(game, db) {
        super(game, db);
        this.auto_save_timer = 0;
        this.auto_save_laps = 15000;
    }

    auto_save() {
        for (const entity of this.game.pool) {
            this.save_entity(entity);
        }
    }

    update(delta) {
        if (this.auto_save_timer >= this.auto_save_laps) {
            this.auto_save_timer = 0;
            this.auto_save();
        }
        this.auto_save_timer += delta;
    }
}

export { AutoSave };