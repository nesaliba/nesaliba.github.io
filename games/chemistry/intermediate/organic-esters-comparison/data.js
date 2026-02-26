new ScitriadTileGame({
    title: "Organic Chemistry: Esters",
    backUrl: "../../../../Chemistry.html",
    minWidth: 1100, // Make it wide enough to comfortably fit 7 columns
    columns:[
        "", 
        "<div style='line-height:1.2'><b>Methyl ethanoate</b><br><small>CH₃COOCH₃</small></div>", 
        "<div style='line-height:1.2'><b>Ethyl methanoate</b><br><small>HCOOCH₂CH₃</small></div>", 
        "<div style='line-height:1.2'><b>Propyl ethanoate</b><br><small>CH₃COOCH₂CH₂CH₃</small></div>", 
        "<div style='line-height:1.2'><b>Ethyl propanoate</b><br><small>CH₃CH₂COOCH₂CH₃</small></div>", 
        "<div style='line-height:1.2'><b>Pentyl ethanoate</b><br><small>CH₃COO(CH₂)₄CH₃</small></div>", 
        "<div style='line-height:1.2'><b>Ethyl pentanoate</b><br><small>CH₃(CH₂)₃COOCH₂CH₃</small></div>"
    ],
    rows:[
        "Chemical Formula", 
        "IUPAC Name", 
        "Carboxylic Acid R-COOH", 
        "# carbons carboxylic acid", 
        "Alcohol R-OH", 
        "# carbons alcohol"
    ],
    data:[
        // --- Row 1: Chemical Formula ---
        // Duplicate text uses the same matchId so they can be placed interchangeably
        { matchId: "f-c3h6o2", text: "C₃H₆O₂" },
        { matchId: "f-c3h6o2", text: "C₃H₆O₂" },
        { matchId: "f-c5h10o2", text: "C₅H₁₀O₂" },
        { matchId: "f-c5h10o2", text: "C₅H₁₀O₂" },
        { matchId: "f-c7h14o2", text: "C₇H₁₄O₂" },
        { matchId: "f-c7h14o2", text: "C₇H₁₄O₂" },

        // --- Row 2: IUPAC Name ---
        { matchId: "n-methylethanoate", text: "methylethanoate" },
        { matchId: "n-ethylmethanoate", text: "ethylmethanoate" },
        { matchId: "n-propylethanoate", text: "propylethanoate" },
        { matchId: "n-ethylpropanoate", text: "ethylpropanoate" },
        { matchId: "n-pentylethanoate", text: "pentylethanoate" },
        { matchId: "n-ethylpentanoate", text: "ethylpentanoate" },

        // --- Row 3: Carboxylic Acid R-COOH ---
        { matchId: "a-ethanoic", text: "ethanoic acid" },
        { matchId: "a-methanoic", text: "methanoic acid" },
        { matchId: "a-ethanoic", text: "ethanoic acid" },
        { matchId: "a-propanoic", text: "propanoic acid" },
        { matchId: "a-ethanoic", text: "ethanoic acid" },
        { matchId: "a-pentanoic", text: "pentanoic acid" },

        // --- Row 4: # carbons carboxylic acid ---
        { matchId: "ca-2c", text: "2C acid" },
        { matchId: "ca-1c", text: "1C acid" },
        { matchId: "ca-2c", text: "2C acid" },
        { matchId: "ca-3c", text: "3C acid" },
        { matchId: "ca-2c", text: "2C acid" },
        { matchId: "ca-5c", text: "5C acid" },

        // --- Row 5: Alcohol R-OH ---
        { matchId: "al-methanol", text: "methanol" },
        { matchId: "al-ethanol", text: "ethanol" },
        { matchId: "al-propan1ol", text: "propan-1-ol" },
        { matchId: "al-ethanol", text: "ethanol" },
        { matchId: "al-pentan1ol", text: "pentan-1-ol" },
        { matchId: "al-ethanol", text: "ethanol" },

        // --- Row 6: # carbons alcohol ---
        { matchId: "alc-1c", text: "1C alcohol" },
        { matchId: "alc-2c", text: "2C alcohol" },
        { matchId: "alc-3c", text: "3C alcohol" },
        { matchId: "alc-2c", text: "2C alcohol" },
        { matchId: "alc-5c", text: "5C alcohol" },
        { matchId: "alc-2c", text: "2C alcohol" }
    ]
});