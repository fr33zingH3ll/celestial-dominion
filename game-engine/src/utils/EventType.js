import { Event } from "./Event";

/**
 * Classe représentant un événement lié à un joueur.
 */
class PlayerEvent extends Event {
    /**
     * Crée une instance de PlayerEvent.
     * @param {string} type - Le type d'événement.
     * @param {any} message - Le message associé à l'événement.
     */
    constructor(type, message) {
        // Appelle le constructeur de la classe de base Event avec le type d'événement
        super(type);
        // Initialise la propriété message avec le message associé à l'événement
        this.message = message;
    }
}

/**
 * Classe représentant un événement de connexion.
 */
class ConnectEvent extends Event {
    /**
     * Crée une instance de ConnectEvent.
     * @param {string} type - Le type d'événement.
     * @param {any} message - Le message associé à l'événement.
     */
    constructor(type, message) {
        // Appelle le constructeur de la classe de base Event avec le type d'événement
        super(type);
        // Initialise la propriété message avec le message associé à l'événement
        this.message = message;
    }
}

export { ConnectEvent, PlayerEvent };
