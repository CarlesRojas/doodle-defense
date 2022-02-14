import * as PIXI from "pixi.js";
import ENEMIES from "./lists/enemies";

export default class Enemy {
    constructor(global, enemyId, handleEnemyDead) {
        this.global = global;
        this.handleEnemyDead = handleEnemyDead;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        // ENEMY INFO
        this.info = ENEMIES[enemyId];
        this.object = null;

        // POSITION
        this.enemyPathNextIndex = 0;
        this.gridPosition = { x: 0, y: 0 };
        this.gridTargetPosition = { x: 0, y: 0 };

        // STATE
        this.dead = false;

        this.#spawnEnemy();
        this.handleResize();
    }

    destructor() {
        this.global.app.stage.removeChild(this.container);
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        const { cellSize } = this.global.gameDimensions;
        const { worldX, worldY } = this.#gridToWorldPosition(this.gridPosition);

        this.object.x = worldX;
        this.object.y = worldY;
        this.object.width = cellSize;
        this.object.height = cellSize;
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.#animateEnemy(deltaTime);
    }

    // #################################################
    //   SPAWN ENEMY
    // #################################################

    #spawnEnemy() {
        this.object = PIXI.Sprite.from(this.global.app.loader.resources[this.info.artId].texture);

        this.gridPosition = { ...this.global.combat.enemyPath[this.enemyPathNextIndex] };
        this.gridTargetPosition = { ...this.global.combat.enemyPath[this.enemyPathNextIndex] };
        this.enemyPathNextIndex++;

        this.container.addChild(this.object);
    }

    // #################################################
    //   DESTROY ENEMY
    // #################################################

    #destroyEnemy(reachedPlayer) {
        this.dead = true;

        if (reachedPlayer) this.global.events.emit("damagePlayer", this.info.damage);

        this.container.removeChild(this.object);
        this.handleEnemyDead();
    }

    // #################################################
    //   ANIMATE ENEMY
    // #################################################

    #animateEnemy(deltaTime) {
        if (this.dead) return;

        const step = this.info.speed * deltaTime;

        if (this.gridTargetPosition.x < this.gridPosition.x)
            this.gridPosition.x = Math.max(this.gridTargetPosition.x, this.gridPosition.x - step);
        else if (this.gridTargetPosition.x > this.gridPosition.x)
            this.gridPosition.x = Math.min(this.gridTargetPosition.x, this.gridPosition.x + step);

        if (this.gridTargetPosition.y < this.gridPosition.y)
            this.gridPosition.y = Math.max(this.gridTargetPosition.y, this.gridPosition.y - step);
        else if (this.gridTargetPosition.y > this.gridPosition.y)
            this.gridPosition.y = Math.min(this.gridTargetPosition.y, this.gridPosition.y + step);

        // Update world position
        const { worldX, worldY } = this.#gridToWorldPosition(this.gridPosition);
        this.object.x = worldX;
        this.object.y = worldY;

        if (this.gridTargetPosition.x === this.gridPosition.x && this.gridTargetPosition.y === this.gridPosition.y) {
            if (this.enemyPathNextIndex >= this.global.combat.enemyPath.length) return this.#destroyEnemy(true);

            this.gridTargetPosition = { ...this.global.combat.enemyPath[this.enemyPathNextIndex] };
            this.enemyPathNextIndex++;
        }
    }

    // #################################################
    //   UTILS
    // #################################################

    #gridToWorldPosition({ x, y }) {
        const { left, top, cellSize } = this.global.gameDimensions;
        return { worldX: left + x * cellSize, worldY: top + y * cellSize };
    }
}
