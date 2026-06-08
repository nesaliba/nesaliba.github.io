export const COMPOUNDS = [

    // ── ALKANES ──────────────────────────────────────────────
    {
        id: 'methane',
        name: 'Methane',
        formula: 'CH₄',
        condensed: 'CH₄',
        type: 'Alkane',
        distractors: ['Ethane', 'Propane', 'Ethene', 'Methanol'],
        svgType: null
    },
    {
        id: 'ethane',
        name: 'Ethane',
        formula: 'C₂H₆',
        condensed: 'CH₃-CH₃',
        type: 'Alkane',
        distractors: ['Ethene', 'Ethyne', 'Propane', 'Methane'],
        svgType: 'ethane'
    },
    {
        id: 'propane',
        name: 'Propane',
        formula: 'C₃H₈',
        condensed: 'CH₃-CH₂-CH₃',
        type: 'Alkane',
        distractors: ['Butane', 'Ethane', 'Propene', 'Propan-1-ol'],
        svgType: 'propane'
    },
    {
        id: 'butane',
        name: 'Butane',
        formula: 'C₄H₁₀',
        condensed: 'CH₃-CH₂-CH₂-CH₃',
        type: 'Alkane',
        distractors: ['Propane', 'Pentane', 'But-1-ene', 'Isobutane'],
        svgType: 'butane'       // zigzag 3-segment chain — add to drawSkeletal
    },
    {
        id: 'pentane',
        name: 'Pentane',
        formula: 'C₅H₁₂',
        condensed: 'CH₃-(CH₂)₃-CH₃',
        type: 'Alkane',
        distractors: ['Butane', 'Hexane', 'Pent-1-ene', 'Cyclopentane'],
        svgType: 'pentane'
    },
    {
        id: '2-methylpropane',
        name: '2-Methylpropane',
        formula: 'C₄H₁₀',
        condensed: '(CH₃)₃CH',
        type: 'Alkane',
        distractors: ['Butane', 'Propane', '2-Methylbutane', 'Cyclobutane'],
        svgType: null
    },
    {
        id: '2-methylbutane',
        name: '2-Methylbutane',
        formula: 'C₅H₁₂',
        condensed: 'CH₃-CH(CH₃)-CH₂-CH₃',
        type: 'Alkane',
        distractors: ['Pentane', '2-Methylpropane', '3-Methylpentane', 'Neopentane'],
        svgType: null
    },
    {
        id: 'cyclohexane',
        name: 'Cyclohexane',
        formula: 'C₆H₁₂',
        condensed: 'C₆H₁₂ (ring)',
        type: 'Cycloalkane',
        distractors: ['Hexane', 'Benzene', 'Cyclohexene', 'Cyclohexanol'],
        svgType: 'cyclohexane'  // hexagon — add to drawSkeletal
    },
    {
        id: 'cyclopentane',
        name: 'Cyclopentane',
        formula: 'C₅H₁₀',
        condensed: 'C₅H₁₀ (ring)',
        type: 'Cycloalkane',
        distractors: ['Cyclopentene', 'Pentane', 'Cyclohexane', 'Cyclobutane'],
        svgType: 'cyclopentane'
    },

    // ── ALKENES ──────────────────────────────────────────────
    {
        id: 'ethene',
        name: 'Ethene',
        formula: 'C₂H₄',
        condensed: 'CH₂=CH₂',
        type: 'Alkene',
        distractors: ['Ethane', 'Ethyne', 'Propene', 'Butene'],
        svgType: 'ethene'
    },
    {
        id: 'propene',
        name: 'Propene',
        formula: 'C₃H₆',
        condensed: 'CH₂=CH-CH₃',
        type: 'Alkene',
        distractors: ['Propane', 'Propyne', 'Ethene', 'But-1-ene'],
        svgType: 'propene'
    },
    {
        id: 'but-1-ene',
        name: 'But-1-ene',
        formula: 'C₄H₈',
        condensed: 'CH₂=CH-CH₂-CH₃',
        type: 'Alkene',
        distractors: ['But-2-ene', 'Butane', 'Propene', '2-Methylpropene'],
        svgType: null
    },
    {
        id: 'but-2-ene',
        name: 'But-2-ene',
        formula: 'C₄H₈',
        condensed: 'CH₃-CH=CH-CH₃',
        type: 'Alkene',
        distractors: ['But-1-ene', 'Butane', '2-Methylpropene', 'Propene'],
        svgType: null
    },
    {
        id: '2-methylpropene',
        name: '2-Methylpropene',
        formula: 'C₄H₈',
        condensed: 'CH₂=C(CH₃)₂',
        type: 'Alkene',
        distractors: ['But-1-ene', 'But-2-ene', 'Propene', '2-Methylbutene'],
        svgType: null
    },
    {
        id: 'cyclohexene',
        name: 'Cyclohexene',
        formula: 'C₆H₁₀',
        condensed: 'C₆H₁₀ (ring, one C=C)',
        type: 'Cycloalkene',
        distractors: ['Cyclohexane', 'Benzene', 'Cyclohexanol', 'Hex-1-ene'],
        svgType: null
    },

    // ── ALKYNES ──────────────────────────────────────────────
    {
        id: 'ethyne',
        name: 'Ethyne',
        formula: 'C₂H₂',
        condensed: 'CH≡CH',
        type: 'Alkyne',
        distractors: ['Ethane', 'Ethene', 'Propyne', 'Butyne'],
        svgType: 'ethyne'
    },
    {
        id: 'propyne',
        name: 'Propyne',
        formula: 'C₃H₄',
        condensed: 'CH≡C-CH₃',
        type: 'Alkyne',
        distractors: ['Propene', 'Propane', 'But-1-yne', 'Ethyne'],
        svgType: 'propyne'
    },
    {
        id: 'but-1-yne',
        name: 'But-1-yne',
        formula: 'C₄H₆',
        condensed: 'CH≡C-CH₂-CH₃',
        type: 'Alkyne',
        distractors: ['But-2-yne', 'Propyne', 'But-1-ene', 'Butane'],
        svgType: null
    },
    {
        id: 'but-2-yne',
        name: 'But-2-yne',
        formula: 'C₄H₆',
        condensed: 'CH₃-C≡C-CH₃',
        type: 'Alkyne',
        distractors: ['But-1-yne', 'But-2-ene', 'Propyne', 'Pentyne'],
        svgType: null
    },

    // ── ALCOHOLS ─────────────────────────────────────────────
    {
        id: 'methanol',
        name: 'Methanol',
        formula: 'CH₄O',
        condensed: 'CH₃-OH',
        type: 'Alcohol',
        distractors: ['Ethanol', 'Propan-1-ol', 'Methanal', 'Methane'],
        svgType: null
    },
    {
        id: 'ethanol',
        name: 'Ethanol',
        formula: 'C₂H₆O',
        condensed: 'CH₃-CH₂-OH',
        type: 'Alcohol',
        distractors: ['Methanol', 'Propan-1-ol', 'Ethanal', 'Ethanoic acid'],
        svgType: 'bromoethane'
    },
    {
        id: 'propan-1-ol',
        name: 'Propan-1-ol',
        formula: 'C₃H₈O',
        condensed: 'CH₃-CH₂-CH₂-OH',
        type: 'Alcohol',
        distractors: ['Propan-2-ol', 'Propanal', 'Propanoic acid', 'Ethanol'],
        svgType: 'propanol'
    },
    {
        id: 'propan-2-ol',
        name: 'Propan-2-ol',
        formula: 'C₃H₈O',
        condensed: 'CH₃-CH(OH)-CH₃',
        type: 'Alcohol',
        distractors: ['Propan-1-ol', 'Propanal', 'Propanone', 'Ethanol'],
        svgType: null
    },
    {
        id: 'butan-1-ol',
        name: 'Butan-1-ol',
        formula: 'C₄H₁₀O',
        condensed: 'CH₃-CH₂-CH₂-CH₂-OH',
        type: 'Alcohol',
        distractors: ['Butan-2-ol', 'Propan-1-ol', 'Butanal', 'Butanoic acid'],
        svgType: null
    },
    {
        id: 'butan-2-ol',
        name: 'Butan-2-ol',
        formula: 'C₄H₁₀O',
        condensed: 'CH₃-CH(OH)-CH₂-CH₃',
        type: 'Alcohol',
        distractors: ['Butan-1-ol', 'Butan-2-one', 'Propan-2-ol', 'Butanal'],
        svgType: null
    },
    {
        id: '2-methylpropan-2-ol',
        name: '2-Methylpropan-2-ol',
        formula: 'C₄H₁₀O',
        condensed: '(CH₃)₃C-OH',
        type: 'Alcohol',
        distractors: ['Butan-1-ol', 'Butan-2-ol', '2-Methylpropan-1-ol', 'Propan-2-ol'],
        svgType: null
    },

    // ── ALDEHYDES ────────────────────────────────────────────
    {
        id: 'methanal',
        name: 'Methanal',
        formula: 'CH₂O',
        condensed: 'HCHO',
        type: 'Aldehyde',
        distractors: ['Ethanal', 'Propanal', 'Methanol', 'Methanoic acid'],
        svgType: null
    },
    {
        id: 'ethanal',
        name: 'Ethanal',
        formula: 'C₂H₄O',
        condensed: 'CH₃-CHO',
        type: 'Aldehyde',
        distractors: ['Propanal', 'Methanal', 'Ethanol', 'Ethanoic acid'],
        svgType: null
    },
    {
        id: 'propanal',
        name: 'Propanal',
        formula: 'C₃H₆O',
        condensed: 'CH₃-CH₂-CHO',
        type: 'Aldehyde',
        distractors: ['Propanone', 'Propan-1-ol', 'Butanal', 'Propanoic acid'],
        svgType: null
    },
    {
        id: 'butanal',
        name: 'Butanal',
        formula: 'C₄H₈O',
        condensed: 'CH₃-CH₂-CH₂-CHO',
        type: 'Aldehyde',
        distractors: ['Butan-1-ol', 'Butan-2-one', 'Propanal', 'Butanoic acid'],
        svgType: null
    },

    // ── KETONES ──────────────────────────────────────────────
    {
        id: 'propanone',
        name: 'Propanone',
        formula: 'C₃H₆O',
        condensed: 'CH₃-CO-CH₃',
        type: 'Ketone',
        distractors: ['Propanal', 'Propan-2-ol', 'Butanone', 'Propanoic acid'],
        svgType: null
    },
    {
        id: 'butanone',
        name: 'Butanone',
        formula: 'C₄H₈O',
        condensed: 'CH₃-CO-CH₂-CH₃',
        type: 'Ketone',
        distractors: ['Propanone', 'Butanal', 'Butan-2-ol', 'Pentan-3-one'],
        svgType: null
    },
    {
        id: 'pentan-3-one',
        name: 'Pentan-3-one',
        formula: 'C₅H₁₀O',
        condensed: 'CH₃-CH₂-CO-CH₂-CH₃',
        type: 'Ketone',
        distractors: ['Pentan-2-one', 'Butanone', 'Pentanal', 'Propanone'],
        svgType: null
    },

    // ── CARBOXYLIC ACIDS ─────────────────────────────────────
    {
        id: 'methanoic_acid',
        name: 'Methanoic acid',
        formula: 'CH₂O₂',
        condensed: 'HCOOH',
        type: 'Carboxylic Acid',
        distractors: ['Ethanoic acid', 'Methanal', 'Methanol', 'Propanoic acid'],
        svgType: null
    },
    {
        id: 'ethanoic_acid',
        name: 'Ethanoic acid',
        formula: 'C₂H₄O₂',
        condensed: 'CH₃-COOH',
        type: 'Carboxylic Acid',
        distractors: ['Methanoic acid', 'Propanoic acid', 'Ethanal', 'Ethanol'],
        svgType: null
    },
    {
        id: 'propanoic_acid',
        name: 'Propanoic acid',
        formula: 'C₃H₆O₂',
        condensed: 'CH₃-CH₂-COOH',
        type: 'Carboxylic Acid',
        distractors: ['Ethanoic acid', 'Propanol', 'Methyl ethanoate', 'Butanoic acid'],
        svgType: 'propanoic_acid'
    },
    {
        id: 'butanoic_acid',
        name: 'Butanoic acid',
        formula: 'C₄H₈O₂',
        condensed: 'CH₃-CH₂-CH₂-COOH',
        type: 'Carboxylic Acid',
        distractors: ['Propanoic acid', 'Butanal', 'Methyl propanoate', 'Butan-1-ol'],
        svgType: null
    },

    // ── ESTERS ───────────────────────────────────────────────
    {
        id: 'methyl_methanoate',
        name: 'Methyl methanoate',
        formula: 'C₂H₄O₂',
        condensed: 'HCOO-CH₃',
        type: 'Ester',
        distractors: ['Methyl ethanoate', 'Ethyl methanoate', 'Ethanoic acid', 'Dimethyl ether'],
        svgType: null
    },
    {
        id: 'methyl_ethanoate',
        name: 'Methyl ethanoate',
        formula: 'C₃H₆O₂',
        condensed: 'CH₃-COO-CH₃',
        type: 'Ester',
        distractors: ['Ethyl methanoate', 'Methyl propanoate', 'Ethanoic acid', 'Propan-1-ol'],
        svgType: null
    },
    {
        id: 'ethyl_ethanoate',
        name: 'Ethyl ethanoate',
        formula: 'C₄H₈O₂',
        condensed: 'CH₃-COO-CH₂-CH₃',
        type: 'Ester',
        distractors: ['Methyl propanoate', 'Propyl methanoate', 'Butanoic acid', 'Ethyl methanoate'],
        svgType: 'ethyl_ethanoate'
    },
    {
        id: 'propyl_methanoate',
        name: 'Propyl methanoate',
        formula: 'C₄H₈O₂',
        condensed: 'HCOO-CH₂-CH₂-CH₃',
        type: 'Ester',
        distractors: ['Butyl methanoate', 'Ethyl ethanoate', 'Methyl propanoate', 'Propanoic acid'],
        svgType: null
    },
    {
        id: 'methyl_propanoate',
        name: 'Methyl propanoate',
        formula: 'C₄H₈O₂',
        condensed: 'CH₃-CH₂-COO-CH₃',
        type: 'Ester',
        distractors: ['Ethyl ethanoate', 'Propyl methanoate', 'Butanoic acid', 'Methyl butanoate'],
        svgType: null
    },
    {
        id: 'ethyl_propanoate',
        name: 'Ethyl propanoate',
        formula: 'C₅H₁₀O₂',
        condensed: 'CH₃-CH₂-COO-CH₂-CH₃',
        type: 'Ester',
        distractors: ['Propyl ethanoate', 'Methyl butanoate', 'Pentanoic acid', 'Ethyl butanoate'],
        svgType: null
    },
    {
        id: 'propyl_ethanoate',
        name: 'Propyl ethanoate',
        formula: 'C₅H₁₀O₂',
        condensed: 'CH₃-COO-CH₂-CH₂-CH₃',
        type: 'Ester',
        distractors: ['Ethyl propanoate', 'Butyl methanoate', 'Pentanoic acid', 'Methyl butanoate'],
        svgType: null
    },

    // ── ALKYL HALIDES ─────────────────────────────────────────
    {
        id: 'chloromethane',
        name: 'Chloromethane',
        formula: 'CH₃Cl',
        condensed: 'CH₃Cl',
        type: 'Alkyl Halide',
        distractors: ['Bromomethane', 'Chloroethane', 'Dichloromethane', 'Iodomethane'],
        svgType: null
    },
    {
        id: 'bromomethane',
        name: 'Bromomethane',
        formula: 'CH₃Br',
        condensed: 'CH₃Br',
        type: 'Alkyl Halide',
        distractors: ['Chloromethane', 'Bromoethane', 'Iodomethane', 'Dibromomethane'],
        svgType: null
    },
    {
        id: 'bromoethane',
        name: 'Bromoethane',
        formula: 'C₂H₅Br',
        condensed: 'CH₃-CH₂Br',
        type: 'Alkyl Halide',
        distractors: ['Bromomethane', '1-Bromopropane', '2-Bromopropane', 'Chloroethane'],
        svgType: 'bromoethane'
    },
    {
        id: 'chloroethane',
        name: 'Chloroethane',
        formula: 'C₂H₅Cl',
        condensed: 'CH₃-CH₂Cl',
        type: 'Alkyl Halide',
        distractors: ['Bromoethane', 'Chloromethane', '1-Chloropropane', 'Iodoethane'],
        svgType: 'bromoethane'
    },
    {
        id: '1-bromopropane',
        name: '1-Bromopropane',
        formula: 'C₃H₇Br',
        condensed: 'CH₃-CH₂-CH₂Br',
        type: 'Alkyl Halide',
        distractors: ['2-Bromopropane', 'Bromoethane', '1-Chloropropane', '1-Iodopropane'],
        svgType: 'propanol'
    },
    {
        id: '2-bromopropane',
        name: '2-Bromopropane',
        formula: 'C₃H₇Br',
        condensed: 'CH₃-CHBr-CH₃',
        type: 'Alkyl Halide',
        distractors: ['1-Bromopropane', 'Bromoethane', '2-Chloropropane', '2-Iodopropane'],
        svgType: null
    },
    {
        id: '1-chloropropane',
        name: '1-Chloropropane',
        formula: 'C₃H₇Cl',
        condensed: 'CH₃-CH₂-CH₂Cl',
        type: 'Alkyl Halide',
        distractors: ['2-Chloropropane', '1-Bromopropane', 'Chloroethane', '1-Chlorobutane'],
        svgType: 'propanol'
    },
    {
        id: '1-bromobutane',
        name: '1-Bromobutane',
        formula: 'C₄H₉Br',
        condensed: 'CH₃-CH₂-CH₂-CH₂Br',
        type: 'Alkyl Halide',
        distractors: ['2-Bromobutane', '1-Bromopropane', '1-Chlorobutane', '4-Bromobutane'],
        svgType: null
    },
    {
        id: '2-bromobutane',
        name: '2-Bromobutane',
        formula: 'C₄H₉Br',
        condensed: 'CH₃-CHBr-CH₂-CH₃',
        type: 'Alkyl Halide',
        distractors: ['1-Bromobutane', '2-Bromopropane', '3-Bromobutane', '2-Chlorobutane'],
        svgType: null
    },
    
    // ── ETHERS ───────────────────────────────────────────────
    {
        id: 'dimethyl_ether',
        name: 'Dimethyl ether',
        formula: 'C₂H₆O',
        condensed: 'CH₃-O-CH₃',
        type: 'Ether',
        distractors: ['Ethanol', 'Diethyl ether', 'Methyl ethyl ether', 'Methanol'],
        svgType: null
    },
    {
        id: 'diethyl_ether',
        name: 'Diethyl ether',
        formula: 'C₄H₁₀O',
        condensed: 'CH₃-CH₂-O-CH₂-CH₃',
        type: 'Ether',
        distractors: ['Dimethyl ether', 'Methyl propyl ether', 'Butan-1-ol', 'Butanal'],
        svgType: null
    },
    {
        id: 'methyl_ethyl_ether',
        name: 'Methyl ethyl ether',
        formula: 'C₃H₈O',
        condensed: 'CH₃-O-CH₂-CH₃',
        type: 'Ether',
        distractors: ['Dimethyl ether', 'Diethyl ether', 'Propan-1-ol', 'Propan-2-ol'],
        svgType: null
    },

    // ── AROMATIC ─────────────────────────────────────────────
    {
        id: 'benzene',
        name: 'Benzene',
        formula: 'C₆H₆',
        condensed: 'C₆H₆ (hexagonal ring)',
        type: 'Aromatic',
        distractors: ['Cyclohexane', 'Cyclohexene', 'Toluene', 'Phenol'],
        svgType: 'benzene'
    },
    {
        id: 'toluene',
        name: 'Toluene',
        formula: 'C₇H₈',
        condensed: 'C₆H₅-CH₃',
        type: 'Aromatic',
        distractors: ['Benzene', 'Phenol', 'Xylene', 'Styrene'],
        svgType: null
    },
    {
        id: 'phenol',
        name: 'Phenol',
        formula: 'C₆H₆O',
        condensed: 'C₆H₅-OH',
        type: 'Aromatic',
        distractors: ['Benzene', 'Cyclohexanol', 'Toluene', 'Benzoic acid'],
        svgType: null
    },
];


