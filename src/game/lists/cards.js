export const CARDS = [
    {
        id: "ballista",
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
    {
        id: "fortify",
        name: ["Fortify", "Fortify +"],
        artID: "skill_fortify",
        mana: [1, 1],
        text: ["Add 1 Fortification to your tower.", "Add 2 Fortification to your tower."],
        popups: ["Fortification", "Fortification"],
        rarity: 0,
    },
];

export const CARDS_DICT = {
    ballista: 0,
    fortify: 1,
};
