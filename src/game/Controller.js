import * as PIXI from "pixi.js";
import { EventSystem } from "@pixi/events";
import Run from "./Run";
import Loader from "./Loader";
import constants from "../constants";
import Background from "./Background";

export default class Controller {
    constructor({ container, state, events, width, height }) {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        delete PIXI.Renderer.__plugins.interaction;

        this.global = {
            state,
            events,
            app: new PIXI.Application({
                width,
                height,
                backgroundAlpha: 0,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
            }),
            containers: {},
            loader: null,
            gameDimensions: null,
            run: {},
            combat: {},
        };

        this.#enableInteraction();
        this.#getGameDimensions({ width, height });

        this.addViewToWindow(container);

        this.global.loader = new Loader(this.global, this.#handleLoadingComplete.bind(this));
    }

    destructor() {
        for (const value of Object.values(this.global.containers)) value.destructor();
        this.global.loader.destructor();
    }

    #handleLoadingComplete() {
        this.global.containers.background = new Background(this.global);
        this.global.containers.run = new Run(this.global);
        this.global.app.ticker.add(this.#gameLoop.bind(this));
    }

    // #################################################
    //   VIEW
    // #################################################

    addViewToWindow(container) {
        const oldCanvases = container.current.getElementsByTagName("canvas");
        for (let i = 0; i < oldCanvases.length; i++) {
            oldCanvases[i].parentNode.removeChild(oldCanvases[0]);
        }
        container.current.appendChild(this.global.app.view);
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize({ width, height }) {
        this.global.app.renderer.resize(width, height);
        this.#getGameDimensions({ width, height });

        for (const value of Object.values(this.global.containers)) value.handleResize();
    }

    #getGameDimensions({ width, height }) {
        const { aspectRatioWidth, aspectRatioHeight, gridX } = constants;

        let gameWidth = width;
        let gameHeight = (width / aspectRatioWidth) * aspectRatioHeight;

        if (gameHeight > height) {
            gameHeight = height;
            gameWidth = (height / aspectRatioHeight) * aspectRatioWidth;
        }

        this.global.gameDimensions = {
            windowWidth: width,
            windowHeight: height,
            width: gameWidth,
            height: gameHeight,
            left: (width - gameWidth) / 2,
            top: (height - gameHeight) / 2,
            cellSize: gameWidth / gridX,
        };

        this.global.state.set("gameDimensions", this.global.gameDimensions);
    }

    // #################################################
    //   INTERACTION
    // #################################################

    #enableInteraction() {
        if (!("events" in this.global.app.renderer)) this.global.app.renderer.addSystem(EventSystem, "events");
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    #gameLoop() {
        if (!this.global) return;

        for (const value of Object.values(this.global.containers))
            value.gameLoop(this.global.app.ticker.deltaMS / 1000);
    }
}
