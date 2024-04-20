import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { Scene3D } from 'game-engine/src/gamemode/Scene3D.js';

class MainGame extends Scene3D { // Définition de la classe MainGame qui étend GameMaster
    constructor(server) { // Constructeur de la classe MainGame avec le paramètre 'server'
        super(); // Appel du constructeur de la classe parente GameMaster
        this.server = server; // Assignation du paramètre 'server' à la propriété 'server' de MainGame 
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
