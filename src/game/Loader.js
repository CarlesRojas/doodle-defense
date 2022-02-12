import * as PIXI from "pixi.js";
import FontFaceObserver from "fontfaceobserver";

// BACKGROUND
import Background from "../resources/sprites/background/Background.png";

// CARDS
import Card_StructureCommon from "../resources/sprites/cards/Card_StructureCommon.png";
import Card_StructureEpic from "../resources/sprites/cards/Card_StructureEpic.png";
import Card_StructureRare from "../resources/sprites/cards/Card_StructureRare.png";
import Card_StructureLegendary from "../resources/sprites/cards/Card_StructureLegendary.png";
import Card_SkillCommon from "../resources/sprites/cards/Card_SkillCommon.png";
import Card_SkillEpic from "../resources/sprites/cards/Card_SkillEpic.png";
import Card_SkillRare from "../resources/sprites/cards/Card_SkillRare.png";
import Card_SkillLegendary from "../resources/sprites/cards/Card_SkillLegendary.png";
import Card_ModifierCommon from "../resources/sprites/cards/Card_ModifierCommon.png";
import Card_ModifierEpic from "../resources/sprites/cards/Card_ModifierEpic.png";
import Card_ModifierRare from "../resources/sprites/cards/Card_ModifierRare.png";
import Card_ModifierLegendary from "../resources/sprites/cards/Card_ModifierLegendary.png";
import Card_Mana from "../resources/sprites/cards/Card_Mana.png";
import Card_Shadow from "../resources/sprites/cards/Card_Shadow.png";
import Card_Back from "../resources/sprites/cards/Card_Back.png";

// EFFECTS
import Effect_Bolt from "../resources/sprites/effects/Effect_Bolt.png";

// ENEMIES
import Enemy_Rogue from "../resources/sprites/enemies/Enemy_Rogue.png";
import Enemy_Skeleton from "../resources/sprites/enemies/Enemy_Skeleton.png";
import Enemy_Soldier from "../resources/sprites/enemies/Enemy_Soldier.png";
import Enemy_Wolf from "../resources/sprites/enemies/Enemy_Wolf.png";

// MODIFIERS

// PLAZA
import Plaza_BottomLeft from "../resources/sprites/plaza/Plaza_BottomLeft.png";
import Plaza_BottomRight from "../resources/sprites/plaza/Plaza_BottomRight.png";
import Plaza_HorizontalBottom from "../resources/sprites/plaza/Plaza_HorizontalBottom.png";
import Plaza_HorizontalTop from "../resources/sprites/plaza/Plaza_HorizontalTop.png";
import Plaza_Point_BottomLeft from "../resources/sprites/plaza/Plaza_Point_BottomLeft.png";
import Plaza_Point_BottomRight from "../resources/sprites/plaza/Plaza_Point_BottomRight.png";
import Plaza_Point_TopLeft from "../resources/sprites/plaza/Plaza_Point_TopLeft.png";
import Plaza_Point_TopRight from "../resources/sprites/plaza/Plaza_Point_TopRight.png";
import Plaza_TopLeft from "../resources/sprites/plaza/Plaza_TopLeft.png";
import Plaza_TopRight from "../resources/sprites/plaza/Plaza_TopRight.png";
import Plaza_VerticalLeft from "../resources/sprites/plaza/Plaza_VerticalLeft.png";
import Plaza_VerticalRight from "../resources/sprites/plaza/Plaza_VerticalRight.png";
import Plaza_PointsRight from "../resources/sprites/plaza/Plaza_PointsRight.png";
import Plaza_PointsLeft from "../resources/sprites/plaza/Plaza_PointsLeft.png";
import Plaza_PointsTop from "../resources/sprites/plaza/Plaza_PointsTop.png";
import Plaza_PointsBottom from "../resources/sprites/plaza/Plaza_PointsBottom.png";
import Plaza_Left from "../resources/sprites/plaza/Plaza_Left.png";
import Plaza_Right from "../resources/sprites/plaza/Plaza_Right.png";
import Plaza_Top from "../resources/sprites/plaza/Plaza_Top.png";
import Plaza_Bottom from "../resources/sprites/plaza/Plaza_Bottom.png";

// SKILLS
import Skill_Fortify from "../resources/sprites/skills/Skill_Fortify.png";

// STRUCTURES
import Structure_Ballista from "../resources/sprites/structures/Structure_Ballista.png";

// TRACK
import Track_BottomLeft from "../resources/sprites/track/Track_BottomLeft.png";
import Track_BottomRight from "../resources/sprites/track/Track_BottomRight.png";
import Track_Horizontal from "../resources/sprites/track/Track_Horizontal.png";
import Track_TopLeft from "../resources/sprites/track/Track_TopLeft.png";
import Track_TopRight from "../resources/sprites/track/Track_TopRight.png";
import Track_Vertical from "../resources/sprites/track/Track_Vertical.png";

// UTILS
import Util_Border from "../resources/sprites/utils/Border.png";

