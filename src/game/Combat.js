import * as PIXI from "pixi.js";
import constants from "../constants";
import Deck from "./Deck";

export default class Combat {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        this.wolf = PIXI.Sprite.from(this.global.app.loader.resources.enemy_wolf.texture);
        // this.wolf.anchor.set(0.5);
        this.container.addChild(this.wolf);

        // Create deck
        this.deck = new Deck(this.global);

        this.handleResize();
    }

    destructor() {
        this.deck.destructor();
    }

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

        this.deck.handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.deck.gameLoop(deltaTime);
    }
}
