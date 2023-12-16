import Matter from "matter-js";

class GameMaster {
    constructor(server) {

        this.server = server;
        // Utilisation de Matter.js pour la simulation physique
        this.matter = Matter;

        // Création d'un moteur Matter.js
        this.engine = Matter.Engine.create();
        
        // Accès au monde physique dans Matter.js
        this.world = this.engine.world;

        // Désactive la gravité pour ce mode de jeu
        this.engine.gravity.scale = 0;

        // Écouteur d'événement pour la détection de collision
		this.matter.Events.on(this.engine, 'collisionStart', (event) => {
			const pairs = event.pairs;
		
			for (let i = 0; i < pairs.length; i++) {
				const pair = pairs[i];
			}
		});
    }
}

export { GameMaster };