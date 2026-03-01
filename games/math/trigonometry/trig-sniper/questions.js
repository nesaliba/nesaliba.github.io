export const UNIT_CIRCLE =[
    { id: 0, rad: "0", deg: "0^\\circ", val: 0, x: "1", y: "0", tan: "0", csc: "undef", sec: "1", cot: "undef", q: "axis" },
    { id: 1, rad: "\\frac{\\pi}{6}", deg: "30^\\circ", val: Math.PI/6, x: "\\frac{\\sqrt{3}}{2}", y: "\\frac{1}{2}", tan: "\\frac{\\sqrt{3}}{3}", csc: "2", sec: "\\frac{2\\sqrt{3}}{3}", cot: "\\sqrt{3}", q: 1 },
    { id: 2, rad: "\\frac{\\pi}{4}", deg: "45^\\circ", val: Math.PI/4, x: "\\frac{\\sqrt{2}}{2}", y: "\\frac{\\sqrt{2}}{2}", tan: "1", csc: "\\sqrt{2}", sec: "\\sqrt{2}", cot: "1", q: 1 },
    { id: 3, rad: "\\frac{\\pi}{3}", deg: "60^\\circ", val: Math.PI/3, x: "\\frac{1}{2}", y: "\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", csc: "\\frac{2\\sqrt{3}}{3}", sec: "2", cot: "\\frac{\\sqrt{3}}{3}", q: 1 },
    { id: 4, rad: "\\frac{\\pi}{2}", deg: "90^\\circ", val: Math.PI/2, x: "0", y: "1", tan: "undef", csc: "1", sec: "undef", cot: "0", q: "axis" },
    { id: 5, rad: "\\frac{2\\pi}{3}", deg: "120^\\circ", val: 2*Math.PI/3, x: "-\\frac{1}{2}", y: "\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", csc: "\\frac{2\\sqrt{3}}{3}", sec: "-2", cot: "-\\frac{\\sqrt{3}}{3}", q: 2 },
    { id: 6, rad: "\\frac{3\\pi}{4}", deg: "135^\\circ", val: 3*Math.PI/4, x: "-\\frac{\\sqrt{2}}{2}", y: "\\frac{\\sqrt{2}}{2}", tan: "-1", csc: "\\sqrt{2}", sec: "-\\sqrt{2}", cot: "-1", q: 2 },
    { id: 7, rad: "\\frac{5\\pi}{6}", deg: "150^\\circ", val: 5*Math.PI/6, x: "-\\frac{\\sqrt{3}}{2}", y: "\\frac{1}{2}", tan: "-\\frac{\\sqrt{3}}{3}", csc: "2", sec: "-\\frac{2\\sqrt{3}}{3}", cot: "-\\sqrt{3}", q: 2 },
    { id: 8, rad: "\\pi", deg: "180^\\circ", val: Math.PI, x: "-1", y: "0", tan: "0", csc: "undef", sec: "-1", cot: "undef", q: "axis" },
    { id: 9, rad: "\\frac{7\\pi}{6}", deg: "210^\\circ", val: 7*Math.PI/6, x: "-\\frac{\\sqrt{3}}{2}", y: "-\\frac{1}{2}", tan: "\\frac{\\sqrt{3}}{3}", csc: "-2", sec: "-\\frac{2\\sqrt{3}}{3}", cot: "\\sqrt{3}", q: 3 },
    { id: 10, rad: "\\frac{5\\pi}{4}", deg: "225^\\circ", val: 5*Math.PI/4, x: "-\\frac{\\sqrt{2}}{2}", y: "-\\frac{\\sqrt{2}}{2}", tan: "1", csc: "-\\sqrt{2}", sec: "-\\sqrt{2}", cot: "1", q: 3 },
    { id: 11, rad: "\\frac{4\\pi}{3}", deg: "240^\\circ", val: 4*Math.PI/3, x: "-\\frac{1}{2}", y: "-\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", csc: "-\\frac{2\\sqrt{3}}{3}", sec: "-2", cot: "\\frac{\\sqrt{3}}{3}", q: 3 },
    { id: 12, rad: "\\frac{3\\pi}{2}", deg: "270^\\circ", val: 3*Math.PI/2, x: "0", y: "-1", tan: "undef", csc: "-1", sec: "undef", cot: "0", q: "axis" },
    { id: 13, rad: "\\frac{5\\pi}{3}", deg: "300^\\circ", val: 5*Math.PI/3, x: "\\frac{1}{2}", y: "-\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", csc: "-\\frac{2\\sqrt{3}}{3}", sec: "2", cot: "-\\frac{\\sqrt{3}}{3}", q: 4 },
    { id: 14, rad: "\\frac{7\\pi}{4}", deg: "315^\\circ", val: 7*Math.PI/4, x: "\\frac{\\sqrt{2}}{2}", y: "-\\frac{\\sqrt{2}}{2}", tan: "-1", csc: "-\\sqrt{2}", sec: "\\sqrt{2}", cot: "-1", q: 4 },
    { id: 15, rad: "\\frac{11\\pi}{6}", deg: "330^\\circ", val: 11*Math.PI/6, x: "\\frac{\\sqrt{3}}{2}", y: "-\\frac{1}{2}", tan: "-\\frac{\\sqrt{3}}{3}", csc: "-2", sec: "\\frac{2\\sqrt{3}}{3}", cot: "-\\sqrt{3}", q: 4 }
];

