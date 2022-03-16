import { TILE_SIZE, TILE_HALF, EF, ES, EW, EH } from './Resource.js';

import GameManager from "./GameManager.js";
import SrcManager from './SrcManager.js';
import Scene from "./scene.js";

export default class Skeleton {

    constructor(scene) {
        this.id = ++GameManager.id;
        this.scene = scene;

        this.shadow = SrcManager.getGroup('enemy').get('walk_shadow');

        this.width = EW;
        this.height = EH;

        this.dir = Scene.SS;
        this.#initPosition();

        this.life = 1;

        this.reactRate = this.scene.getRandomInt(21, 210);

        this.fIndex = 0;
        this.moveCount = this.reactRate;

        this.scene.objectMap.set(this.id, this);
        this.scene.enemyMap.set(this.id, this);
    }

    #initPosition() {
        let position = this.scene.getRandomInt(0, 4);

        if (position == 0) {
            this.x = this.scene.map.offsetX;
            this.y = this.scene.map.offsetY;

        } else if (position == 1) {
            this.x = this.scene.map.width + this.scene.map.offsetX;
            this.y = (this.scene.map.width) / 2 + this.scene.map.offsetY;

        } else if (position == 2) {
            this.x = this.scene.map.offsetX - this.scene.map.height;
            this.y = (this.scene.map.height) / 2 + this.scene.map.offsetY;

        } else if (position == 3) {
            this.x = this.scene.map.offsetX - this.scene.map.height + this.scene.map.width;
            this.y = (this.scene.map.height + this.scene.map.width) / 2 + this.scene.map.offsetY;
        }
    }

    updateScreenCoord(dirY, weightY, dirX, weightX) {
        this.#updateX(dirX, weightX);
        this.#updateY(dirY, weightY);
        
        this.scene.updateOrthoCoord(this);

        this.#updateDir();
    }

    #updateDir() {
        if (this.moveCount == this.reactRate) {
            var angle = this.scene.getAngle(this.x, this.y, this.scene.character.x, this.scene.character.y);
    
            if (angle > -22.5 && angle <= 22.5) {
                this.dir = Scene.NN;
            } else if (angle > 22.5 && angle <= 67.5) {
                this.dir = Scene.NE;
            } else if (angle > 67.5 && angle <= 112.5) {
                this.dir = Scene.EE;
            } else if (angle > 112.5 && angle <= 157.5) {
                this.dir = Scene.SE;
            } else if ((angle > 157.5 && angle <= 180) || (angle <= -157.5 && angle >= -180)) {
                this.dir = Scene.SS;
            } else if (angle <= -112.5 && angle > -157.5) {
                this.dir = Scene.SW;
            } else if (angle <= -67.5 && angle > -112.5) {
                this.dir = Scene.WW;
            } else if (angle <= -22.5 && angle > -67.5) {
                this.dir = Scene.NW;
            }
        }

        if (--this.moveCount % 2 == 0) {
            this.#updateMoveIndex();
        }
    }

    #updateX(dir, weight = 1) {
        this.x += (ES * weight * (dir == Scene.EE ? 1 : -1));
    }

    #updateY(dir, weight = 1) {
        this.y += (ES * weight * (dir == Scene.SS ? 1 : -1));
    }

    #updateMoveIndex() {
        if (++this.fIndex > EF) {
            this.fIndex = 0;
        }

        if (this.moveCount == 0) {
            this.moveCount = this.reactRate;
        }
    }

    isCollision(s) {
        if (this.orthoX < s.orthoX + TILE_SIZE &&
            this.orthoX + TILE_SIZE > s.orthoX &&
            this.orthoY  < s.orthoY + TILE_SIZE &&
            this.orthoY + TILE_SIZE > s.orthoY) {
        
            return true;
        }
        return false;
    }

    draw(map) {
        var img = SrcManager.getGroup('enemy').get('walk_' + this.dir);

        var ctx = GameManager.ctx;

        ctx.drawImage(
            img, 
            this.width * this.fIndex, 
            0, 
            this.width, 
            this.height, 
            this.x - map.getOriginX() - (this.width / 2),
            this.y - map.getOriginY() - (this.height / 2),
            this.width,
            this.height
        );

        ctx.drawImage(
            this.shadow,
            0,
            0,
            this.width,
            this.height,
            this.x - map.getOriginX() - (this.width / 2),
            this.y - map.getOriginY() - (this.height / 2),
            this.width,
            this.height
        );
    }

    addDamage() {
        this.life -= 1;

        if (this.life <= 0) {
            this.scene.objectMap.delete(this.id);
            this.scene.enemyMap.delete(this.id);
        }
    }
}