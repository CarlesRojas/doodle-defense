import Deck from "./Deck";
import Maze from "./Maze";
import COMBATS from "./lists/combats";
import Wave from "./Wave";

export default class Combat {
    constructor(global) {
        this.global = global;

        this.global.combat = {
            grid: [],
            enemyPath: [],
            info: {},
            nextWaveIndex: 0,
            currentWave: null,
        };

        // Choose a random combat
        const combatId = Object.keys(COMBATS)[Math.floor(Math.random() * Object.keys(COMBATS).length)];
        this.global.combat.info = COMBATS[combatId];

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
            if (this.global.combat.currentWave) this.global.combat.currentWave.destructor();

            this.global.combat.currentWave = new Wave(
                this.global,
                this.global.combat.info.waves[this.global.combat.nextWaveIndex],
                this.#handleWaveFinished.bind(this)
            );

            this.global.combat.nextWaveIndex++;
        }, 2 * 1000);
    }

    #handleWaveFinished() {
        if (this.global.combat.nextWaveIndex >= this.global.combat.info.waves.length)
            return console.log("COMBAT VCTORY"); // ROJAS Do something here

        // Update UI
        this.#setNextWaveUI(true);
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        this.maze.handleResize();
        this.deck.handleResize();
        if (this.global.combat.currentWave) this.global.combat.currentWave.handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.maze.gameLoop(deltaTime);
        this.deck.gameLoop(deltaTime);
        if (this.global.combat.currentWave) this.global.combat.currentWave.gameLoop(deltaTime);
    }

    // #################################################
    //   UI
    // #################################################

    #setNextWaveUI(visible) {
        this.global.events.emit("setNextWave", visible);
    }
}
