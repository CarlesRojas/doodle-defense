import * as PIXI from "pixi.js";
import Card from "./Card";

export default class Deck {
    constructor(global) {
        this.global = global;

        // CONTAINER
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.global.app.stage.addChild(this.container);

        // DECK
        this.deck = [
            { id: "fortify", level: 1, object: null },
            { id: "fortify", level: 1, object: null },
            { id: "fortify", level: 1, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "ballista", level: 1, object: null },
            { id: "ballista", level: 1, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
        ];

        // PILES
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];

        // DRAW CARDS
        this.cardsLeftToDraw = 0;
        this.cardsLeftToDiscard = 0;

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
    }

    // #################################################
    //   START COMBAT
    // #################################################

    #startCombat() {
        this.drawPile = [...this.deck];
        this.#updateUI();
        this.#drawCards(5);

        // setTimeout(() => {
        //     this.#discardCards(4);
        // }, 4000);
    }

    // #################################################
    //   DRAW CARDS
    // #################################################

    #drawCards(number) {
        this.cardsLeftToDraw = Math.min(number, this.deck.length);
        this.#drawNextCard();
    }

    #drawNextCard() {
        if (this.cardsLeftToDraw <= 0) return;
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
        --this.cardsLeftToDiscard;

        const card = this.hand.pop();
        card.object.discard();
        this.discardPile.push(card);

        this.#updateUI();
    }

    #cleanupAfterACardIsDiscarded() {
        for (let i = 0; i < this.discardPile.length; i++)
            if (this.discardPile[i].object && this.discardPile[i].object.discarded) this.discardPile[i].object = null;

        if (this.cardsLeftToDiscard <= 0) this.#updateCardsHandPositions();
        else this.#discardNextCard();
    }

    // #################################################
    //   HAND POSITIONS
    // #################################################

    #updateCardsHandPositions() {
        for (let i = 0; i < this.hand.length; i++)
            this.hand[i].object.updateHandPosition(i + this.cardsLeftToDraw, this.hand.length + this.cardsLeftToDraw);
    }

    // #################################################
    //   UI
    // #################################################

    #updateUI() {
        this.global.events.emit("updateDrawPile", this.drawPile.length);
        this.global.events.emit("updateDiscardPile", this.discardPile.length);
    }
}
