import Deck from "./Deck";
import Maze from "./Maze";

export default class Combat {
    constructor(global) {
        this.global = global;

        // Create maze
        this.maze = new Maze(this.global);

        // Create deck
        this.deck = new Deck(this.global);

        // Turn
        this.turn = 0;
        this.sendWaveTimeout = null;

        this.handleResize();

        // Start first turn
        this.#startNextTurn();

        // SUB TO EVENTS
        this.global.events.sub("nextRoundClicked", this.#startNextTurn.bind(this));
    }

    destructor() {
        if (this.sendWaveTimeout) clearTimeout(this.sendWaveTimeout);

        // UNSUB FROM EVENTS
        this.global.events.unsub("nextRoundClicked", this.#startNextTurn.bind(this));

        this.maze.destructor();
        this.deck.destructor();
    }

    // #################################################
    //   TURNS
    // #################################################

    #startNextTurn() {
        // Update UI
        this.#setNextWaveUI(false);

        // Draw cards
        this.deck.startNextTurn();

        // Send wave in 10 seconds
        this.sendWaveTimeout = setTimeout(() => {
            console.log("SEND WAVE");

            // Update UI
            this.#setNextWaveUI(true);
        }, 2 * 1000);
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

    // #################################################
    //   UI
    // #################################################

    #setNextWaveUI(visible) {
        this.global.events.emit("setNextWave", visible);
    }
}
