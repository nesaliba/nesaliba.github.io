export const gameData = {
    title: "Oxidation vs. Reduction",
    backUrl: "/Chemistry.html",
    minWidth: 600, // Reduced width since there are only 3 columns
    columns:["", "Oxidation", "Reduction"],
    rows:[
        "Definition", 
        "Abbreviation, acronym", 
        "Change in oxidation number", 
        "Example half-reaction A", 
        "Example half-reaction B", 
        "Process word example"
    ],
    data:[
        // --- Row 1: Definition ---
        { matchId: "def-ox", text: "substance loses electrons" },
        { matchId: "def-red", text: "substance gains electrons" },

        // --- Row 2: Abbreviation, acronym ---
        { matchId: "abbr-ox", text: "LEO" },
        { matchId: "abbr-red", text: "GER" },

        // --- Row 3: Change in oxidation number ---
        { matchId: "change-ox", text: "increase in oxidation state" },
        { matchId: "change-red", text: "decrease in oxidation state" },

        // --- Row 4: Example half-reaction A ---
        { matchId: "exA-ox", text: "Zn⁰ ➔ Zn²⁺ + 2e⁻" },
        { matchId: "exA-red", text: "Ag⁺ + e⁻ ➔ Ag⁰" },

        // --- Row 5: Example half-reaction B ---
        { matchId: "exB-ox", text: "2Cl⁻ ➔ Cl₂ + 2e⁻" },
        { matchId: "exB-red", text: "Br₂ + 2e⁻ ➔ 2Br⁻" },

        // --- Row 6: Process word example ---
        { matchId: "proc-ox", text: "iron metal changes to iron (II) cation" },
        { matchId: "proc-red", text: "gold (III) cation changes to gold metal" }
    ]
};