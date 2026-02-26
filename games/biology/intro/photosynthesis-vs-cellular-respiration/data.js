new ScitriadTileGame({
    title: "Photosynthesis vs. Cellular Respiration",
    backUrl: "../../../../Biology.html",
    minWidth: 700, // Wide enough to comfortably fit the 3 columns with detailed text
    columns:["", "Photosynthesis", "Cellular Respiration"],
    rows:[
        "Cell organelle where the reaction occurs", 
        "Produces or Absorbs Energy (exothermic or endothermic)", 
        "How glucose is involved in the reaction", 
        "Chemical Reaction", 
        "Diagram of organelle where process occurs", 
        "Process Description"
    ],
    data:[
        // --- Row 1: Cell organelle where the reaction occurs ---
        { matchId: "org-photo", text: "Chloroplast" },
        { matchId: "org-resp", text: "Mitochondria" },

        // --- Row 2: Produces or Absorbs Energy ---
        { matchId: "energy-photo", text: "Absorbs energy, endothermic" },
        { matchId: "energy-resp", text: "Releases or produces energy, exothermic" },

        // --- Row 3: How glucose is involved in the reaction ---
        { matchId: "gluc-photo", text: "Glucose produced by plant" },
        { matchId: "gluc-resp", text: "Glucose burned or converted into other forms of energy" },

        // --- Row 4: Chemical Reaction ---
        { matchId: "rxn-photo", text: "<u>6</u>CO₂(g) + <u>6</u>H₂O(l)<br>➔<br><u>1</u>C₆H₁₂O₆(s) + <u>6</u>O₂(g)" },
        { matchId: "rxn-resp", text: "1C₆H₁₂O₆(s) + <u>6</u>O₂(g)<br>➔<br><u>6</u>CO₂(g) + <u>6</u>H₂O(l)" },

        // --- Row 5: Diagram of organelle where process occurs ---
        { matchId: "diag-photo", text: '<img src="chloroplast.jpg" alt="Chloroplast Diagram" style="max-width: 100%; max-height: 100px; object-fit: contain; border-radius: 4px;">' },
        { matchId: "diag-resp", text: '<img src="mitochondria.jpg" alt="Mitochondria Diagram" style="max-width: 100%; max-height: 100px; object-fit: contain; border-radius: 4px;">' },

        // --- Row 6: Process Description ---
        { matchId: "desc-photo", text: "<small>Solar energy, carbon dioxide gas and water are converted into glucose and oxygen gas by plants</small>" },
        { matchId: "desc-resp", text: "<small>Glucose and oxygen are converted into carbon dioxide, water, and energy such as ATP to perform cells functions</small>" }
    ]
});