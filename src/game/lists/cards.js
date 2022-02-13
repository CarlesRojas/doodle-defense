const CARDS = {
    ballista: {
        id: "ballista",
        type: "structure",
        name: ["Ballista", "Ballista +"],
        artID: "structure_ballista",
        mana: [1, 2],
        text: [
            "Fire a bolt every second. Each bolt deals 1 damage. <highlight>Exhaust</highlight>",
            "Fire a bolt every second. Each bolt deals 2 damage. <highlight>Exhaust</highlight>",
        ],
        popups: [null, null],
        rarity: 0,
    },
    fortify: {
        id: "fortify",
        type: "skill",
        name: ["Fortify", "Fortify +"],
        artID: "skill_fortify",
        mana: [3, 4],
        text: [
            "Add 1 <highlight>Fortification</highlight> to your tower.",
            "Add 2 <highlight>Fortification</highlight> to your tower.",
        ],
        popups: ["Fortification", "Fortification"],
        rarity: 3,
    },
};

export default CARDS;
