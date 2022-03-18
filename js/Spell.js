import { TO_RADIAN, SF, SS, SW, SH } from './resource.js';

import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';
import Scene from './scene.js';

export default class Spell {

    offset = 24;

    constructor(dir, x, y, scene, angle) {
        this.id = ++GameManager.id;

        this.width = SW;
        this.height = SH;

        this.rangeX = 1;
        this.rangeY = 1;
        
        this.dir = dir;

        this.radian = angle * TO_RADIAN;
        this.diagonalX = Math.sin(this.radian);
        this.diagonalY = -Math.cos(this.radian);

        this.x = x + this.diagonalX * this.offset;
        this.y = y + this.diagonalY * this.offset;

        this.img = SrcManager.getGroup('spell').get('fireball');
        this.shadow = SrcManager.getGroup('spell').get('fireball_shadow');

        this.scene = scene;
        this.scene.objectMap.set(this.id, this);
        this.scene.spellMap.set(this.id, this);

        this.fIndex = 0;
        this.fIndexUpdator = setInterval(this.updateIndex, 24, this);
    }

    updateIndex(s) {
        if (++s.fIndex > SF) {
            s.fIndex = SF - 40;
        }
    }

    updateScreenCoord() {
        this.#updateX();
        this.#updateY();
        
        let isCollision = false;
        isCollision = this.#checkEnemyCollision();
        if (isCollision) {
            this.#removeFromMap();
        }
        isCollision = this.scene.updateOrthoCoord(this);
        if (isCollision) {
            this.#removeFromMap();
        }
    }

    #updateX() {
        this.x += SS * this.diagonalX;
    }

    #updateY() {
        this.y += SS * this.diagonalY;
    }

    #checkEnemyCollision() {
        let result = false;
        Array.from(this.scene.enemyMap.values()).some((v) => {
            result = v.isCollision(this);
            if (result) {
                v.addDamage();
                return result;
            }
        });
        return result;
    }

    #removeFromMap() {
        this.scene.objectMap.delete(this.id);
        this.scene.spellMap.delete(this.id);
    }

    draw(map) {
        var ctx = GameManager.ctx;

        var pointX = this.x - map.getOriginX();
        var pointY = this.y - map.getOriginY();

        this.#drawShadow(ctx, pointX, pointY);

        pointY -= 100;

        this.#drawImage(ctx, pointX, pointY);
    }

    #drawShadow(ctx, pointX, pointY) {
        ctx.save();
        ctx.translate(pointX, pointY);
        ctx.rotate(this.radian);
        ctx.translate(-pointX, -pointY);

        ctx.drawImage(
            this.shadow,
            this.width * this.fIndex,
            0,
            this.width,
            this.height,
            pointX - (this.width / 2),
            pointY - (this.height / 2),
            this.width,
            this.height
        );

        ctx.restore();
    }

    #drawImage(ctx, pointX, pointY) {
        ctx.save();
        ctx.translate(pointX, pointY);
        ctx.rotate(this.radian);
        ctx.translate(-pointX, -pointY);

        ctx.drawImage(
            this.img,
            this.width * this.fIndex,
            0,
            this.width,
            this.height,
            pointX - (this.width / 2),
            pointY - (this.height / 2),
            this.width,
            this.height
        );

        ctx.restore();
    }
}