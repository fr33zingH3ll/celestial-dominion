import { Projectil } from "../entity/Projectil.js";
import { Saver } from "./Saver.js";

class AutoSave extends Saver {
    constructor(game, db) {
        super(game, db);
        this.auto_save_timer = 0;
        this.auto_save_laps = 15000;
        this.countdown_start = 5000; // 5 seconds in milliseconds
        this.displayed_messages = new Set();
    }

    auto_save() {
        const entites_to_save = this.game.pool.filter(entity => entity.type !== 'Projectil');
        for (const entity of entites_to_save) {
            this.save_entity(entity);
        }
        console.log("Auto save effectué.");
    }

    update(delta) {
        // Check if we should display the countdown
        const time_remaining = this.auto_save_laps - this.auto_save_timer;
        if (time_remaining <= this.countdown_start && time_remaining > 0) {
            const seconds_remaining = Math.ceil(time_remaining / 1000);
            if (!this.displayed_messages.has(seconds_remaining)) {
                console.log(`Auto-save in ${seconds_remaining} seconds`);
                this.displayed_messages.add(seconds_remaining);
            }
        }

        // Check if it's time to auto-save
        if (this.auto_save_timer >= this.auto_save_laps) {
            this.auto_save_timer = 0;
            this.auto_save();
            this.displayed_messages.clear(); // Reset the displayed messages
        } else {
            this.auto_save_timer += delta;
        }
    }
}

export { AutoSave };
