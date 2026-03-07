import { BaseGame } from '/games/shared/base-game.js';

const REACTIONS =[
    { eq: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)', dh: -92, exo: true, molesL: 4, molesR: 2 },
    { eq: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)', dh: -198, exo: true, molesL: 3, molesR: 2 },
    { eq: 'N₂O₄(g) ⇌ 2NO₂(g)', dh: 57, exo: false, molesL: 1, molesR: 2 },
    { eq: 'H₂(g) + I₂(g) ⇌ 2HI(g)', dh: 53, exo: false, molesL: 2, molesR: 2 },
    { eq: 'CO(g) + 2H₂(g) ⇌ CH₃OH(g)', dh: -90, exo: true, molesL: 3, molesR: 1 }
];

class EquilibriumEngine extends BaseGame {
    constructor() {
        super("Equilibrium Engine");
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        
        this.particles =[];
        this.numParticles = 100;
        this.animationFrameId = null;
        this.qJitter = 0;

        this.initDOM();
        this.initCanvas();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        this.nextWave();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Equilibrium Engine</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">System Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Reactor: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="engine-panel">
                    <div class="engine-header">⚙️ Core Control Systems</div>
                    
                    <div class="reactor-dashboard">
                        <div class="gauges-panel">
                            <div class="gauge-container">
                                <div class="gauge-track"><div class="gauge-fill fill-q" id="gauge-q"></div></div>
                                <div class="gauge-label">Q</div>
                            </div>
                            <div class="gauge-container">
                                <div class="gauge-track"><div class="gauge-fill fill-k" id="gauge-k"></div></div>
                                <div class="gauge-label">K</div>
                            </div>
                        </div>

                        <div class="reactor-core-wrapper" id="reactor-wrapper">
                            <div class="reactor-glass">
                                <canvas class="particle-canvas" id="reactor-canvas"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="data-readout">
                        <div class="equation" id="rxn-eq">N₂(g) + 3H₂(g) ⇌ 2NH₃(g)</div>
                        <div class="enthalpy" id="rxn-dh">ΔH = -92 kJ</div>
                    </div>

                    <div class="scenario-prompt" id="scenario-prompt">Analyzing telemetry...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `;
    }

    initCanvas() {
        this.canvas = document.getElementById('reactor-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * 220,
                y: Math.random() * 220,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 2 + 1.5,
                color: Math.random() > 0.5 ? '#10b981' : '#38bdf8'
            });
        }
        this.animate();
    }

    animate() {
        if (!this.ctx) return;
        
        this.canvas.width = 220;
        this.canvas.height = 220;
        
        this.ctx.clearRect(0, 0, 220, 220);
        
        const speedMult = this.particleSpeed || 1;

        this.particles.forEach(p => {
            p.x += p.vx * speedMult;
            p.y += p.vy * speedMult;

            // Circular boundary collision
            const dx = p.x - 110;
            const dy = p.y - 110;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 105) {
                const nx = dx / dist;
                const ny = dy / dist;
                const dot = p.vx * nx + p.vy * ny;
                p.vx = p.vx - 2 * dot * nx;
                p.vy = p.vy - 2 * dot * ny;
                
                // Nudge back inside to prevent getting stuck
                p.x = 110 + nx * 104;
                p.y = 110 + ny * 104;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
        });

        // Jitter Q Gauge slightly for a "live" feel
        if (!this.stabilized && Math.random() > 0.8) {
            const qGauge = document.getElementById('gauge-q');
            if (qGauge) {
                const currentHeight = parseFloat(qGauge.style.height || this.targetQ);
                const jitter = (Math.random() - 0.5) * 2;
                qGauge.style.height = `${Math.max(5, Math.min(95, currentHeight + jitter))}%`;
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    generateScenario() {
        const rxn = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
        const types =['q_vs_k', 'stress_temp', 'stress_pressure', 'maximize_yield'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let prompt = "", correct = "", options =[], state = "normal", qVal = 50, kVal = 50, speed = 1;
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'q_vs_k') {
            const qGreater = Math.random() > 0.5;
            kVal = 50;
            qVal = qGreater ? 85 : 15;
            
            const qStr = qGreater ? "8.4 × 10³" : "1.2 × 10⁻³";
            const kStr = qGreater ? "2.1 × 10³" : "5.5 × 10⁻³";
            
            prompt = `Live Telemetry: The reaction quotient (Q) is ${qStr}, while the equilibrium constant (K) is ${kStr}. Predict the immediate system response.`;
            correct = qGreater ? "Shift Left (Towards Reactants)" : "Shift Right (Towards Products)";
            options =["Shift Left (Towards Reactants)", "Shift Right (Towards Products)", "No Shift (System is at Equilibrium)", "K will adjust to match Q"];
        }
        else if (type === 'stress_temp') {
            const tempIncrease = Math.random() > 0.5;
            state = tempIncrease ? "hot" : "cold";
            speed = tempIncrease ? 2.5 : 0.4;
            qVal = 50; kVal = 50; // Visual logic handles heat, gauges stay neutral initially

            prompt = tempIncrease 
                ? "🚨 ALERT: Coolant failure detected. Core temperature is rising rapidly. How will the equilibrium shift?"
                : "🚨 ALERT: Heating element offline. Core temperature is dropping. How will the equilibrium shift?";
            
            if (rxn.exo) {
                correct = tempIncrease ? "Shift Left (Towards Reactants)" : "Shift Right (Towards Products)";
            } else {
                correct = tempIncrease ? "Shift Right (Towards Products)" : "Shift Left (Towards Reactants)";
            }
            options =["Shift Left (Towards Reactants)", "Shift Right (Towards Products)", "No Shift (Temperature has no effect)", "Both rates stop completely"];
        }
        else if (type === 'stress_pressure') {
            const pressureIncrease = Math.random() > 0.5;
            state = pressureIncrease ? "pressure" : "normal";
            speed = pressureIncrease ? 1.5 : 0.8;
            
            prompt = pressureIncrease
                ? "⚙️ SYSTEM OVERRIDE: Chamber compressed, halving the volume and doubling the pressure. Predict the shift."
                : "⚙️ SYSTEM OVERRIDE: Chamber expanded, doubling the volume and halving the pressure. Predict the shift.";
                
            if (rxn.molesL === rxn.molesR) {
                correct = "No Shift (Equal moles of gas)";
            } else if (rxn.molesL > rxn.molesR) {
                correct = pressureIncrease ? "Shift Right (Fewer moles)" : "Shift Left (More moles)";
            } else {
                correct = pressureIncrease ? "Shift Left (Fewer moles)" : "Shift Right (More moles)";
            }
            
            options =["Shift Right (Fewer moles)", "Shift Left (Fewer moles)", "Shift Left (More moles)", "Shift Right (More moles)", "No Shift (Equal moles of gas)"];
            // Ensure unique options mapping to 4
            options = shuffle([...new Set(options)]).slice(0, 4);
            if (!options.includes(correct)) options[0] = correct;
            options = shuffle(options);
        }
        else if (type === 'maximize_yield') {
            prompt = `🎯 MISSION DIRECTIVE: Determine the optimal sustained conditions to maximize the yield of the product(s).`;
            
            let tempIdeal = rxn.exo ? "Low T" : "High T";
            let presIdeal = "No P effect";
            
            if (rxn.molesL > rxn.molesR) presIdeal = "High P";
            else if (rxn.molesL < rxn.molesR) presIdeal = "Low P";

            correct = presIdeal === "No P effect" ? `${tempIdeal}, Any P` : `${tempIdeal}, ${presIdeal}`;
            
            options =[
                "Low T, High P", "Low T, Low P", "High T, High P", "High T, Low P",
                "Low T, Any P", "High T, Any P"
            ];
            options = shuffle(options).slice(0, 3);
            options.push(correct);
            options = shuffle([...new Set(options)]);
            while(options.length < 4) {
                options.push("Catalyst Only");
                options = [...new Set(options)];
            }
        }

        return { rxn, prompt, options, answer: correct, state, qVal, kVal, speed };
    }

    nextWave() {
        this.stabilized = false;
        document.getElementById('wave-box').innerText = `Reactor: ${this.wave}/${this.maxWaves}`;
        const data = this.generateScenario();
        
        document.getElementById('rxn-eq').innerText = data.rxn.eq;
        document.getElementById('rxn-dh').innerText = `ΔH = ${data.rxn.dh > 0 ? '+' : ''}${data.rxn.dh} kJ`;
        document.getElementById('scenario-prompt').innerHTML = data.prompt;
        
        // Visual States
        const wrapper = document.getElementById('reactor-wrapper');
        wrapper.className = 'reactor-core-wrapper'; // reset
        if (data.state === 'hot') wrapper.classList.add('state-hot');
        if (data.state === 'cold') wrapper.classList.add('state-cold');
        if (data.state === 'pressure') wrapper.classList.add('state-pressure');

        this.particleSpeed = data.speed;
        this.targetQ = data.qVal;
        document.getElementById('gauge-q').style.height = `${data.qVal}%`;
        document.getElementById('gauge-k').style.height = `${data.kVal}%`;
        
        // Color transition for particles based on heat
        this.particles.forEach(p => {
            if (data.state === 'hot') p.color = Math.random() > 0.5 ? '#ef4444' : '#f59e0b';
            else p.color = Math.random() > 0.5 ? '#10b981' : '#38bdf8';
        });

        const optsContainer = document.getElementById('options-container');
        optsContainer.innerHTML = '';
        
        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt;
            btn.onclick = () => {
                this.initAudio();
                const isCorrect = (opt === data.answer);
                this.handleAnswer(btn, isCorrect, data.answer);
            };
            optsContainer.appendChild(btn);
        });
    }

    handleAnswer(btn, isCorrect, correctAnswer) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            btn.classList.add('correct');
            this.stabilized = true;
            this.playHit();
            
            // Stabilization Animation
            document.getElementById('gauge-q').style.height = document.getElementById('gauge-k').style.height;
            document.getElementById('gauge-q').style.backgroundColor = '#10b981';
            
            const wrapper = document.getElementById('reactor-wrapper');
            wrapper.className = 'reactor-core-wrapper state-stabilized';
            this.particleSpeed = 1;
            this.particles.forEach(p => p.color = '#10b981');

            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else {
                    document.getElementById('gauge-q').style.backgroundColor = '';
                    this.nextWave();
                }
            }, 1200);
        } else {
            btn.classList.add('wrong');
            this.playMiss();
            buttons.forEach(b => { if (b.innerHTML === correctAnswer) b.classList.add('correct'); });
            
            this.mistakes++;
            document.getElementById('health-box').innerText = `System Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            setTimeout(() => {
                if (this.mistakes >= this.maxMistakes) this.endGame(false);
                else {
                    this.wave++;
                    if (this.wave > this.maxWaves) this.endGame(true);
                    else {
                        document.getElementById('gauge-q').style.backgroundColor = '';
                        this.nextWave();
                    }
                }
            }, 2000);
        }
    }

    endGame(win) {
        this.stopTimer();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        
        const desc = win 
            ? `Masterful control! You stabilized all reactors and applied Le Chatelier's Principle flawlessly with only ${this.mistakes} errors.${timeStr}`
            : `Reactor meltdown. Miscalculated shifts caused the system limits to be exceeded. Review your equilibrium rules before trying again.`;

        modal.show(
            win ? 'Reactors Stabilized!' : 'System Failure!', 
            desc, 
            win, 
            '/Chemistry.html'
        );

        if (win) {
            this.playVictory();
            this.saveProgress(this.mistakes);
        } else {
            this.playGameOver();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new EquilibriumEngine());