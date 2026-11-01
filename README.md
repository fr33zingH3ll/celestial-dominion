# Moteur — jeu de société

Architecture cible : un jeu de société. Pas de physique, pas de Matter.js. La vue de jeu est en 3D avec Three.js. Le renderer Pixi reste dans le dépôt.

Une case cochée veut dire que le comportement existe déjà pour ce jeu de société. Le code du jeu spatial (vaisseaux, tirs, astéroïdes, Matter.js, Three.js) est hors cible : il ne coche rien ici.

L’éditeur n’est pas optionnel.

```text
engine/
├── core/                 Math, Object, EventBus, Assets, Utils
├── runtime/              Rules, Turn, Rendering, Input, Audio
├── scene/                Plateau, Case, Pièce, Zone, Prefab
├── modules/              Règles optionnelles (cartes, dés, enchères…)
├── renderers/            PixiRenderer
├── platform/             Abstractions navigateur
├── main/                 Bootstrap et boucle de jeu
├── editor/               Obligatoire
└── vendor/               PixiJS, sans Matter.js
```

## Décisions

- [x] Pas de Matter.js, pas de serveur de physique
- [x] Le rendu de jeu de l'éditeur est en 3D, avec Three.js — `front-end/editor.js`
- [ ] Matter.js et Three.js retirés du dépôt

## core/

- [x] Math — `game-engine/src/core/maths/` (`Vector`, `Interpolation`, `Grid`, distances Manhattan et Tchebychev)
- [x] Object — `game-engine/src/core/objects/GameObject.js`
- [x] EventBus minimal — `game-engine/src/core/events/Event.js`, `EventDispatcher.js`
- [ ] Assets — cache de références dans `game-engine/src/core/assets/AssetCache.js`. Le chargement Pixi attend que PixiJS soit une dépendance
- [x] Générateur déterministe — `game-engine/src/core/maths/Rng.js` (dés et pioches reproductibles)

## runtime/

- [x] Rules — `game-engine/src/runtime/Rules.js` (légalité, application, annulation)
- [x] Turn — `game-engine/src/runtime/Turn.js`
- [x] Rendering — file de commandes `game-engine/src/runtime/RenderQueue.js`, séparée des règles. Pixi les lira dans `renderers/`
- [x] Audio — demandes de son `game-engine/src/runtime/AudioCue.js`. La sortie haut-parleur reste à brancher
- [x] Input — `game-engine/src/runtime/Input.js`, une pièce avant la case

## scene/

- [x] Plateau — `game-engine/src/scene/Scene.js`
- [x] Case — `game-engine/src/scene/Cell.js`
- [x] Pièce — `game-engine/src/scene/Piece.js`
- [x] Zone (main, pioche, défausse, marché) — `game-engine/src/scene/Zone.js`
- [x] Prefab de pièce ou de plateau — `game-engine/src/scene/Prefab.js`

## modules/

Règles optionnelles, chargeables sans toucher au cœur.

- [x] Cartes — `game-engine/src/modules/Cards.js`
- [x] Dés — `game-engine/src/modules/Dice.js`
- [x] Chargement et déchargement d’un module — `game-engine/src/modules/Modules.js`

## renderers/

- [x] PixiRenderer — `game-engine/src/renderers/PixiRenderer.js`. Il affiche le plateau et joue la file. Il ne déplace pas les pièces. Dans Node sans canvas, `createPixiApplication` s'arrête sur le renderer Pixi.

## platform/

- [x] Abstractions navigateur — `game-engine/src/platform/` (fenêtre, temps, stockage, réseau)
- [x] Accès directs encore en place — WebSocket et `localStorage` dans `front-end/`, Vite pour le client

## main/

- [x] Bootstrap unique — `game-engine/src/main/Bootstrap.js`
- [x] Boucle qui affiche et envoie les coups, sans pas physique — `game-engine/src/main/Loop.js`

## editor/

Obligatoire.

- [x] Coque — vue 3D, fichiers avec flèches, code coloré — `front-end/editor.html`, `game-engine/src/editor/`
- [x] Lecture d'une scène vide — le bouton Lecture lance la boucle 3D sans pièce
- [ ] Ouverture d’un plateau
- [ ] Pose et inspection d’une pièce
- [ ] Édition d’un prefab
- [ ] Partie d’essai depuis l’éditeur

## vendor/

- [x] PixiJS déclaré comme dépendance de rendu — `game-engine` et `front-end`, PixiJS 7
- [ ] Matter.js absent des dépendances
- [ ] Three.js absent des dépendances

## Autour du moteur, déjà en place

- [x] Comptes, jetons, rapports — `back-end/src/`
- [x] MariaDB — `back-end/src/DB.js`
- [x] Lancement local — `make`
- [ ] Messages de partie adaptés au plateau — `proto/game.proto` décrit encore le jeu spatial

## Hors cible, à retirer

- `game-engine/src/gamemode/GameMaster.js` et Matter.js
- `game-engine/src/entity/` (vaisseau, projectile, astéroïde)
- `game-engine/src/gamemode/Scene3D.js` et Three.js
- `game-engine/src/sim/` (force, vitesse, pas physique)
- `front-end/src/view/EntityView.js` et `front-end/src/playercontroller/Controller.js`

## Comment mettre à jour ce fichier

Cocher une case quand le comportement du jeu de société est là. Remplacer le chemin le jour où le code entre dans `engine/`. Ne pas recocher une brique du jeu spatial.
