# Moteur — jeu de société

Architecture cible : un jeu de société. Pas de physique, pas de Matter.js. Le rendu passe uniquement par PixiJS.

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
- [x] Un seul rendu : PixiJS. Pas de Three.js, pas de WebGPURenderer maison
- [ ] Matter.js et Three.js retirés du dépôt

## core/

- [x] Math — `game-engine/src/core/maths/` (`Vector`, `Interpolation`, `Grid`, distances Manhattan et Tchebychev)
- [x] Object — `game-engine/src/core/objects/GameObject.js`
- [x] EventBus minimal — `game-engine/src/core/events/Event.js`, `EventDispatcher.js`
- [ ] Assets — cache de références dans `game-engine/src/core/assets/AssetCache.js`. Le chargement Pixi attend que PixiJS soit une dépendance
- [x] Générateur déterministe — `game-engine/src/core/maths/Rng.js` (dés et pioches reproductibles)

## runtime/

- [ ] Rules — légalité d’un coup, application, annulation
- [ ] Turn — ordre des joueurs, phase, fin de tour
- [ ] Rendering — file d’affichage Pixi, séparée des règles
- [ ] Audio
- [ ] Input — pointer sur une case ou une pièce, pas un vaisseau

## scene/

- [ ] Plateau
- [ ] Case
- [ ] Pièce
- [ ] Zone (main, pioche, défausse, marché)
- [ ] Prefab de pièce ou de plateau

## modules/

Règles optionnelles, chargeables sans toucher au cœur.

- [ ] Cartes
- [ ] Dés
- [ ] Chargement et déchargement d’un module

## renderers/

- [ ] PixiRenderer — crée l’application Pixi, affiche plateau et pièces, ne décide aucun coup

## platform/

- [ ] Abstractions navigateur (fenêtre, temps, stockage, réseau)
- [x] Accès directs encore en place — WebSocket et `localStorage` dans `front-end/`, Vite pour le client

## main/

- [ ] Bootstrap unique
- [ ] Boucle qui affiche et envoie les coups, sans pas physique

## editor/

Obligatoire.

- [ ] Ouverture d’un plateau
- [ ] Pose et inspection d’une pièce
- [ ] Édition d’un prefab
- [ ] Partie d’essai depuis l’éditeur

## vendor/

- [ ] PixiJS déclaré comme dépendance de rendu
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
