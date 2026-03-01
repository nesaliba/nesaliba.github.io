// Helper functions for polynomial generation
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZeroRand = (min, max) => { let v = 0; while(v === 0) v = rand(min, max); return v; };

const fmt = (c, p) => {
    if (c === 0) return "";
    let term = "";
    if (p === 0) term = Math.abs(c);
    else if (p === 1) term = (Math.abs(c) === 1 ? "x" : Math.abs(c) + "x");
    else term = (Math.abs(c) === 1 ? "x^" + p : Math.abs(c) + "x^" + p);
    return (c < 0 ? "- " : "+ ") + term;
};

const buildPoly = (coeffs) => {
    let s = "";
    let deg = coeffs.length - 1;
    for(let i=0; i<=deg; i++) {
        let c = coeffs[i];
        let p = deg - i;
        if (c === 0) continue;
        let term = fmt(c, p);
        if (s === "") {
            if (c < 0) s = "-" + term.substring(2);
            else s = term.substring(2);
        } else {
            s += " " + term;
        }
    }
    return s === "" ? "0" : s;
};

const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

export const PolynomialQuestionBank = {
    quad:[
        // Question Type 1: Find the zeros
        function() {
            let r1 = nonZeroRand(-5, 5);
            let r2 = nonZeroRand(-5, 5);
            let b = -(r1 + r2);
            let c = r1 * r2;
            let poly = buildPoly([1, b, c]);

            let correctAns = `x = ${r1}, x = ${r2}`;
            if (r1 === r2) correctAns = `x = ${r1}`;
            
            let distractors =[
                `x = ${-r1}, x = ${-r2}`,
                `x = ${r1 + 1}, x = ${r2 - 1}`,
                `x = ${-r1}, x = ${r2}`
            ];
            if (r1 === r2) distractors =[`x = ${-r1}`, `x = ${r1+1}`, `x = ${r1-1}`];

            return { prompt: `\\text{Find the zeros of } f(x) = ${poly}`, answer: correctAns, distractors: distractors };
        },
        // Question Type 2: Factor the expression
        function() {
            let r1 = nonZeroRand(-5, 5);
            let r2 = nonZeroRand(-5, 5);
            let b = -(r1 + r2);
            let c = r1 * r2;
            let poly = buildPoly([1, b, c]);

            const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
            const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
            let correctAns = r1 === r2 ? `${f1}^2` : `${f1}${f2}`;
            
            const d1 = r1 < 0 ? `(x - ${-r1})` : `(x + ${r1})`;
            const d2 = r2 < 0 ? `(x - ${-r2})` : `(x + ${r2})`;
            let distractors =[
                r1 === r2 ? `${d1}^2` : `${d1}${d2}`,
                `${f1}${d2}`,
                `${d1}${f2}`
            ];

            return { prompt: `\\text{Factor the expression } ${poly}`, answer: correctAns, distractors: distractors };
        },
        // Question Type 3: Find the equation given vertex
        function() {
            let yInt = nonZeroRand(-6, 6);
            let correctAns = `y = x^2 ${yInt > 0 ? '+' : '-'} ${Math.abs(yInt)}`;
            let distractors =[
                `y = -x^2 ${yInt > 0 ? '+' : '-'} ${Math.abs(yInt)}`,
                `y = (x ${yInt > 0 ? '-' : '+'} ${Math.abs(yInt)})^2`,
                `y = x^2 ${yInt > 0 ? '-' : '+'} ${Math.abs(yInt)}`
            ];

            return { 
                prompt: `\\text{Which equation represents a parabola opening upward with vertex at } (0, ${yInt})?`, 
                answer: correctAns, 
                distractors: distractors 
            };
        }
    ],
    cubic:[
        // Question Type 1: Determine End Behavior
        function() {
            let a = nonZeroRand(-3, 3);
            let poly = buildPoly([a, rand(-5,5), rand(-5,5), rand(-5,5)]);
            
            let correctAns, distractors;
            if (a > 0) {
                correctAns = `x \\to \\infty, y \\to \\infty \\text{ and } x \\to -\\infty, y \\to -\\infty`;
                distractors =[
                    `x \\to \\infty, y \\to -\\infty \\text{ and } x \\to -\\infty, y \\to \\infty`,
                    `x \\to \\pm\\infty, y \\to \\infty`,
                    `x \\to \\pm\\infty, y \\to -\\infty`
                ];
            } else {
                correctAns = `x \\to \\infty, y \\to -\\infty \\text{ and } x \\to -\\infty, y \\to \\infty`;
                distractors =[
                    `x \\to \\infty, y \\to \\infty \\text{ and } x \\to -\\infty, y \\to -\\infty`,
                    `x \\to \\pm\\infty, y \\to \\infty`,
                    `x \\to \\pm\\infty, y \\to -\\infty`
                ];
            }

            return { prompt: `\\text{Determine the end behavior of } f(x) = ${poly}`, answer: correctAns, distractors: distractors };
        },
        // Question Type 2: Find the zeros of factored cubic
        function() {
            let r1 = nonZeroRand(-4, 4);
            let r2 = nonZeroRand(-4, 4);
            let r3 = nonZeroRand(-4, 4);
            const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
            const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
            const f3 = r3 < 0 ? `(x + ${-r3})` : `(x - ${r3})`;
            
            let roots = [...new Set([r1, r2, r3])].sort((a,b)=>a-b);
            let correctAns = `x = ` + roots.join(", ");
            let distractors =[
                `x = ` + [...new Set([-r1, -r2, -r3])].sort((a,b)=>a-b).join(", "),
                `x = ` + [...new Set([r1+1, r2, r3])].sort((a,b)=>a-b).join(", "),
                `x = ` + [...new Set([-r1, r2, -r3])].sort((a,b)=>a-b).join(", ")
            ];

            return { prompt: `\\text{Find the zeros of } f(x) = ${f1}${f2}${f3}`, answer: correctAns, distractors: distractors };
        },
        // Question Type 3: Determine cubic given roots
        function() {
            let r1 = nonZeroRand(-3, 3);
            let r2 = nonZeroRand(-3, 3);
            const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
            const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
            let correctAns = `f(x) = ${f1}^2 ${f2}`;
            
            const d1 = r1 < 0 ? `(x - ${-r1})` : `(x + ${r1})`;
            const d2 = r2 < 0 ? `(x - ${-r2})` : `(x + ${r2})`;
            let distractors =[
                `f(x) = ${f1} ${f2}^2`,
                `f(x) = ${d1}^2 ${d2}`,
                `f(x) = ${d1} ${d2}^2`
            ];

            return { prompt: `\\text{Which cubic has roots } x=${r1} \\text{ (multiplicity 2) and } x=${r2}?`, answer: correctAns, distractors: distractors };
        }
    ],
    rational:[
        // Question Type 1: Find Vertical Asymptote
        function() {
            let va = nonZeroRand(-5, 5);
            let root = nonZeroRand(-5, 5);
            if (va === root) root++;
            const num = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
            const den = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
            
            return { 
                prompt: `\\text{Find the vertical asymptote of } f(x) = \\frac{${num}}{${den}}`, 
                answer: `x = ${va}`, 
                distractors:[`x = ${-va}`, `y = ${va}`, `x = ${root}`] 
            };
        },
        // Question Type 2: Find Horizontal Asymptote
        function() {
            let a = nonZeroRand(1, 5);
            let b = nonZeroRand(1, 5);
            if (a===b) a++;
            let polyNum = buildPoly([a, rand(-3,3), rand(-3,3)]);
            let polyDen = buildPoly([b, rand(-3,3), rand(-3,3)]);
            
            let g = gcd(Math.abs(a), Math.abs(b));
            let simpA = a/g; let simpB = b/g;
            if (simpB < 0) { simpA = -simpA; simpB = -simpB; }
            let ans = simpB === 1 ? `${simpA}` : `\\frac{${simpA}}{${simpB}}`;
            
            return { 
                prompt: `\\text{Find the horizontal asymptote of } f(x) = \\frac{${polyNum}}{${polyDen}}`, 
                answer: `y = ${ans}`, 
                distractors:[`y = 0`, `\\text{No horizontal asymptote}`, `x = ${ans}`] 
            };
        },
        // Question Type 3: Find function given VA and Root
        function() {
            let va = nonZeroRand(-5, 5);
            let root = nonZeroRand(-5, 5);
            if (va === root) root++;
            
            const num = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
            const den = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
            let correctAns = `f(x) = \\frac{${num}}{${den}}`;
            
            const dNum = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
            const dDen = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
            let distractors =[
                `f(x) = \\frac{${dNum}}{${dDen}}`,
                `f(x) = \\frac{${num}^2}{${den}}`,
                `f(x) = \\frac{${dNum}}{${den}}`
            ];

            return { 
                prompt: `\\text{Which function has a vertical asymptote at } x=${va} \\text{ and an } x\\text{-intercept at } x=${root}?`, 
                answer: correctAns, 
                distractors: distractors 
            };
        }
    ]
};