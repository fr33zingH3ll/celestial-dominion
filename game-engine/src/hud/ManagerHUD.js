import * as THREE from 'three'; // Importation de la bibliothèque Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HudMenu } from './HudMenu.js';
import { CustomMouse } from './customMouse.js';
import { rectangle , Circle , vertex} from './Forme.js';

class ManagerHUD {
    constructor(game,id) {
        this.game = game;
        this.owner = id;
        this.pool_hud = [];
        this.canvas = document.getElementById("hud");
        
        this.addPoolHud(new CustomMouse(this.game));
        //this.pool_hud.filter(e => e.load() );

        //this.addPoolHud(new rectangle(50,50,0,0,'rgba(0, 0, 0, 0.5)'));
        //this.addPoolHud(new Circle(10, 10, 10, 'rgba(0, 0, 0, 0.5)'));
        /*
        const vertices = [
            { x: 0, y: 0 },
            { x: 35, y: 0 },
            { x: 50, y: 45 },
            { x: 0, y: 50 }
        ];
        this.addPoolHud(new vertex(vertices, 'rgba(255, 0, 0, 0.5)', 10, 10, 'hud'));
        */
    }
    addPoolHud(hud){
        this.pool_hud.push(hud);
    }

    disableVisible(){
        this.canvas.style.display = 'none'; 
    }
    
    enableVisible(){
        this.canvas.style.display = 'block';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
    }
       
        

    update() {
        
        if(this.game.inBack)return;

        for(const hud of this.pool_hud){
            
            hud.update();
        }
            
    } 

}

export { ManagerHUD };