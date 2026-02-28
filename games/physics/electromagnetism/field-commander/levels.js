// Each level provides initial parameters for the particle and environment.
// Physics Coordinate System: (0,0) is bottom-left, +x is right, +y is UP.

window.FieldMissions =[
    {
        title: "Mission 1: Electric Deflection",
        briefing: "A <span style='color:#ef4444; font-weight:bold;'>proton (+1)</span> is entering a uniform electric field. Use the E-field slider to deflect it upward into the target zone. Magnetic field is offline.",
        charge: 1,
        start: { x: 50, y: 300, vx: 100, vy: 0 },
        target: { x: 500, y: 450, r: 25 }, // Needs to move UP (+y)
        obstacles: [],
        lockedE: null,
        lockedB: 0
    },
    {
        title: "Mission 2: Magnetic Curve",
        briefing: "An <span style='color:#3b82f6; font-weight:bold;'>electron (-1)</span> is moving through a magnetic testing chamber. Apply the Right-Hand Rule and use the B-field slider to curve its path into the target. Electric field is offline.",
        charge: -1,
        start: { x: 300, y: 100, vx: 0, vy: 100 }, // Moving UP initially
        target: { x: 500, y: 300, r: 25 }, // Needs to curve right
        obstacles:[
            { x: 0, y: 0, w: 600, h: 50 }, // Boundaries
            { x: 0, y: 550, w: 600, h: 50 }
        ],
        lockedE: 0,
        lockedB: null
    },
    {
        title: "Mission 3: Velocity Selector",
        briefing: "A <span style='color:#ef4444; font-weight:bold;'>proton (+1)</span> must pass through a narrow corridor. The B-field is fixed at <span style='color:#a855f7; font-weight:bold;'>2.0 T (OUT)</span>. Calculate and apply the exact E-field required to maintain a straight trajectory ($F_{net} = 0$).",
        charge: 1,
        start: { x: 50, y: 300, vx: 100, vy: 0 },
        target: { x: 550, y: 300, r: 25 }, // Straight ahead
        obstacles:[
            { x: 150, y: 0, w: 300, h: 260 }, // Top wall
            { x: 150, y: 340, w: 300, h: 260 }  // Bottom wall
        ],
        lockedE: null,
        lockedB: 2.0
    },
    {
        title: "Mission 4: Electron Velocity Selector",
        briefing: "An <span style='color:#3b82f6; font-weight:bold;'>electron (-1)</span> enters the corridor. The B-field is fixed at <span style='color:#a855f7; font-weight:bold;'>-1.5 T (IN)</span>. Set the E-field to achieve undeflected motion.",
        charge: -1,
        start: { x: 50, y: 300, vx: 120, vy: 0 },
        target: { x: 550, y: 300, r: 25 },
        obstacles:[
            { x: 150, y: 0, w: 300, h: 260 },
            { x: 150, y: 340, w: 300, h: 260 }
        ],
        lockedE: null,
        lockedB: -1.5
    },
    {
        title: "Mission 5: The Cyclotron Trap",
        briefing: "A <span style='color:#ef4444; font-weight:bold;'>proton (+1)</span> must navigate a tight bend. The E-field is disabled. Calculate the B-field magnitude and direction needed to curve it tightly into the safe zone without hitting the outer wall.",
        charge: 1,
        start: { x: 100, y: 500, vx: 120, vy: 0 },
        target: { x: 300, y: 300, r: 25 }, // Curve down and right
        obstacles:[
            { x: 400, y: 0, w: 200, h: 600 }, // Right wall
            { x: 0, y: 0, w: 600, h: 100 }    // Bottom wall
        ],
        lockedE: 0,
        lockedB: null
    }
];