import fs from 'fs/promises';
import path from 'path';

class Saver {
    constructor(game) {
        this.game = game;

        const __dirname = path.dirname("./");
        this.filePath = path.join(__dirname, 'saves', 'entities.json');

        (async () => {
            if (!await fs.access(path.join(__dirname, 'saves')).then(() => true).catch(() => false)) {
                await fs.mkdir(path.join(__dirname, 'saves'));
            }
            if (!await fs.access(this.filePath).then(() => true).catch(() => false)) {
                await fs.writeFile(this.filePath, JSON.stringify([]));
            }
        })();
    }

    async load_player(entity_id) {
        let entities = JSON.parse(await fs.readFile(this.filePath, 'utf-8'));
        let entity = entities.find(e => e.id === entity_id && e.type === 'PlayerEntity');

        if (!entity) {
            entity = {
                id: entity_id,
                type: 'PlayerEntity',
                prototype_name: 'base',
                model: 'vaisseau_heal.glb',
                state: {
                    angle: 0,
                    angularVelocity: 0,
                    livingEntity: {
                        force: 10,
                        hp: 85,
                        hpMax: 100,
                        speed: 0.5
                    },
                    position: {
                        x: 0,
                        y: 0
                    },
                    velocity: {
                        x: 0,
                        y: 0
                    }
                }
            };

            entities.push(entity);
            await fs.writeFile(this.filePath, JSON.stringify(entities, null, 2));
            console.log(`Created new entity with id: ${entity_id}`);
        } else {
            console.log(entity.id);
        }

        return entity;
    }

    async load_entities() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const entities = JSON.parse(data);
        const nonPlayerEntities = entities.filter(e => e.type !== 'PlayerEntity');
        return nonPlayerEntities;
    }

    async save_entity(entity) {
        try {
            let entities = JSON.parse(await fs.readFile(this.filePath, 'utf-8'));
            const index = entities.findIndex(e => e.id === entity.id);

            if (index === -1) {
                entities.push({
                    id: entity.id,
                    type: entity.entity_type,
                    prototype_name: entity.prototypeName,
                    model: entity.model,
                    state: entity.serializeState()
                });
            } else {
                entities[index] = {
                    id: entity.id,
                    type: entity.entity_type,
                    prototype_name: entity.prototypeName,
                    model: entity.model,
                    state: entity.serializeState()
                };
            }

            await fs.writeFile(this.filePath, JSON.stringify(entities, null, 2));
        } catch (error) {
            console.log(error);
        }
    }
}

export { Saver };
