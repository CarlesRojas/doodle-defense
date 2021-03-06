import Combat from "./Combat";

export default class Run {
    constructor(global) {
        this.global = global;

        this.global.run = {
            deck: [
                { id: "fortify", level: 1, object: null },
                { id: "fortify", level: 1, object: null },
                { id: "fortify", level: 1, object: null },
                { id: "fortify", level: 0, object: null },
                { id: "fortify", level: 0, object: null },
                { id: "ballista", level: 1, object: null },
                { id: "ballista", level: 1, object: null },
                { id: "ballista", level: 0, object: null },
                { id: "ballista", level: 0, object: null },
            ],
            totalMana: 3,
            powers: [],
            totalHp: 100,
            hp: 100,
            coins: 0,
        };

        this.#updateHealthUI();
        this.#updateManaUI();
        this.#updateCoinsUI();

        // Create maze
        this.combat = new Combat(this.global);
        this.handleResize();

        // SUB TO EVENTS
        this.global.events.sub("damagePlayer", this.#damagePlayer.bind(this));
    }

    destructor() {
        this.combat.destructor();

        // UNSUB TFROM EVENTS
        this.global.events.unsub("damagePlayer", this.#damagePlayer.bind(this));
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        this.combat.handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.combat.gameLoop(deltaTime);
    }

    // #################################################
    //   DAMAGE PLAYER
    // #################################################

    #damagePlayer(ammount) {
        this.global.run.hp = Math.max(0, this.global.run.hp - ammount);
        this.#updateHealthUI();

        if (this.global.run.hp <= 0) console.log("PLAYER DEAD");
    }

    // #################################################
    //   UI
    // #################################################

    #updateHealthUI() {
        this.global.events.emit("updateHealth", { current: this.global.run.hp, total: this.global.run.totalHp });
    }

    #updateManaUI() {
        this.global.events.emit("updateMana", { current: this.global.run.totalMana, total: this.global.run.totalMana });
    }

    #updateCoinsUI() {
        this.global.events.emit("updateCoins", this.global.run.coins);
    }
}
