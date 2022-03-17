import { TILE_SIZE, EF, ES, EW, EH } from './Resource.js';

import GameManager from "./GameManager.js";
import SrcManager from './SrcManager.js';
import Scene from "./scene.js";

export default class Skeleton {

    maxLife = 5;

    constructor(scene) {
        this.id = ++GameManager.id;
        this.scene = scene;

        this.lifeBar = SrcManager.getGroup('ui').get('life');
        this.lifeBack = SrcManager.getGroup('ui').get('life_back');
        this.shadow = SrcManager.getGroup('enemy').get('walk_shadow');

        this.width = EW;
        this.height = EH;

        this.rangeX = 1;
        this.rangeY = 1;

        this.dir = Scene.SS;
        this.#initPosition();

        this.life = this.maxLife;

        this.reactRate = this.scene.getRandomInt(21, 210);

        this.fIndex = 0;
        this.moveCount = this.reactRate;

        this.scene.objectMap.set(this.id, this);
        this.scene.enemyMap.set(this.id, this);
    }

    #initPosition() {
        this.x = this.scene.map.offsetX + this.scene.getRandomInt(200, 1200) - this.scene.getRandomInt(200, 1200);
        this.y = this.scene.map.offsetY + (this.scene.getRandomInt(200, 1200) + this.scene.getRandomInt(200, 1200)) / 2;
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

    draw() {
        var img = SrcManager.getGroup('enemy').get('walk_' + this.dir);
        var ctx = GameManager.ctx;

        this.#drawShadow(ctx);
        this.#drawImage(ctx, img);
        this.#drawLifeBack(ctx);
        this.#drawLifeBar(ctx);  
    }

    #drawShadow(ctx) {
        ctx.drawImage(
            this.shadow,
            0,
            0,
            this.width,
            this.height,
            this.x - this.scene.map.getOriginX() - (this.width / 2),
            this.y - this.scene.map.getOriginY() - (this.height / 2),
            this.width,
            this.height
        );
    }

    #drawImage(ctx, img) {
        ctx.drawImage(
            img, 
            this.width * this.fIndex, 
            0, 
            this.width, 
            this.height, 
            this.x - this.scene.map.getOriginX() - (this.width / 2),
            this.y - this.scene.map.getOriginY() - (this.height / 2),
            this.width,
            this.height
        );
    }

    #drawLifeBack(ctx) {
        ctx.drawImage(
            this.lifeBack, 
            0,
            0, 
            this.lifeBack.width, 
            this.lifeBack.height, 
            this.x - this.scene.map.getOriginX() - (this.lifeBack.width / 2),
            this.y - this.scene.map.getOriginY() - (this.lifeBack.height / 2) - 30,
            this.lifeBack.width, 
            this.lifeBack.height, 
        );
    }

    #drawLifeBar(ctx) {
        ctx.drawImage(
            this.lifeBar, 
            0,
            0, 
            this.lifeBar.width, 
            this.lifeBar.height, 
            this.x - this.scene.map.getOriginX() - (this.lifeBar.width / 2),
            this.y - this.scene.map.getOriginY() - (this.lifeBar.height / 2) - 30,
            this.lifeBar.width * (this.life / this.maxLife), 
            this.lifeBar.height, 
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