import * as PIXI from "pixi.js";

const SPEED = 2;

export default class CardTrail {
    constructor(global, handContainer, cardContainer) {
        this.global = global;
        this.handContainer = handContainer;
        this.cardContainer = cardContainer;

        // CONTAINER
        this.container = new PIXI.Container();
        this.container.zIndex = 90;
        this.container.interactive = false;
        this.handContainer.addChild(this.container);

        this.active = true;
        this.trail = [];
        this.trailInterval = setInterval(() => {
            if (this.active) this.#spawnTrailPiece();
        }, 5);

        this.handleResize();
    }

    destructor() {
        if (this.trailInterval) clearTimeout(this.trailInterval);
    }

    // #################################################
    //   TRAIL
    // #################################################

    #spawnTrailPiece() {
        if (this.trail.length > 500) return;

        const trailPiece = PIXI.Sprite.from(this.global.app.loader.resources.card_back.texture);
        trailPiece.anchor.set(0.5);
        trailPiece.x = this.cardContainer.x;
        trailPiece.y = this.cardContainer.y;
        this.container.addChild(trailPiece);
        this.trail.push(trailPiece);
    }

    #animateTrail(deltaTime) {
        const scaleStep = SPEED * deltaTime;

        for (let i = 0; i < this.trail.length; i++) {
            const element = this.trail[i];

            if (element.scale.x > 0) element.scale.x = Math.max(0, element.scale.x - scaleStep);
            if (element.scale.y > 0) element.scale.y = Math.max(0, element.scale.y - scaleStep);

            // Animation finished -> Destroy trail piece
            if (element.scale.x <= 0 && element.scale.y <= 0) {
                this.container.removeChild(element);
                this.trail.splice(i, 1);
                --i;
            }
        }
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {}

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.#animateTrail(deltaTime);
    }
}
