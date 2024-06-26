import r from 'rethinkdb';

class Saver {
    constructor(game, db) {
        this.game = game;
        this.db = db;
    }

    async load_entities() {
        const entities = await r.table("entity").get().run(this.db.conn);
        console.log(entities);
    }

    async save_entity(entity) {
        console.log(entity.prototypeName);
        let result;
        try {
            result = await r.table("entity").get(entity.id).run(this.db.conn);
            if (result === null) {
                result = await r.table("entity").insert({id: entity.id, type: entity.prototypeName, state: entity.serializeState() }).run(this.db.conn);
            } else {
                result = await r.table("entity").filter({ id: entity.id }).update({ type: entity.prototypeName, state: entity.serializeState() }).run(this.db.conn);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { Saver };