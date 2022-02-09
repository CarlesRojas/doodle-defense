import * as PIXI from "pixi.js";
import Card from "./Card";

export default class Deck {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.global.app.stage.addChild(this.container);

        this.deck = [
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "fortify", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
            { id: "ballista", level: 0, object: null },
        ];

        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];

        this.#startCombat();
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

    gameLoop(deltaTime) {}

    // #################################################
    //   START COMBAT
    // #################################################

    #startCombat() {
        this.drawPile = [...this.deck];
        this.#drawCards(6);
    }

    // #################################################
    //   DRAW CARD
    // #################################################

    #drawCards(number) {
        for (let i = 0; i < number; i++) {
            const randomCard = Math.floor(Math.random() * this.drawPile.length);

            const card = this.drawPile.splice(randomCard, 1)[0];
            card.object = new Card(this.global, this.container, card.id, card.level, 0, this.hand.length + 1);
            this.hand.unshift(card);
        }

        this.#updateCardsHandPositions();
    }

    #updateCardsHandPositions() {
        for (let i = 0; i < this.hand.length; i++) this.hand[i].object.updateHandPosition(i, this.hand.length);
    }
}
