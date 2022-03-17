import { TILE_SIZE, TILE_HALF } from './resource.js';

import SceneMap from './Map.js'
import Character from './character.js'
import Obstacle from './Obstacle.js';
import Skeleton from './Skeleton.js';

export default class Scene {

    static IDLE = 0;
    static NN = 1;
    static NE = 2;
    static EE = 3;
    static SE = 4;
    static SS = 5;
    static SW = 6;
    static WW = 7;
    static NW = 8;

    constructor(name, map, width, height) {
        this.map = new SceneMap(map, width, height, this);
        this.character = new Character(name, this);

        this.objectMap = new Map();
        this.objectMap.set(this.character.id, this.character);

        this.spellMap = new Map();
        this.enemyMap = new Map();

        this.setCoord();
        this.coordUpdator = setInterval(this.updateCoord, 16, this);
    }

    setCoord() {
        var x = this.map.img.width / 2;
        var y = this.map.img.height / 2;

        this.map.x = x;
        this.map.y = y;

        this.character.x = x;
        this.character.y = y;
    }

    updateCoord(s) {
        s.updateCharacterCoord();
        s.updateMapCoord();
        s.updateEnemyCoord();
        s.updateSpellCoord();
    }

    updateCharacterCoord() {
        if (this.character.isIdle) {
            return;
        }

        this.#updateCoordByDir(this.character);
    }

    updateMapCoord() {
        this.map.x = this.character.x;
        this.map.y = this.character.y;

        this.map.updateX();
        this.map.updateY();
    }

    updateEnemyCoord() {
        this.enemyMap.forEach(e => this.#updateCoordByDir(e));
    }

    updateSpellCoord() {
        this.spellMap.forEach(s => this.#updateCoordByDir(s));
    }

    #updateCoordByDir(t) {
        switch (t.dir) {
            case Scene.NN:
                t.updateScreenCoord(Scene.NN, 1, Scene.EE, 0);
                break

            case Scene.NE:
                t.updateScreenCoord(Scene.NN, 0.45, Scene.EE, 0.9);
                break;

            case Scene.EE:
                t.updateScreenCoord(Scene.NN, 0, Scene.EE, 1);
                break;

            case Scene.SE:
                t.updateScreenCoord(Scene.SS, 0.45, Scene.EE, 0.9);
                break;

            case Scene.SS:
                t.updateScreenCoord(Scene.SS, 1, Scene.EE, 0);
                break;

            case Scene.SW:
                t.updateScreenCoord(Scene.SS, 0.45, Scene.WW, 0.9);
                break;

            case Scene.WW:
                t.updateScreenCoord(Scene.NN, 0, Scene.WW, 1);
                break;

            case Scene.NW:
                t.updateScreenCoord(Scene.NN, 0.45, Scene.WW, 0.9);
                break;
        }
    }

    updateOrthoCoord(t) {
        var orthoX = this.#getOrthoX(t.x, t.y);
        var orthoY = this.#getOrthoY(t.x, t.y);

        let dir = 0;
        let obj = null;
        let isCollision = false;

        for (let index = 0; index < 4; index++) {
            dir = (index + 1) * 2;
            obj = this.#checkCollision(dir, t, orthoX, orthoY);

            if (obj.isCollision) {
                isCollision = obj.isCollision;
            }

            orthoX = obj.x;
            orthoY = obj.y;
        }

        if (orthoX < TILE_HALF) {
            orthoX = TILE_HALF;

            isCollision = true;

        } else if (orthoX > this.map.width - TILE_HALF) {
            orthoX = this.map.width - TILE_HALF;

            isCollision = true;
        }

        if (orthoY < TILE_HALF) {
            orthoY = TILE_HALF;

            isCollision = true;

        } else if (orthoY > this.map.height - TILE_HALF) {
            orthoY = this.map.height - TILE_HALF;

            isCollision = true;
        }

        t.orthoX = orthoX;
        t.orthoY = orthoY;
        t.x = this.#getScreenX(orthoX, orthoY);
        t.y = this.#getScreenY(orthoX, orthoY);

        return isCollision;
    }

    #checkCollision(dir, t, orthoX, orthoY) {
        try {
            let isCollision = false;

            switch (dir) {
                case Scene.NE:
                    var ne = new Object();
                    ne.x = parseInt((orthoX + TILE_HALF) / TILE_SIZE);
                    if (ne.x > (this.map.width / TILE_SIZE) - 1) {
                        break;
                    }
                    
                    ne.y = parseInt((orthoY - TILE_HALF) / TILE_SIZE);
                    if (ne.y < 0) {
                        break;
                    }

                    if (this.map.resource[ne.y][ne.x] != 0) {
                        var obstacle = this.objectMap.get(this.map.resource[ne.y][ne.x]);

                        if ((obstacle.coordY + obstacle.rangeY) * TILE_SIZE <= t.orthoY - TILE_HALF) {
                            orthoY = (obstacle.coordY + obstacle.rangeY) * TILE_SIZE + TILE_HALF;

                        } else {
                            orthoX = obstacle.coordX * TILE_SIZE - TILE_HALF;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.SE:
                    var se = new Object();
                    se.x = parseInt((orthoX + TILE_HALF) / TILE_SIZE);
                    if (se.x > (this.map.width / TILE_SIZE) - 1) {
                        break;
                    }

                    se.y = parseInt((orthoY + TILE_HALF) / TILE_SIZE);
                    if (se.y > (this.map.height / TILE_SIZE) - 1) {
                        break;
                    }
            
                    if (this.map.resource[se.y][se.x] != 0) {
                        var obstacle = this.objectMap.get(this.map.resource[se.y][se.x]);

                        if (obstacle.coordX * TILE_SIZE >= t.orthoX + TILE_HALF) {
                            orthoX = obstacle.coordX * TILE_SIZE - TILE_HALF;

                        } else {
                            orthoY = obstacle.coordY * TILE_SIZE - TILE_HALF;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.SW:
                    var sw = new Object();
                    sw.x = parseInt((orthoX - TILE_HALF) / TILE_SIZE);
                    if (sw.x < 0) {
                        break;
                    }

                    sw.y = parseInt((orthoY + TILE_HALF) / TILE_SIZE);
                    if (sw.y > (this.map.height / TILE_SIZE) - 1) {
                        break;
                    }
            
                    if (this.map.resource[sw.y][sw.x] != 0) {
                        var obstacle = this.objectMap.get(this.map.resource[sw.y][sw.x]);

                        if (obstacle.coordY * TILE_SIZE >= t.orthoY + TILE_HALF) {
                            orthoY = obstacle.coordY * TILE_SIZE - TILE_HALF;

                        } else {
                            orthoX = (obstacle.coordX + obstacle.rangeX)  * TILE_SIZE + TILE_HALF;
                        }

                        isCollision = true;
                    }
                    break;

                case Scene.NW:
                    var nw = new Object();
                    nw.x = parseInt((orthoX - TILE_HALF) / TILE_SIZE);
                    if (nw.x < 0) {
                        break;
                    }

                    nw.y = parseInt((orthoY - TILE_HALF) / TILE_SIZE);
                    if (nw.y < 0) {
                        break;
                    }
            
                    if (this.map.resource[nw.y][nw.x] != 0) {
                        var obstacle = this.objectMap.get(this.map.resource[nw.y][nw.x]);

                        if ((obstacle.coordX + obstacle.rangeX) * TILE_SIZE <= t.orthoX - TILE_HALF) {
                            orthoX = (obstacle.coordX + obstacle.rangeX) * TILE_SIZE + TILE_HALF;

                        } else {
                            orthoY = (obstacle.coordY + obstacle.rangeY)  * TILE_SIZE + TILE_HALF;
                        }

                        isCollision = true;
                    }
                    break;
            }

        } catch (error) {
            console.log('Error is occured on checkCollision [ ' + error + ' ]');
        }

        return { x: orthoX, y: orthoY, isCollision: isCollision };
    }

    #getOrthoX(x, y) {
        return (2 * (y - this.map.offsetY) + (x - this.map.offsetX)) / 2; 
    }

    #getOrthoY(x, y) {
        return (2 * (y - this.map.offsetY) - (x - this.map.offsetX)) / 2; 
    }

    #getScreenX(x, y) {
        return (x - y) + this.map.offsetX;
    }

    #getScreenY(x, y) {
        return ((x + y) / 2) + this.map.offsetY;
    }

