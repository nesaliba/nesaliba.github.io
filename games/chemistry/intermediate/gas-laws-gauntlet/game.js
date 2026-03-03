import { BaseGame } from '/games/shared/base-game.js';

class GasLawsGauntlet extends BaseGame {
    constructor() {
        super("Gas Laws Gauntlet");
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        
        this.R = 8.314; // kPa * L / (mol * K)
        this.particles =[];
        this.numParticles = 80;
        this.animationFrameId = null;

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
                <h1>Gas Laws Gauntlet</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">System Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Phase: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="crisis-panel" id="main-panel">
                    
                    <div class="diagnostic-overlay" id="diagnostic-overlay">
                        <div class="diagnostic-title" id="diag-title">⚠️ System Rupture</div>
                        <div class="diagnostic-message" id="diagnostic-msg">Error analysis...</div>
                        <button class="btn-action primary" id="btn-dismiss-diag">Recalibrate & Retry</button>
                    </div>

                    <div class="scenario-header">🔧 Active Operation Protocol</div>
                    <div class="scenario-text" id="scenario-prompt">Loading facility parameters...</div>

                    <details class="reference-panel">
                        <summary>📘 Engineering Formula Reference</summary>
                        <div class="ref-content">
                            <strong>Boyle's Law (Constant T):</strong> P₁V₁ = P₂V₂<br>
                            <strong>Charles's Law (Constant P):</strong> V₁/T₁ = V₂/T₂ &nbsp;<em>(T must be in Kelvin!)</em><br>
                            <strong>Gay-Lussac's Law (Constant V):</strong> P₁/T₁ = P₂/T₂ &nbsp;<em>(T must be in Kelvin!)</em><br>
                            <strong>Combined Gas Law:</strong> (P₁V₁)/T₁ = (P₂V₂)/T₂<br>
                            <strong>Ideal Gas Law:</strong> PV = nRT &nbsp;<em>(R = 8.314 kPa·L/mol·K)</em><br>
                            <strong>Temp Conversion:</strong> K = °C + 273.15
                        </div>
                    </details>

                    <div class="industrial-facility" id="facility-view">
                        <div class="chamber-wrapper" id="chamber-wrapper">
                            <div class="chamber-walls-glow"></div>
                            <canvas class="particle-canvas" id="particle-canvas"></canvas>
                            <div class="piston-assembly">
                                <div class="piston-rod" id="piston-rod"></div>
                                <div class="piston-head" id="piston-head"></div>
                            </div>
                        </div>
                        <div class="gauges-panel">
                            <div class="gauge-container">
                                <span class="gauge-label">Pressure (P)</span>
                                <span class="gauge-value" id="val-p">101.3 kPa</span>
                            </div>
                            <div class="gauge-container">
                                <span class="gauge-label">Volume (V)</span>
                                <span class="gauge-value" id="val-v">10.0 L</span>
                            </div>
                            <div class="gauge-container">
                                <span class="gauge-label">Temperature (T)</span>
                                <span class="gauge-value" id="val-t">298 K</span>
                            </div>
                        </div>
                    </div>

                    <div class="hud-graph-container">
                        <div class="hud-header">📡 Live Telemetry Graph</div>
                        <canvas class="graph-canvas" id="graph-canvas"></canvas>
                    </div>

                    <div class="controls-area">
                        <label id="control-label">Set Final Variable</label>
                        <input type="range" id="slider-target" min="0" max="100" step="0.1" value="50">
                        <div id="control-display" style="font-size: 1.2rem; font-weight: bold; color: var(--primary); margin-top: 10px;">50</div>
                    </div>

                    <div style="text-align: center;">
                        <button class="btn-action primary" id="btn-submit" style="width: 100%; max-width: 300px;">Engage System</button>
                    </div>

                </div>
            </main>
        `;

        document.getElementById('slider-target').addEventListener('input', () => this.handleInput());
        document.getElementById('btn-submit').addEventListener('click', () => this.checkAnswer());
        document.getElementById('btn-dismiss-diag').addEventListener('click', () => {
            document.getElementById('diagnostic-overlay').classList.remove('active');
            document.getElementById('facility-view').classList.remove('shake-severe');
        });
    }

    initCanvas() {
        this.particleCanvas = document.getElementById('particle-canvas');
        this.pCtx = this.particleCanvas.getContext('2d');
        this.graphCanvas = document.getElementById('graph-canvas');
        this.gCtx = this.graphCanvas.getContext('2d');

        // Setup particles
        for(let i=0; i<this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * 180,
                y: Math.random() * 250,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
        this.animate();
    }

    generateScenario() {
        const types = ['boyles', 'charles', 'gaylussac'];
        let type = types[Math.floor(Math.random() * types.length)];
        
        // Late game introduces Ideal
        if (this.wave >= 7) type = ['boyles', 'charles', 'gaylussac', 'ideal'][Math.floor(Math.random() * 4)];

        const data = { type };
        const contexts = {
            'boyles': { name: "Scuba Tank Compressor", desc: "Temperature is held constant by a cooling jacket." },
            'charles': { name: "Weather Balloon Ascent", desc: "Pressure equalizes with the surroundings, remaining constant." },
            'gaylussac': { name: "Autoclave Sterilization", desc: "The steel chamber volume is completely locked and fixed." },
            'ideal': { name: "Chemical Synthesis Chamber", desc: "A precise molar quantity of gas is reacting." }
        };

        let prompt = `<strong>${contexts[type].name}:</strong> ${contexts[type].desc}<br>`;

        if (type === 'boyles') {
            data.T1 = 298; data.T2 = 298;
            data.P1 = Math.floor(Math.random() * 100) + 100; // 100-200 kPa
            data.V1 = Math.floor(Math.random() * 10) + 5; // 5-15 L
            data.n = (data.P1 * data.V1) / (this.R * data.T1);
            
            // Ask for V2 given P2
            data.P2 = Math.floor(Math.random() * 200) + 250; // 250-450 kPa
            data.targetAnswer = (data.P1 * data.V1) / data.P2;
            data.targetVar = 'V';
            data.targetUnit = 'L';
            
            prompt += `Initial Pressure: ${data.P1} kPa | Initial Volume: ${data.V1.toFixed(1)} L.<br>The system pressure is increased to <strong>${data.P2} kPa</strong>. Set the Final Volume.`;
        } 
        else if (type === 'charles') {
            data.P1 = 101.3; data.P2 = 101.3;
            data.T1C = Math.floor(Math.random() * 30) + 10; // 10 to 40 C
            data.T1 = data.T1C + 273.15;
            data.V1 = Math.floor(Math.random() * 15) + 10; // 10-25 L
            data.n = (data.P1 * data.V1) / (this.R * data.T1);
            
            // Ask for V2 given T2C
            data.T2C = Math.floor(Math.random() * 100) + 60; // 60 to 160 C
            data.T2 = data.T2C + 273.15;
            data.targetAnswer = data.V1 * (data.T2 / data.T1);
            data.targetVar = 'V';
            data.targetUnit = 'L';
            
            prompt += `Initial Volume: ${data.V1.toFixed(1)} L | Initial Temp: ${data.T1C} &deg;C.<br>The system is heated to <strong>${data.T2C} &deg;C</strong>. Set the Final Volume.`;
        }
        else if (type === 'gaylussac') {
            data.V1 = 15; data.V2 = 15;
            data.T1C = Math.floor(Math.random() * 20) + 5; // 5 to 25 C
            data.T1 = data.T1C + 273.15;
            data.P1 = Math.floor(Math.random() * 50) + 100; // 100-150 kPa
            data.n = (data.P1 * data.V1) / (this.R * data.T1);
            
            // Ask for P2 given T2C
            data.T2C = Math.floor(Math.random() * 150) + 100; // 100 to 250 C
            data.T2 = data.T2C + 273.15;
            data.targetAnswer = data.P1 * (data.T2 / data.T1);
            data.targetVar = 'P';
            data.targetUnit = 'kPa';
            
            prompt += `Initial Pressure: ${data.P1} kPa | Initial Temp: ${data.T1C} &deg;C.<br>The sealed tank is heated to <strong>${data.T2C} &deg;C</strong>. Set the Final Pressure.`;
        }
        else if (type === 'ideal') {
            data.T = Math.floor(Math.random() * 50) + 273; // K
            data.V = Math.floor(Math.random() * 10) + 5; // L
            data.n = (Math.random() * 2 + 0.5).toFixed(2); // 0.5 - 2.5 mol
            
            data.targetAnswer = (data.n * this.R * data.T) / data.V;
            data.targetVar = 'P';
            data.targetUnit = 'kPa';
            
            prompt += `The chamber contains exactly <strong>${data.n} mol</strong> of gas at a volume of ${data.V.toFixed(1)} L and temperature of ${data.T} K.<br>Calculate and set the resulting Pressure.`;
        }

        return { data, prompt };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Phase: ${this.wave}/${this.maxWaves}`;
        const scenario = this.generateScenario();
        this.currentData = scenario.data;
        
        document.getElementById('scenario-prompt').innerHTML = scenario.prompt;

        const slider = document.getElementById('slider-target');
        const label = document.getElementById('control-label');
        
        if (this.currentData.targetVar === 'V') {
            label.innerText = 'Set Final Volume (L)';
            slider.min = 1; slider.max = 40; slider.step = 0.1;
            slider.value = this.currentData.V1 || 10;
        } else {
            label.innerText = 'Set Final Pressure (kPa)';
            slider.min = 50; slider.max = 600; slider.step = 1;
            slider.value = this.currentData.P1 || 101;
        }

        this.handleInput();
    }

