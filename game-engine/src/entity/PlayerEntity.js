import { LivingEntity } from "./LivingEntity";

class PlayerEntity extends LivingEntity {
    constructor(game, options) {
        super(game, options);
        
        addEventListener('ClientPlayerUpdate', this.onClientPlayerUpdate);
    }

    // Méthode pour gérer l'événement ClientPlayerUpdate
    onClientPlayerUpdate(event) {
        const data = event.detail;
        console.log("Événement ClientPlayerUpdate reçu pour le joueur :", this.name);
        console.log("Données reçues :", data);
        // Traitez les données de l'événement comme nécessaire
    }

    // Méthode pour nettoyer l'écouteur d'événements lorsque l'entité est détruite
    destroy() {
        // Retirer l'écouteur d'événements pour ClientPlayerUpdate
        removeEventListener('ClientPlayerUpdate', this.onClientPlayerUpdate);
        // Appeler la méthode destroy() de la classe parent LivingEntity
        super.destroy();
    }
}

export { PlayerEntity };