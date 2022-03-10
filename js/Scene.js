import { TILE_SIZE, TILE_HALF, CS } from './resource.js';

import SceneMap from './Map.js'
import Character from './character.js'
import GameManager from './GameManager.js';
import Obstacle from './Obstacle.js';

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

    constructor(name, map, widht, height) {
        this.map = new SceneMap(map, widht, height);
        this.character = new Character(name);

        this.objectMap = new Map();
        this.objectMap.set(this.character.id, this.character);

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
        if (s.character.isIdle) {
            return;
        }

        switch (s.character.dir) {
            case Scene.NN:
                s.updateCharacterY(Scene.NN);
                break

            case Scene.NE:
                s.updateCharacterY(Scene.NN, 0.45);
                s.updateCharacterX(Scene.EE, 0.9);
                break;

            case Scene.EE:
                s.updateCharacterX(Scene.EE);
                break;

            case Scene.SE:
                s.updateCharacterY(Scene.SS, 0.45);
                s.updateCharacterX(Scene.EE, 0.9);
                break;

            case Scene.SS:
                s.updateCharacterY(Scene.SS);
                break;

            case Scene.SW:
                s.updateCharacterY(Scene.SS, 0.45);
                s.updateCharacterX(Scene.WW, 0.9);
                break;

            case Scene.WW:
                s.updateCharacterX(Scene.WW);
                break;

            case Scene.NW:
                s.updateCharacterY(Scene.NN, 0.45);
                s.updateCharacterX(Scene.WW, 0.9);
                break;
        }

        s.updateMapCoord();
    }

    updateCharacterX(dir, isDiagonal = 1) {
        this.character.x += (CS * isDiagonal * (dir == Scene.EE ? 1 : -1));
        this.#updateOrthoCoord(this.character);
    }

    updateCharacterY(dir, isDiagonal = 1) {
        this.character.y += (CS * isDiagonal * (dir == Scene.SS ? 1 : -1));
        this.#updateOrthoCoord(this.character);
    }

    updateMapCoord() {
        this.map.x = this.character.x;
        this.map.y = this.character.y;

        this.#updateMapCoordX();
        this.#updateMapCoordY();
    }

    #updateMapCoordX() {
        if (this.map.x <= GameManager.canvas.width / 2) {
            this.map.x = GameManager.canvas.width / 2;

        } else if (this.map.x >= this.map.img.width - (GameManager.canvas.width / 2)) {
            this.map.x = this.map.img.width - (GameManager.canvas.width / 2);
        }
    }

    #updateMapCoordY() {
        if (this.map.y <= GameManager.canvas.height / 2) {
            this.map.y = GameManager.canvas.height / 2;

        } else if (this.map.y >= this.map.img.height - (GameManager.canvas.height / 2)) {
            this.map.y = this.map.img.height - (GameManager.canvas.height / 2);
        }
    }

    #updateOrthoCoord(t) {
        var orthoX = this.#getOrthoX(t.x, t.y);
        var orthoY = this.#getOrthoY(t.x, t.y);

        for (let index = 0; index < 4; index++) {
            var dir = (index + 1) * 2;
            var obj = this.#checkCollision(dir, orthoX, orthoY);

            if (obj.isCollision) {
                orthoX = obj.x;
                orthoY = obj.y;
                break;
            }
        }

        if (orthoX < TILE_HALF) {
            orthoX = TILE_HALF;

        } else if (orthoX > this.map.width - TILE_HALF) {
            orthoX = this.map.width - TILE_HALF
        }

        if (orthoY < TILE_HALF) {
            orthoY = TILE_HALF;

        } else if (orthoY > this.map.height - TILE_HALF) {
            orthoY = this.map.height - TILE_HALF
        }

        t.orthoX = orthoX;
        t.orthoY = orthoY;
        t.x = this.#getScreenX(orthoX, orthoY);
        t.y = this.#getScreenY(orthoX, orthoY);
    }

    #checkCollision(dir, orthoX, orthoY) {
        let isCollision = false;

        switch (dir) {
            case Scene.NE:
                var ne = new Object();
                ne.x = Math.floor((orthoX + TILE_HALF) / TILE_SIZE);
                if (ne.x > (this.map.width / TILE_SIZE) - 1) {
                    break;
                }
                
                ne.y = Math.floor((orthoY - TILE_HALF) / TILE_SIZE);
                if (ne.y < 0) {
                    break;
                }

                if (this.map.resource[ne.y][ne.x] != 0) {
                    var obstacle = this.objectMap.get(this.map.resource[ne.y][ne.x]);

                    if ((obstacle.coordY + obstacle.rangeY) * TILE_SIZE <= this.character.orthoY - TILE_HALF) {
                        orthoY = (obstacle.coordY + obstacle.rangeY) * TILE_SIZE + TILE_HALF;

                    } else {
                        orthoX = obstacle.coordX * TILE_SIZE - TILE_HALF;
                    }

                    isCollision = true;
                }
                break;

            case Scene.SE:
                var se = new Object();
                se.x = Math.floor((orthoX + TILE_HALF) / TILE_SIZE);
                if (se.x > (this.map.width / TILE_SIZE) - 1) {
                    break;
                }

                se.y = Math.floor((orthoY + TILE_HALF) / TILE_SIZE);
                if (se.y > (this.map.height / TILE_SIZE) - 1) {
                    break;
                }
        
                if (this.map.resource[se.y][se.x] != 0) {
                    var obstacle = this.objectMap.get(this.map.resource[se.y][se.x]);

                    if (obstacle.coordX * TILE_SIZE >= this.character.orthoX + TILE_HALF) {
                        orthoX = obstacle.coordX * TILE_SIZE - TILE_HALF;

                    } else {
                        orthoY = obstacle.coordY * TILE_SIZE - TILE_HALF;
                    }

                    isCollision = true;
                }
                break;

            case Scene.SW:
                var sw = new Object();
                sw.x = Math.floor((orthoX - TILE_HALF) / TILE_SIZE);
                if (sw.x < 0) {
                    break;
                }

                sw.y = Math.floor((orthoY + TILE_HALF) / TILE_SIZE);
                if (sw.y > (this.map.height / TILE_SIZE) - 1) {
                    break;
                }
        
                if (this.map.resource[sw.y][sw.x] != 0) {
                    var obstacle = this.objectMap.get(this.map.resource[sw.y][sw.x]);

                    if (obstacle.coordY * TILE_SIZE >= this.character.orthoY + TILE_HALF) {
                        orthoY = obstacle.coordY * TILE_SIZE - TILE_HALF;

                    } else {
                        orthoX = (obstacle.coordX + obstacle.rangeX)  * TILE_SIZE + TILE_HALF;
                    }

                    isCollision = true;
                }
                break;

            case Scene.NW:
                var nw = new Object();
                nw.x = Math.floor((orthoX - TILE_HALF) / TILE_SIZE);
                if (nw.x < 0) {
                    break;
                }

                nw.y = Math.floor((orthoY - TILE_HALF) / TILE_SIZE);
                if (nw.y < 0) {
                    break;
                }
        
                if (this.map.resource[nw.y][nw.x] != 0) {
                    var obstacle = this.objectMap.get(this.map.resource[nw.y][nw.x]);

                    if ((obstacle.coordX + obstacle.rangeX) * TILE_SIZE <= this.character.orthoX - TILE_HALF) {
                        orthoX = (obstacle.coordX + obstacle.rangeX) * TILE_SIZE + TILE_HALF;

                    } else {
                        orthoY = (obstacle.coordY + obstacle.rangeY)  * TILE_SIZE + TILE_HALF;
                    }

                    isCollision = true;
                }
                break;
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

    #getAngle(x1, y1, x2, y2) {
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

    draw() {
        this
            .map
            .draw();

        Array
            .from(this.objectMap.values())
            .sort((a, b) => a.y - b.y)
            .forEach((o) => o.draw(this.map));
    }
}