import { CR, MR, OR } from './Resource.js'

import SrcManager from './SrcManager.js'
import Scene from './scene.js';

let GAME_MANAGER;

class GameManager {

    constructor() {
        this.id = 0;

        this.canvas = document.getElementById('mainCanvas');
        this.canvas.width = document.body.clientWidth - 1;
        this.canvas.height = document.body.clientHeight - 1;

        this.ctx = this.canvas.getContext('2d');
        this.controlMap = new Map();
    }

    async init() {
        await this.#initResource();
        this.#initControl();
    }

    async #initResource() {
        await SrcManager.createGroup('character', CR);
        await SrcManager.createGroup('map', MR);
        await SrcManager.createGroup('obstacle', OR);
    }

    #initControl() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) {
                return;
            }
            this.controlMap.set(e.code, true);
        });
        document.addEventListener('keyup', (e) => {
            this.controlMap.set(e.code, false);
        });
    }

    start(name) {
        this.mainScene = new Scene(name,'map_002', 1440, 1440);

        // back wall
        this.mainScene.createObstacle(null, 0, 0, 1, 40);
        this.mainScene.createObstacle(null, 0, 0, 40, 1);

        // front wall
        this.mainScene.createObstacle('wall_h', 0, 39, 40, 1);
        this.mainScene.createObstacle('wall_v', 39, 0, 1, 40);

        for (let index = 0; index < 8; index++) {
            this.mainScene.createObstacle(
                                        'block_c', 
                                        this.#getRandomInt(4, 35), 
                                        this.#getRandomInt(4, 35), 
                                        1, 
                                        1
                                    );
        }

        this.controlReader = setInterval(this.readControl, 100, this);

        requestAnimationFrame(this.render);
    }

    #getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    

    readControl(gm) {
        gm.readDirection();
    }

    readDirection() {
        let dir = Scene.IDLE;

        if (this.controlMap.get('ArrowUp') && this.controlMap.get('ArrowRight')) {
            dir = Scene.NE;
        } else if (this.controlMap.get('ArrowUp') && this.controlMap.get('ArrowLeft')) {
            dir = Scene.NW;
        } else if (this.controlMap.get('ArrowDown') && this.controlMap.get('ArrowRight')) {
            dir = Scene.SE;
        } else if (this.controlMap.get('ArrowDown') && this.controlMap.get('ArrowLeft')) {
            dir = Scene.SW;
        } else if (this.controlMap.get('ArrowUp')) {
            dir = Scene.NN;
        } else if (this.controlMap.get('ArrowDown')) {
            dir = Scene.SS;
        } else if (this.controlMap.get('ArrowRight')) {
            dir = Scene.EE;
        } else if (this.controlMap.get('ArrowLeft')) {
            dir = Scene.WW;
        }

        this.mainScene.character.updateDir(dir);
    }

    render() {
        GAME_MANAGER
            .ctx
            .clearRect(
                0, 
                0, 
                GAME_MANAGER.canvas.width, 
                GAME_MANAGER.canvas.height
            );

        GAME_MANAGER.mainScene.draw();

        requestAnimationFrame(GAME_MANAGER.render);
    }
}

export default GAME_MANAGER = new GameManager();