import { TILE_HALF, SF, SS, SW, SH } from './resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';
import Scene from './scene.js';

export default class Spell {

    offset = 24;

    constructor(dir, x, y, scene) {
        this.id = ++GameManager.id;

        this.width = SW;
        this.height = SH;

        this.rangeX = 1;
        this.rangeY = 1;
        
        this.dir = dir;
        this.#initPosition(x, y);

        this.img = SrcManager.getGroup('spell').get('fireball_' + this.dir);

        this.scene = scene;
        this.scene.objectMap.set(this.id, this);
        this.scene.spellMap.set(this.id, this);

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 24, this);
    }

    #initPosition(x, y) {
        switch (this.dir) {
            case Scene.NN:
                this.x = x;
                this.y = y - this.offset;
                break

            case Scene.NE:
                this.x = x + this.offset;
                this.y = y - this.offset / 2;
                break;

            case Scene.EE:
                this.x = x + this.offset;
                this.y = y;
                break;

            case Scene.SE:
                this.x = x + this.offset;
                this.y = y + this.offset / 2;
                break;

            case Scene.SS:
                this.x = x;
                this.y = y + this.offset;
                break;

            case Scene.SW:
                this.x = x - this.offset;
                this.y = y + this.offset / 2;
                break;

            case Scene.WW:
                this.x = x - this.offset;
                this.y = y;
                break;

            case Scene.NW:
                this.x = x - this.offset;
                this.y = y - this.offset / 2;
                break;
        }
    }

    updateIndex(s) {
        if (++s.fIndex > SF) {
            s.fIndex = SF - 20;
        }
    }

    updateX(dir, isDiagonal = 1) {
        this.x += (SS * isDiagonal * (dir == Scene.EE ? 1 : -1));
        var isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.#removeFromMap();
            return;
        }
    }

    updateY(dir, isDiagonal = 1) {
        this.y += (SS * isDiagonal * (dir == Scene.SS ? 1 : -1));
        var isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.#removeFromMap();
            return;
        }
    }

    #removeFromMap() {
        this.scene.objectMap.delete(this.id);
        this.scene.spellMap.delete(this.id);
    }

    draw(map) {
        GameManager
            .ctx
            .drawImage(
                this.img,
                this.width * this.fIndex,
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