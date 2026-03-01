export const gameData = {
    title: "Mitosis vs. Meiosis",
    backUrl: "/Biology.html",
    minWidth: 600,
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
        { matchId: "purp-mitosis", text: "Replication" },
        { matchId: "purp-meiosis", text: "Formation of Gametes" },
        { matchId: "type-mitosis", text: "Somatic Cells" },
        { matchId: "type-meiosis", text: "Germ Cells" },
        { matchId: "dup-1", text: "One Duplication" },
        { matchId: "dup-1", text: "One Duplication" },
        { matchId: "div-1", text: "One Division" },
        { matchId: "div-2", text: "Two Divisions" },
        { matchId: "chrom-46", text: "46" },
        { matchId: "chrom-46", text: "46" },
        { matchId: "cells-2", text: "2 Cells" },
        { matchId: "cells-4", text: "4 Cells" }
    ]
};