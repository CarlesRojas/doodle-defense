import * as PIXI from "pixi.js";
import constants from "../constants";

export default class GameContainer {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        this.wolf = PIXI.Sprite.from(this.global.app.loader.resources.enemy_wolf.texture);
        // this.wolf.anchor.set(0.5);
        this.handleResize();
        this.container.addChild(this.wolf);
    }

    destructor() {}

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        const { left, top, cellSize } = this.global.gameDimensions;
        const { gridX, gridY } = constants;

        this.wolf.x = left + Math.floor(gridX / 2) * cellSize;
        this.wolf.y = top + Math.floor((gridY - 2) / 2) * cellSize;
        this.wolf.width = cellSize;
        this.wolf.height = cellSize;
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {}
}