const randPt = () => window.UNIT_CIRCLE[Math.floor(Math.random() * window.UNIT_CIRCLE.length)];

export const TrigQuestionBank = {
    rookie:[
        () => {
            const pt = randPt();
            return { prompt: `\\text{Locate Angle: } ${pt.rad}`, targets: [pt.id] };
        },
        () => {
            const pt = randPt();
            return { prompt: `\\text{Locate Angle: } ${pt.deg}`, targets:[pt.id] };
        },
        () => {
            const pt = randPt();
            return { prompt: `\\text{Locate Point: } \\left(${pt.x}, ${pt.y}\\right)`, targets: [pt.id] };
        }
    ],
    marksman:[
        // Condition checking (Original Logic)
        () => {
            const pt = randPt();
            const useSin = Math.random() > 0.5;
            const funcKey = useSin ? 'y' : 'x';
            const val = pt[funcKey];
            
            let condSign = '';
            let isAxisCond = pt.q === 'axis';

            if (!isAxisCond) {
                const otherValNum = useSin ? Math.cos(pt.val) : Math.sin(pt.val);
                condSign = otherValNum > 0 ? '>' : '<';
            }

            const targets = window.UNIT_CIRCLE.filter(p => {
                if (p[funcKey] !== val) return false;
                if (isAxisCond) return p.q === 'axis';
                const checkVal = useSin ? Math.cos(p.val) : Math.sin(p.val);
                return condSign === '>' ? checkVal > 0.001 : checkVal < -0.001;
            }).map(p => p.id);

            const funcStr = useSin ? '\\sin(\\theta)' : '\\cos(\\theta)';
            const otherFuncStr = useSin ? '\\cos(\\theta)' : '\\sin(\\theta)';
            let promptText = `\\text{Find } \\theta \\text{ where } ${funcStr} = ${val}`;
            if (isAxisCond) promptText += ` \\text{ on an axis}`;
            else promptText += ` \\text{ and } ${otherFuncStr} ${condSign} 0`;

            return { prompt: promptText, targets: targets };
        },
        // Unrestricted match (Locate ANY valid theta)
        () => {
            const pt = randPt();
            const useSin = Math.random() > 0.5;
            const funcKey = useSin ? 'y' : 'x';
            const val = pt[funcKey];
            const funcStr = useSin ? '\\sin(\\theta)' : '\\cos(\\theta)';
            
            const targets = window.UNIT_CIRCLE.filter(p => p[funcKey] === val).map(p => p.id);
            return { prompt: `\\text{Find a } \\theta \\text{ where } ${funcStr} = ${val}`, targets: targets };
        }
    ],
    sniper:[
        // Identify inverse ratios with constraints (Original Logic)
        () => {
            const pt = randPt();
            const funcs =['tan', 'csc', 'sec', 'cot'];
            let chosenFunc = '';
            let val = 'undef';
            while(val === 'undef') {
                chosenFunc = funcs[Math.floor(Math.random() * funcs.length)];
                val = pt[chosenFunc];
            }

            let checkFunc = Math.random() > 0.5 ? 'sin' : 'cos';
            let condSign = '';
            let isAxisCond = pt.q === 'axis';

            if (!isAxisCond) {
                const numVal = checkFunc === 'sin' ? Math.sin(pt.val) : Math.cos(pt.val);
                condSign = numVal > 0 ? '>' : '<';
            }

            const targets = window.UNIT_CIRCLE.filter(p => {
                if (p[chosenFunc] !== val) return false;
                if (isAxisCond) return p.q === 'axis';
                const checkVal = checkFunc === 'sin' ? Math.sin(p.val) : Math.cos(p.val);
                return condSign === '>' ? checkVal > 0.001 : checkVal < -0.001;
            }).map(p => p.id);

            let promptText = `\\text{Find } \\theta \\text{ where } \\${chosenFunc}(\\theta) = ${val}`;
            if (isAxisCond) promptText += ` \\text{ on an axis}`;
            else promptText += ` \\text{ and } \\${checkFunc}(\\theta) ${condSign} 0`;

            return { prompt: promptText, targets: targets };
        },
        // Identify when trig functions intercept
        () => {
            const targets = [2, 10]; // pi/4, 5pi/4
            return { prompt: `\\text{Find a } \\theta \\text{ where } \\sin(\\theta) = \\cos(\\theta)`, targets };
        },
        () => {
            const targets =[6, 14]; // 3pi/4, 7pi/4
            return { prompt: `\\text{Find a } \\theta \\text{ where } \\sin(\\theta) = -\\cos(\\theta)`, targets };
        }
    ]
};