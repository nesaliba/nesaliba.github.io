new ScitriadTileGame({
    title: "Endothermic vs. Exothermic",
    backUrl: "/Chemistry.html",
    minWidth: 600, // Reduced width since there are only 3 columns
    columns:["", "Endothermic", "Exothermic"],
    rows:[
        "Heat released or absorbed", 
        "Sensation noticed by the observer", 
        "Energy Comparison of Reactant and Product", 
        "Chemical reaction with enthalpy change", 
        "Thermometer Reading", 
        "Potential Energy Diagram"
    ],
    data:[
        // --- Row 1: Heat released or absorbed ---
        { matchId: "heat-endo", text: "heat absorbed" },
        { matchId: "heat-exo", text: "heat released or produced" },

        // --- Row 2: Sensation noticed by the observer ---
        { matchId: "sens-endo", text: "cooling sensation" },
        { matchId: "sens-exo", text: "warming sensation" },

        // --- Row 3: Energy Comparison of Reactant and Product ---
        { matchId: "energy-endo", text: "Product energy higher than reactant energy" },
        { matchId: "energy-exo", text: "Reactant energy higher than product energy" },

        // --- Row 4: Chemical reaction with enthalpy change ---
        { matchId: "rxn-endo", text: "A + B ➔ C + D <br> ΔH>0, positive" },
        { matchId: "rxn-exo", text: "A + B ➔ C + D <br> ΔH<0, negative" },

        // --- Row 5: Thermometer Reading ---
        { matchId: "therm-endo", text: "thermometer reading decreases" },
        { matchId: "therm-exo", text: "thermometer reading increases" },

        // --- Row 6: Potential Energy Diagram ---
        { matchId: "pe-endo", text: '<img src="endo pe diagram.png" alt="Endothermic Diagram" style="max-width: 100%; max-height: 120px; object-fit: contain; border-radius: 4px;">' },
        { matchId: "pe-exo", text: '<img src="exo pe diagram.jpg" alt="Exothermic Diagram" style="max-width: 100%; max-height: 120px; object-fit: contain; border-radius: 4px;">' }
    ]
});