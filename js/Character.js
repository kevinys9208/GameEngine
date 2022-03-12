import { WF, CS, CW, CH } from './resource.js';

import GameManager from './GameManager.js'
import SrcManager from './SrcManager.js';
import Scene from './scene.js';
import Spell from './Spell.js';

export default class Character {

    constructor(name, scene) {
        this.id = ++GameManager.id;
        this.name = name;
        this.scene = scene;

        this.width = CW;
        this.height = CH;

        this.rangeX = 1;
        this.rangeY = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        this.dir = Scene.SS;
        this.isIdle = true;

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 24, this);
    }

    updateIndex(ch) {
        if (!ch.isIdle) {
            if (++ch.fIndex > WF) {
                ch.fIndex = 1;
            }
        }
    }

    updateDir(dir) {
        if (dir == Scene.IDLE) {
            this.isIdle = true;
            this.frameIndex = 1;
            return;
        }

        this.dir = dir;
        this.isIdle = false;
    }

    updateX(dir, isDiagonal = 1) {
        this.x += (CS * isDiagonal * (dir == Scene.EE ? 1 : -1));
        this.scene.updateOrthoCoord(this);
    }

    updateY(dir, isDiagonal = 1) {
        this.y += (CS * isDiagonal * (dir == Scene.SS ? 1 : -1));
        this.scene.updateOrthoCoord(this);
    }

    attack() {
        new Spell(this.x, this.y, this.dir, this.scene);
    }

    draw(map) {
        var img = SrcManager.getGroup('character').get('walk_' + this.dir);
        var index = this.fIndex;

        if (this.isIdle) {
            index = 0;
        }

        GameManager
            .ctx
            .drawImage(
                img,
                this.width * index,
                0,
                this.width,
                this.height,
                this.x - map.getOriginX() - (this.width / 2),
                this.y - map.getOriginY() - (this.height / 2),
                this.width,
                this.height
            );
    }
}