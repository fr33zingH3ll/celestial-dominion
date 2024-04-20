import { Scene3D } from 'game-engine/src/gamemode/Scene3D.js';
import { entityNames } from 'game-engine/src/entity/EntityList';

class MainGame extends Scene3D { // Définition de la classe MainGame qui étend GameMaster
    constructor(server) { // Constructeur de la classe MainGame avec le paramètre 'server'
        super(); // Appel du constructeur de la classe parente GameMaster
        this.server = server; // Assignation du paramètre 'server' à la propriété 'server' de MainGame

        this.server.emitter.addEventListener('serverEntityCreate', (event) => {
            for (const datum of event.message.data) {
                const entity = new entityNames[datum.type](this, {id: datum.entityId});
                entity.deserializeState(datum.state);
                this.addPool(entity);
            }
        });
    }

    addPool(entity) {
        super.addPool(entity);
        entity.load();
    }

    update(delta) {
        super.update(delta); // Appel de la méthode update() de la classe parente GameMaster

        for (const entity of this.pool) {
            entity.update(delta); // Appel de la méthode update() pour chaque entité dans le pool
        }
    }
    
    start() {
        super.start(); // Appel de la méthode start() de la classe parente GameMaster
    }
}

export { MainGame }; // Exportation de la classe MainGame pour une utilisation dans d'autres fichiers
