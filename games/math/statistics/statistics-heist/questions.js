// Helper functions
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const nPr = (n, r) => factorial(n) / factorial(n - r);
const nCr = (n, r) => factorial(n) / (factorial(r) * factorial(n - r));

export const StatisticsQuestionBank =[
    // 1. Permutations (Combinatorics)
    function() {
        let n = rand(5, 9);
        let r = rand(3, 4);
        let prompt = `\\text{The vault requires a } ${r}\\text{-digit code using digits 1 to } ${n} \\text{ with NO repetition. How many possible codes exist?}`;
        let ans = nPr(n, r);
        let distractors =[
            Math.pow(n, r).toString(), // Allowed repetition mistake
            nCr(n, r).toString(), // Combination mistake
            (n * r).toString() // Multiplication mistake
        ];
        return { prompt, answer: ans.toString(), distractors };
    },

    // 2. Combinations (Crew Selection)
    function() {
        let n = rand(6, 10);
        let r = rand(3, 4);
        let prompt = `\\text{You need to assemble a crew of } ${r} \\text{ specialists from a pool of } ${n}. \\text{ Order does not matter. How many possible crews can you form?}`;
        let ans = nCr(n, r);
        let distractors =[
            nPr(n, r).toString(), // Permutation mistake
            Math.pow(n, r).toString(), // Exponent mistake
            (n * r).toString() // Multiplication mistake
        ];
        return { prompt, answer: ans.toString(), distractors };
    },

    // 3. Expected Value (Risk Assessment)
    function() {
        let winProb = rand(6, 8) * 10; // 60% to 80%
        let loseProb = 100 - winProb;
        let reward = rand(5, 10) * 1000; // 5000 to 10000
        let cost = rand(1, 3) * 1000; // 1000 to 3000

        let prompt = `\\text{A hack has a } ${winProb}\\% \\text{ chance to secure \\$}${reward}, \\text{ but a } ${loseProb}\\% \\text{ chance to trigger a firewall costing \\$}${cost}. \\text{ What is the Expected Value of this hack?}`;
        
        let ev = ((winProb / 100) * reward) + ((loseProb / 100) * -cost);
        let ans = `\\$${ev}`;

        let distractors =[
            `\\$${((winProb / 100) * reward) + ((loseProb / 100) * cost)}`, // Added instead of subtracted
            `\\$${reward - cost}`, // Simple difference
            `\\$${((winProb / 100) * reward)}` // Ignored the loss
        ];
        return { prompt, answer: ans, distractors };
    },

    // 4. Probability (Independent Events)
    function() {
        let failChance = rand(10, 25);
        let successChance = 100 - failChance;
        let p = successChance / 100;
        
        let prompt = `\\text{A guard ignores a distraction } ${failChance}\\% \\text{ of the time. If you use } 2 \\text{ independent distractions, what is the probability BOTH work successfully?}`;
        
        let ansProb = p * p;
        let ansPercent = (ansProb * 100).toFixed(1);
        
        let distractors =[
            (failChance * 2).toFixed(1) + "\\%",
            (successChance * 2).toFixed(1) + "\\%",
            ((failChance/100) * (failChance/100) * 100).toFixed(1) + "\\%" // Prob both fail
        ];
        
        return { prompt, answer: `${ansPercent}\\%`, distractors };
    },

    // 5. Normal Distribution (Empirical Rule)
    function() {
        let mean = rand(10, 15);
        let sd = rand(1, 3);
        let low = mean - sd;
        let high = mean + sd;
        
        let prompt = `\\text{Guard patrol times are normally distributed with a mean of } ${mean} \\text{ min and standard deviation of } ${sd} \\text{ min. What percentage of patrols take between } ${low} \\text{ and } ${high} \\text{ min?}`;
        
        let ans = "68\\%";
        let distractors =[ "95\\%", "99.7\\%", "34\\%" ];
        return { prompt, answer: ans, distractors };
    }
];