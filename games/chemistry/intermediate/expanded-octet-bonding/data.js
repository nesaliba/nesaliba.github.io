new ScitriadTileGame({
    title: "Expanded Octet Bonding (Steric 5 & 6)",
    backUrl: "../../../../Chemistry.html",
    minWidth: 1100, // Make it wide enough to comfortably fit 7 columns
    columns:["", "SF₆", "ClF₃", "PCl₅", "BrF₅", "SF₄", "XeF₄"],
    rows:[
        "Lewis or Structural Diagram", 
        "Steric Number", 
        "Number of pi or sigma bonds", 
        "Lone Pairs Bonding Pairs", 
        "Hybridization Type sp, sp², sp³", 
        "VSEPR Shape"
    ],
    data:[
        // --- Row 1: Lewis or Structural Diagram ---
        { matchId: "diag-sf6", text: "SF₆ Diagram" },
        { matchId: "diag-clf3", text: "ClF₃ Diagram" },
        { matchId: "diag-pcl5", text: "PCl₅ Diagram" },
        { matchId: "diag-brf5", text: "BrF₅ Diagram" },
        { matchId: "diag-sf4", text: "SF₄ Diagram" },
        { matchId: "diag-xef4", text: "XeF₄ Diagram" },

        // --- Row 2: Steric Number ---
        // Duplicate text uses the same matchId so they can be placed interchangeably
        { matchId: "steric-6", text: "Steric 6" },
        { matchId: "steric-5", text: "Steric 5" },
        { matchId: "steric-5", text: "Steric 5" },
        { matchId: "steric-6", text: "Steric 6" },
        { matchId: "steric-5", text: "Steric 5" },
        { matchId: "steric-6", text: "Steric 6" },

        // --- Row 3: Number of pi or sigma bonds ---
        { matchId: "bond-6s", text: "6σ" },
        { matchId: "bond-3s", text: "3σ" },
        { matchId: "bond-5s", text: "5σ" },
        { matchId: "bond-5s", text: "5σ" },
        { matchId: "bond-4s", text: "4σ" },
        { matchId: "bond-4s", text: "4σ" },

        // --- Row 4: Lone Pairs Bonding Pairs ---
        { matchId: "pairs-6b", text: "6 bonding pairs" },
        { matchId: "pairs-3b2l", text: "3 bonding pairs, 2 lone pairs" },
        { matchId: "pairs-5b", text: "5 bonding pairs" },
        { matchId: "pairs-5b1l", text: "5 bonding pairs, 1 lone pair" },
        { matchId: "pairs-4b1l", text: "4 bonding pairs, 1 lone pair" },
        { matchId: "pairs-4b2l", text: "4 bonding pairs, 2 lone pairs" },

        // --- Row 5: Hybridization Type sp, sp², sp³ ---
        { matchId: "hyb-sp3d2", text: "sp³d²" },
        { matchId: "hyb-sp3d", text: "sp³d" },
        { matchId: "hyb-sp3d", text: "sp³d" },
        { matchId: "hyb-sp3d2", text: "sp³d²" },
        { matchId: "hyb-sp3d", text: "sp³d" },
        { matchId: "hyb-sp3d2", text: "sp³d²" },

        // --- Row 6: VSEPR Shape ---
        { matchId: "shape-octa", text: "octahedral" },
        { matchId: "shape-t", text: "T-shape" },
        { matchId: "shape-trigbipyr", text: "trigonal bipyramidal" },
        { matchId: "shape-sqpyr", text: "square pyramidal" },
        { matchId: "shape-seesaw", text: "see-saw, irregular tetrahedron" },
        { matchId: "shape-sqplanar", text: "square planar" }
    ]
});