export default class Loader {
    constructor(global, handleComplete) {
        this.global = global;
        this.handleComplete = handleComplete;

        PIXI.utils.clearTextureCache();

        this.loaded = {
            fonts: false,
            sprites: false,
        };

        this.#loadFonts();
        this.#loadBackground();
        this.#loadCards();
        this.#loadEffects();
        this.#loadEnemies();
        this.#loadModifiers();
        this.#loadPlaza();
        this.#loadSkills();
        this.#loadStructures();
        this.#loadTrack();
        this.#loadUtils();

        this.global.app.loader.onProgress.add(this.#handleLoadProgress.bind(this));
        this.global.app.loader.onComplete.add(this.#handleLoadComplete.bind(this));
        this.global.app.loader.onError.add(this.#handleLoadError.bind(this));

        this.global.app.loader.load();
    }

    destructor() {}

    // #################################################
    //   PROGRESS
    // #################################################

    #handleLoadProgress({ progress }, { name }) {
        // console.log(`${progress.toFixed(2)}% - ${name}`);
    }

    #handleLoadError(error) {
        // console.log(error);
    }

    #handleLoadComplete() {
        this.loaded.sprites = true;
        const finishedLoading = Object.values(this.loaded).reduce((prev, curr) => prev && curr, true);
        if (finishedLoading) this.handleComplete();
    }

    // #################################################
    //   FONT
    // #################################################

    async #loadFonts() {
        let handFont = new FontFaceObserver("Hand");
        await handFont.load();

        this.#handleLoadFontsComplete();
    }

    #handleLoadFontsComplete() {
        this.loaded.fonts = true;
        const finishedLoading = Object.values(this.loaded).reduce((prev, curr) => prev && curr, true);
        if (finishedLoading) this.handleComplete();
    }

    // #################################################
    //   MODULES
    // #################################################

    #loadBackground() {
        this.global.app.loader.add("background", Background);
    }

    #loadCards() {
        this.global.app.loader.add("card_structureCommon", Card_StructureCommon);
        this.global.app.loader.add("card_structureRare", Card_StructureRare);
        this.global.app.loader.add("card_structureEpic", Card_StructureEpic);
        this.global.app.loader.add("card_structureLegendary", Card_StructureLegendary);
        this.global.app.loader.add("card_skillCommon", Card_SkillCommon);
        this.global.app.loader.add("card_skillRare", Card_SkillRare);
        this.global.app.loader.add("card_skillEpic", Card_SkillEpic);
        this.global.app.loader.add("card_skillLegendary", Card_SkillLegendary);
        this.global.app.loader.add("card_modifierCommon", Card_ModifierCommon);
        this.global.app.loader.add("card_modifierRare", Card_ModifierRare);
        this.global.app.loader.add("card_modifierEpic", Card_ModifierEpic);
        this.global.app.loader.add("card_modifierLegendary", Card_ModifierLegendary);
        this.global.app.loader.add("card_mana", Card_Mana);
        this.global.app.loader.add("card_shadow", Card_Shadow);
        this.global.app.loader.add("card_back", Card_Back);
    }

    #loadEffects() {
        this.global.app.loader.add("effect_bolt", Effect_Bolt);
    }

    #loadEnemies() {
        this.global.app.loader.add("enemy_rogue", Enemy_Rogue);
        this.global.app.loader.add("enemy_skeleton", Enemy_Skeleton);
        this.global.app.loader.add("enemy_soldier", Enemy_Soldier);
        this.global.app.loader.add("enemy_wolf", Enemy_Wolf);
    }

    #loadModifiers() {}

    #loadPlaza() {
        this.global.app.loader.add("plaza_bottomLeft", Plaza_BottomLeft);
        this.global.app.loader.add("plaza_bottomRight", Plaza_BottomRight);
        this.global.app.loader.add("plaza_horizontalBottom", Plaza_HorizontalBottom);
        this.global.app.loader.add("plaza_horizontalTop", Plaza_HorizontalTop);
        this.global.app.loader.add("plaza_point_BottomLeft", Plaza_Point_BottomLeft);
        this.global.app.loader.add("plaza_point_BottomRight", Plaza_Point_BottomRight);
        this.global.app.loader.add("plaza_point_TopLeft", Plaza_Point_TopLeft);
        this.global.app.loader.add("plaza_point_TopRight", Plaza_Point_TopRight);
        this.global.app.loader.add("plaza_topLeft", Plaza_TopLeft);
        this.global.app.loader.add("plaza_topRight", Plaza_TopRight);
        this.global.app.loader.add("plaza_verticalLeft", Plaza_VerticalLeft);
        this.global.app.loader.add("plaza_verticalRight", Plaza_VerticalRight);
        this.global.app.loader.add("plaza_pointsRight", Plaza_PointsRight);
        this.global.app.loader.add("plaza_pointsLeft", Plaza_PointsLeft);
        this.global.app.loader.add("plaza_pointsTop", Plaza_PointsTop);
        this.global.app.loader.add("plaza_pointsBottom", Plaza_PointsBottom);
        this.global.app.loader.add("plaza_left", Plaza_Left);
        this.global.app.loader.add("plaza_right", Plaza_Right);
        this.global.app.loader.add("plaza_top", Plaza_Top);
        this.global.app.loader.add("plaza_bottom", Plaza_Bottom);
    }

    #loadSkills() {
        this.global.app.loader.add("skill_fortify", Skill_Fortify);
    }

    #loadStructures() {
        this.global.app.loader.add("structure_ballista", Structure_Ballista);
    }

    #loadTrack() {
        this.global.app.loader.add("track_bottomLeft", Track_BottomLeft);
        this.global.app.loader.add("track_bottomRight", Track_BottomRight);
        this.global.app.loader.add("track_horizontal", Track_Horizontal);
        this.global.app.loader.add("track_topLeft", Track_TopLeft);
        this.global.app.loader.add("track_topRight", Track_TopRight);
        this.global.app.loader.add("track_vertical", Track_Vertical);
    }

    #loadUtils() {
        this.global.app.loader.add("util_border", Util_Border);
    }
}
