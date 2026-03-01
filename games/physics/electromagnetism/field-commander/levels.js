// Procedurally generates a campaign of physics missions.
// Physics Coordinate System: (0,0) is bottom-left, +x is right, +y is UP.

export function generateFieldMissions(count = 10) {
    const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const missions =[];

    for (let i = 0; i < count; i++) {
        const charge = randChoice([-1, 1]);
        const particleName = charge > 0 
            ? "<span style='color:#ef4444; font-weight:bold;'>proton (+1)</span>" 
            : "<span style='color:#3b82f6; font-weight:bold;'>electron (-1)</span>";

        // Escalate complexity smoothly for the first few levels, then randomize.
        let type;
        if (i === 0) type = 'e_only';
        else if (i === 1) type = 'b_only';
        else if (i === 2) type = 'selector';
        else type = randChoice(['e_only', 'b_only', 'selector', 'complex']);

        let title, briefing;
        let start, target, obstacles =[];
        let lockedE = null, lockedB = null;

        if (type === 'e_only') {
            title = `Mission ${i + 1}: Electric Deflection`;
            briefing = `A ${particleName} is entering a uniform electric field. Use the E-field slider to deflect it into the target zone. Magnetic field is offline.`;
            const startY = randInt(200, 400);
            start = { x: 50, y: startY, vx: randInt(80, 120), vy: 0 };
            
            // Target needs to be distinctly above or below to require E-field utilization
            const targetY = startY > 300 ? randInt(100, 200) : randInt(400, 500);
            target = { x: randInt(450, 550), y: targetY, r: 25 };
            lockedB = 0;
        } 
        else if (type === 'b_only') {
            title = `Mission ${i + 1}: Magnetic Curve`;
            briefing = `A ${particleName} is moving through a magnetic testing chamber. Apply the Right-Hand Rule and use the B-field slider to curve its path into the target. Electric field is offline.`;
            
            // Start moving UP or RIGHT randomly
            const moveUp = Math.random() > 0.5;
            if (moveUp) {
                start = { x: randInt(250, 350), y: 100, vx: 0, vy: randInt(80, 120) };
                const curveRight = Math.random() > 0.5;
                target = { x: start.x + (curveRight ? 200 : -200), y: randInt(350, 450), r: 25 };
            } else {
                start = { x: 100, y: randInt(250, 350), vx: randInt(80, 120), vy: 0 };
                const curveUp = Math.random() > 0.5;
                target = { x: randInt(350, 450), y: start.y + (curveUp ? 200 : -200), r: 25 };
            }
            
            obstacles =[
                { x: 0, y: 0, w: 600, h: 50 }, // Boundaries
                { x: 0, y: 550, w: 600, h: 50 }
            ];
            lockedE = 0;
        } 
        else if (type === 'selector') {
            title = `Mission ${i + 1}: Velocity Selector`;
            
            // Generate perfectly solvable pairs where Ey = vx * Bz matches the slider increments cleanly
            const vx = randChoice([50, 100, 150]);
            const bVal = randChoice([-2, -1.5, -1, 1, 1.5, 2]);
            const eVal = bVal * vx; // Guarantees a multiple of 25 (Slider E steps by 5)

            const isBFixed = Math.random() > 0.5;
            if (isBFixed) {
                const bStr = bVal > 0 ? `${bVal} T (OUT)` : `${Math.abs(bVal)} T (IN)`;
                briefing = `A ${particleName} must pass through a narrow corridor. The B-field is fixed at <span style='color:#a855f7; font-weight:bold;'>${bStr}</span>. Calculate and apply the exact E-field required to maintain a straight trajectory ($F_{net} = 0$).`;
                lockedB = bVal;
            } else {
                briefing = `A ${particleName} must pass through a narrow corridor. The E-field is fixed at <span style='color:#06b6d4; font-weight:bold;'>${eVal} N/C</span>. Set the B-field to achieve undeflected motion.`;
                lockedE = eVal;
            }
            
            const sy = randInt(250, 350);
            start = { x: 50, y: sy, vx: vx, vy: 0 };
            target = { x: 550, y: sy, r: 25 };
            
            obstacles =[
                { x: 150, y: 0, w: 300, h: sy - 40 },
                { x: 150, y: sy + 40, w: 300, h: 600 - (sy + 40) }
            ];
        } 
        else {
            title = `Mission ${i + 1}: The Cyclotron Trap`;
            briefing = `A ${particleName} needs to navigate a tricky setup. Both fields are manual. Use your knowledge to guide it around the barriers to the target!`;
            start = { x: randInt(50, 100), y: randInt(100, 500), vx: randInt(80, 120), vy: 0 };
            target = { x: randInt(400, 550), y: randInt(100, 500), r: randInt(25, 35) };
            
            const obsX = (start.x + target.x) / 2;
            const gapTop = Math.random() > 0.5;
            if (gapTop) {
                obstacles =[{ x: obsX - 25, y: 0, w: 50, h: 300 }];
            } else {
                obstacles =[{ x: obsX - 25, y: 300, w: 50, h: 300 }];
            }
        }

        missions.push({ title, briefing, charge, start, target, obstacles, lockedE, lockedB });
    }

    return missions;
};