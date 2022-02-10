import * as PIXI from "pixi.js";
import MultiStyleText from "pixi-multistyle-text";
import CARDS from "./lists/cards";
import { capitalizeFirstLetter, degToRad } from "./Utils";

const CARD_WIDTH = 2.5; // CARD_WIDTH * cellsize = card width px
const ENTERING_SPEED = 40; // 1 cellsizes per second
const SPEED = 10; // 1 cellsizes per second

export default class Card {
    constructor(global, handContainer, id, level, handPosition, totalCardsInHand) {
        // PARENT ARGUMENTS
        this.global = global;
        this.handContainer = handContainer;
        this.cardInfo = CARDS[id];
        this.handPosition = handPosition;
        this.totalCardsInHand = totalCardsInHand;
        this.level = level;

        // CARD ELEMENTS
        this.elements = {
            art: null,
            artBorder: null,
            card: null,
            mana: null,
            manaNumber: null,
            name: null,
            type: null,
            description: null,
            shadow: null,
        };

        // INITIAL VALUES
        this.initialWidth = { art: 0, card: 0, mana: 0, shadow: 0 };
        this.initialHeight = { card: 0 };

        // ANIMATION
        this.animating = false;
        this.targetPosition = { x: 0, y: this.global.app.screen.height };
        this.targetAngleInDeg = 0;
        this.targetScale = 0;
        this.drawingCard = true;
        this.discardingCard = false;

        // CONTAINER
        this.container = new PIXI.Container();
        this.container.rotation = degToRad(this.targetAngleInDeg);
        this.container.position.set(this.targetPosition.x, this.targetPosition.y);
        this.container.scale.set(this.targetScale);
        this.container.zIndex = handPosition;
        this.container.interactive = false;
        this.handContainer.addChild(this.container);

        // HIGHLIGHT
        this.isHighlighted = false;
        this.highlightedCard = -1;

        // DRAG
        this.isReturningToHand = false;
        this.isMoving = false;

        // CREATE CARD
        this.#instantiateCard();

        // SUB TO EVENTS
        this.container.addEventListener("pointerenter", this.#handlePointerEnter.bind(this));
        this.container.addEventListener("pointerleave", this.#handlePointerLeave.bind(this));
        this.container.addEventListener("pointerdown", this.#handlePointerDown.bind(this));
        this.container.addEventListener("pointerup", this.#handlePointerUp.bind(this));
        this.container.addEventListener("pointerupoutside", this.#handlePointerUp.bind(this));

        this.global.events.sub("highlightCard", this.#highlightCard.bind(this));
    }

    destructor() {
        // UNSUB TFROM EVENTS
        this.container.removeEventListener("pointerenter", this.#handlePointerEnter.bind(this));
        this.container.removeEventListener("pointerleave", this.#handlePointerLeave.bind(this));
        this.container.removeEventListener("pointerdown", this.#handlePointerDown.bind(this));
        this.container.removeEventListener("pointerup", this.#handlePointerUp.bind(this));
        this.container.removeEventListener("pointerupoutside", this.#handlePointerUp.bind(this));
        this.container.removeEventListener("pointermove", this.#handlePointerMove.bind(this));
        this.global.events.unsub("highlightCard", this.#highlightCard.bind(this));
    }

    #instantiateCard() {
        const { type, name, artID, mana, text } = this.cardInfo;

        const whiteTextStyle = {
            fontFamily: "Hand",
            fill: "#ffffff",
            stroke: "#000000",
            align: "center",
        };

        const blackTextStyle = {
            fontFamily: "Hand",
            fill: "#2b2b2b",
            stroke: "#2b2b2b",
            align: "center",
        };

        const highlightTextStyle = {
            fontFamily: "Hand",
            fill: "#1c2687",
            stroke: "#1c2687",
            align: "center",
        };

        // SHADOW
        this.elements.shadow = PIXI.Sprite.from(this.global.app.loader.resources.card_shadow.texture);
        this.elements.shadow.anchor.set(0.5);
        this.elements.shadow.alpha = 0.5;
        this.initialWidth.shadow = this.elements.shadow.width;

        // CARD
        this.elements.card = PIXI.Sprite.from(this.global.app.loader.resources[this.#getCardID()].texture);
        this.elements.card.anchor.set(0.5);
        this.initialWidth.card = this.elements.card.width;
        this.initialHeight.card = this.elements.card.height;

        // ART
        this.elements.art = PIXI.Sprite.from(this.global.app.loader.resources[artID].texture);
        this.elements.art.anchor.set(0.5);
        this.initialWidth.art = this.elements.art.width;

        this.elements.artBorder = PIXI.Sprite.from(this.global.app.loader.resources.util_border.texture);
        this.elements.artBorder.anchor.set(0.5);

        // NAME
        this.elements.name = new PIXI.Text(name[this.level], whiteTextStyle);
        this.elements.name.anchor.set(0.5);

        // MANA
        this.elements.mana = PIXI.Sprite.from(this.global.app.loader.resources.card_mana.texture);
        this.elements.mana.anchor.set(0.5);
        this.initialWidth.mana = this.elements.mana.width;

        // MANA NUMBER
        this.elements.manaNumber = new PIXI.Text(mana[this.level], blackTextStyle);
        this.elements.manaNumber.anchor.set(0.5);

        // TYPE
        this.elements.type = new PIXI.Text(capitalizeFirstLetter(type), blackTextStyle);
        this.elements.type.anchor.set(0.5);

        // Description
        this.elements.description = new MultiStyleText(text[this.level], {
            default: blackTextStyle,
            highlight: highlightTextStyle,
        });
        this.elements.description.anchor.set(0.5);

        this.container.addChild(this.elements.shadow);
        this.container.addChild(this.elements.card);
        this.container.addChild(this.elements.art);
        // this.container.addChild(this.elements.artBorder);
        this.container.addChild(this.elements.name);
        this.container.addChild(this.elements.mana);
        this.container.addChild(this.elements.manaNumber);
        this.container.addChild(this.elements.type);
        this.container.addChild(this.elements.description);

        this.handleResize();
    }

    #getCardID() {
        const { type, rarity } = this.cardInfo;

        // Structure
        if (type === "structure") {
            if (rarity === 0) return "card_structureCommon";
            if (rarity === 1) return "card_structureRare";
            if (rarity === 2) return "card_structureEpic";
            return "card_structureLegendary";
        }

        // Skill
        if (type === "skill") {
            if (rarity === 0) return "card_skillCommon";
            if (rarity === 1) return "card_skillRare";
            if (rarity === 2) return "card_skillEpic";
            return "card_skillLegendary";
        }

        // Modifier
        if (rarity === 0) return "card_modifierCommon";
        if (rarity === 1) return "card_modifierRare";
        if (rarity === 2) return "card_modifierEpic";
        return "card_modifierLegendary";
    }

    // #################################################
    //   HOVER A CARD
    // #################################################

    #handlePointerEnter() {
        // console.log(`enter card: ${this.handPosition}`);

        this.global.events.emit("highlightCard", this.handPosition);
    }

    #handlePointerLeave() {
        // console.log(`leave card: ${this.handPosition}`);
    }

    #handlePointerDown() {
        if (this.isHighlighted) this.global.events.emit("highlightCard", -1);
        else this.global.events.emit("highlightCard", this.handPosition);

        this.isMoving = true;
        this.container.addEventListener("pointermove", this.#handlePointerMove.bind(this));

        // console.log(`click card: ${this.handPosition}`);
    }

    #handlePointerUp(event) {
        const { cellSize } = this.global.gameDimensions;

        // Stop moving
        this.isMoving = false;
        this.container.removeEventListener("pointermove", this.#handlePointerMove.bind(this));

        // Check if action is made or canceled
        if (event.global.y < this.global.app.screen.height - cellSize * 3) this.#discardThis();
        else this.isReturningToHand = true;
    }

    #handlePointerMove(event) {
        if (!this.isMoving) return;
        this.container.parent.toLocal(event.global, null, this.container.position);
    }

    #highlightCard(index) {
        if (this.drawingCard || this.discardingCard || this.isReturningToHand) return;

        this.isHighlighted = index === this.handPosition;
        this.highlightedCard = index;

        // Animate back
        this.#updateTargetPosition();
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        const { cellSize } = this.global.gameDimensions;

        // Shadow
        const shadowScaleFactor = (cellSize * CARD_WIDTH * 1.1) / this.initialWidth.shadow;
        this.elements.shadow.scale.set(shadowScaleFactor);
        this.elements.shadow.y = shadowScaleFactor * (25 + 12);
        this.elements.shadow.x = -shadowScaleFactor * 10;

        // Card
        const cardScaleFactor = (cellSize * CARD_WIDTH) / this.initialWidth.card;
        this.elements.card.scale.set(cardScaleFactor);
        this.elements.card.y = cardScaleFactor * 14;

        // Art
        const artScaleFactor = (cellSize * (CARD_WIDTH * 0.5)) / this.initialWidth.art;
        this.elements.artBorder.scale.set(artScaleFactor);
        this.elements.art.scale.set(artScaleFactor);

        // Name
        this.elements.name.style = {
            ...this.elements.name.style,
            strokeThickness: cardScaleFactor * 1.5,
            fontSize: cardScaleFactor * 8,
        };
        this.elements.name.y = -cardScaleFactor * 40;

        // Mana
        const manaScaleFactor = (cellSize * (CARD_WIDTH * 0.22)) / this.initialWidth.mana;
        this.elements.mana.scale.set(manaScaleFactor);
        this.elements.mana.interactive = false;
        this.elements.mana.x = -manaScaleFactor * 33;
        this.elements.mana.y = -manaScaleFactor * 40;

        // Mana number
        this.elements.manaNumber.style = {
            ...this.elements.manaNumber.style,
            strokeThickness: cardScaleFactor * 0.3,
            fontSize: cardScaleFactor * 10,
        };
        this.elements.manaNumber.interactive = false;
        this.elements.manaNumber.y = -cardScaleFactor * 39.5;
        this.elements.manaNumber.x = -cardScaleFactor * 33.3;

        // Type
        this.elements.type.style = {
            ...this.elements.type.style,
            strokeThickness: cardScaleFactor * 0.2,
            fontSize: cardScaleFactor * 5,
        };
        this.elements.type.y = cardScaleFactor * 34.3;

        // Description
        this.elements.description.textStyles.default = {
            ...this.elements.description.textStyles.default,
            strokeThickness: cardScaleFactor * 0.2,
            fontSize: cardScaleFactor * 6.5,
        };
        this.elements.description.textStyles.highlight = {
            ...this.elements.description.textStyles.highlight,
            strokeThickness: cardScaleFactor * 0.2,
            fontSize: cardScaleFactor * 6.5,
        };
        this.elements.description.style = {
            ...this.elements.description.style,
            wordWrap: true,
            wordWrapWidth: cellSize * 1.9,
        };
        this.elements.description.y = cardScaleFactor * 54.5;

        // Shadow

        this.#updateTargetPosition();
    }

    // #################################################
    //   ANIMATE
    // #################################################

    updateHandPosition(handPosition, totalCardsInHand) {
        this.handPosition = handPosition;
        this.totalCardsInHand = totalCardsInHand;

        this.#updateTargetPosition();
    }

    discard() {
        const { cellSize } = this.global.gameDimensions;
        const middleCard = Math.floor(this.totalCardsInHand / 2);
        const evenCards = this.totalCardsInHand % 2 === 0;
        const currentCardDisp = this.handPosition - middleCard;
        const heightDisp = middleCard > 0 ? 0.5 / middleCard : 0.5;

        this.discardingCard = true;
        this.isHighlighted = false;

        this.targetPosition = {
            x: this.global.app.screen.width,
            y:
                this.global.app.screen.height -
                cellSize * 0.5 +
                Math.abs(currentCardDisp + (evenCards && currentCardDisp < 0 ? 1 : 0)) * cellSize * heightDisp,
        };
        this.targetScale = 0;
        this.highlightedCard = -1;
        this.global.events.emit("highlightCard", -1);
    }

    #discardThis() {
        this.global.events.emit("discardCardAtIndex", this.handPosition);
    }

    #updateTargetPosition() {
        const { cellSize } = this.global.gameDimensions;

        const middleCard = Math.floor(this.totalCardsInHand / 2);
        const evenCards = this.totalCardsInHand % 2 === 0;
        const currentCardDisp = this.handPosition - middleCard;

        const overlap = Math.min(0.75, Math.max(0.25, 0.05 * this.totalCardsInHand));
        const heightDisp = middleCard > 0 ? 0.5 / middleCard : 0.5;

        const cardRatio = this.initialHeight.card / this.initialWidth.card;

        this.targetPosition = {
            x:
                this.global.app.screen.width / 2 + // Middle of horizontal screen
                currentCardDisp * cellSize * CARD_WIDTH * (1 - overlap) + // Displace left or right to spread the cards
                (evenCards ? (cellSize * CARD_WIDTH * (1 - overlap)) / 2 : 0) + // If the cards are even, no card in the middle
                (this.highlightedCard >= 0 && this.handPosition !== this.highlightedCard
                    ? cellSize * CARD_WIDTH * (overlap + 0.15) * (this.handPosition < this.highlightedCard ? -1 : 1)
                    : 0), // displace if there is a card selected to give it space
            y:
                this.global.app.screen.height + // Bottom of the screen
                (this.isHighlighted
                    ? -(cellSize * CARD_WIDTH * cardRatio * 0.75)
                    : -cellSize * 0.5 +
                      Math.abs(currentCardDisp + (evenCards && currentCardDisp < 0 ? 1 : 0)) * cellSize * heightDisp), // Move down the further away
        };

        this.targetAngleInDeg = this.isHighlighted
            ? 0
            : (10 / middleCard) * (currentCardDisp + (evenCards && currentCardDisp < 0 ? 1 : 0));

        this.targetScale = this.isHighlighted ? 1.2 : 1;

        // this.targetPosition = { x: this.global.app.screen.width / 2, y: this.global.app.screen.height / 2 };
        // this.targetAngleInDeg = 0;
        // this.targetScale = 1;
    }

    #animateCard(deltaTime) {
        if (this.isMoving) return;

        const { cellSize } = this.global.gameDimensions;
        let animating = false;
        const speed = this.drawingCard || this.discardingCard || this.isReturningToHand ? ENTERING_SPEED : SPEED;

        // ANIMATE POSITION
        const step = cellSize * speed * deltaTime;

        if (this.container.x > this.targetPosition.x)
            this.container.x = Math.max(this.targetPosition.x, this.container.x - step);
        else if (this.container.x < this.targetPosition.x)
            this.container.x = Math.min(this.targetPosition.x, this.container.x + step);

        if (this.container.y > this.targetPosition.y)
            this.container.y = Math.max(this.targetPosition.y, this.container.y - step);
        else if (this.container.y < this.targetPosition.y)
            this.container.y = Math.min(this.targetPosition.y, this.container.y + step);

        // ANIMATE ROTATION
        const rotationStep = speed * 0.1 * deltaTime;
        const angleInRad = degToRad(this.targetAngleInDeg);

        if (this.container.rotation > angleInRad)
            this.container.rotation = Math.max(angleInRad, this.container.rotation - rotationStep);
        else if (this.container.rotation < angleInRad)
            this.container.rotation = Math.min(angleInRad, this.container.rotation + rotationStep);

        // ANIMATE SCALE
        const scaleStep = speed * 0.0875 * deltaTime;

        if (this.container.scale.x > this.targetScale)
            this.container.scale.x = Math.max(this.targetScale, this.container.scale.x - scaleStep);
        else if (this.container.scale.x < this.targetScale)
            this.container.scale.x = Math.min(this.targetScale, this.container.scale.x + scaleStep);

        if (this.container.scale.y > this.targetScale)
            this.container.scale.y = Math.max(this.targetScale, this.container.scale.y - scaleStep);
        else if (this.container.scale.y < this.targetScale)
            this.container.scale.y = Math.min(this.targetScale, this.container.scale.y + scaleStep);

        // CHECK IF WE ARE ANIMATING
        if (
            this.container.x > this.targetPosition.x ||
            this.container.x < this.targetPosition.x ||
            this.container.y > this.targetPosition.y ||
            this.container.y < this.targetPosition.y ||
            this.container.rotation > angleInRad ||
            this.container.rotation < angleInRad ||
            this.container.scale.x > this.targetScale ||
            this.container.scale.x < this.targetScale ||
            this.container.scale.y > this.targetScale ||
            this.container.scale.y < this.targetScale
        )
            animating = true;

        // ANIMATION CHANGE STATE
        if (this.animating !== animating) {
            this.animating = animating;
            this.#animationChangeState();
        }
    }

    #animationChangeState() {
        // When the card finishes the draw animation
        if (!this.animating && this.drawingCard) {
            this.drawingCard = false;
            this.container.interactive = true;
            this.global.events.emit("cardDrawn");
        }

        // When the card finishes the discard animation
        if (!this.animating && this.discardingCard) {
            this.discardingCard = false;
            this.handContainer.removeChild(this.container);
            this.global.events.emit("cardDiscarded");
        }

        // When the card finishes returning to hand
        if (!this.animating && this.isReturningToHand) {
            this.isReturningToHand = false;
        }
    }

    #updateZIndex() {
        this.container.zIndex = this.isHighlighted || this.isMoving ? 100 : this.handPosition;
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.#animateCard(deltaTime);
        this.#updateZIndex();
    }
}
