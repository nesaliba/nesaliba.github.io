import { BaseGame } from '/games/shared/base-game.js';

const SCENARIOS =[
    {
        id: 1,
        type: 'endocrine',
        title: 'Scenario 1: Post-Meal Glucose Spike',
        stimulus: 'Blood glucose has spiked after a carbohydrate-heavy meal. Restore homeostasis using the correct dosage.',
        variableName: 'Blood Glucose (mg/dL)',
        graphMin: 40, graphMax: 220, normalMin: 80, normalMax: 100,
        initialValue: 180,
        glands:[
            { id: 'pancreas', name: 'Pancreas', hormones: ['Insulin', 'Glucagon'] },
            { id: 'pituitary', name: 'Pituitary', hormones: ['TSH'] }
        ],
        organs:[
            { id: 'liver', name: 'Liver' },
            { id: 'thyroid', name: 'Thyroid Gland' }
        ],
        rules:[
            { hormone: 'Insulin', target: 'liver', effect: -45, isCorrect: true, msg: 'Insulin applied! Liver stores glucose, but more might be needed.' },
            { hormone: 'Glucagon', target: 'liver', effect: 40, isCorrect: false, msg: 'Wrong! Glucagon tells the liver to release MORE glucose!' },
            { hormone: 'TSH', target: 'thyroid', effect: 0, isCorrect: false, msg: 'TSH stimulates the thyroid, which affects metabolism, not immediate blood sugar.' }
        ],
        disruptor: {
            triggerAt: 1, 
            effect: 40, 
            msg: '⚠️ Random Event: Patient just drank a sugary soda! Blood glucose spiking again!'
        }
    },
    {
        id: 2,
        type: 'nervous',
        title: 'Scenario 2: Hot Stove Reflex',
        stimulus: 'Your hand just touched a burning hot stove! Transmit the reflex arc signal to pull away.',
        nodes:[
            { id: 'interneuron', name: 'Interneuron (Spinal Cord)', top: '15%', left: '50%' },
            { id: 'motor', name: 'Motor Neuron', top: '50%', left: '80%' },
            { id: 'receptor', name: 'Sensory Receptor (Skin)', top: '85%', left: '15%' },
            { id: 'effector', name: 'Effector (Muscle)', top: '85%', left: '85%' },
            { id: 'sensory', name: 'Sensory Neuron', top: '50%', left: '20%' }
        ],
        correctSequence:['receptor', 'sensory', 'interneuron', 'motor', 'effector'],
        msg: 'Excellent! The reflex arc successfully bypassed the brain for a rapid protective response.'
    },
    {
        id: 3,
        type: 'endocrine',
        title: 'Scenario 3: The Thyroid Cascade',
        stimulus: 'Body temperature and metabolism are dropping. Initiate the multi-step cascade from the brain to the body cells.',
        variableName: 'Metabolic Rate (BMR %)',
        graphMin: 50, graphMax: 150, normalMin: 95, normalMax: 105,
        initialValue: 60,
        glands:[
            { id: 'hypothalamus', name: 'Hypothalamus', hormones: ['TRH'] },
            { id: 'pituitary', name: 'Pituitary', hormones:[] }, // TSH unlocks here dynamically
            { id: 'thyroid', name: 'Thyroid', hormones: [] } // Thyroxine unlocks here dynamically
        ],
        organs:[
            { id: 'pituitary', name: 'Pituitary Gland' },
            { id: 'thyroid', name: 'Thyroid Gland' },
            { id: 'body_cells', name: 'Body Cells' }
        ],
        rules:[
            { hormone: 'TRH', target: 'pituitary', effect: 5, isCorrect: true, msg: 'TRH stimulates the Pituitary! TSH is now available.', unlocks: { gland: 'pituitary', hormone: 'TSH' } },
            { hormone: 'TSH', target: 'thyroid', effect: 5, isCorrect: true, msg: 'TSH stimulates the Thyroid! Thyroxine is now available.', unlocks: { gland: 'thyroid', hormone: 'Thyroxine' } },
            { hormone: 'Thyroxine', target: 'body_cells', effect: 30, isCorrect: true, msg: 'Thyroxine successfully increases the metabolic rate of body cells!' },
            { hormone: 'TRH', target: 'thyroid', effect: 0, isCorrect: false, msg: 'TRH does not act on the thyroid directly. It must go to the Pituitary.' },
            { hormone: 'TSH', target: 'body_cells', effect: 0, isCorrect: false, msg: 'TSH only targets the thyroid, not general body cells.' }
        ]
    },
    {
        id: 4,
        type: 'endocrine',
        title: 'Scenario 4: Bear Attack! (Synergy)',
        stimulus: 'A bear is charging! You need a massive, sustained surge of energy. Combine synergistic hormones to reach maximum output!',
        variableName: 'Energy Availability',
        graphMin: 0, graphMax: 100, normalMin: 80, normalMax: 100,
        initialValue: 30,
        glands:[
            { id: 'adrenal_medulla', name: 'Adrenal Medulla', hormones: ['Epinephrine'] },
            { id: 'adrenal_cortex', name: 'Adrenal Cortex', hormones:['Cortisol'] },
            { id: 'pancreas', name: 'Pancreas', hormones: ['Glucagon'] }
        ],
        organs:[
            { id: 'heart', name: 'Heart & Lungs' },
            { id: 'liver', name: 'Liver' }
        ],
        rules:[
            { hormone: 'Epinephrine', target: 'heart', effect: 30, isCorrect: true, msg: 'Heart rate spikes! Immediate short-term energy provided.' },
            { hormone: 'Cortisol', target: 'liver', effect: 25, isCorrect: true, msg: 'Cortisol triggers sustained, long-term glucose production.' },
            { hormone: 'Glucagon', target: 'liver', effect: 10, isCorrect: true, msg: 'Glucagon helps a bit, but is too weak to handle a major fight-or-flight emergency!' },
            { hormone: 'Epinephrine', target: 'liver', effect: 15, isCorrect: true, msg: 'Epinephrine stimulates the liver slightly, but target the heart for max effect.' }
        ]
    },
    {
        id: 5,
        type: 'endocrine',
        title: 'Scenario 5: Type 1 Diabetes',
        stimulus: 'Blood glucose is high, but the Pancreas is damaged (Type 1 Diabetes) and cannot secrete insulin. Apply a medical corrective action.',
        variableName: 'Blood Glucose (mg/dL)',
        graphMin: 40, graphMax: 250, normalMin: 80, normalMax: 100,
        initialValue: 200,
        glands:[
            { id: 'pancreas', name: 'Pancreas (Damaged)', hormones: ['Glucagon'] }, 
            { id: 'medical', name: 'Medical Kit', hormones: ['Insulin Injection'] }
        ],
        organs:[
            { id: 'liver', name: 'Liver' },
            { id: 'body_cells', name: 'Body Cells' }
        ],
        rules:[
            { hormone: 'Insulin Injection', target: 'liver', effect: -110, isCorrect: true, msg: 'Correct! External insulin injection successfully forces the liver to store glucose.' },
            { hormone: 'Glucagon', target: 'liver', effect: 40, isCorrect: false, msg: 'Glucagon worsens the hyperglycemia!' }
        ]
    }
];

