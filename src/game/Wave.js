import Enemy from "./Enemy";
import { sleep } from "./Utils";

export default class Wave {
    constructor(global, info, handleWaveFinished) {
        this.global = global;
        this.handleWaveFinished = handleWaveFinished;
        this.info = info;
        this.enemies = [];
        this.enemiesLeftInWave = this.info.length;

        this.#spawnEnemies();
        this.handleResize();
    }

    destructor() {
        for (let i = 0; i < this.enemies.length; i++) this.enemies[i].destructor();
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        for (let i = 0; i < this.enemies.length; i++) this.enemies[i].handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        for (let i = 0; i < this.enemies.length; i++) this.enemies[i].gameLoop(deltaTime);
    }

    // #################################################
    //   ENEMIES
    // #################################################

    async #spawnEnemies() {
        for (let i = 0; i < this.info.length; i++) {
            const enemyId = this.info[i];
            const enemy = new Enemy(this.global, enemyId, this.#handleEnemyDead.bind(this));

            this.enemies.push(enemy);
            await sleep(1000);
        }
    }

    #handleEnemyDead() {
        this.enemiesLeftInWave--;

        if (this.enemiesLeftInWave <= 0) this.handleWaveFinished();
    }
}
