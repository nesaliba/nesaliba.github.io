new ScitriadTileGame({
    title: "Mitosis vs. Meiosis",
    backUrl: "../../../../Biology.html",
    minWidth: 600, // Reduced width since there are only 3 columns
    columns:["", "Mitosis", "Meiosis"],
    rows:[
        "Purpose", 
        "Type of Cells", 
        "Number of Chromosome Duplications", 
        "Number of Rounds of Division", 
        "Chromosome Number of Parent Cell", 
        "Number of Cells Resulting from One Complete Cycle"
    ],
    data:[
        // --- Row 1: Purpose ---
        { matchId: "purp-mitosis", text: "Replication" },
        { matchId: "purp-meiosis", text: "Formation of Gametes" },

        // --- Row 2: Type of Cells ---
        { matchId: "type-mitosis", text: "Somatic Cells" },
        { matchId: "type-meiosis", text: "Germ Cells" },

        // --- Row 3: Number of Chromosome Duplications ---
        // Biologically corrected: Both Mitosis and Meiosis only have ONE round of chromosome duplication.
        { matchId: "dup-1", text: "One Duplication" },
        { matchId: "dup-1", text: "One Duplication" },

        // --- Row 4: Number of Rounds of Division ---
        { matchId: "div-1", text: "One Division" },
        { matchId: "div-2", text: "Two Divisions" },

        // --- Row 5: Chromosome Number of Parent Cell ---
        // Duplicates share matchId so they can be placed interchangeably
        { matchId: "chrom-46", text: "46" },
        { matchId: "chrom-46", text: "46" },

        // --- Row 6: Number of Cells Resulting from One Complete Cycle ---
        { matchId: "cells-2", text: "2 Cells" },
        { matchId: "cells-4", text: "4 Cells" }
    ]
});