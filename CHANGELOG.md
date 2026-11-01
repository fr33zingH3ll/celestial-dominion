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
