import { WF, CW, CH } from './resource.js';

import GameManager from './GameManager.js'
import SrcManager from './SrcManager.js';
import Scene from './scene.js';

export default class Character {

    constructor(name, width = 300, height = 300) {
        this.id = ++GameManager.id;
        this.name = name;

        this.width = width;
        this.height = height;

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
                CW * index,
                0,
                CW,
                CH,
                this.x - map.getOriginX() - (this.width / 2),
                this.y - map.getOriginY() - (this.height / 2),
                this.width,
                this.height
            );
    }
}