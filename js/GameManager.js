import { CR, MR } from './Resource.js'

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
        this.scene = new Scene(name);
        this.controlReader = setInterval(this.readControl, 50, this);

        requestAnimationFrame(this.render);
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

        this.scene.character.updateDir(dir);
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

        GAME_MANAGER.scene.draw();

        requestAnimationFrame(GAME_MANAGER.render);
    }
}

export default GAME_MANAGER = new GameManager();