class CellSignalScramble extends BaseGame {
    constructor() {
        super('Cell Signal Scramble');
        this.currentLevel = 0;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        this.isGameOver = false;
        
        this.history =[];
        this.currentValue = 0;
        this.moves = 0;
        this.selectedHormone = null;
        this.playerSequence =[];
        
        // Handle window resizing dynamically to redraw SVG graphs / lines
        window.addEventListener('resize', () => {
            if (this.isGameOver || this.currentLevel >= SCENARIOS.length) return;
            if (SCENARIOS[this.currentLevel].type === 'endocrine') {
                this.renderGraph();
            } else {
                this.drawNervousLines();
            }
        });
        
        this.initDOM();
        if (this.settings.timer === 'on') {
            document.getElementById('game-timer').style.display = 'block';
            this.startTimer('game-timer');
        }
        this.updateStats();
        this.loadLevel();
    }

    initDOM() {
        document.getElementById('level-display').textContent = `Level 1 / ${SCENARIOS.length}`;
    }

    loadLevel() {
        if (this.currentLevel >= SCENARIOS.length) {
            this.winGame();
            return;
        }
        
        const scenario = SCENARIOS[this.currentLevel];
        document.getElementById('scenario-title').textContent = scenario.title;
        document.getElementById('scenario-desc').textContent = scenario.stimulus;
        document.getElementById('level-display').textContent = `Level ${this.currentLevel + 1} / ${SCENARIOS.length}`;
        document.getElementById('feedback-msg').textContent = '';
        this.moves = 0;
        
        if (scenario.type === 'endocrine') {
            document.getElementById('graph-panel-container').style.display = 'flex';
            document.getElementById('action-prompt').innerHTML = "Action Required: Click or drag the correct hormone token to its target organ.";
            this.currentValue = scenario.initialValue;
            this.history = [this.currentValue];
            this.selectedHormone = null;
            this.setupEndocrineBoard(scenario);
            // Defer render slightly to allow flexbox CSS computation of parent widths
            setTimeout(() => this.renderGraph(), 50);
        } else {
            document.getElementById('graph-panel-container').style.display = 'none';
            document.getElementById('action-prompt').innerHTML = `Action Required: Click the starting neuron to begin the reflex arc (0 / ${scenario.correctSequence.length} selected).`;
            this.playerSequence =[];
            this.setupNervousBoard(scenario);
        }
    }

