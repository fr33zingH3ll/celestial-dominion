import { Scene3D } from 'game-engine/src/gamemode/Scene3D.js';
import entityNames from 'game-engine/src/entity/EntityList';
import { Controller } from '../playercontroller/Controller';
import { Socket } from '../../api';
import { PlayerEntity } from 'game-engine/src/entity/PlayerEntity';

/**
 * Classe représentant le jeu principal.
 * Étend la classe Scene3D du moteur de jeu.
 */
class MainGame extends Scene3D {
    /**
     * Socket pour la communication avec le serveur.
     * @type {Socket}
     */
    server;

    /**
     * ID du joueur actuel.
     * @type {number}
     */
    playerId;

    /**
     * Nom du joueur actuel.
     * @type {string}
     */
    playerName;

    /**
     * Entité du joueur actuel.
     * @type {PlayerEntity}
     */
    playerEntity;

    /**
     * Crée une instance de MainGame.
     * @param {Socket} server - Le socket pour la communication avec le serveur.
     */
    constructor(server) {
        super();
        this.server = server;

        // Écoute les événements de réponse de poignée de main
        this.server.emitter.addEventListener('handshakeResponse', event => {
            this.playerId = event.message.userId;
        });

        // Écoute les événements de création d'entité du serveur
        this.server.emitter.addEventListener('serverEntityCreate', (event) => {
            for (const datum of event.message.data) {
                const entityConstructor = entityNames[datum.type];
                const entity = new entityConstructor(this, datum.prototype);
                entity.id = datum.entityId;
                entity.deserializeState(datum.state);

                this.addPool(entity);

                if (entity.id === this.playerId) {
                    this.playerEntity = entity;
                    this.playerEntity.controller = new Controller(this);
                }
            }
        });

        // Écoute les événements de mise à jour d'entité du serveur
        this.server.emitter.addEventListener('serverEntityUpdate', (event) => {
            for (const datum of event.message.data) {
                if (datum.entityId === this.playerId && this.playerEntity) {
                    datum.state.position = { ...this.playerEntity.body.position };
                    datum.state.angle = this.playerEntity.body.angle;
                } else {
                    const entity = this.pool.find((e) => e.id === datum.entityId);
                    if (entity) {
                        entity.deserializeState(datum.state);
                    }
                }
            }
        });

        // Écoute les événements de suppression d'entité du serveur
        this.server.emitter.addEventListener('serverEntityDelete', event => {
            const entity = this.getEntityById(event.message.entityId);
            if (entity) {
                this.removePool(entity);
                entity.destroy();
            } else {
                console.warn("Told to delete unknown entity", event.message.id);
            }
        });
    }

    /**
     * Ajoute une entité à la piscine et la charge.
     * @param {Object} entity - L'entité à ajouter.
     */
    addPool(entity) {
        super.addPool(entity);
        entity.load();
    }

    /**
     * Met à jour le jeu.
     * @param {number} delta - Le delta de temps depuis la dernière mise à jour.
     */
    update(delta) {
        super.update(delta); // Appel de la méthode update() de la classe parente Scene3D

        if (this.playerEntity) {
            this.server.sendPlayerMove(this.playerEntity.body.position, this.playerEntity.body.angle, this.playerEntity.body.velocity);
        }
    }

    /**
     * Démarre le jeu.
     */
    start() {
        super.start(); // Appel de la méthode start() de la classe parente Scene3D

        // Fonction pour exécuter la boucle de jeu
        const run = () => {
            window.requestAnimationFrame(run);
            this.update(1000 / 60); // Appel de la méthode update() avec un delta de 1/60 seconde
        };

        run(); // Exécute la boucle de jeu
    }
}

export { MainGame }; // Exportation de la classe MainGame pour une utilisation dans d'autres fichiers
