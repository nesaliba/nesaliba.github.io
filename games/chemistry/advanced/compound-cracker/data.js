export const COMPOUNDS = [
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
        id: 'ethene',
        name: 'Ethene',
        formula: 'C₂H₄',
        condensed: 'CH₂=CH₂',
        type: 'Alkene',
        distractors: ['Ethane', 'Ethyne', 'Propene', 'Butene'],
        svgType: 'ethene'
    },
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
        id: 'propane',
        name: 'Propane',
        formula: 'C₃H₈',
        condensed: 'CH₃-CH₂-CH₃',
        type: 'Alkane',
        distractors: ['Butane', 'Ethane', 'Propene', 'Propan-1-ol'],
        svgType: 'propane'
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
        id: 'propan-1-ol',
        name: 'Propan-1-ol',
        formula: 'C₃H₈O',
        condensed: 'CH₃-CH₂-CH₂-OH',
        type: 'Alcohol',
        distractors: ['Propan-2-ol', 'Propanal', 'Propanoic acid', 'Ethanol'],
        svgType: 'propanol'
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
        id: 'bromoethane',
        name: 'Bromoethane',
        formula: 'C₂H₅Br',
        condensed: 'CH₃-CH₂Br',
        type: 'Alkyl Halide',
        distractors: ['Bromomethane', '1-bromopropane', '2-bromopropane', 'Chloroethane'],
        svgType: 'bromoethane'
    },
    {
        id: 'ethyl_ethanoate',
        name: 'Ethyl ethanoate',
        formula: 'C₄H₈O₂',
        condensed: 'CH₃-COO-CH₂-CH₃',
        type: 'Ester',
        distractors: ['Methyl propanoate', 'Propyl methanoate', 'Butanoic acid', 'Ethyl methanoate'],
        svgType: 'ethyl_ethanoate'
    }
];

export const REACTIONS = [
    {
        id: 'addition_rxn',
        reactant: 'ethene',
        product: 'bromoethane',
        equation: 'CH₂=CH₂ + HBr → CH₃-CH₂Br',
        type: 'Addition',
        justification: 'The carbon-carbon double (pi) bond is broken to form two new single (sigma) bonds with hydrogen and bromine.',
        distractors: ['Substitution', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Addition reactions occur when atoms are added across an unsaturated double or triple bond.'
    },
    {
        id: 'substitution_rxn',
        reactant: 'ethane',
        product: 'bromoethane',
        equation: 'CH₃-CH₃ + Br₂ → CH₃-CH₂Br + HBr',
        type: 'Substitution',
        justification: 'A hydrogen atom on the saturated alkane chain is replaced by a bromine atom, yielding an inorganic byproduct.',
        distractors: ['Addition', 'Elimination', 'Combustion', 'Esterification'],
        explanation: 'Substitution reactions involve the replacement of a hydrogen atom on a saturated alkane with a halogen atom.'
    },
    {
        id: 'elimination_rxn',
        reactant: 'propan-1-ol',
        product: 'propene',
        equation: 'CH₃-CH₂-CH₂-OH → CH₂=CH-CH₃ + H₂O',
        type: 'Elimination',
        justification: 'Atoms are removed from adjacent carbon atoms on the reactant chain to form a new carbon-carbon double (pi) bond.',
        distractors: ['Addition', 'Substitution', 'Combustion', 'Esterification'],
        explanation: 'Elimination reactions remove atoms from adjacent carbons to form an unsaturated bond, releasing a small molecule byproduct.'
    },
    {
        id: 'esterification_rxn',
        reactant: 'propanoic_acid',
        product: 'ethyl_ethanoate',
        equation: 'CH₃-CH₂-COOH + CH₃-CH₂-OH → CH₃-CH₂-COOCH₂-CH₃ + H₂O',
        type: 'Esterification',
        justification: 'A carboxylic acid reacts with an alcohol in a condensation process, releasing water to produce an ester.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Combustion'],
        explanation: 'Esterification is a specific condensation-substitution reaction linking an acid and an alcohol together.'
    },
    {
        id: 'combustion_rxn',
        reactant: 'propane',
        product: 'CO₂ + H₂O',
        equation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
        type: 'Combustion',
        justification: 'A hydrocarbon reacts rapidly with oxygen gas to release thermal energy and generate carbon dioxide and water.',
        distractors: ['Addition', 'Substitution', 'Elimination', 'Esterification'],
        explanation: 'Combustion reactions involve rapid oxidation of a fuel, releasing heat and yielding carbon dioxide and water.'
    }
];