# Celestial Dominion

Créer des jeux de cartes et de plateau dans le navigateur, puis exporter chaque jeu en site web que l’on peut héberger.

## Où on en est

Le moteur de plateau et un éditeur local sont en place. On compose un plateau, on pose des pions, des cartes et des dés, et on essaie la partie seul sur la machine. Le jeu ne sort pas encore de cet éditeur : il n’est pas enregistré, pas exporté, et personne ne peut rejoindre une session hébergée par un joueur.

L’ancien jeu spatial (vaisseaux, tirs, Matter.js) est encore dans le dépôt. Il ne fait pas partie de ce but.

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

### Encore à faire pour le but

1. Un jeu est un document de configuration. L’interface le modifie, le fichier est écrit en arrière-plan.
2. Les règles, la taille du plateau et la place des zones se règlent dans l’interface, sans éditer le code du moteur.
3. Créer, enregistrer et rouvrir plusieurs jeux.
4. Exporter un jeu en site web statique, prêt à déposer sur un hébergement.
5. Multijoueur : le joueur qui lance la partie héberge la session, les autres la rejoignent.
6. Retirer le jeu spatial (Matter.js, vaisseaux, projectiles, astéroïdes).

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
- [ ] Matter.js retiré du dépôt
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

### À retirer avec le jeu spatial

- `game-engine/src/gamemode/` et Matter.js
- `game-engine/src/entity/`
- `game-engine/src/sim/`
- `front-end/src/view/EntityView.js` et `front-end/src/playercontroller/Controller.js`

Cocher une case quand le comportement du jeu de société est là. Ne pas cocher une brique du jeu spatial.
