// Helper functions for parameter generation
const randRange = (min, max, step) => {
    const steps = Math.floor((max - min) / step);
    return min + Math.floor(Math.random() * (steps + 1)) * step;
};

const nonZeroRand = (min, max, step) => {
    let v = 0;
    while(v === 0) v = randRange(min, max, step);
    return v;
};

const getRandomType = () => {
    const types =['linear', 'quadratic', 'absolute', 'sqrt', 'cubic', 'reciprocal'];
    return types[Math.floor(Math.random() * types.length)];
};

export const FunctionQuestionBank = {
    practice:[
        // Only vertical/horizontal shifts
        () => ({ type: getRandomType(), a: 1, b: 1, h: randRange(-6, 6, 1), k: randRange(-6, 6, 1) }),
        // Only stretches / reflections
        () => ({ type: getRandomType(), a: nonZeroRand(-3, 3, 0.5), b: 1, h: 0, k: 0 }),
        // Standard mix
        () => ({ type: getRandomType(), a: nonZeroRand(-3, 3, 0.5), b: 1, h: randRange(-8, 8, 1), k: randRange(-8, 8, 1) })
    ],
    timed:[
        // Standard mix for speed run
        () => ({ type: getRandomType(), a: nonZeroRand(-3, 3, 0.5), b: 1, h: randRange(-8, 8, 1), k: randRange(-8, 8, 1) })
    ],
    puzzle:[
        // Standard mix
        () => ({ type: getRandomType(), a: nonZeroRand(-3, 3, 0.5), b: 1, h: randRange(-8, 8, 1), k: randRange(-8, 8, 1) })
    ],
    challenge:[
        // Includes 'b' parameter (horizontal stretch/reflect)
        () => ({ type: getRandomType(), a: nonZeroRand(-3, 3, 0.5), b: nonZeroRand(-2, 2, 0.5), h: randRange(-8, 8, 1), k: randRange(-8, 8, 1) }),
        // Harder challenge numbers
        () => ({ type: getRandomType(), a: nonZeroRand(-4, 4, 0.5), b: nonZeroRand(-3, 3, 0.5), h: randRange(-10, 10, 1), k: randRange(-10, 10, 1) })
    ]
};