// ============================================================
//  REACTIONS
// ============================================================

export const REACTIONS = [

    // ── ADDITION ─────────────────────────────────────────────
    {
        id: 'addition_HBr_ethene',
        reactant: 'ethene',
        product: 'bromoethane',
        equation: 'CH₂=CH₂ + HBr → CH₃-CH₂Br',
        type: 'Addition',
        justification: 'The C=C pi bond is broken and H and Br add across it to form two new sigma bonds.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Addition reactions occur when atoms add across a C=C or C≡C bond, converting an unsaturated compound into a saturated one.'
    },
    {
        id: 'addition_HBr_propene',
        reactant: 'propene',
        product: 'bromoethane',
        equation: 'CH₂=CH-CH₃ + HBr → CH₃-CHBr-CH₃',
        type: 'Addition',
        justification: 'HBr adds across the double bond of propene; Br attaches to the secondary carbon (Markovnikov).',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Electrophilic addition to an asymmetric alkene follows Markovnikov\'s rule: the H adds to the carbon bearing more H atoms.'
    },
    {
        id: 'addition_H2_ethene',
        reactant: 'ethene',
        product: 'ethane',
        equation: 'CH₂=CH₂ + H₂ → CH₃-CH₃',
        type: 'Addition',
        justification: 'Hydrogen gas adds across the double bond (hydrogenation), saturating the compound.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Catalytic hydrogenation is an addition reaction where H₂ is added across a double bond using a metal catalyst.'
    },
    {
        id: 'addition_Cl2_ethene',
        reactant: 'ethene',
        product: 'ethane',
        equation: 'CH₂=CH₂ + Cl₂ → ClCH₂-CH₂Cl',
        type: 'Addition',
        justification: 'Cl₂ adds across the C=C double bond forming 1,2-dichloroethane.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Halogen addition across a double bond is a classic addition reaction; the product is a vicinal dihalide.'
    },
    {
        id: 'addition_H2O_ethene',
        reactant: 'ethene',
        product: 'ethanol',
        equation: 'CH₂=CH₂ + H₂O → CH₃-CH₂-OH',
        type: 'Addition',
        justification: 'Water adds across the double bond (hydration) to form ethanol.',
        distractors: ['Substitution', 'Elimination', 'Esterification', 'Combustion'],
        explanation: 'Hydration of an alkene is an acid-catalysed addition where water adds across the C=C double bond.'
    },
    {
        id: 'addition_HBr_ethyne',
        reactant: 'ethyne',
        product: 'bromoethane',
        equation: 'CH≡CH + 2HBr → CH₃-CHBr₂',
        type: 'Addition',
        justification: 'Two moles of HBr add successively across the C≡C triple bond.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Alkynes can undergo addition twice; two equivalents of a reagent add across the triple bond to give a geminal dihalide.'
    },
    {
        id: 'addition_H2_propyne',
        reactant: 'propyne',
        product: 'propane',
        equation: 'CH≡C-CH₃ + 2H₂ → CH₃-CH₂-CH₃',
        type: 'Addition',
        justification: 'Full hydrogenation of the triple bond requires two moles of H₂ and yields propane.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Catalytic hydrogenation of an alkyne to an alkane requires two equivalents of H₂.'
    },

    // ── SUBSTITUTION ─────────────────────────────────────────
    {
        id: 'substitution_ethane_Br2',
        reactant: 'ethane',
        product: 'bromoethane',
        equation: 'CH₃-CH₃ + Br₂ → CH₃-CH₂Br + HBr',
        type: 'Substitution',
        justification: 'A hydrogen on the saturated alkane is replaced by bromine, releasing HBr.',
        distractors: ['Addition', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Free-radical halogenation replaces a C–H bond on an alkane with a C–X bond.'
    },
    {
        id: 'substitution_propane_Cl2',
        reactant: 'propane',
        product: '1-chloropropane',
        equation: 'CH₃-CH₂-CH₃ + Cl₂ → CH₃-CH₂-CH₂Cl + HCl',
        type: 'Substitution',
        justification: 'Chlorine replaces a terminal hydrogen on propane under UV light.',
        distractors: ['Addition', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Halogenation of alkanes is a free-radical substitution initiated by UV light or heat.'
    },
    {
        id: 'substitution_methane_Cl2',
        reactant: 'methane',
        product: 'chloromethane',
        equation: 'CH₄ + Cl₂ → CH₃Cl + HCl',
        type: 'Substitution',
        justification: 'One hydrogen on methane is replaced by chlorine, yielding chloromethane and hydrogen chloride.',
        distractors: ['Addition', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Monochlorination of methane is the simplest example of free-radical substitution in alkanes.'
    },
    {
        id: 'substitution_butane_Br2',
        reactant: 'butane',
        product: '1-bromobutane',
        equation: 'CH₃-CH₂-CH₂-CH₃ + Br₂ → CH₃-CH₂-CH₂-CH₂Br + HBr',
        type: 'Substitution',
        justification: 'Bromine replaces a terminal hydrogen on butane via a free-radical mechanism.',
        distractors: ['Addition', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Bromination of alkanes follows the same free-radical mechanism as chlorination but is more selective.'
    },

    // ── ELIMINATION ──────────────────────────────────────────
    {
        id: 'elimination_propan1ol',
        reactant: 'propan-1-ol',
        product: 'propene',
        equation: 'CH₃-CH₂-CH₂-OH → CH₂=CH-CH₃ + H₂O',
        type: 'Elimination',
        justification: 'OH and an adjacent H are removed, forming a C=C double bond and releasing water.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Dehydration of alcohols is an acid-catalysed elimination reaction producing an alkene and water.'
    },
    {
        id: 'elimination_ethanol',
        reactant: 'ethanol',
        product: 'ethene',
        equation: 'CH₃-CH₂-OH → CH₂=CH₂ + H₂O',
        type: 'Elimination',
        justification: 'Concentrated H₂SO₄ at 170 °C removes H and OH from adjacent carbons, forming a double bond.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Dehydration of ethanol is a classic elimination producing ethene — the reverse of alkene hydration.'
    },
    {
        id: 'elimination_bromoethane',
        reactant: 'bromoethane',
        product: 'ethene',
        equation: 'CH₃-CH₂Br + KOH(alc) → CH₂=CH₂ + KBr + H₂O',
        type: 'Elimination',
        justification: 'Alcoholic KOH removes HBr from bromoethane, forming a double bond.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Dehydrohalogenation using alcoholic KOH removes HX from a haloalkane to produce an alkene.'
    },
    {
        id: 'elimination_2bromopropane',
        reactant: '2-bromopropane',
        product: 'propene',
        equation: 'CH₃-CHBr-CH₃ + KOH(alc) → CH₂=CH-CH₃ + KBr + H₂O',
        type: 'Elimination',
        justification: 'Alcoholic KOH removes HBr, yielding propene via dehydrohalogenation.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Secondary haloalkanes readily undergo elimination with strong base to give the more substituted alkene.'
    },
    {
        id: 'elimination_butan1ol',
        reactant: 'butan-1-ol',
        product: 'but-1-ene',
        equation: 'CH₃-CH₂-CH₂-CH₂-OH → CH₂=CH-CH₂-CH₃ + H₂O',
        type: 'Elimination',
        justification: 'Dehydration removes OH and an adjacent H from butan-1-ol to form but-1-ene.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Acid-catalysed dehydration of a primary alcohol typically gives the terminal alkene.'
    },

    // ── COMBUSTION ───────────────────────────────────────────
    {
        id: 'combustion_methane',
        reactant: 'methane',
        product: 'CO₂ + H₂O',
        equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
        type: 'Combustion',
        justification: 'Methane burns completely in oxygen to release energy, producing CO₂ and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Complete combustion of any hydrocarbon in excess O₂ yields only CO₂ and H₂O.'
    },
    {
        id: 'combustion_propane',
        reactant: 'propane',
        product: 'CO₂ + H₂O',
        equation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
        type: 'Combustion',
        justification: 'Propane reacts with oxygen to produce carbon dioxide and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Combustion of propane is used in LPG appliances; the balanced equation requires 5 mol O₂.'
    },
    {
        id: 'combustion_ethane',
        reactant: 'ethane',
        product: 'CO₂ + H₂O',
        equation: 'C₂H₆ + 7/2 O₂ → 2CO₂ + 3H₂O',
        type: 'Combustion',
        justification: 'Ethane undergoes complete combustion releasing heat and forming CO₂ and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Complete combustion of ethane: each carbon becomes CO₂ and each pair of H atoms forms water.'
    },
    {
        id: 'combustion_ethanol',
        reactant: 'ethanol',
        product: 'CO₂ + H₂O',
        equation: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
        type: 'Combustion',
        justification: 'Ethanol burns completely in oxygen to give CO₂ and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Combustion of alcohols, like hydrocarbons, produces CO₂ and H₂O — relevant to biofuel applications.'
    },
    {
        id: 'combustion_butane',
        reactant: 'butane',
        product: 'CO₂ + H₂O',
        equation: 'C₄H₁₀ + 13/2 O₂ → 4CO₂ + 5H₂O',
        type: 'Combustion',
        justification: 'Complete combustion of butane yields four moles of CO₂ and five of water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Butane (lighter fuel) undergoes complete combustion; longer chains require more O₂ per mole.'
    },

    // ── ESTERIFICATION ───────────────────────────────────────
    {
        id: 'esterification_ethanoic_ethanol',
        reactant: 'ethanoic_acid',
        product: 'ethyl_ethanoate',
        equation: 'CH₃-COOH + CH₃-CH₂-OH ⇌ CH₃-COO-CH₂-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'Ethanoic acid and ethanol condense under acid catalyst to produce ethyl ethanoate and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'Esterification is a reversible condensation reaction between a carboxylic acid and an alcohol, catalysed by a strong acid.'
    },
    {
        id: 'esterification_propanoic_ethanol',
        reactant: 'propanoic_acid',
        product: 'ethyl_propanoate',
        equation: 'CH₃-CH₂-COOH + CH₃-CH₂-OH ⇌ CH₃-CH₂-COO-CH₂-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'Propanoic acid reacts with ethanol to produce ethyl propanoate and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'The acid group and alcohol group combine with loss of water to form an ester linkage (–COO–).'
    },
    {
        id: 'esterification_methanoic_propanol',
        reactant: 'methanoic_acid',
        product: 'propyl_methanoate',
        equation: 'HCOOH + CH₃-CH₂-CH₂-OH ⇌ HCOO-CH₂-CH₂-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'Methanoic acid reacts with propan-1-ol to produce propyl methanoate (propyl formate) and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'Even the simplest carboxylic acid (methanoic acid) can esterify with any alcohol.'
    },
    {
        id: 'esterification_butanoic_methanol',
        reactant: 'butanoic_acid',
        product: 'methyl_propanoate',
        equation: 'CH₃-CH₂-CH₂-COOH + CH₃-OH ⇌ CH₃-CH₂-CH₂-COO-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'Butanoic acid and methanol condense to give methyl butanoate (pineapple aroma ester) and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'Many fruit aromas are esters; methyl butanoate is responsible for pineapple scent.'
    },
    {
        id: 'esterification_ethanoic_propanol',
        reactant: 'ethanoic_acid',
        product: 'propyl_ethanoate',
        equation: 'CH₃-COOH + CH₃-CH₂-CH₂-OH ⇌ CH₃-COO-CH₂-CH₂-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'Ethanoic acid and propan-1-ol react to form propyl ethanoate (pear-drop aroma) and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'Ester formation always releases water as the –OH of the acid and the H of the alcohol combine.'
    },

    // ── OXIDATION ────────────────────────────────────────────
    {
        id: 'oxidation_ethanol_to_ethanal',
        reactant: 'ethanol',
        product: 'ethanal',
        equation: 'CH₃-CH₂-OH + [O] → CH₃-CHO + H₂O',
        type: 'Oxidation',
        justification: 'A primary alcohol is partially oxidised by removing two hydrogen atoms to give an aldehyde.',
        distractors: ['Reduction', 'Esterification', 'Elimination', 'Combustion'],
        explanation: 'Mild oxidation of a primary alcohol produces an aldehyde; further oxidation gives a carboxylic acid.'
    },
    {
        id: 'oxidation_ethanal_to_ethanoic',
        reactant: 'ethanal',
        product: 'ethanoic_acid',
        equation: 'CH₃-CHO + [O] → CH₃-COOH',
        type: 'Oxidation',
        justification: 'An aldehyde is further oxidised to a carboxylic acid by gaining an oxygen atom.',
        distractors: ['Reduction', 'Esterification', 'Elimination', 'Combustion'],
        explanation: 'Aldehydes are easily oxidised to carboxylic acids; this is used in Fehling\'s and Tollens\' tests.'
    },
    {
        id: 'oxidation_propan1ol_to_propanal',
        reactant: 'propan-1-ol',
        product: 'propanal',
        equation: 'CH₃-CH₂-CH₂-OH + [O] → CH₃-CH₂-CHO + H₂O',
        type: 'Oxidation',
        justification: 'Mild oxidation of propan-1-ol yields propanal by removing two hydrogen atoms.',
        distractors: ['Reduction', 'Esterification', 'Elimination', 'Combustion'],
        explanation: 'Primary alcohols oxidise to aldehydes under mild conditions (e.g., acidified dichromate).'
    },
    {
        id: 'oxidation_propan2ol_to_propanone',
        reactant: 'propan-2-ol',
        product: 'propanone',
        equation: 'CH₃-CH(OH)-CH₃ + [O] → CH₃-CO-CH₃ + H₂O',
        type: 'Oxidation',
        justification: 'A secondary alcohol is oxidised to a ketone by removing two hydrogen atoms.',
        distractors: ['Reduction', 'Esterification', 'Elimination', 'Combustion'],
        explanation: 'Oxidation of secondary alcohols produces ketones; unlike aldehydes, ketones are not easily further oxidised.'
    },

    // ── HYDROLYSIS ───────────────────────────────────────────
    {
        id: 'hydrolysis_ethyl_ethanoate',
        reactant: 'ethyl_ethanoate',
        product: 'ethanoic_acid',
        equation: 'CH₃-COO-CH₂-CH₃ + H₂O ⇌ CH₃-COOH + CH₃-CH₂-OH',
        type: 'Hydrolysis',
        justification: 'Water breaks the ester bond, regenerating the carboxylic acid and alcohol.',
        distractors: ['Esterification', 'Elimination', 'Addition', 'Combustion'],
        explanation: 'Acid or base hydrolysis of an ester is the reverse of esterification, breaking the –COO– linkage.'
    },
    {
        id: 'hydrolysis_methyl_ethanoate',
        reactant: 'methyl_ethanoate',
        product: 'ethanoic_acid',
        equation: 'CH₃-COO-CH₃ + H₂O ⇌ CH₃-COOH + CH₃-OH',
        type: 'Hydrolysis',
        justification: 'The ester bond in methyl ethanoate is cleaved by water to give ethanoic acid and methanol.',
        distractors: ['Esterification', 'Elimination', 'Addition', 'Combustion'],
        explanation: 'Hydrolysis of esters is catalysed by acid or base and is the reverse of condensation.'
    },
    {
        id: 'hydrolysis_bromoethane',
        reactant: 'bromoethane',
        product: 'ethanol',
        equation: 'CH₃-CH₂Br + NaOH(aq) → CH₃-CH₂-OH + NaBr',
        type: 'Hydrolysis',
        justification: 'Aqueous NaOH substitutes Br with OH, converting bromoethane to ethanol.',
        distractors: ['Elimination', 'Addition', 'Esterification', 'Combustion'],
        explanation: 'Hydrolysis of a haloalkane with aqueous alkali replaces the halide with a hydroxyl group to give an alcohol.'
    },
    {
        id: 'hydrolysis_1bromopropane',
        reactant: '1-bromopropane',
        product: 'propan-1-ol',
        equation: 'CH₃-CH₂-CH₂Br + NaOH(aq) → CH₃-CH₂-CH₂-OH + NaBr',
        type: 'Hydrolysis',
        justification: 'Aqueous NaOH replaces the bromine with an OH group, producing propan-1-ol.',
        distractors: ['Elimination', 'Addition', 'Esterification', 'Combustion'],
        explanation: 'Nucleophilic substitution with aqueous hydroxide converts haloalkanes to alcohols.'
    },
];