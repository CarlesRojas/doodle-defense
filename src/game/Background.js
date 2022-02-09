import * as PIXI from "pixi.js";
import constants from "../constants";

const TILES_IN_SPRITE = 10;

export default class Background {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        this.tiles = [[]];

        this.handleResize();
    }

    destructor() {}

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        const { windowWidth, windowHeight, left, top, cellSize } = this.global.gameDimensions;
        const { gridX, gridY } = constants;
        const spriteSize = cellSize * TILES_IN_SPRITE;

        const totalHorizontalCells = Math.ceil(windowWidth / cellSize);
        const totalVerticalCells = Math.ceil(windowHeight / cellSize);

        const numHorizontalSprites = Math.ceil(totalHorizontalCells / TILES_IN_SPRITE) + 1;
        const numVerticalSprites = Math.ceil(totalVerticalCells / TILES_IN_SPRITE) + 1;

        const necessaryHorizontalSprites = Math.ceil(gridX / TILES_IN_SPRITE);
        const necessaryVerticalSprites = Math.ceil(gridY / TILES_IN_SPRITE);

        const horizontalDispl = Math.ceil((numHorizontalSprites - necessaryHorizontalSprites) / 2) * spriteSize;
        const verticalDispl = Math.ceil((numVerticalSprites - necessaryVerticalSprites) / 2) * spriteSize;

        this.tiles = [];
        for (let x = 0; x <= numHorizontalSprites; x++) {
            const column = [];

            for (let y = 0; y <= numVerticalSprites; y++) {
                const tile = PIXI.Sprite.from(this.global.app.loader.resources.background.texture);
                tile.width = spriteSize;
                tile.height = spriteSize;
                tile.x = left + spriteSize * x - horizontalDispl;
                tile.y = top + spriteSize * y - verticalDispl;

                column.push(tile);
                this.container.addChild(tile);
            }

            this.tiles.push(column);
        }
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop() {}
}