    handleInput() {
        const sliderVal = parseFloat(document.getElementById('slider-target').value);
        document.getElementById('control-display').innerText = sliderVal.toFixed(1) + ' ' + this.currentData.targetUnit;
        
        // Derive the other live variables based on the input
        let currentP, currentV, currentT;
        
        if (this.currentData.type === 'boyles') {
            currentT = this.currentData.T1;
            if (this.currentData.targetVar === 'V') {
                currentV = sliderVal;
                currentP = (this.currentData.P1 * this.currentData.V1) / currentV;
            }
        } 
        else if (this.currentData.type === 'charles') {
            currentP = this.currentData.P1;
            if (this.currentData.targetVar === 'V') {
                currentV = sliderVal;
                currentT = currentV * (this.currentData.T1 / this.currentData.V1);
            }
        }
        else if (this.currentData.type === 'gaylussac') {
            currentV = this.currentData.V1;
            if (this.currentData.targetVar === 'P') {
                currentP = sliderVal;
                currentT = currentP * (this.currentData.T1 / this.currentData.P1);
            }
        }
        else if (this.currentData.type === 'ideal') {
            currentV = this.currentData.V;
            currentT = this.currentData.T;
            currentP = sliderVal; // They are setting P
        }

        this.liveState = { P: currentP, V: currentV, T: currentT };

        // Update Gauges
        document.getElementById('val-p').innerText = currentP.toFixed(1) + ' kPa';
        document.getElementById('val-v').innerText = currentV.toFixed(1) + ' L';
        document.getElementById('val-t').innerText = currentT.toFixed(0) + ' K';

        // Update Piston Height (V maps to height)
        const maxV = 40; // max scale
        const heightPct = Math.max(10, Math.min(100, (currentV / maxV) * 100));
        const pistonTop = (100 - heightPct); // 0 is top, 100 is bottom
        
        const pistonHead = document.getElementById('piston-head');
        const pistonRod = document.getElementById('piston-rod');
        
        pistonHead.style.top = `${pistonTop}%`;
        pistonRod.style.top = '0';
        pistonRod.style.height = `${pistonTop}%`;

        this.pistonY = (pistonTop / 100) * 250; // Canvas px

        // Warning Glows
        const facility = document.getElementById('facility-view');
        facility.classList.remove('state-warning', 'state-critical');
        if (currentP > 400 || currentT > 600) facility.classList.add('state-critical');
        else if (currentP > 300 || currentT > 450) facility.classList.add('state-warning');

        this.drawGraph();
    }

