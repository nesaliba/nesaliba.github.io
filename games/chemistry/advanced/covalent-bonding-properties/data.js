new ScitriadTileGame({
    title: "Advanced Covalent Bonding Properties",
    backUrl: "/Chemistry.html",
    minWidth: 1000, 
    columns:["", "NH₃", "CH₃OH", "C₂H₄", "BH₃", "C₂H₂", "CH₃COOH"],
    rows:[
        "Structural Diagram", 
        "Steric Number", 
        "Number of pi or sigma bonds", 
        "Lone Pairs & Bonding Pairs", 
        "Hybridization Type (sp, sp², sp³)", 
        "VSEPR Shape"
    ],
    data:[
        // --- Row 1: Structural Diagram ---
        { matchId: "diag-nh3", text: "NH₃ Diagram" },
        { matchId: "diag-ch3oh", text: "CH₃OH Diagram" },
        { matchId: "diag-c2h4", text: "C₂H₄ Diagram" },
        { matchId: "diag-bh3", text: "BH₃ Diagram" },
        { matchId: "diag-c2h2", text: "C₂H₂ Diagram" },
        { matchId: "diag-ch3cooh", text: "CH₃COOH Diagram" },

        // --- Row 2: Steric Number ---
        { matchId: "steric-4", text: "Steric 4" },
        { matchId: "steric-4", text: "Steric 4" },
        { matchId: "steric-3", text: "Steric 3" },
        { matchId: "steric-3", text: "Steric 3" },
        { matchId: "steric-2", text: "Steric 2" },
        { matchId: "steric-3-4", text: "Steric 3<br>Steric 4" },

        // --- Row 3: Number of pi or sigma bonds ---
        { matchId: "bonds-3s", text: "3σ" },
        { matchId: "bonds-5s", text: "5σ" },
        { matchId: "bonds-5s1p", text: "5σ<br>1π" },
        { matchId: "bonds-3s", text: "3σ" },
        { matchId: "bonds-3s2p", text: "3σ<br>2π" }, // Filled in missing data
        { matchId: "bonds-7s1p", text: "7σ<br>1π" },

        // --- Row 4: Lone Pairs Bonding Pairs ---
        { matchId: "pairs-nh3", text: "3 bonding pairs<br>1 lone pair" },
        { matchId: "pairs-ch3oh", text: "<small>4 bonding pairs around C<br>2 lone pairs, 2 bonding pairs around O</small>" },
        { matchId: "pairs-c2h4", text: "3 bonding regions<br>0 lone pairs" },
        { matchId: "pairs-bh3", text: "3 bonding pairs" },
        { matchId: "pairs-c2h2", text: "2 bonding regions" },
        { matchId: "pairs-ch3cooh", text: "<small>4 bonding pairs around C<br>3 bonding regions around C<br>2 bonding pairs, 2 lone pairs around O</small>" },

        // --- Row 5: Hybridization Type sp, sp², sp³ ---
        { matchId: "hyb-sp3", text: "sp³" }, // Filled in missing data
        { matchId: "hyb-sp3", text: "sp³" },
        { matchId: "hyb-sp2", text: "sp²" },
        { matchId: "hyb-sp2", text: "sp²" },
        { matchId: "hyb-sp", text: "sp" },
        { matchId: "hyb-sp3sp2", text: "sp³<br>sp²" },

        // --- Row 6: VSEPR Shape ---
        { matchId: "shape-trigpyr", text: "trigonal pyramidal" },
        { matchId: "shape-ch3oh", text: "tetrahedral (C)<br>angular/bent (O)" },
        { matchId: "shape-trigplanar", text: "trigonal planar" },
        { matchId: "shape-trigplanar", text: "trigonal planar" },
        { matchId: "shape-linear", text: "linear" },
        { matchId: "shape-ch3cooh", text: "tetrahedral<br>trigonal planar<br>bent" } // Filled in missing data
    ]
});