const CARDS = {
    ballista: {
        id: "ballista",
        type: "structure",
        name: ["Ballista", "Ballista +"],
        artID: "structure_ballista",
        mana: [1, 1],
        text: [
            "Fire a bolt every second. Each bolt deals 1 damage.",
            "Fire a bolt every second. Each bolt deals 2 damage.",
        ],
        popups: [null, null],
        rarity: 0,
    },
    fortify: {
        id: "fortify",
        type: "skill",
        name: ["Fortify", "Fortify +"],
        artID: "skill_fortify",
        mana: [1, 1],
        text: [
            "Add 1 <highlight>Fortification</highlight> to your tower.",
            "Add 2 <highlight>Fortification</highlight> to your tower.",
        ],
        popups: ["Fortification", "Fortification"],
        rarity: 0,
    },
};

export default CARDS;
