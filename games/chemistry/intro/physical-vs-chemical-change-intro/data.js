new ScitriadTileGame({
    title: "Physical vs Chemical Change",
    backUrl: "../../../../Chemistry.html",
    minWidth: 600, // Optimal for 2 data columns
    columns: ["", "Physical Change", "Chemical Change"],
    rows:["Reversibility", "Description", "Example 1", "Example 2", "Example 3", "Example 4"],
    data:[
        { matchId: "p-rev", text: "Reversible Reaction" },
        { matchId: "c-rev", text: "Difficult to reverse the reaction" },
        { matchId: "p-desc", text: "substance changes state (s, l, g)" },
        { matchId: "c-desc", text: "new substance formed" },
        { matchId: "p-ex", text: "water condenses on the window" },
        { matchId: "c-ex", text: "two clear solutions mix together to produce a white solid" },
        { matchId: "p-ex", text: "melting ice" },
        { matchId: "c-ex", text: "heat produced or absorbed" },
        { matchId: "p-ex", text: "chopping carrots" },
        { matchId: "c-ex", text: "indicator changes from yellow to blue colour" },
        { matchId: "p-ex", text: "green coloured solution" },
        { matchId: "c-ex", text: "cooking eggs" }
    ]
});