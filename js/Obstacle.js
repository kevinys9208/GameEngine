import GameManager from './GameManager.js';
import SrcManager from './SrcManager.js';

export default class Obstacle {

    constructor(img, x, y, coordX, coordY, rangeX, rangeY, width = 300, height = 300) {
        this.id = ++GameManager.id;

        this.img = SrcManager.getGroup('obstacle').get(img);

        this.x = x;
        this.y = y;

        this.coordX = coordX;
        this.coordY = coordY;

        this.rangeX = rangeX;
        this.rangeY = rangeY;

        this.width = rangeX * width;
        this.height = rangeY * height;
    }

    draw(map) {
        GameManager
            .ctx
            .drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                this.x - map.getOriginX() - (this.width / 2),
                this.y - map.getOriginY() - (this.height / 2),
                this.width,
                this.height
            );
    }
}