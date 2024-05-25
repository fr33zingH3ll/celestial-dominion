/**
 * Classe représentant un gestionnaire d'événements.
 */
class EventDispatcher {
    /**
     * Crée une instance de EventDispatcher.
     */
    constructor() {
        // Map contenant les écouteurs d'événements
        // Clé : type d'événement
        // Valeur : liste des écouteurs pour ce type d'événement
        this.listeners = new Map();
    }
  
    /**
     * Ajoute un écouteur pour un type d'événement donné.
     * @param {string} type - Le type d'événement auquel s'abonner.
     * @param {Function} listener - La fonction de rappel à exécuter lorsque l'événement est déclenché.
     */
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }

        this.listeners.get(type).push(listener);
    }
  
    /**
     * Déclenche l'événement en appelant tous les écouteurs enregistrés pour ce type d'événement.
     * @param {Event} event - L'événement à déclencher.
     */
    dispatchEvent(event) {
        const listeners = this.listeners.get(event.type);

        if (listeners) {
            for (const listener of listeners) {
                listener(event);
            }
        }
    }

    /**
     * Supprime un écouteur pour un type d'événement donné.
     * @param {string} type - Le type d'événement dont supprimer l'écouteur.
     * @param {Function} listener - Le fonction de rappel à supprimer.
     */
    removeEventListener(type, listener) {
        const listeners = this.listeners.get(type);

        if (listeners) {
            const index = listeners.indexOf(listener);

            if (index !== -1) {
                listeners.splice(index, 1);
                if (listeners.length === 0) {
                    this.listeners.delete(type);
                }
            }
        }
    }
  
    /**
     * Obtient tous les écouteurs d'événements enregistrés.
     * @returns {Map} - Une map contenant les écouteurs d'événements.
     */
    getListeners() {
        return this.listeners;
    }
}

export { EventDispatcher };
