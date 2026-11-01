# Celestial Dominion

Créer des jeux de cartes et de plateau dans le navigateur, puis exporter chaque jeu en site web que l’on peut héberger.

## Où on en est

Le moteur de plateau et un éditeur local sont en place. On compose un plateau, on pose des pions, des cartes et des dés, et on essaie la partie seul sur la machine. Le site, l’enregistrement des jeux et les parties à plusieurs ne sont pas encore là.

Le jeu spatial (vaisseaux, Matter.js, physique) est retiré du moteur. Les paquets s’appellent `celestial-dominion`. Le dépôt GitHub actuel reste `fr33zingH3ll/celestial-dominion` tant qu’un nouveau dépôt n’est pas créé.

### Déjà utilisable

- Plateau, cases, pièces et zones (main, pioche, défausse, marché, plus une zone nommée à la main) — `game-engine/src/scene/`
- Cartes (mélange, pioche) et dés — `game-engine/src/modules/`
- Règles en code : un coup est accepté, appliqué, ou annulé. Les tours existent — `game-engine/src/runtime/`
- Éditeur 3D — `http://127.0.0.1:5173/editor.html` après `make front`
  - arbre de scène, inspecteur, prefabs, annulation
  - vue Three.js : glisser pour tourner, molette pour zoomer, clic pour choisir
  - partie d’essai : Mélanger, Piocher, Lancer. Stop rend le plateau d’avant la lecture
- Boucle qui affiche le plateau et envoie un coup, sans physique — `game-engine/src/main/`
- Comptes, jetons et MariaDB — `back-end/src/`. Ils servent encore l’ancien jeu, pas les plateaux

### Tâches

Le produit est un site. Chaque personne y crée des jeux, les range dans son compte, les importe, les exporte, et les lance en partie.

**Site**

1. Page d’accueil : nouveau jeu, mes jeux, importer, exporter.
2. Un jeu est un fichier JSON : nom, plateau, zones et leur place, pièces, règles, nombre de joueurs.
3. L’éditeur ouvre ce JSON et le réécrit. Le code du moteur ne se modifie pas pour décrire un jeu.
4. Importer ce JSON depuis le disque. Exporter le même JSON.
5. Export web : un dossier `index.html` + moteur + JSON, que l’on copie sur un hébergement.
6. Cloud : avec le compte, enregistrer le JSON, lister les jeux, les rouvrir, les supprimer. La base et les comptes existent déjà, la table des jeux non.

**Éditeur**

7. Règles à l’écran : déplacer une pièce (distance, cases ou zone), piocher, mélanger, lancer un dé, activer ou désactiver la règle.
8. Déplacer une zone dans la vue 3D, et retrouver cette place dans le JSON.
9. Choisir le jeu ouvert dans la liste du compte, sans changer de page de code.

**Multijoueur**

10. Même règles pour les deux modes. L’autorité applique le coup et renvoie l’état. Les autres n’envoient qu’un coup.
11. Serveur dédié : le site ouvre une session, donne un code, les joueurs rejoignent ce code.
12. Auto-hébergement : le navigateur de l’hôte est l’autorité. Il affiche une adresse. Les autres s’y connectent.
13. Salon : liste des joueurs, l’hôte démarre, l’arrêt ferme la session.

**Dépôt**

14. Retirer les messages de l’ancien jeu dans `proto/game.proto` et `back-end/src/api.js` quand le protocole de session existe.
15. Pousser ce dépôt nettoyé vers un nouveau dépôt GitHub. Le lien SSH manque encore.

## Essayer

```bash
make front
```

Puis ouvrir `http://127.0.0.1:5173/editor.html`. `make` lance aussi le serveur de l’ancien jeu sur le port 3000. `npm test` lance les tests.

## Suivi du moteur

Une case cochée veut dire que le comportement existe pour un jeu de société. Le code du jeu spatial ne coche rien ici.

```text
engine/
├── core/                 Math, Object, EventBus, Assets, Utils
├── runtime/              Rules, Turn, Rendering, Input, Audio
├── scene/                Plateau, Case, Pièce, Zone, Prefab
├── modules/              Cartes, dés
├── renderers/            PixiRenderer (2D, encore dans le dépôt)
├── platform/             Fenêtre, temps, stockage, réseau
├── main/                 Bootstrap et boucle
├── editor/               Éditeur 3D
└── vendor/               PixiJS et Three.js
```

### Décisions

- [x] Pas de Matter.js dans le nouveau moteur, pas de serveur de physique
- [x] La vue de l’éditeur est en 3D, avec Three.js — `front-end/editor.js`
- [x] Matter.js retiré des dépendances du moteur, du site et du serveur
- [ ] Export web d’un jeu
- [ ] Session hébergée par un joueur

### core/

- [x] Math — `game-engine/src/core/maths/` (`Vector`, `Interpolation`, `Grid`, Manhattan, Tchebychev)
- [x] Object — `game-engine/src/core/objects/GameObject.js`
- [x] EventBus — `game-engine/src/core/events/`
- [x] Générateur déterministe — `game-engine/src/core/maths/Rng.js`
- [ ] Assets — le cache de références existe (`AssetCache.js`). Le chargement d’images n’est pas branché

### runtime/

- [x] Rules — `game-engine/src/runtime/Rules.js`
- [x] Turn — `game-engine/src/runtime/Turn.js`
- [x] File d’affichage — `game-engine/src/runtime/RenderQueue.js`
- [x] Demandes de son — `game-engine/src/runtime/AudioCue.js`. Le haut-parleur n’est pas branché
- [x] Pointer — `game-engine/src/runtime/Input.js`
- [ ] Règles décrites dans l’éditeur et relues depuis la configuration du jeu

### scene/

- [x] Plateau, case, pièce, zone, prefab — `game-engine/src/scene/`

### modules/

- [x] Cartes — `game-engine/src/modules/Cards.js`
- [x] Dés — `game-engine/src/modules/Dice.js`
- [x] Chargement et déchargement — `game-engine/src/modules/Modules.js`

### renderers/

- [x] PixiRenderer 2D — `game-engine/src/renderers/PixiRenderer.js`
- [x] Vue 3D de l’éditeur — `front-end/editor.js`

### platform/ et main/

- [x] Fenêtre, temps, stockage, réseau — `game-engine/src/platform/`
- [x] Bootstrap et boucle sans physique — `game-engine/src/main/`

### editor/

- [x] Vue 3D, fichiers, code coloré — `front-end/editor.html`
- [x] Arbre, inspecteur, zones, pions, cartes, dés, prefabs, annulation — `game-engine/src/editor/Board.js`
- [x] Partie d’essai locale (mélanger, piocher, lancer)
- [ ] Déplacer une zone dans la vue
- [ ] Écrire la configuration du jeu sur disque
- [ ] Plusieurs jeux, ouverture et enregistrement
- [ ] Export web

### Autour

- [x] Comptes, jetons, rapports — `back-end/src/`
- [x] MariaDB — `back-end/src/DB.js`
- [x] Lancement local — `make`
- [ ] Messages de partie adaptés au plateau — `proto/game.proto` décrit encore le jeu spatial

### Ancien jeu, encore dans le serveur

- `proto/game.proto` décrit encore les vaisseaux et les tirs
- `back-end/src/api.js` parle encore ce protocole sur le WebSocket
- Les comptes et MariaDB restent : ils serviront au stockage des jeux

Cocher une case quand le comportement du jeu de société est là. Ne pas cocher une brique du jeu spatial.
