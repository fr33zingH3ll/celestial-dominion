# Changelog

## [Unreleased]

### Corrigé

- Le serveur applique l'intention du joueur une fois par pas, et arrête le vaisseau quand elle est nulle.
- Le client affiche l'état serveur au lieu de resimuler Matter.js.
- Une reconnexion remplace l'ancienne session au lieu de l'effacer.
- Les points de vie modifiés sont envoyés aux clients.
- Un projectile s'arrête sur un astéroïde.
- Login et inscription répondent 409 ou 500 au lieu de laisser tomber la requête.
- Le pas serveur rattrape un retard court au lieu de dériver avec `setInterval`.
- Firefox peut ouvrir le jeu : le service worker d'une autre application sur le port 5173 est retiré, et une URL de module inconnue ne renvoie plus la page HTML.
- Une erreur de pas, de socket, de jeton ou de base est journalisée. Le processus continue d'écouter et ne relance pas la partie.

### Ajouté

- Module `core` : vecteurs, interpolation, grille de cases, objet identifié, cache de références et bus d'événements annulable.
- Module `runtime` : légalité d'un coup, annulation, tours, file d'affichage, demandes de son et pointer de case.
- Module `scene` : plateau, cases, pièces, zones ordonnées et prefabs.
- Modules optionnels : cartes, dés, chargement et déchargement sans modifier le cœur.

### Modifié

- Les règles de simulation, de session et de boucle serveur sont décrites à côté du code.
- Le générateur aléatoire et le bus d'événements vivent dans `game-engine/src/core/`.
