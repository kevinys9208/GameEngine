import { SF, SS, SW, SH } from './resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';
import Scene from './scene.js';

export default class Spell {

    constructor(x, y, dir, scene) {
        this.id = ++GameManager.id;

        this.width = SW;
        this.height = SH;

        this.rangeX = 1;
        this.rangeY = 1;

        this.x = x;
        this.y = y;

        this.dir = dir;
        this.img = SrcManager.getGroup('spell').get('fireball_' + this.dir);

        this.scene = scene;

        this.scene.objectMap.set(this.id, this);
        this.scene.spellMap.set(this.id, this);

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 24, this);
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

        this.#checkBoundOverX();
    }

    #checkBoundOverX() {
        if (this.orthoX < -(this.width / 2)) {
            this.#removeFromMap();

        } else if (this.orthoX > this.scene.map.widht + (this.width / 2)) {
            this.#removeFromMap();
        }
    }

    updateY(dir, isDiagonal = 1) {
        this.y += (SS * isDiagonal * (dir == Scene.SS ? 1 : -1));
        var isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.#removeFromMap();
            return;
        }

        this.#checkBoundOverY();
    }

    #checkBoundOverY() {
        if (this.orthoY < -(this.height / 2)) {
            this.#removeFromMap();
            
        } else if (this.orthoY > this.scene.map.height + (this.height / 2)) {
            this.#removeFromMap();
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