    setupEndocrineBoard(scenario) {
        const board = document.getElementById('board-panel');
        let html = `<div class="endocrine-board">
            <div class="glands-col">
                ${scenario.glands.map(g => `
                    <div class="node-card" data-gland="${g.id}">
                        <h4>${g.name}</h4>
                        <div class="hormones-container">
                            ${g.hormones.map(h => `<div class="hormone-token" draggable="true" data-hormone="${h}">${h}</div>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="organs-col">
                ${scenario.organs.map(o => `
                    <div class="organ-card node-card" data-organ="${o.id}">
                        ${o.name}
                    </div>
                `).join('')}
            </div>
        </div>`;
        board.innerHTML = html;

        this.attachEndocrineListeners(board);
    }

    attachEndocrineListeners(board) {
        const tokens = board.querySelectorAll('.hormone-token');
        const organs = board.querySelectorAll('.organ-card');

        tokens.forEach(token => {
            token.addEventListener('dragstart', (e) => {
                this.initAudio();
                e.dataTransfer.setData('text/plain', token.dataset.hormone);
                this.selectedHormone = token.dataset.hormone;
            });
            token.addEventListener('click', () => {
                this.initAudio();
                this.selectedHormone = token.dataset.hormone;
                board.querySelectorAll('.hormone-token').forEach(t => t.classList.remove('selected'));
                token.classList.add('selected');
                document.getElementById('action-prompt').innerHTML = `Action Required: Click the target organ for ${this.selectedHormone}.`;
            });
        });

        organs.forEach(organ => {
            organ.addEventListener('dragover', (e) => {
                e.preventDefault();
                organ.classList.add('drag-over');
            });
            organ.addEventListener('dragleave', () => {
                organ.classList.remove('drag-over');
            });
            organ.addEventListener('drop', (e) => {
                e.preventDefault();
                organ.classList.remove('drag-over');
                let hormone = e.dataTransfer.getData('text/plain') || this.selectedHormone;
                if (hormone) {
                    this.handleHormoneAction(hormone, organ.dataset.organ);
                    this.selectedHormone = null;
                    board.querySelectorAll('.hormone-token').forEach(t => t.classList.remove('selected'));
                }
            });
            organ.addEventListener('click', () => {
                if (this.selectedHormone) {
                    this.handleHormoneAction(this.selectedHormone, organ.dataset.organ);
                    this.selectedHormone = null;
                    board.querySelectorAll('.hormone-token').forEach(t => t.classList.remove('selected'));
                }
            });
        });
    }

    addHormoneToken(glandId, hormoneName) {
        const glandContainer = document.querySelector(`[data-gland="${glandId}"] .hormones-container`);
        if (glandContainer && !glandContainer.querySelector(`[data-hormone="${hormoneName}"]`)) {
            const token = document.createElement('div');
            token.className = 'hormone-token new-token';
            token.draggable = true;
            token.dataset.hormone = hormoneName;
            token.textContent = hormoneName;
            
            token.addEventListener('dragstart', (e) => {
                this.initAudio();
                e.dataTransfer.setData('text/plain', token.dataset.hormone);
                this.selectedHormone = token.dataset.hormone;
            });
            token.addEventListener('click', () => {
                this.initAudio();
                this.selectedHormone = token.dataset.hormone;
                document.querySelectorAll('.hormone-token').forEach(t => t.classList.remove('selected'));
                token.classList.add('selected');
                document.getElementById('action-prompt').innerHTML = `Action Required: Click the target organ for ${this.selectedHormone}.`;
            });
            
            glandContainer.appendChild(token);
        }
    }

    setupNervousBoard(scenario) {
        const board = document.getElementById('board-panel');
        let html = `<div class="nervous-board">
            <svg id="nervous-lines"></svg>
            ${scenario.nodes.map(n => `
                <div class="neuron-node" data-node="${n.id}" style="top: ${n.top}; left: ${n.left};">
                    ${n.name}
                </div>
            `).join('')}
        </div>`;
        board.innerHTML = html;

        board.querySelectorAll('.neuron-node').forEach(node => {
            node.addEventListener('click', () => {
                if (this.isGameOver) return;
                this.initAudio();
                this.handleNeuronClick(node.dataset.node, node);
            });
        });
    }

    handleHormoneAction(hormone, organId) {
        if (this.isGameOver) return;
        const scenario = SCENARIOS[this.currentLevel];
        const rule = scenario.rules.find(r => r.hormone === hormone && r.target === organId);

        if (!rule) {
            this.showFeedback(`The ${organId} does not have receptors for ${hormone}.`, false);
            this.addMistake();
            document.getElementById('action-prompt').innerHTML = "Incorrect target. Try again!";
            return;
        }

        this.moves++;
        this.showFeedback(rule.msg, rule.isCorrect);

        if (rule.isCorrect) {
            this.playHit();
            
            if (rule.unlocks) {
                this.addHormoneToken(rule.unlocks.gland, rule.unlocks.hormone);
            }

            let newValue = this.currentValue + rule.effect;
            this.history.push(newValue);
            this.currentValue = newValue;
            this.renderGraph();

            // Handle Dynamic Disruptor Events
            if (scenario.disruptor && this.moves === scenario.disruptor.triggerAt) {
                document.getElementById('action-prompt').innerHTML = "System updating...";
                setTimeout(() => {
                    if (this.isGameOver) return;
                    this.playMiss(); // Alert sound for disruption
                    this.currentValue += scenario.disruptor.effect;
                    this.history.push(this.currentValue);
                    this.renderGraph();
                    
                    const prompt = document.getElementById('action-prompt');
                    prompt.innerHTML = `<span class="disruptor-alert">${scenario.disruptor.msg}</span>`;
                    
                    this.checkEndocrineWinCondition(scenario);
                }, 1200);
            } else {
                this.checkEndocrineWinCondition(scenario);
            }
            
        } else {
            this.playMiss();
            let tempValue = this.currentValue + rule.effect;
            this.history.push(tempValue);
            this.renderGraph();
            this.addMistake();
            document.getElementById('action-prompt').innerHTML = "Harmful action detected! Reverting to prevent damage...";

            // Revert incorrect effect to prevent math soft-locks
            setTimeout(() => {
                if (this.isGameOver) return;
                this.history.push(this.currentValue);
                this.renderGraph();
                document.getElementById('action-prompt').innerHTML = "Effect reverted. Try a different hormone!";
            }, 1800);
        }
    }

    checkEndocrineWinCondition(scenario) {
        if (this.currentValue >= scenario.normalMin && this.currentValue <= scenario.normalMax) {
            document.getElementById('action-prompt').innerHTML = "Homeostasis successfully restored!";
            this.levelComplete();
        } else if (!scenario.disruptor || this.moves !== scenario.disruptor.triggerAt) {
            document.getElementById('action-prompt').innerHTML = "Action applied, but more is needed. Keep going!";
        }
    }

    handleNeuronClick(nodeId, element) {
        if (this.playerSequence.includes(nodeId)) return;
        
        const scenario = SCENARIOS[this.currentLevel];
        const expectedNode = scenario.correctSequence[this.playerSequence.length];

        if (nodeId === expectedNode) {
            this.playHit();
            this.playerSequence.push(nodeId);
            element.classList.add('active');
            this.drawNervousLines();

            if (this.playerSequence.length === scenario.correctSequence.length) {
                document.getElementById('action-prompt').innerHTML = "Pathway complete!";
                this.showFeedback(scenario.msg, true);
                this.levelComplete();
            } else {
                document.getElementById('action-prompt').innerHTML = `Action Required: Click the next neuron in the pathway (${this.playerSequence.length} / ${scenario.correctSequence.length} selected).`;
            }
        } else {
            this.playMiss();
            this.showFeedback("Incorrect pathway! A reflex arc must follow a specific sequence.", false);
            element.classList.add('error');
            element.classList.add('shake-enemy'); 
            setTimeout(() => {
                element.classList.remove('error');
                element.classList.remove('shake-enemy');
            }, 500);
            this.addMistake();
            
            // Reset sequence
            this.playerSequence =[];
            document.querySelectorAll('.neuron-node').forEach(n => n.classList.remove('active'));
            this.drawNervousLines();
            document.getElementById('action-prompt').innerHTML = `Action Required: Click the starting neuron to begin the reflex arc (0 / ${scenario.correctSequence.length} selected).`;
        }
    }

    renderGraph() {
        const scenario = SCENARIOS[this.currentLevel];
        if (scenario.type !== 'endocrine') return;
        
        const svg = document.getElementById('graph-svg');
        const title = document.getElementById('graph-title');
        title.textContent = scenario.variableName;
        
        const width = svg.clientWidth || 300;
        const height = svg.clientHeight || 250;
        
        const mapY = (val) => {
            let clamped = Math.max(scenario.graphMin, Math.min(scenario.graphMax, val));
            return height - ((clamped - scenario.graphMin) / (scenario.graphMax - scenario.graphMin)) * height;
        };
        
        const normalTop = mapY(scenario.normalMax);
        const normalBottom = mapY(scenario.normalMin);
        
        let html = `<rect x="0" y="${normalTop}" width="100%" height="${normalBottom - normalTop}" fill="#d1fae5" opacity="0.6" />`;
        
        html += `<line x1="0" y1="${normalTop}" x2="100%" y2="${normalTop}" stroke="#10b981" stroke-dasharray="4" />`;
        html += `<line x1="0" y1="${normalBottom}" x2="100%" y2="${normalBottom}" stroke="#10b981" stroke-dasharray="4" />`;
        
        if (this.history.length > 0) {
            const stepX = width / Math.max(1, this.history.length);
            let points = this.history.map((val, i) => {
                let x = i === 0 ? 10 : i === this.history.length - 1 ? width - 10 : i * stepX;
                return `${x},${mapY(val)}`;
            }).join(' ');
            
            html += `<polyline points="${points}" fill="none" stroke="#38B6FF" stroke-width="4" />`;
            
            this.history.forEach((val, i) => {
                let x = i === 0 ? 10 : i === this.history.length - 1 ? width - 10 : i * stepX;
                html += `<circle cx="${x}" cy="${mapY(val)}" r="6" fill="#38B6FF" stroke="#fff" stroke-width="2" />`;
            });
        }
        
        svg.innerHTML = html;
    }

    drawNervousLines() {
        const scenario = SCENARIOS[this.currentLevel];
        if (scenario.type !== 'nervous') return;
        
        const svg = document.getElementById('nervous-lines');
        let html = '';
        
        for (let i = 0; i < this.playerSequence.length - 1; i++) {
            let n1 = scenario.nodes.find(n => n.id === this.playerSequence[i]);
            let n2 = scenario.nodes.find(n => n.id === this.playerSequence[i+1]);
            html += `<line x1="${n1.left}" y1="${n1.top}" x2="${n2.left}" y2="${n2.top}" stroke="#8b5cf6" stroke-width="4" />`;
        }
        svg.innerHTML = html;
    }

    levelComplete() {
        this.isGameOver = true;
        setTimeout(() => {
            this.currentLevel++;
            this.isGameOver = false;
            this.loadLevel();
        }, 2500);
    }
    
    showFeedback(msg, isSuccess) {
        const fb = document.getElementById('feedback-msg');
        fb.textContent = msg;
        fb.className = 'feedback-msg ' + (isSuccess ? 'feedback-success' : 'feedback-error');
    }

    addMistake() {
        this.mistakes++;
        this.updateStats();
        if (this.mistakes >= this.maxMistakes) {
            this.loseGame();
        }
    }

    updateStats() {
        document.getElementById('game-mistakes').textContent = `Mistakes: ${this.mistakes} / ${this.maxMistakes}`;
    }

    winGame() {
        this.isGameOver = true;
        this.stopTimer();
        this.playVictory();
        this.saveProgress(this.mistakes);
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `Time: ${document.getElementById('game-timer').textContent}` : '';
        modal.show('Simulation Complete!', `You successfully restored homeostasis and managed system signals! <br><br> ${timeStr} <br> Mistakes: ${this.mistakes}`, true, '/Biology.html');
    }

    loseGame() {
        this.isGameOver = true;
        this.stopTimer();
        this.playGameOver();
        const modal = document.querySelector('game-report-modal');
        modal.show('System Failure!', `You made too many wrong choices and the patient lost homeostasis.<br><br> Mistakes: ${this.mistakes}`, false, '/Biology.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CellSignalScramble();
});