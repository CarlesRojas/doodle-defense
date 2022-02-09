// AOE
import AOE_Corner from "../resources/sprites/aoe/AOE_Corner.png";
import AOE_DoublePoint from "../resources/sprites/aoe/AOE_DoublePoint.png";
import AOE_End from "../resources/sprites/aoe/AOE_End.png";
import AOE_Full from "../resources/sprites/aoe/AOE_Full.png";
import AOE_Point from "../resources/sprites/aoe/AOE_Point.png";
import AOE_Straight from "../resources/sprites/aoe/AOE_Straight.png";

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

export default class Loader {
    constructor(global, handleComplete) {
        this.global = global;

        // AOE
        this.global.app.loader.add("aoe_corner", AOE_Corner);
        this.global.app.loader.add("aoe_doublePoint", AOE_DoublePoint);
        this.global.app.loader.add("aoe_end", AOE_End);
        this.global.app.loader.add("aoe_full", AOE_Full);
        this.global.app.loader.add("aoe_point", AOE_Point);
        this.global.app.loader.add("aoe_straight", AOE_Straight);

        // BACKGROUND
        this.global.app.loader.add("background", Background);

        // CARDS
        this.global.app.loader.add("card_structureCommon", Card_StructureCommon);
        this.global.app.loader.add("card_structureEpic", Card_StructureEpic);
        this.global.app.loader.add("card_structureRare", Card_StructureRare);
        this.global.app.loader.add("card_structureLegendary", Card_StructureLegendary);
        this.global.app.loader.add("card_skillCommon", Card_SkillCommon);
        this.global.app.loader.add("card_skillEpic", Card_SkillEpic);
        this.global.app.loader.add("card_skillRare", Card_SkillRare);
        this.global.app.loader.add("card_skillLegendary", Card_SkillLegendary);
        this.global.app.loader.add("card_modifierCommon", Card_ModifierCommon);
        this.global.app.loader.add("card_modifierEpic", Card_ModifierEpic);
        this.global.app.loader.add("card_modifierRare", Card_ModifierRare);
        this.global.app.loader.add("card_modifierLegendary", Card_ModifierLegendary);

        // EFFECTS
        this.global.app.loader.add("effect_bolt", Effect_Bolt);

        // ENEMIES
        this.global.app.loader.add("enemy_rogue", Enemy_Rogue);
        this.global.app.loader.add("enemy_skeleton", Enemy_Skeleton);
        this.global.app.loader.add("enemy_soldier", Enemy_Soldier);
        this.global.app.loader.add("enemy_wolf", Enemy_Wolf);

        // MODIFIERS

        // PLAZA
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

        // SKILLS
        this.global.app.loader.add("skill_fortify", Skill_Fortify);

        // STRUCTURES
        this.global.app.loader.add("structure_ballista", Structure_Ballista);

        // TRACK
        this.global.app.loader.add("track_bottomLeft", Track_BottomLeft);
        this.global.app.loader.add("track_bottomRight", Track_BottomRight);
        this.global.app.loader.add("track_horizontal", Track_Horizontal);
        this.global.app.loader.add("track_topLeft", Track_TopLeft);
        this.global.app.loader.add("track_topRight", Track_TopRight);
        this.global.app.loader.add("track_vertical", Track_Vertical);

        this.global.app.loader.onProgress.add(this.#handleProgress.bind(this));
        this.global.app.loader.onComplete.add(handleComplete);
        this.global.app.loader.onError.add(this.#handleError.bind(this));

        this.global.app.loader.load();
    }

    // #################################################
    //   RESIZE
    // #################################################

    #handleProgress({ progress }, { name }) {
        console.log(`${progress.toFixed(2)}% - ${name}`);
    }

    #handleError(error) {
        // console.log(error);
    }
}
