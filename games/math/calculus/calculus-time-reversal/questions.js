// Helper functions for parameter generation
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZeroRand = (min, max) => { let v = 0; while(v === 0) v = rand(min, max); return v; };

export const CalculusQuestionBank =[
    // 1. Instantaneous Rate of Change (Quadratic)
    function() {
        let a = nonZeroRand(-3, 3);
        let b = rand(-5, 5);
        let c = rand(-10, 10);
        let t0 = rand(1, 5);
        
        let aStr = a === 1 ? "" : (a === -1 ? "-" : a);
        let bStr = b === 0 ? "" : (b > 0 ? `+ ${b}t` : `- ${Math.abs(b)}t`);
        let cStr = c === 0 ? "" : (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`);
        
        let prompt = `\\text{A structural load fails at } L(t) = ${aStr}t^2 ${bStr} ${cStr}. \\text{ Find the rate of change } L'(t) \\text{ exactly at } t = ${t0}.`;
        
        let ans = 2 * a * t0 + b;
        
        let distractors =[
            (a * Math.pow(t0, 2) + b * t0 + c).toString(), // Original function evaluated
            (2 * a * t0 - b).toString(), // Sign error
            (a * t0 + b).toString() // Derivative coefficient error
        ];

        return { prompt, answer: ans.toString(), distractors };
    },

    // 2. Critical Points (Quadratic Optimization)
    function() {
        let a = nonZeroRand(1, 4);
        let criticalT = rand(2, 6);
        let b = -2 * a * criticalT; // Ensures critical point is an integer
        
        let aStr = a === 1 ? "" : a;
        let bStr = b === 0 ? "" : (b > 0 ? `+ ${b}t` : `- ${Math.abs(b)}t`);
        
        let prompt = `\\text{A reactor's thermal output is } T(t) = ${aStr}t^2 ${bStr} + 50. \\text{ At what time } t \\text{ does it hit a critical turning point?}`;
        
        let ans = criticalT;
        
        let distractors =[
            (-criticalT).toString(),
            (criticalT + 2).toString(),
            (criticalT * 2).toString()
        ];

        return { prompt, answer: `t = ${ans}`, distractors: distractors.map(d => `t = ${d}`) };
    },

    // 3. Related Rates (Expanding Area)
    function() {
        let side = rand(3, 10);
        let rate = rand(2, 5);
        
        let prompt = `\\text{A containment field (square) is expanding. The side } s \\text{ grows at } ${rate}\\text{m/s}. \\text{ Find the rate of area increase } \\frac{dA}{dt} \\text{ when } s = ${side}\\text{m}.`;
        
        // A = s^2 -> dA/dt = 2s * ds/dt
        let ans = 2 * side * rate;
        
        let distractors =[
            (side * side).toString(), // Area
            (side * rate).toString(), // Forgot multiplier
            (2 * side).toString() // Forgot chain rule part
        ];

        return { prompt, answer: `${ans} \\text{ m}^2\\text{/s}`, distractors: distractors.map(d => `${d} \\text{ m}^2\\text{/s}`) };
    },

    // 4. Power Rule Evaluation
    function() {
        let a = nonZeroRand(2, 5);
        let exp = rand(3, 4);
        let t0 = rand(1, 2);
        
        let prompt = `\\text{A vehicle's displacement is } s(t) = ${a}t^${exp}. \\text{ Find its velocity } v(t) \\text{ at } t = ${t0}.`;
        
        // v(t) = s'(t) = a * exp * t^(exp-1)
        let ans = a * exp * Math.pow(t0, exp - 1);
        
        let distractors =[
            (a * Math.pow(t0, exp)).toString(), // Just position
            (a * exp * Math.pow(t0, exp)).toString(), // Forgot to reduce exponent
            (a * (exp - 1) * Math.pow(t0, exp - 1)).toString() // Wrong multiplier
        ];

        return { prompt, answer: ans.toString(), distractors };
    }
];