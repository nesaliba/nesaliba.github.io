new ScitriadTileGame({
    title: "Metal vs Non-Metal Properties",
    backUrl: "../../../Chemistry.html",
    minWidth: 750, // Optimal for 4 data columns
    columns:["", "State of Matter (s, l, g)", "Appearance", "Conductivity", "Malleability or Ductility"],
    rows: ["Metallic Elements", "Non-metallic Elements", "Metalloids"],
    data:[
        { matchId: "m-state", text: "solids except Hg(l)" },
        { matchId: "m-app", text: "shiny, lustrous" },
        { matchId: "m-cond", text: "good conductors of heat and electricity" },
        { matchId: "m-mall", text: "malleable and ductile" },
        { matchId: "nm-state", text: "some gaseous state, some solids, bromine (l)" },
        { matchId: "nm-app", text: "non-shiny, non-lustrous, dull" },
        { matchId: "nm-cond", text: "poor conductors of heat and electricity" },
        { matchId: "nm-mall", text: "brittle, not very ductile" },
        { matchId: "md-state", text: "solids" },
        { matchId: "md-app", text: "lustrous or dull" },
        { matchId: "md-cond", text: "may conduct electricity, poor conductors of heat" },
        { matchId: "md-mall", text: "could be malleable or ductile" }
    ]
});