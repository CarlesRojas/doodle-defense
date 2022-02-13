import * as PIXI from "pixi.js";
import Card from "./Card";
import { degToRad, sleep } from "./Utils";

const SPEED = 75;

export default class Deck {
    constructor(global) {
        this.global = global;

        // CONTAINER
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.global.app.stage.addChild(this.container);

        // PILES
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];

        // DRAW CARDS
        this.cardsLeftToDraw = 0;
        this.cardsLeftToDiscard = 0;

        // TURN
        this.startingTurn = false;

        // DISCARD TO DRAW ANIMATION
        this.discardToDrawCards = [];

        // SUB TO EVENTS
        this.global.events.sub("cardDrawn", this.#drawNextCard.bind(this));
        this.global.events.sub("cardDiscarded", this.#cleanupAfterACardIsDiscarded.bind(this));
        this.global.events.sub("discardCardAtIndex", this.#discardCardAtIndex.bind(this));

        // START COMBAT
        this.#startCombat();
    }

    destructor() {
        for (let i = 0; i < this.hand.length; i++) this.hand[i].object.destructor();

        // UNSUB FROM EVENTS
        this.global.events.unsub("cardDrawn", this.#drawNextCard.bind(this));
        this.global.events.unsub("cardDiscarded", this.#cleanupAfterACardIsDiscarded.bind(this));
        this.global.events.unsub("discardCardAtIndex", this.#discardCardAtIndex.bind(this));
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        for (let i = 0; i < this.hand.length; i++) this.hand[i].object.handleResize();
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        for (let i = 0; i < this.hand.length; i++) this.hand[i].object.gameLoop(deltaTime);

        for (let i = 0; i < this.discardPile.length; i++)
            if (this.discardPile[i].object) this.discardPile[i].object.gameLoop(deltaTime);

        this.#animateDiscardToDrawCards(deltaTime);
    }

    // #################################################
    //   START COMBAT
    // #################################################

    #startCombat() {
        this.drawPile = [...this.global.run.deck];
        this.#updateUI();
    }

    startNextTurn() {
        this.startingTurn = true;

        if (this.hand.length) this.#discardCards(this.hand.length);
        else this.#drawNewCards();
    }

    // #################################################
    //   DRAW CARDS
    // #################################################

    #drawNewCards() {
        this.startingTurn = false;
        this.#drawCards(5);
    }

    #drawCards(number) {
        this.cardsLeftToDraw = number;
        this.#drawNextCard();
    }

    #drawNextCard() {
        if (this.cardsLeftToDraw <= 0) return;
        if (this.drawPile.length <= 0) return this.#shuffleDiscardIntoDrawPile();
        --this.cardsLeftToDraw;

        const randomCard = Math.floor(Math.random() * this.drawPile.length);
        const card = this.drawPile.splice(randomCard, 1)[0];
        card.object = new Card(
            this.global,
            this.container,
            card.id,
            card.level,
            0 + this.cardsLeftToDraw,
            this.hand.length + this.cardsLeftToDraw + 1
        );
        this.hand.unshift(card);

        this.#updateUI();
        this.#updateCardsHandPositions();
    }

    // #################################################
    //   DISCARD TO DRAW PILE
    // #################################################

    #shuffleDiscardIntoDrawPile() {
        this.drawPile = this.discardPile;
        this.discardPile = [];
        this.#spawnDiscardToDrawCards();
    }

    // #################################################
    //   DISCARD CARDS
    // #################################################

    #discardCards(number) {
        this.cardsLeftToDiscard = Math.min(number, this.hand.length);
        this.#discardNextCard();
    }

    #discardCardAtIndex(index) {
        if (index < 0 || index >= this.hand.length) return;

        const card = this.hand.splice(index, 1)[0];
        card.object.discard();
        this.discardPile.push(card);

        this.#updateUI();
    }

    #discardNextCard() {
        if (this.cardsLeftToDiscard <= 0) return;

        --this.cardsLeftToDiscard;

        const card = this.hand.pop();
        card.object.discard();
        this.discardPile.push(card);

        this.#updateUI();
    }

    #cleanupAfterACardIsDiscarded() {
        for (let i = 0; i < this.discardPile.length; i++)
            if (this.discardPile[i].object && this.discardPile[i].object.discarded) this.discardPile[i].object = null;

        if (this.cardsLeftToDiscard <= 0) {
            this.#updateCardsHandPositions();
            if (this.startingTurn) this.#drawNewCards();
        } else this.#discardNextCard();
    }

    // #################################################
    //   HAND POSITIONS
    // #################################################

    #updateCardsHandPositions() {
        for (let i = 0; i < this.hand.length; i++)
            this.hand[i].object.updateHandPosition(i + this.cardsLeftToDraw, this.hand.length + this.cardsLeftToDraw);
    }

    // #################################################
    //   DISCARD TO DRAW CARDS
    // #################################################

    async #spawnDiscardToDrawCards() {
        const { cellSize } = this.global.gameDimensions;
        this.discardToDrawCards = [];

        const numOfCards = 4;
        for (let i = 0; i < numOfCards; i++) {
            const card = PIXI.Sprite.from(this.global.app.loader.resources.card_back.texture);
            card.anchor.set(0.5);
            card.x = this.global.app.screen.width - cellSize;
            card.y = this.global.app.screen.height - cellSize;

            const scaleFactor = cellSize / card.width;
            card.scale.set(scaleFactor);

            this.discardToDrawCards.push(card);
            this.container.addChild(this.discardToDrawCards[this.discardToDrawCards.length - 1]);

            await sleep(50);
        }
    }

    #dispawnDiscardToDrawCards(index) {
        if (index < 0 || index >= this.discardToDrawCards.length) return false;

        this.container.removeChild(this.discardToDrawCards[index]);
        this.discardToDrawCards.splice(index, 1);

        if (this.discardToDrawCards.length <= 0) this.#drawNextCard();

        return true;
    }

    #animateDiscardToDrawCards(deltaTime) {
        const { cellSize } = this.global.gameDimensions;
        const step = cellSize * SPEED * deltaTime;

        const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
        const lerp = (start, end, t) => start * (1 - t) + end * t;

        for (let i = 0; i < this.discardToDrawCards.length; i++) {
            const element = this.discardToDrawCards[i];
            const halfScreenWidth = (this.global.app.screen.width - cellSize * 2) / 2;
            const isInSecondHalf = element.x > this.global.app.screen.width / 2;

            const angle = isInSecondHalf
                ? lerp(180, 225, clamp((element.x - this.global.app.screen.width / 2) / halfScreenWidth))
                : lerp(135, 180, clamp((element.x - cellSize) / halfScreenWidth));

            const xMult = Math.cos(degToRad(angle));
            const yMult = Math.sin(degToRad(angle));

            element.x += xMult * step;
            element.y += yMult * step * 0.5;

            if (element.x <= cellSize) {
                if (this.#dispawnDiscardToDrawCards(i)) --i;
            }
        }
    }

    // #################################################
    //   UI
    // #################################################

    #updateUI() {
        this.global.events.emit("updateDrawPile", this.drawPile.length);
        this.global.events.emit("updateDiscardPile", this.discardPile.length);
    }
}
