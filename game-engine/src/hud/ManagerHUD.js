import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HudMenu } from './HudMenu.js';

class ManagerHUD {
    constructor(game,id) {
        this.game = game;
        this.owner = id;
        this.pool_hud = [];
        this.addPoolHud(new HudMenu(this.game));
        this.pool_hud.filter(e => e.load() );
    }

    addPoolHud(hud){
        this.pool_hud.push(hud);
    }

    update() {
        console.log(this.game.inBack);
        if(this.game.inBack)return;

        console.log("manager");
        for(const hud of this.pool_hud){
            
            hud.update();
        }
    } 
}

export { ManagerHUD };