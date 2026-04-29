// games/chemistry/advanced/dimensional-analysis/generator.js

export class PuzzleGenerator {
    constructor() {
        this.beginnerNodes = ['🔴', '▲', '⬛', '⭐', '⬟', '🌙', '☀️', '🌊', '🌿'];
        
        this.intermediateEdges = [
            { a: 'km', b: 'm', t: '1000 m', bL: '1 km' },
            { a: 'm', b: 'cm', t: '100 cm', bL: '1 m' },
            { a: 'cm', b: 'mm', t: '10 mm', bL: '1 cm' },
            { a: 'mile', b: 'km', t: '1.609 km', bL: '1 mile' },
            { a: 'ft', b: 'in', t: '12 in', bL: '1 ft' },
            { a: 'in', b: 'cm', t: '2.54 cm', bL: '1 in' },
            { a: 'year', b: 'day', t: '365 days', bL: '1 year' },
            { a: 'week', b: 'day', t: '7 days', bL: '1 week' },
            { a: 'day', b: 'h', t: '24 h', bL: '1 day' },
            { a: 'h', b: 'min', t: '60 min', bL: '1 h' },
            { a: 'min', b: 's', t: '60 s', bL: '1 min' },
            { a: 'kg', b: 'g', t: '1000 g', bL: '1 kg' },
            { a: 'g', b: 'mg', t: '1000 mg', bL: '1 g' },
            { a: 'lb', b: 'g', t: '453.59 g', bL: '1 lb' },
            { a: 'L', b: 'mL', t: '1000 mL', bL: '1 L' },
            { a: 'mL', b: 'cm³', t: '1 cm³', bL: '1 mL' },
            { a: 'gal', b: 'L', t: '3.785 L', bL: '1 gal' },
            { a: 'atm', b: 'kPa', t: '101.325 kPa', bL: '1 atm' },
            { a: 'atm', b: 'mmHg', t: '760 mmHg', bL: '1 atm' }
        ];

        this.advancedScenarios = [
            this.genStoichiometry.bind(this),
            this.genTitration.bind(this),
            this.genElectrochemistry.bind(this),
            this.genGasLaw.bind(this)
        ];
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    genBeginner(level) {
        const length = Math.min(2 + Math.floor(level / 3), 5);
        const nodes = this.shuffle([...this.beginnerNodes]).slice(0, length + 1);
        
        const hand = [];
        for (let i = 0; i < length; i++) {
            hand.push({
                t: nodes[i+1],
                b: nodes[i]
            });
        }
        
        const distractors = [];
        const numDistractors = Math.min(1 + Math.floor(level / 2), 4);
        for (let i = 0; i < numDistractors; i++) {
            const n1 = this.beginnerNodes[this.rand(0, this.beginnerNodes.length - 1)];
            let n2 = this.beginnerNodes[this.rand(0, this.beginnerNodes.length - 1)];
            while (n1 === n2) n2 = this.beginnerNodes[this.rand(0, this.beginnerNodes.length - 1)];
            distractors.push({ t: n2, b: n1 });
        }

        return {
            start: nodes[0],
            target: nodes[length],
            hand: this.randomizeFlips(hand),
            distractors: distractors
        };
    }

    buildGraph(edges) {
        const graph = {};
        for (const e of edges) {
            if (!graph[e.a]) graph[e.a] = [];
            if (!graph[e.b]) graph[e.b] = [];
            graph[e.a].push({ to: e.b, t: e.t, b: e.bL, edge: e });
            graph[e.b].push({ to: e.a, t: e.bL, b: e.t, edge: e });
        }
        return graph;
    }

    findPath(graph, start, target) {
        const queue = [{ node: start, path: [] }];
        const visited = new Set([start]);
        
        while (queue.length > 0) {
            const { node, path } = queue.shift();
            if (node === target) return path;
            
            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor.to)) {
                    visited.add(neighbor.to);
                    queue.push({ node: neighbor.to, path: [...path, neighbor] });
                }
            }
        }
        return null;
    }

    getRandomPath(graph, start, length) {
        let current = start;
        const path = [];
        const visited = new Set([start]);

        for (let i = 0; i < length; i++) {
            const neighbors = graph[current].filter(n => !visited.has(n.to));
            if (neighbors.length === 0) break;
            
            const next = neighbors[this.rand(0, neighbors.length - 1)];
            path.push(next);
            visited.add(next.to);
            current = next.to;
        }
        return path;
    }

    genIntermediate(level) {
        const graph = this.buildGraph(this.intermediateEdges);
        const nodes = Object.keys(graph);
        
        let path = [];
        let start = '';
        let target = '';
        const targetLength = Math.min(2 + Math.floor(level / 3), 5);

        for (let i = 0; i < 15; i++) {
            start = nodes[this.rand(0, nodes.length - 1)];
            path = this.getRandomPath(graph, start, targetLength);
            if (path.length >= 2) break; 
        }

        if (path.length === 0) return this.genIntermediate(level);

        target = path[path.length - 1].to;
        const hand = path.map(step => ({ t: step.t, b: step.b }));
        
        const distractors = [];
        const numDistractors = Math.min(1 + Math.floor(level / 2), 4);
        for (let i = 0; i < numDistractors; i++) {
            if (Math.random() > 0.5) {
                const e = this.intermediateEdges[this.rand(0, this.intermediateEdges.length - 1)];
                distractors.push(Math.random() > 0.5 ? { t: e.t, b: e.bL } : { t: e.bL, b: e.t });
            } else {
                const step = path[this.rand(0, path.length - 1)];
                distractors.push({ t: step.b, b: step.t });
            }
        }

        return {
            start,
            target,
            hand: this.randomizeFlips(hand),
            distractors
        };
    }

    genAdvanced(level) {
        const scenario = this.advancedScenarios[this.rand(0, this.advancedScenarios.length - 1)]();
        const graph = this.buildGraph(scenario.edges);
        
        let start = scenario.startNodes[this.rand(0, scenario.startNodes.length - 1)];
        let target = '';
        let path = null;
        
        const possibleTargets = this.shuffle([...scenario.targetNodes]);
        for (const t of possibleTargets) {
            if (t === start) continue;
            path = this.findPath(graph, start, t);
            if (path && path.length >= 2) {
                target = t;
                break;
            }
        }

        if (!target) return this.genAdvanced(level);

        const hand = path.map(step => ({ t: step.t, b: step.b }));
        
        const distractors = [];
        const numDistractors = Math.min(2 + Math.floor(level / 3), 5);
        for (let i = 0; i < numDistractors; i++) {
            if (Math.random() > 0.5) {
                const e = scenario.edges[this.rand(0, scenario.edges.length - 1)];
                distractors.push(Math.random() > 0.5 ? { t: e.t, b: e.bL } : { t: e.bL, b: e.t });
            } else {
                const step = path[this.rand(0, path.length - 1)];
                // Creates malicious distractors (inverts numbers but keeps units exactly the same)
                const tNumMatch = step.t.match(/^([\d\.\×\^eE⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+)\s+(.*)$/);
                const bNumMatch = step.b.match(/^([\d\.\×\^eE⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+)\s+(.*)$/);
                if (tNumMatch && bNumMatch && Math.random() > 0.3) {
                    distractors.push({
                        t: `${bNumMatch[1]} ${tNumMatch[2]}`,
                        b: `${tNumMatch[1]} ${bNumMatch[2]}`
                    });
                } else {
                    distractors.push({ t: step.b, b: step.t });
                }
            }
        }

        return {
            start,
            target,
            hand: this.randomizeFlips(hand),
            distractors
        };
    }

    randomizeFlips(hand) {
        return hand.map(d => {
            if (Math.random() > 0.5) {
                return { t: d.b, b: d.t, flipped: true };
            }
            return d;
        });
    }

    // SCENARIO GENERATORS FOR ADVANCED
    genStoichiometry() {
        const reactions = [
            { eq: '2H₂ + O₂ -> 2H₂O', a: 'H₂', aM: '2.02', aC: 2, b: 'O₂', bM: '32.00', bC: 1, c: 'H₂O', cM: '18.02', cC: 2 },
            { eq: 'N₂ + 3H₂ -> 2NH₃', a: 'N₂', aM: '28.02', aC: 1, b: 'H₂', bM: '2.02', bC: 3, c: 'NH₃', cM: '17.04', cC: 2 },
            { eq: 'CH₄ + 2O₂ -> CO₂ + 2H₂O', a: 'CH₄', aM: '16.05', aC: 1, b: 'O₂', bM: '32.00', bC: 2, c: 'CO₂', cM: '44.01', cC: 1, d: 'H₂O', dM: '18.02', dC: 2 }
        ];

        const rxn = reactions[this.rand(0, reactions.length - 1)];
        const edges = [];
        const nodes = [];

        const addSubstance = (name, mass, coeff) => {
            edges.push({ a: `g ${name}`, b: `mol ${name}`, t: `1 mol ${name}`, bL: `${mass} g ${name}` });
            edges.push({ a: `mol ${name}`, b: `molecules ${name}`, t: `6.02×10²³ molecules ${name}`, bL: `1 mol ${name}` });
            nodes.push(`g ${name}`, `mol ${name}`, `molecules ${name}`);
        };

        addSubstance(rxn.a, rxn.aM, rxn.aC);
        addSubstance(rxn.b, rxn.bM, rxn.bC);
        addSubstance(rxn.c, rxn.cM, rxn.cC);
        if (rxn.d) addSubstance(rxn.d, rxn.dM, rxn.dC);

        edges.push({ a: `mol ${rxn.a}`, b: `mol ${rxn.b}`, t: `${rxn.bC} mol ${rxn.b}`, bL: `${rxn.aC} mol ${rxn.a}` });
        edges.push({ a: `mol ${rxn.a}`, b: `mol ${rxn.c}`, t: `${rxn.cC} mol ${rxn.c}`, bL: `${rxn.aC} mol ${rxn.a}` });
        edges.push({ a: `mol ${rxn.b}`, b: `mol ${rxn.c}`, t: `${rxn.cC} mol ${rxn.c}`, bL: `${rxn.bC} mol ${rxn.b}` });
        
        if (rxn.d) {
            edges.push({ a: `mol ${rxn.a}`, b: `mol ${rxn.d}`, t: `${rxn.dC} mol ${rxn.d}`, bL: `${rxn.aC} mol ${rxn.a}` });
            edges.push({ a: `mol ${rxn.b}`, b: `mol ${rxn.d}`, t: `${rxn.dC} mol ${rxn.d}`, bL: `${rxn.bC} mol ${rxn.b}` });
            edges.push({ a: `mol ${rxn.c}`, b: `mol ${rxn.d}`, t: `${rxn.dC} mol ${rxn.d}`, bL: `${rxn.cC} mol ${rxn.c}` });
        }

        return { edges, startNodes: nodes, targetNodes: nodes };
    }

    genTitration() {
        const acids = [
            { name: 'HCl', mass: '36.46', protons: 1 },
            { name: 'H₂SO₄', mass: '98.08', protons: 2 }
        ];
        const bases = [
            { name: 'NaOH', mass: '40.00', oh: 1 },
            { name: 'Ca(OH)₂', mass: '74.10', oh: 2 }
        ];

        const acid = acids[this.rand(0, acids.length - 1)];
        const base = bases[this.rand(0, bases.length - 1)];

        const aMolarity = (this.rand(1, 5) * 0.1).toFixed(2);
        const bMolarity = (this.rand(1, 5) * 0.1).toFixed(2);

        const edges = [
            { a: `L ${acid.name}`, b: `mL ${acid.name}`, t: `1000 mL ${acid.name}`, bL: `1 L ${acid.name}` },
            { a: `L ${base.name}`, b: `mL ${base.name}`, t: `1000 mL ${base.name}`, bL: `1 L ${base.name}` },
            { a: `L ${acid.name}`, b: `mol ${acid.name}`, t: `${aMolarity} mol ${acid.name}`, bL: `1 L ${acid.name}` },
            { a: `L ${base.name}`, b: `mol ${base.name}`, t: `${bMolarity} mol ${base.name}`, bL: `1 L ${base.name}` },
            { a: `mol ${acid.name}`, b: `mol ${base.name}`, t: `${acid.protons} mol ${base.name}`, bL: `${base.oh} mol ${acid.name}` },
            { a: `mol ${acid.name}`, b: `g ${acid.name}`, t: `${acid.mass} g ${acid.name}`, bL: `1 mol ${acid.name}` },
            { a: `mol ${base.name}`, b: `g ${base.name}`, t: `${base.mass} g ${base.name}`, bL: `1 mol ${base.name}` },
        ];

        const nodes = [
            `L ${acid.name}`, `mL ${acid.name}`, `mol ${acid.name}`, `g ${acid.name}`,
            `L ${base.name}`, `mL ${base.name}`, `mol ${base.name}`, `g ${base.name}`
        ];

        return { edges, startNodes: nodes, targetNodes: nodes };
    }

    genElectrochemistry() {
        const metals = [
            { name: 'Cu', mass: '63.55', e: 2 },
            { name: 'Ag', mass: '107.87', e: 1 },
            { name: 'Al', mass: '26.98', e: 3 }
        ];
        const metal = metals[this.rand(0, metals.length - 1)];
        const amps = (this.rand(1, 50) * 0.5).toFixed(1);

        const edges = [
            { a: `h`, b: `min`, t: `60 min`, bL: `1 h` },
            { a: `min`, b: `s`, t: `60 s`, bL: `1 min` },
            { a: `s`, b: `C`, t: `${amps} C`, bL: `1 s` },
            { a: `C`, b: `mol e⁻`, t: `1 mol e⁻`, bL: `96485 C` },
            { a: `mol e⁻`, b: `mol ${metal.name}`, t: `1 mol ${metal.name}`, bL: `${metal.e} mol e⁻` },
            { a: `mol ${metal.name}`, b: `g ${metal.name}`, t: `${metal.mass} g ${metal.name}`, bL: `1 mol ${metal.name}` }
        ];

        const startNodes = ['h', 'min', 's'];
        const targetNodes = [`mol e⁻`, `mol ${metal.name}`, `g ${metal.name}`];

        return { edges, startNodes, targetNodes };
    }

    genGasLaw() {
        const gases = [
            { name: 'O₂', mass: '32.00' },
            { name: 'CO₂', mass: '44.01' },
            { name: 'He', mass: '4.00' }
        ];
        const gas = gases[this.rand(0, gases.length - 1)];

        const edges = [
            { a: `L ${gas.name}`, b: `mL ${gas.name}`, t: `1000 mL ${gas.name}`, bL: `1 L ${gas.name}` },
            { a: `L ${gas.name}`, b: `mol ${gas.name}`, t: `1 mol ${gas.name}`, bL: `22.4 L ${gas.name}` },
            { a: `mol ${gas.name}`, b: `g ${gas.name}`, t: `${gas.mass} g ${gas.name}`, bL: `1 mol ${gas.name}` },
            { a: `mol ${gas.name}`, b: `molecules ${gas.name}`, t: `6.02×10²³ molecules ${gas.name}`, bL: `1 mol ${gas.name}` }
        ];

        const nodes = [`L ${gas.name}`, `mL ${gas.name}`, `mol ${gas.name}`, `g ${gas.name}`, `molecules ${gas.name}`];

        return { edges, startNodes: nodes, targetNodes: nodes };
    }
}