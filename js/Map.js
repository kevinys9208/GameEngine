import { MW, MH } from './resource.js';
import * as MapResource from './MapResource.js';

import SrcManager from './SrcManager.js';
import GameManager from './GameManager.js';

export default class Map {

    constructor(img) {
        this.img = SrcManager.getGroup('map').get(img);
        this.resource = MapResource[img];
        
        this.width = MW;
        this.height = MH;

        this.offsetX = (this.img.width - (MW - MH)) / 2;
        this.offsetY = (this.img.height - (MW + MH) / 2) / 2;

        console.log('Screen offset => x: ' + this.offsetX + ', y: ' + this.offsetY);
    }

    getOriginX() {
        return this.x - (GameManager.canvas.width / 2);
    }

    getOriginY() {
        return this.y - (GameManager.canvas.height / 2);
    }

    draw() {
        GameManager
            .ctx
            .drawImage(
                this.img,
                this.x - (GameManager.canvas.width / 2),
                this.y - (GameManager.canvas.height / 2),
                GameManager.canvas.width,
                GameManager.canvas.height,
                0,
                0,
                GameManager.canvas.width,
                GameManager.canvas.height
            );
    }
}