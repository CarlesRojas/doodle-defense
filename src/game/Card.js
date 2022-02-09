import * as PIXI from "pixi.js";
import MultiStyleText from "pixi-multistyle-text";
import CARDS from "./lists/cards";
import { capitalizeFirstLetter } from "./Utils";

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
            name: null,
            type: null,
            description: null,
        };
        this.initialWidth = { art: 0, card: 0 };

        // ANIMATION
        this.animating = false;
        this.targetPosition = { x: 0, y: this.global.app.screen.height };
        this.targetRotation = 0;
        this.targetScale = 0;
        this.drawingCard = true;
        this.discardingCard = false;

        // CONTAINER
        this.container = new PIXI.Container();
        this.container.angle = this.targetRotation;
        this.container.position.set(this.targetPosition.x, this.targetPosition.y);
        this.container.scale.set(this.targetScale);
        this.container.zIndex = handPosition;
        this.handContainer.addChild(this.container);

        // CREATE CARD
        this.#instantiateCard();
    }

    destructor() {}

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

        // CARD
        this.elements.card = PIXI.Sprite.from(this.global.app.loader.resources[this.#getCardID()].texture);
        this.elements.card.anchor.set(0.5);
        this.initialWidth.card = this.elements.card.width;

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
        this.elements.mana = new PIXI.Text(mana[this.level], blackTextStyle);
        this.elements.mana.anchor.set(0.5);

        // TYPE
        this.elements.type = new PIXI.Text(capitalizeFirstLetter(type), blackTextStyle);
        this.elements.type.anchor.set(0.5);

        // Description
        this.elements.description = new MultiStyleText(text[this.level], {
            default: blackTextStyle,
            highlight: highlightTextStyle,
        });
        this.elements.description.anchor.set(0.5);

        this.container.addChild(this.elements.card);
        this.container.addChild(this.elements.art);
        // this.container.addChild(this.elements.artBorder);
        this.container.addChild(this.elements.name);
        this.container.addChild(this.elements.mana);
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
    //   RESIZE
    // #################################################

    handleResize() {
        const { cellSize } = this.global.gameDimensions;

        // Card
        const cardScaleFactor = (cellSize * CARD_WIDTH) / this.initialWidth.card;
        this.elements.card.scale.set(cardScaleFactor);
        this.elements.card.x = -cardScaleFactor * 1;
        this.elements.card.y = cardScaleFactor * 14;

        // Art
        const artScaleFactor = (cellSize * (CARD_WIDTH / 2)) / this.initialWidth.art;
        this.elements.artBorder.scale.set(artScaleFactor);
        this.elements.art.scale.set(artScaleFactor);

        // Name
        this.elements.name.style = {
            ...this.elements.name.style,
            strokeThickness: cardScaleFactor * 1.5,
            fontSize: cardScaleFactor * 8,
        };
        this.elements.name.y = -cardScaleFactor * 39;

        // Mana
        this.elements.mana.style = {
            ...this.elements.mana.style,
            strokeThickness: cardScaleFactor * 0.3,
            fontSize: cardScaleFactor * 10,
        };
        this.elements.mana.y = -cardScaleFactor * 39.5;
        this.elements.mana.x = -cardScaleFactor * 33.3;

        // Type
        this.elements.type.style = {
            ...this.elements.type.style,
            strokeThickness: cardScaleFactor * 0.2,
            fontSize: cardScaleFactor * 5,
        };
        this.elements.type.y = cardScaleFactor * 34.6;

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
        this.elements.description.y = cardScaleFactor * 55;

        this.#updateTargetPosition();
    }

    // #################################################
    //   ANIMATE
    // #################################################

    updateHandPosition(handPosition, totalCardsInHand) {
        this.handPosition = handPosition;
        this.totalCardsInHand = totalCardsInHand;
        this.container.zIndex = handPosition;

        this.#updateTargetPosition();
    }

    discard() {
        this.discardingCard = true;
        this.targetPosition = { ...this.targetPosition, x: this.global.app.screen.width };
        this.targetScale = 0;
    }

    #updateTargetPosition() {
        const { cellSize } = this.global.gameDimensions;

        const middleCard = Math.floor(this.totalCardsInHand / 2);
        const evenCards = this.totalCardsInHand % 2 === 0;
        const currentCardDisp = this.handPosition - middleCard;

        const overlap = Math.min(0.75, Math.max(0.25, 0.05 * this.totalCardsInHand));
        const heightDisp = 0.5 / middleCard;

        this.targetPosition = {
            x:
                this.global.app.screen.width / 2 +
                currentCardDisp * cellSize * CARD_WIDTH * (1 - overlap) +
                (evenCards ? (cellSize * CARD_WIDTH * (1 - overlap)) / 2 : 0),
            y:
                this.global.app.screen.height -
                cellSize * 0.5 +
                Math.abs(currentCardDisp + (evenCards && currentCardDisp < 0 ? 1 : 0)) * cellSize * heightDisp,
        };

        this.targetRotation = (10 / middleCard) * (currentCardDisp + (evenCards && currentCardDisp < 0 ? 1 : 0));

        this.targetScale = 1;
    }

    #animateCard(deltaTime) {
        const { cellSize } = this.global.gameDimensions;
        let animating = false;
        const speed = this.drawingCard || this.discardingCard ? ENTERING_SPEED : SPEED;

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
        const rotationStep = speed * 5 * deltaTime;

        if (this.container.angle > this.targetRotation)
            this.container.angle = Math.max(this.targetRotation, this.container.angle - rotationStep);
        else if (this.container.angle < this.targetRotation)
            this.container.angle = Math.min(this.targetRotation, this.container.angle + rotationStep);

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
            this.container.angle > this.targetRotation ||
            this.container.angle < this.targetRotation ||
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
            this.global.events.emit("cardDrawn");
        }

        if (!this.animating && this.discardingCard) {
            this.discardingCard = false;
            this.handContainer.removeChild(this.container);
            this.global.events.emit("cardDiscarded");
        }
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {
        this.#animateCard(deltaTime);
    }
}
