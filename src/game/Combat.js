import * as PIXI from "pixi.js";
// import constants from "../constants";
import Deck from "./Deck";
import Maze from "./Maze";

export default class Combat {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        // Create maze
        this.maze = new Maze(this.global);

        // Create deck
        this.deck = new Deck(this.global);

        this.handleResize();
    }

    destructor() {
        this.maze.destructor();
        this.deck.destructor();
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        this.maze.handleResize();
        this.deck.handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.maze.gameLoop(deltaTime);
        this.deck.gameLoop(deltaTime);
    }
}
