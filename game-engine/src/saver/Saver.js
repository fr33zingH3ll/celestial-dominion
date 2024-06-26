import r from 'rethinkdb';

class Saver {
    constructor(game, db) {
        this.game = game;
        this.db = db;
    }

    async load_entities() {
        const entities = await r.table("entity").filter(r.row("type").ne("PlayerEntity")).run(this.db.conn);
        const result = await entities.toArray();
        return result;
    }

    async save_entity(entity) {
        let result;
        try {
            result = await r.table("entity").get(entity.id).run(this.db.conn);
            if (result.type == "PlayerEntity") console.log(entity.id);
            if (result === null) {
                result = await r.table("entity").insert(
                    {
                        id: entity.id, 
                        type: entity.entity_type, 
                        prototype_name: entity.prototypeName, 
                        model: entity.model, 
                        state: entity.serializeState() 
                    }
                ).run(this.db.conn);
            } else {
                result = await r.table("entity").filter({ id: entity.id }).update(
                    { 
                        type: entity.entity_type, 
                        prototype_name: entity.prototypeName, 
                        model: entity.model, 
                        state: entity.serializeState() 
                    }
                ).run(this.db.conn);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export { Saver };