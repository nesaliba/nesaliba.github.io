new ScitriadTileGame({
    title: "Predicting Ionic Compounds (IUPAC Names)",
    backUrl: "../../../../Chemistry.html",
    minWidth: 1000, // Provides enough horizontal space for 7 columns
    columns:["", "Li⁺", "Al⁺³", "Fe⁺²", "Fe⁺³", "Mg⁺²", "NH₄⁺"],
    rows:[
        "Br⁻", 
        "S⁻²", 
        "SO₄⁻²", 
        "PO₄⁻³", 
        "OH⁻¹", 
        "CO₃⁻²"
    ],
    data:[
        // --- Row 1: Br- ---
        { matchId: "li-br", text: "lithium bromide" },
        { matchId: "al-br", text: "aluminum bromide" },
        { matchId: "fe2-br", text: "iron(II) bromide" },
        { matchId: "fe3-br", text: "iron(III) bromide" },
        { matchId: "mg-br", text: "magnesium bromide" },
        { matchId: "nh4-br", text: "ammonium bromide" },

        // --- Row 2: S-2 ---
        { matchId: "li-s", text: "lithium sulfide" },
        { matchId: "al-s", text: "aluminum sulfide" },
        { matchId: "fe2-s", text: "iron(II) sulfide" },
        { matchId: "fe3-s", text: "iron(III) sulfide" },
        { matchId: "mg-s", text: "magnesium sulfide" },
        { matchId: "nh4-s", text: "ammonium sulfide" },

        // --- Row 3: SO4-2 ---
        { matchId: "li-so4", text: "lithium sulfate" },
        { matchId: "al-so4", text: "aluminum sulfate" },
        { matchId: "fe2-so4", text: "iron(II) sulfate" },
        { matchId: "fe3-so4", text: "iron(III) sulfate" },
        { matchId: "mg-so4", text: "magnesium sulfate" },
        { matchId: "nh4-so4", text: "ammonium sulfate" },

        // --- Row 4: PO4-3 ---
        { matchId: "li-po4", text: "lithium phosphate" },
        { matchId: "al-po4", text: "aluminum phosphate" },
        { matchId: "fe2-po4", text: "iron(II) phosphate" },
        { matchId: "fe3-po4", text: "iron(III) phosphate" },
        { matchId: "mg-po4", text: "magnesium phosphate" },
        { matchId: "nh4-po4", text: "ammonium phosphate" },

        // --- Row 5: OH-1 ---
        { matchId: "li-oh", text: "lithium hydroxide" },
        { matchId: "al-oh", text: "aluminum hydroxide" },
        { matchId: "fe2-oh", text: "iron(II) hydroxide" },
        { matchId: "fe3-oh", text: "iron(III) hydroxide" },
        { matchId: "mg-oh", text: "magnesium hydroxide" },
        { matchId: "nh4-oh", text: "ammonium hydroxide" },

        // --- Row 6: CO3-2 ---
        { matchId: "li-co3", text: "lithium carbonate" },
        { matchId: "al-co3", text: "aluminum carbonate" },
        { matchId: "fe2-co3", text: "iron(II) carbonate" },
        { matchId: "fe3-co3", text: "iron(III) carbonate" },
        { matchId: "mg-co3", text: "magnesium carbonate" },
        { matchId: "nh4-co3", text: "ammonium carbonate" }
    ]
});