    getAngle(x1, y1, x2, y2) {
        let a;
        if(y1 == y2) {
            if(x2 < x1) {
                a = -90;
    
            } else {
                a = 90;
            }
    
        } else if(x1 == x2 && y2 > y1) {
            a = 180;
    
        } else {
            const rad = Math.atan((x2 -x1) / (y1 - y2));
            a = rad * 180 / Math.PI;
            
            if(y2 > y1 && x2 > x1) {
                a = 180 + a;
    
            } else if(y2 > y1 && x2 < x1) {
                a = -180 + a;
            }
        }

        return a;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    createObstacle(img, coordX, coordY, rangeX, rangeY) {
        var x = (coordX * TILE_SIZE + (coordX + rangeX) * TILE_SIZE) / 2;
        var y = (coordY * TILE_SIZE + (coordY + rangeY) * TILE_SIZE) / 2;

        var obstacle = new Obstacle(
                                img, 
                                this.#getScreenX(x, y),
                                this.#getScreenY(x, y),
                                coordX,
                                coordY,
                                rangeX,
                                rangeY
                            );

        this.objectMap.set(obstacle.id, obstacle);
        this.map.setObstacle(obstacle);
    }

    createEnemy(amount) {
        for (let index = 0; index < amount; index++) {
            new Skeleton(this);
        }
    }

    draw() {
        this
            .map
            .draw();

        Array
            .from(this.objectMap.values())
            .sort((a, b) => {
                var aX = this.#getOrthoX(a.x, a.y) + (a.rangeX * TILE_HALF);
                var aY = this.#getOrthoY(a.x, a.y) + (a.rangeY * TILE_HALF);
                
                var bX = this.#getOrthoX(b.x, b.y) + (b.rangeX * TILE_HALF);
                var bY = this.#getOrthoY(b.x, b.y) + (b.rangeY * TILE_HALF);

                return (aX**2 + aY**2) - (bX**2 + bY**2);
            })
            .forEach((o) => o.draw(this.map));
    }
}