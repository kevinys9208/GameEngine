import { TILE_SIZE, CR, SR, MR, ER, OR, UR } from './Resource.js'

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

        this.isStart = false;
    }

    async init() {
        await this.#initResource();
        this.#initControl();
        this.#initUiControl();
    }

    async #initResource() {
        await SrcManager.createGroup('character', CR);
        await SrcManager.createGroup('enemy', ER);
        await SrcManager.createGroup('map', MR);
        await SrcManager.createGroup('obstacle', OR);
        await SrcManager.createGroup('spell', SR);
        await SrcManager.createGroup('ui', UR);
    }

    #initControl() {
        this.#initKeyboardControl();
        this.#initMouseControl();
    }

    #initKeyboardControl() {
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

    #initMouseControl() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button == 0) {
                this.controlMap.set('onclick', true);
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button == 0) {
                this.controlMap.set('onclick', false);
            }
        });
        this.canvas.addEventListener('mousemove', (e) => {
            this.readView(e.clientX, e.clientY);
        });
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    #initUiControl() {
        var startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.start();
        });

        var enemyBtn = document.getElementById('enemyBtn');
        enemyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isStart) {
                this.mainScene.createEnemy(40);
            }
        });
    }

    start(name) {
        if (this.isStart) {
            return;
        }

        let mapX = 2880;
        let mapY = 2880;

        this.mainScene = new Scene(name,'map_002', mapX, mapY);

        let a = 8;
        let rangeX = (mapX / TILE_SIZE) / a;
        let rangeY = (mapY / TILE_SIZE) / a;

        // obstacle
        for (let index = 0; index < a**2; index++) {
            var x = (index % a) * (rangeX) + 4;
            var y = parseInt(index / a) * (rangeY) + 4;

            var coordX = this.mainScene.getRandomInt(x, x + rangeX - 8);
            var coordY = this.mainScene.getRandomInt(y, y + rangeY - 8);

            this.mainScene.createObstacle('grave', coordX, coordY, 2, 1);
        }

        this.controlReader = setInterval(this.readControl, 100, this);
        this.isStart = true;

        this.frameRequest = requestAnimationFrame(this.render);
    }    

    readControl(gm) {
        gm.readMovement();
        gm.readAttack();
    }
    
    readView(x, y) {
        if (this.isStart) {
            this.mainScene.character.updateViewDir(x, y);
        }
    }

    readMovement() {
        let dir = Scene.IDLE;

        if (this.controlMap.get('KeyW') && this.controlMap.get('KeyD')) {
            dir = Scene.NE;
        } else if (this.controlMap.get('KeyW') && this.controlMap.get('KeyA')) {
            dir = Scene.NW;
        } else if (this.controlMap.get('KeyS') && this.controlMap.get('KeyD')) {
            dir = Scene.SE;
        } else if (this.controlMap.get('KeyS') && this.controlMap.get('KeyA')) {
            dir = Scene.SW;
        } else if (this.controlMap.get('KeyW')) {
            dir = Scene.NN;
        } else if (this.controlMap.get('KeyS')) {
            dir = Scene.SS;
        } else if (this.controlMap.get('KeyD')) {
            dir = Scene.EE;
        } else if (this.controlMap.get('KeyA')) {
            dir = Scene.WW;
        }

        this.mainScene.character.updateMoveDir(dir);
    }

    readAttack() {
        if (this.controlMap.get('onclick')) {
            this.mainScene.character.attack();
        }
    }

    stop() {
        this.isStart = false;
        this.mainScene.stop();

        clearInterval(this.controlReader);
        cancelAnimationFrame(this.frameRequest);
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

        GAME_MANAGER.frameRequest = requestAnimationFrame(GAME_MANAGER.render);
    }
}

export default GAME_MANAGER = new GameManager();