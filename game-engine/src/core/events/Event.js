/**
 * Classe représentant un événement générique.
 */
class Event {
    /**
     * Crée une instance de Event.
     * @param {string} type - Le type de l'événement.
     * @param {any} message - Le message associé à l'événement.
     */
    constructor(type, message) {
        this.type = type; // Le type de l'événement
        this.message = message; // Le message associé à l'événement
        this.cancelable = true; // Indique si l'événement peut être annulé
        this.cancelled = false; // Indique si l'événement a été annulé
    }

    /**
     * Vérifie si l'événement est annulable.
     * @returns {boolean} - True si l'événement est annulable, sinon false.
     */
    isCancelable() {
        return this.cancelable;
    }

    /**
     * Définit si l'événement peut être annulé.
     * @param {boolean} cancelable - True si l'événement peut être annulé, sinon false.
     */
    setCancelable(cancelable) {
        this.cancelable = cancelable;
    }

    /**
     * Vérifie si l'événement a été annulé.
     * @returns {boolean} - True si l'événement a été annulé, sinon false.
     */
    isCancelled() {
        return this.cancelled;
    }

    /**
     * Définit si l'événement est annulé.
     * @param {boolean} cancelled - True si l'événement est annulé, sinon false.
     * @throws {Error} - Lève une erreur si l'événement n'est pas annulable.
     */
    setCancelled(cancelled) {
        if (!this.isCancelable()) {
            throw new Error("This event is not cancelable");
        }
        this.cancelled = cancelled;
    }

    /**
     * Obtient le type de l'événement.
     * @returns {string} - Le type de l'événement.
     */
    getType() {
        return this.type;
    }

    /**
     * Convertit l'objet Event en une chaîne de caractères.
     * @returns {string} - La représentation en chaîne de caractères de l'objet Event.
     */
    toString() {
        return `Event [type=${this.type}, cancelable=${this.cancelable}, cancelled=${this.cancelled}]`;
    }
}

export { Event };