    animate() {
        if (!this.pCtx) return;
        
        this.particleCanvas.width = 180;
        this.particleCanvas.height = 250;
        
        this.pCtx.clearRect(0, 0, 180, 250);
        this.pCtx.fillStyle = 'rgba(148, 163, 184, 0.8)';

        const state = this.liveState || { P: 101, V: 10, T: 298 };
        // T influences speed. 298K = base speed 1.
        const speedMultiplier = Math.max(0.2, state.T / 298);
        const topBound = this.pistonY || 0;

        this.particles.forEach(p => {
            p.x += p.vx * speedMultiplier;
            p.y += p.vy * speedMultiplier;

            if (p.x < 2 || p.x > 178) p.vx *= -1;
            if (p.y < topBound + 22) { p.y = topBound + 22; p.vy *= -1; } // bounce off piston head
            if (p.y > 248) { p.y = 248; p.vy *= -1; }

            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.pCtx.fill();
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    drawGraph() {
        const w = this.graphCanvas.width = this.graphCanvas.parentElement.clientWidth - 32;
        const h = this.graphCanvas.height = 120;
        
        this.gCtx.clearRect(0, 0, w, h);
        
        // Draw Axes
        this.gCtx.strokeStyle = '#475569';
        this.gCtx.beginPath();
        this.gCtx.moveTo(30, 10); this.gCtx.lineTo(30, h-20); this.gCtx.lineTo(w-10, h-20);
        this.gCtx.stroke();

        if (!this.currentData || !this.liveState) return;

        this.gCtx.strokeStyle = '#ea580c';
        this.gCtx.lineWidth = 2;
        this.gCtx.beginPath();

        let px, py, dotX, dotY;

        if (this.currentData.type === 'boyles') {
            // P vs V (Inverse curve)
            this.gCtx.fillStyle = '#94a3b8'; this.gCtx.fillText('P', 15, 20); this.gCtx.fillText('V', w-20, h-5);
            const k = this.currentData.P1 * this.currentData.V1;
            for (let v = 1; v <= 40; v += 1) {
                let p = k / v;
                px = 30 + (v / 40) * (w - 40);
                py = (h-20) - (Math.min(p, 600) / 600) * (h - 30);
                if (v === 1) this.gCtx.moveTo(px, py); else this.gCtx.lineTo(px, py);
            }
            this.gCtx.stroke();
            dotX = 30 + (this.liveState.V / 40) * (w - 40);
            dotY = (h-20) - (this.liveState.P / 600) * (h - 30);
        } 
        else if (this.currentData.type === 'charles') {
            // V vs T (Direct line)
            this.gCtx.fillStyle = '#94a3b8'; this.gCtx.fillText('V', 15, 20); this.gCtx.fillText('T', w-20, h-5);
            const slope = this.currentData.V1 / this.currentData.T1;
            this.gCtx.moveTo(30, h-20); // 0,0
            let tMax = 600; let vMax = slope * tMax;
            this.gCtx.lineTo(30 + (tMax/600)*(w-40), (h-20) - (vMax/40)*(h-30));
            this.gCtx.stroke();
            dotX = 30 + (this.liveState.T / 600) * (w - 40);
            dotY = (h-20) - (this.liveState.V / 40) * (h - 30);
        }
        else if (this.currentData.type === 'gaylussac' || this.currentData.type === 'ideal') {
            // P vs T (Direct line)
            this.gCtx.fillStyle = '#94a3b8'; this.gCtx.fillText('P', 15, 20); this.gCtx.fillText('T', w-20, h-5);
            let slope = this.currentData.type === 'ideal' ? (this.currentData.n * this.R) / this.currentData.V : this.currentData.P1 / this.currentData.T1;
            this.gCtx.moveTo(30, h-20); // 0,0
            let tMax = 600; let pMax = slope * tMax;
            this.gCtx.lineTo(30 + (tMax/600)*(w-40), (h-20) - Math.min(1, (pMax/600))*(h-30));
            this.gCtx.stroke();
            dotX = 30 + (this.liveState.T / 600) * (w - 40);
            dotY = (h-20) - (this.liveState.P / 600) * (h - 30);
        }

        // Draw Dot
        this.gCtx.fillStyle = '#38bdf8';
        this.gCtx.beginPath();
        this.gCtx.arc(dotX, dotY, 4, 0, Math.PI*2);
        this.gCtx.fill();
    }

    checkAnswer() {
        const userInput = parseFloat(document.getElementById('slider-target').value);
        const correct = this.currentData.targetAnswer;
        
        // Tolerance: 3% error margin
        const errorMargin = Math.abs(userInput - correct) / correct;
        
        if (errorMargin <= 0.03) {
            this.initAudio();
            this.playHit();
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 800);
        } else {
            this.initAudio();
            this.playMiss();
            this.mistakes++;
            
            document.getElementById('health-box').innerText = `System Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            // Diagnostics
            let diagMsg = "Calculations off nominal parameters. Review your gas law formulas.";
            let diagTitle = "⚠️ Warning: Threshold Exceeded";
            
            if (this.currentData.type === 'boyles') {
                const inverseError = (this.currentData.P2 * this.currentData.V1) / this.currentData.P1;
                if (Math.abs(userInput - inverseError)/inverseError < 0.05) {
                    diagMsg = "Proportionality Error Detected. Boyle's Law states Pressure and Volume are INVERSELY proportional (P₁V₁ = P₂V₂), not directly proportional.";
                }
            } else if (this.currentData.type === 'charles') {
                const celsiusError = this.currentData.V1 * (this.currentData.T2C / this.currentData.T1C);
                const inverseError = this.currentData.V1 * (this.currentData.T1 / this.currentData.T2);
                if (Math.abs(userInput - celsiusError)/celsiusError < 0.05) {
                    diagMsg = "Unit Conversion Error! You calculated ratios using degrees Celsius. You MUST convert temperatures to Kelvin (+273.15) for Gas Laws to work.";
                } else if (Math.abs(userInput - inverseError)/inverseError < 0.05) {
                    diagMsg = "Proportionality Error Detected. Charles's Law states Volume and Temperature are DIRECTLY proportional (V₁/T₁ = V₂/T₂).";
                }
            } else if (this.currentData.type === 'gaylussac') {
                const celsiusError = this.currentData.P1 * (this.currentData.T2C / this.currentData.T1C);
                if (Math.abs(userInput - celsiusError)/celsiusError < 0.05) {
                    diagMsg = "Unit Conversion Error! Always convert degrees Celsius to Kelvin (+273.15) before calculating pressure ratios.";
                }
            }

            // Severe failure visual
            const facility = document.getElementById('facility-view');
            facility.classList.add('shake-severe');
            
            if (this.mistakes >= this.maxMistakes) {
                diagTitle = "💥 CRITICAL RUPTURE";
                diagMsg = "System failure. Structural integrity compromised due to excessive pressure/volume mismatches.";
                document.getElementById('btn-dismiss-diag').style.display = 'none';
                setTimeout(() => this.endGame(false), 2000);
            }

            document.getElementById('diag-title').innerText = diagTitle;
            document.getElementById('diagnostic-msg').innerText = diagMsg;
            document.getElementById('diagnostic-overlay').classList.add('active');
        }
    }

    endGame(win) {
        this.stopTimer();
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        
        const desc = win 
            ? `Masterful engineering! You successfully stabilized all pressure systems with only ${this.mistakes} errors.${timeStr}`
            : `The facility suffered a catastrophic decompression. Review your temperature conversions and inverse relationships before trying again.`;

        modal.show(
            win ? 'Facility Secured!' : 'System Destroyed!', 
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

window.addEventListener('DOMContentLoaded', () => new GasLawsGauntlet());