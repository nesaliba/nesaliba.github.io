export const GamesCatalog =[
    // --- CHEMISTRY ---
    { 
        id: 'metal-nonmetal', 
        title: 'Metal vs Non-Metal Properties', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Classify the physical and chemical properties of elements.', 
        play: 'Select a property tile and drop it into the correct intersection of property type and element category.', 
        path: 'games/chemistry/intro/metal-non-metal-properties-intro/index.html', 
        isNoModal: false,
        keywords:['metals', 'non-metals', 'metalloids', 'properties', 'conductivity', 'malleability', 'shiny', 'dull', 'elements']
    },
    { 
        id: 'physical-chemical', 
        title: 'Physical vs Chemical Change Intro', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Differentiate between physical changes and chemical reactions.', 
        play: 'Match descriptions and real-world examples to either Physical Change or Chemical Change.', 
        path: 'games/chemistry/intro/physical-vs-chemical-change-intro/index.html', 
        isNoModal: false,
        keywords: ['physical', 'chemical', 'change', 'reaction', 'reversible', 'states of matter']
    },
    { 
        id: 'periodic-groups', 
        title: 'Periodic Table Groups Intro', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Learn the characteristics of key periodic table groups.', 
        play: 'Match properties, valence electrons, reactivity, and examples to Alkali Metals, Halogens, Alkaline Earth Metals, and Noble Gases.', 
        path: 'games/chemistry/intro/periodic-table-groups-intro/index.html', 
        isNoModal: false,
        keywords:['periodic table', 'groups', 'alkali', 'halogens', 'noble gases', 'alkaline earth', 'valence electrons']
    },
    { 
        id: 'ionic-molecular', 
        title: 'Ionic & Molecular Compounds Intro', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Distinguish between ionic and molecular (covalent) compounds.', 
        play: 'Classify given chemical formulas by matching their element names, atom counts, bond types, and IUPAC names.', 
        path: 'games/chemistry/intro/ionic-molecular-compounds-intro/index.html', 
        isNoModal: false,
        keywords:['ionic', 'molecular', 'covalent', 'compounds', 'bonds', 'naming']
    },
    { 
        id: 'predict-iupac', 
        title: 'Predicting Ionic Compounds (IUPAC Names)', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Practice naming ionic compounds formed from various cations and anions.', 
        play: 'Match the correct IUPAC name tile to the intersection of the given positive and negative ions.', 
        path: 'games/chemistry/intro/predicting-ionic-compounds-iupac/index.html', 
        isNoModal: false,
        keywords:['ionic', 'compounds', 'iupac', 'nomenclature', 'naming', 'cations', 'anions']
    },
    { 
        id: 'predict-formulas', 
        title: 'Predicting Ionic Compound Formulas', 
        subject: 'chemistry', 
        category: 'Introductory Chemistry Topics', 
        desc: 'Practice writing chemical formulas for ionic compounds.', 
        play: 'Match the correct chemical formula tile to the intersection of the given cation and anion.', 
        path: 'games/chemistry/intro/predicting-ionic-compound-formulas/index.html', 
        isNoModal: false,
        keywords: ['ionic', 'compounds', 'formulas', 'cations', 'anions', 'charges']
    },
    { 
        id: 'expanded-octet', 
        title: 'Expanded Octet Bonding (Steric 5 & 6)', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Explore molecules with expanded octets (Steric Numbers 5 & 6).', 
        play: 'Match Lewis diagrams, steric numbers, bonds, hybridization, and VSEPR shapes for each molecule.', 
        path: 'games/chemistry/intermediate/expanded-octet-bonding/index.html', 
        isNoModal: false,
        keywords:['expanded octet', 'bonding', 'steric number', 'hybridization', 'vsepr', 'lewis structure', 'shape']
    },
    { 
        id: 'oxidation-reduction', 
        title: 'Oxidation vs. Reduction Comparison', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Compare the fundamental concepts of oxidation and reduction in chemistry.', 
        play: 'Match definitions, acronyms, half-reactions, and process examples to either Oxidation or Reduction.', 
        path: 'games/chemistry/intermediate/oxidation-reduction-comparison/index.html', 
        isNoModal: false,
        keywords: ['oxidation', 'reduction', 'redox', 'electrons', 'leo ger', 'half-reaction']
    },
    { 
        id: 'endo-exo', 
        title: 'Endothermic vs. Exothermic Comparison', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Compare reactions that absorb heat versus those that release heat.', 
        play: 'Match properties such as heat flow, potential energy diagrams, and thermometer readings to the correct type.', 
        path: 'games/chemistry/intermediate/endothermic-exothermic-comparison/index.html', 
        isNoModal: false,
        keywords:['endothermic', 'exothermic', 'heat', 'energy', 'enthalpy', 'temperature']
    },
    { 
        id: 'organic-esters', 
        title: 'Organic Chemistry Esters Comparison', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Identify and name organic ester compounds.', 
        play: 'Match chemical formulas, IUPAC names, and the constituent carboxylic acids and alcohols for various esters.', 
        path: 'games/chemistry/intermediate/organic-esters-comparison/index.html', 
        isNoModal: false,
        keywords: ['organic', 'esters', 'chemistry', 'carboxylic acid', 'alcohol', 'naming']
    },
    { 
        id: 'ion-exchange', 
        title: 'Ion Exchange (Electrochemistry)', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Take on the role of an electrochemical engineer. Master galvanic and electrolytic cells, calculate standard cell potentials, and identify redox half-reactions.', 
        play: 'Examine the electrochemical cell array and the provided standard reduction potentials. Calculate voltages or identify the flow of electrons and select the correct option to stabilize the system.', 
        path: 'games/chemistry/advanced/ion-exchange/index.html', 
        isNoModal: true,
        keywords:['electrochemistry', 'galvanic', 'electrolytic', 'cells', 'voltage', 'redox', 'anode', 'cathode']
    },
    { 
        id: 'acid-alliance', 
        title: 'Acid Alliance (Acids & Bases Strategy)', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Manage chemical crises by applying Chemistry 30 acids and bases principles. Stabilize systems using precise pH control and titration calculations.', 
        play: 'Read the crisis report and solve the procedurally generated problem. Select the correct multiple-choice option to stabilize the system. Defeat all 10 crises to win!', 
        path: 'games/chemistry/advanced/acid-alliance/index.html', 
        isNoModal: true,
        keywords:['acid', 'base', 'ph', 'poh', 'titration', 'buffer', 'conjugate', 'neutralization']
    },
    { 
        id: 'reaction-reactor', 
        title: 'Reaction Reactor (Equilibrium & Kinetics)', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Manage an industrial chemical reactor under shifting conditions. Master equilibrium, Le Chatelier\'s principle, and kinetics concepts.', 
        play: 'Analyze the incoming system shift on the reactor monitor. Use the displayed chemical equation to determine how changes to temperature, pressure, concentration, or catalysts affect the equilibrium or reaction rate. Make the correct adjustment before a meltdown occurs!', 
        path: 'games/chemistry/advanced/reaction-reactor/index.html', 
        isNoModal: true,
        keywords:['equilibrium', 'kinetics', 'le chatelier', 'catalyst', 'rate', 'reactor']
    },
    { 
        id: 'thermochemical-trials', 
        title: 'ThermochemicalTrials (Thermochemistry)', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Engineer controlled chemical reactions to meet precise energy targets. Apply Chemistry 30 thermochemistry principles under pressure.', 
        play: 'Analyze the incoming thermochemical data such as calorimetry values, Hess\'s Law equations, or potential energy profiles. Calculate the correct enthalpy change, activation energy, or heat transfer, and select the right option to stabilize the energy core.', 
        path: 'games/chemistry/advanced/thermochemical-trials/index.html', 
        isNoModal: true,
        keywords:['thermochemical', 'thermochemistry', 'enthalpy', 'hess', 'calorimetry', 'activation energy', 'exothermic', 'endothermic']
    },
    { 
        id: 'covalent-props', 
        title: 'Advanced Covalent Bonding Properties', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Analyze advanced covalent molecules and their properties.', 
        play: 'Match steric numbers, pi/sigma bonds, hybridization, and VSEPR shapes for the given molecules.', 
        path: 'games/chemistry/advanced/covalent-bonding-properties/index.html', 
        isNoModal: false,
        keywords:['covalent', 'bonding', 'steric', 'pi', 'sigma', 'hybridization', 'vsepr']
    },
    { 
        id: 'covalent-props-b', 
        title: 'Advanced Covalent Bonding Properties (Part B)', 
        subject: 'chemistry', 
        category: 'Advanced Chemistry Topics', 
        desc: 'Analyze a second set of advanced covalent molecules and their properties.', 
        play: 'Match steric numbers, pi/sigma bonds, hybridization, and VSEPR shapes for the given molecules.', 
        path: 'games/chemistry/advanced/covalent-bonding-part-b/index.html', 
        isNoModal: false,
        keywords:['covalent', 'bonding', 'steric', 'pi', 'sigma', 'hybridization', 'vsepr']
    },
    { 
        id: 'solution-strategist', 
        title: 'Solution Strategist (Concentration)', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Formulate precise solutions by mastering concentration, dilution, and solubility limits in applied scenarios.', 
        play: 'Adjust solute mass and solvent volume on the interactive lab bench. Watch the concentration change in real time and avoid unwanted precipitation!', 
        path: 'games/chemistry/intermediate/solution-strategist/index.html', 
        isNoModal: true,
        keywords:['concentration', 'dilution', 'molarity', 'solubility', 'precipitation', 'moles', 'solutions', 'chemistry 20']
    },
    { 
        id: 'gas-laws-gauntlet', 
        title: 'Gas Laws Gauntlet (Pressure & Temp)', 
        subject: 'chemistry', 
        category: 'Intermediate Chemistry Topics', 
        desc: 'Operate sealed industrial chambers by applying Boyle\'s, Charles\'s, Gay-Lussac\'s, and the Ideal Gas Law.', 
        play: 'Manipulate pressure and volume sliders to stabilize the system. Watch the live piston and telemetry graph respond, and remember to convert to Kelvin!', 
        path: 'games/chemistry/intermediate/gas-laws-gauntlet/index.html', 
        isNoModal: true,
        keywords:['gas laws', 'pressure', 'volume', 'temperature', 'boyle', 'charles', 'ideal gas', 'chemistry 20']
    },

    // --- BIOLOGY ---
    { 
        id: 'photosynthesis-respiration', 
        title: 'Photosynthesis vs. Cellular Respiration', 
        subject: 'biology', 
        category: 'Introductory Biology Topics', 
        desc: 'A tile-matching game comparing the processes of photosynthesis and cellular respiration.', 
        play: 'Place property tiles (such as organelles, energy changes, and chemical equations) into the correct columns.', 
        path: 'games/biology/intro/photosynthesis-vs-cellular-respiration/index.html', 
        isNoModal: false,
        keywords: ['photosynthesis', 'cellular respiration', 'chloroplast', 'mitochondria', 'energy', 'glucose']
    },
    { 
        id: 'mitosis-meiosis', 
        title: 'Mitosis vs. Meiosis Comparison', 
        subject: 'biology', 
        category: 'Introductory Biology Topics', 
        desc: 'A tile-matching game comparing the cellular processes of mitosis and meiosis.', 
        play: 'Click a property tile from the bank and place it into the correct empty slot under Mitosis or Meiosis.', 
        path: 'games/biology/intro/mitosis-vs-meiosis/index.html', 
        isNoModal: false,
        keywords:['mitosis', 'meiosis', 'cells', 'division', 'chromosomes', 'genetics']
    },
    { 
        id: 'cell-signal-scramble', 
        title: 'Cell Signal Scramble (Endocrine & Nervous)', 
        subject: 'biology', 
        category: 'Advanced Biology Topics', 
        desc: 'A systems-regulation game focusing on homeostasis, endocrine signaling, and nervous system communication.', 
        play: 'Select glands to release hormones and drag them to target organs, or trace nervous signals through neurons. Analyze concentration graphs to diagnose disorders like diabetes.', 
        path: 'games/biology/advanced/cell-signal-scramble/index.html', 
        isNoModal: true,
        keywords:['endocrine', 'nervous', 'system', 'homeostasis', 'hormones', 'neurons', 'diabetes', 'reflex']
    },

    // --- PHYSICS ---
    { 
        id: 'newtons-arena', 
        title: 'Newton\'s Arena (Forces & Acceleration)', 
        subject: 'physics', 
        category: 'Dynamics & Kinematics', 
        desc: 'A strategic problem-solving combat game grounded in Physics 20 principles.', 
        play: 'Construct free-body diagrams, calculate net force and acceleration across flat planes, inclines, and pulley systems to defeat opponents.', 
        path: 'games/physics/dynamics/newtons-arena/index.html', 
        isNoModal: true,
        keywords:['newton', 'forces', 'acceleration', 'dynamics', 'kinematics', 'friction', 'incline', 'pulley', 'tension']
    },
    { 
        id: 'field-commander', 
        title: 'Field Commander (E & B Fields)', 
        subject: 'physics', 
        category: 'Electromagnetism', 
        desc: 'A physics-based tactical simulator focusing on electric and magnetic fields (Physics 30).', 
        play: 'Adjust the Electric (E) and Magnetic (B) fields to steer charged particles to their targets using the Right-Hand Rule and electromagnetic force equations.', 
        path: 'games/physics/electromagnetism/field-commander/index.html', 
        isNoModal: true,
        keywords:['field', 'electric', 'magnetic', 'electromagnetism', 'lorentz', 'charge', 'particle']
    },
    { 
        id: 'reproduction-rift', 
        title: 'Reproduction Rift (Cell & Repro Biology)', 
        subject: 'biology', 
        category: 'Advanced Biology Topics', 
        desc: 'Repair biological rifts by mastering cell division, reproduction, and biotechnology.', 
        play: 'Complete 5 sequential levels covering mitosis/meiosis, hormones, fertilization, embryology, and IVF under a dark bioluminescent theme. Answer dynamic questions to heal the rift!', 
        path: 'games/biology/advanced/reproduction-rift/index.html', 
        isNoModal: true,
        keywords:['reproduction', 'cell division', 'mitosis', 'meiosis', 'hormones', 'fertilization', 'embryo', 'biotechnology', 'ivf']
    },

    // --- MATH ---
    { 
        id: 'function-factory', 
        title: 'Function Factory (Transformations)', 
        subject: 'math', 
        category: 'Intermediate and Advanced Math', 
        desc: 'An interactive graphing game focused on mathematical function transformations.', 
        play: 'Adjust the a, b, h, and k sliders to apply transformations to the parent function until it matches the target graph.', 
        path: 'games/math/functions/function-factory/index.html', 
        isNoModal: true,
        keywords:['function', 'transformations', 'graphing', 'linear', 'quadratic', 'absolute', 'cubic', 'shift', 'stretch']
    },
    { 
        id: 'polynomial-arena', 
        title: 'Polynomial Arena (Algebra Battles)', 
        subject: 'math', 
        category: 'Intermediate and Advanced Math', 
        desc: 'Turn algebra into an RPG battle system! Defeat polynomials by factoring, expanding, identifying graph features, and constructing equations.', 
        play: 'Read the mathematical prompt to find the weak point of the enemy polynomial. Select the correct multiple choice option to deal damage. Defeat all bosses to win!', 
        path: 'games/math/algebra/polynomial-arena/index.html', 
        isNoModal: true,
        keywords:['polynomial', 'algebra', 'quadratic', 'cubic', 'rational', 'factoring', 'zeros', 'roots', 'asymptotes']
    },
    { 
        id: 'trig-sniper', 
        title: 'Trig Sniper (Unit Circle & Identities)', 
        subject: 'math', 
        category: 'Trigonometry', 
        desc: 'A fast-paced game to test your knowledge of the unit circle and trigonometric identities.', 
        play: 'Read the prompt and click the correct coordinate(s) on the unit circle before the timer runs out. Watch out for penalties on misses!', 
        path: 'games/math/trigonometry/trig-sniper/index.html', 
        isNoModal: true,
        keywords:['trigonometry', 'unit circle', 'identities', 'sine', 'cosine', 'tangent', 'angles', 'radians', 'degrees']
    },
    { 
        id: 'calculus-time-reversal', 
        title: 'Calculus Time Reversal (Rates & Critical Points)', 
        subject: 'math', 
        category: 'Intermediate and Advanced Math', 
        desc: 'Act as a time agent using Math 30-1 calculus concepts. Compute instantaneous rates of change, critical points, and related rates to reverse system failures.', 
        play: 'Analyze the system anomaly prompt. Compute the requested derivative, rate, or optimization point, and select the correct option to stabilize the timeline before it collapses!', 
        path: 'games/math/calculus/calculus-time-reversal/index.html', 
        isNoModal: true,
        keywords:['calculus', 'derivatives', 'rates', 'critical points', 'optimization', 'related rates']
    },
    { 
        id: 'statistics-heist', 
        title: 'Statistics Heist (Probability & Strategy)', 
        subject: 'math', 
        category: 'Intermediate and Advanced Math', 
        desc: 'Plan and execute elaborate heists by calculating probability, expected value, combinations, and permutations. Miscalculations raise your heat level!', 
        play: 'Review the heist blueprint prompt. Correctly calculate the statistical requirement to bypass security phases. Clear all phases without maximizing your heat level to win.', 
        path: 'games/math/statistics/statistics-heist/index.html', 
        isNoModal: true,
        keywords:['statistics', 'probability', 'expected value', 'combinations', 'permutations', 'normal distribution']
    },

    // --- ENGLISH ---
    { 
        id: 'syntax-surgeon', 
        title: 'Syntax Surgeon (Editing & Grammar)', 
        subject: 'english', 
        category: 'Introductory English Topics', 
        desc: 'A fast-paced editing simulator where players repair flawed writing under time pressure.', 
        play: 'Read the flawed sentence on the monitor and select the correct revision or stylistic improvement to save the patient. Avoid penalties to keep them alive!', 
        path: 'games/english/syntax-surgeon/index.html', 
        isNoModal: true,
        keywords:['english', 'syntax', 'grammar', 'editing', 'writing', 'modifiers', 'structure', 'conciseness']
    },
    { 
        id: 'rhetoric-royale', 
        title: 'Rhetoric Royale (Debate & Persuasion)', 
        subject: 'english', 
        category: 'Intermediate and Advanced English', 
        desc: 'A competitive debate strategy game mapping ELA 20-1/30-1 concepts. Construct persuasive arguments, integrate evidence, and dismantle logical fallacies.', 
        play: 'Read the opponent\'s argument or rhetorical challenge. Select the correct strategy, rhetorical appeal, or fallacy identification to deal damage and defeat them.', 
        path: 'games/english/rhetoric-royale/index.html', 
        isNoModal: true,
        keywords:['english', 'rhetoric', 'debate', 'persuasion', 'fallacies', 'sophist', 'appeals', 'logos', 'ethos', 'pathos']
    }
];