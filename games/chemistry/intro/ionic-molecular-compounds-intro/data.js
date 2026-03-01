new ScitriadTileGame({
    title: "Ionic & Molecular Compounds",
    backUrl: "/Chemistry.html",
    minWidth: 1000, // Make it wide enough to comfortably fit 7 columns
    columns:["", "H₂O", "P₄O₁₀", "MgS", "CO₂", "CCl₄", "NaBr"],
    rows:[
        "Name of Elements", 
        "Number of Atoms", 
        "Type of Element Combo", 
        "Ionic or Molecular Compound", 
        "IUPAC Name", 
        "Chemical Bond Type"
    ],
    data:[
        // --- Row 1: Name of Elements ---
        { matchId: "name-ho", text: "hydrogen oxygen" },
        { matchId: "name-po", text: "phosphorus oxygen" },
        { matchId: "name-mgs", text: "magnesium sulfur" },
        { matchId: "name-co", text: "carbon oxygen" },
        { matchId: "name-ccl", text: "carbon chlorine" },
        { matchId: "name-nabr", text: "sodium bromine" },

        // --- Row 2: Number of Atoms ---
        // Duplicate text uses the same matchId so they can be placed interchangeably
        { matchId: "atoms-3", text: "3 atoms" },
        { matchId: "atoms-14", text: "14 atoms" },
        { matchId: "atoms-2", text: "2 atoms" },
        { matchId: "atoms-3", text: "3 atoms" },
        { matchId: "atoms-5", text: "5 atoms" },
        { matchId: "atoms-2", text: "2 atoms" },

        // --- Row 3: Type of Element Combo ---
        { matchId: "combo-nm", text: "non-metals only" },
        { matchId: "combo-nm", text: "non-metals only" },
        { matchId: "combo-m-nm", text: "metal non-metal combo" },
        { matchId: "combo-nm", text: "non-metals only" },
        { matchId: "combo-nm", text: "non-metals only" },
        { matchId: "combo-m-nm", text: "metal non-metal combo" },

        // --- Row 4: Ionic or Molecular Compound ---
        { matchId: "comp-mol", text: "molecular compound" },
        { matchId: "comp-mol", text: "molecular compound" },
        { matchId: "comp-ion", text: "ionic compound" },
        { matchId: "comp-mol", text: "molecular compound" },
        { matchId: "comp-mol", text: "molecular compound" },
        { matchId: "comp-ion", text: "ionic compound" },

        // --- Row 5: IUPAC Name ---
        { matchId: "iupac-water", text: "water" },
        { matchId: "iupac-p4o10", text: "tetraphosphorus decaoxide" },
        { matchId: "iupac-mgs", text: "magnesium sulfide" },
        { matchId: "iupac-co2", text: "carbon dioxide" },
        { matchId: "iupac-ccl4", text: "carbon tetrachloride" },
        { matchId: "iupac-nabr", text: "sodium bromide" },

        // --- Row 6: Chemical Bond Type ---
        { matchId: "bond-cov", text: "covalent bond (share e-)" },
        { matchId: "bond-cov", text: "covalent bond (share e-)" },
        { matchId: "bond-ion", text: "ionic bond (transfer e-)" },
        { matchId: "bond-cov", text: "covalent bond (share e-)" },
        { matchId: "bond-cov", text: "covalent bond (share e-)" },
        { matchId: "bond-ion", text: "ionic bond (transfer e-)" }
    ]
});