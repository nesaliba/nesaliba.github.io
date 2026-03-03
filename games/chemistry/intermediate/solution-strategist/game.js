import { BaseGame } from '/games/shared/base-game.js';

const SOLUTES = {
    'CuSO4': { name: 'Copper(II) Sulfate', rgb: '56, 182, 255', M: 159.61, satC: 1.4 },
    'KMnO4': { name: 'Potassium Permanganate', rgb: '168, 85, 247', M: 158.03, satC: 0.4 },
    'NaCl': { name: 'Sodium Chloride', rgb: '203, 213, 225', M: 58.44, satC: 6.1 }
};

class SolutionStrategist extends BaseGame {
    constructor() {
        super("Solution Strategist");
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        
        this.currentScenario = null;
        this.prevVolume = 0;

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        this.nextWave();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Solution Strategist</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Budget Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Formulation: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="crisis-panel">
                    
                    <div class="diagnostic-overlay" id="diagnostic-overlay">
                        <div class="diagnostic-title">⚠️ Formulation Error</div>
                        <div class="diagnostic-message" id="diagnostic-msg">Review your parameters.</div>
                        <button class="btn-action primary" id="btn-dismiss-diag">Recalculate</button>
                    </div>

                    <div class="scenario-header">🧪 Laboratory Protocol</div>
                    <div class="scenario-text" id="scenario-prompt">Loading scenario...</div>

                    <details class="reference-panel">
                        <summary>📊 Quick Reference Guide</summary>
                        <div class="ref-content">
                            <strong>Formulas:</strong> C = n / V &nbsp;|&nbsp; n = m / M &nbsp;|&nbsp; C₁V₁ = C₂V₂<br><br>
                            <strong>Molar Masses:</strong> CuSO₄: 159.61 g/mol &nbsp;|&nbsp; KMnO₄: 158.03 g/mol &nbsp;|&nbsp; NaCl: 58.44 g/mol<br><br>
                            <strong>Saturation (@ 25°C):</strong> CuSO₄: 1.4 M &nbsp;|&nbsp; KMnO₄: 0.4 M &nbsp;|&nbsp; NaCl: 6.1 M
                        </div>
                    </details>

                    <div class="lab-bench">
                        <div class="fluid-stream" id="fluid-stream"></div>
                        <div class="beaker-container">
                            <div class="beaker">
                                <div class="liquid" id="beaker-liquid"></div>
                                <div class="crystals" id="beaker-crystals">
                                    <div class="crystal"></div><div class="crystal"></div><div class="crystal"></div>
                                    <div class="crystal"></div><div class="crystal"></div><div class="crystal"></div>
                                </div>
                                <div class="markings">
                                    <div class="mark"></div><div class="mark"></div><div class="mark"></div>
                                    <div class="mark"></div><div class="mark"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="controls-grid">
                        <div class="control-group">
                            <label>Solute Mass (g)</label>
                            <input type="range" id="slider-mass" min="0" max="1000" step="1" value="0">
                            <span class="control-value" id="val-mass">0 g</span>
                        </div>
                        <div class="control-group">
                            <label>Solution Volume (L)</label>
                            <input type="range" id="slider-vol" min="0" max="2.0" step="0.05" value="0.05">
                            <span class="control-value" id="val-vol">0.05 L</span>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <button class="btn-action primary" id="btn-submit" style="width: 100%; max-width: 300px;">Submit Formulation</button>
                    </div>

                </div>
            </main>
        `;

        document.getElementById('slider-mass').addEventListener('input', (e) => this.handleInput(e, 'mass'));
        document.getElementById('slider-vol').addEventListener('input', (e) => this.handleInput(e, 'vol'));
        document.getElementById('btn-submit').addEventListener('click', () => this.checkAnswer());
        document.getElementById('btn-dismiss-diag').addEventListener('click', () => {
            document.getElementById('diagnostic-overlay').classList.remove('active');
        });
    }

    generateScenario() {
        const soluteKeys = Object.keys(SOLUTES);
        const soluteKey = soluteKeys[Math.floor(Math.random() * soluteKeys.length)];
        const solute = SOLUTES[soluteKey];

        let type;
        if (this.wave <= 3) type = 'prep';
        else if (this.wave <= 7) type = 'dilution';
        else type = 'saturation';

        let targetM, targetV, prompt;

        if (type === 'prep') {
            targetV = (Math.floor(Math.random() * 15) * 0.1 + 0.5); // 0.5 to 2.0
            const maxC = solute.satC * 0.8;
            const targetC = (Math.random() * (maxC - 0.1) + 0.1).toFixed(2);
            targetM = targetC * targetV * solute.M;
            
            prompt = `<strong>Water Treatment Scenario:</strong> Prepare exactly ${targetV.toFixed(2)} L of a ${targetC} M solution of ${solute.name}. Set the correct mass and volume.`;
        } 
        else if (type === 'dilution') {
            const C1 = solute.satC * 0.9;
            const targetC2 = (C1 * (Math.random() * 0.4 + 0.1)).toFixed(2);
            targetV = (Math.floor(Math.random() * 15) * 0.1 + 0.5); // 0.5 to 2.0
            
            // Calculate moles needed, lock the mass to represent pipetted stock
            const moles = targetC2 * targetV;
            targetM = moles * solute.M;

            prompt = `<strong>Pharmacy Compounding:</strong> You pipetted stock solution containing exactly ${targetM.toFixed(1)} g of ${solute.name} into the flask. Dilute it with water to reach a final concentration of ${targetC2} M.`;
        } 
        else if (type === 'saturation') {
            targetV = (Math.floor(Math.random() * 10) * 0.1 + 0.5);
            targetM = solute.satC * targetV * solute.M;

            prompt = `<strong>Quality Control:</strong> Formulate exactly ${targetV.toFixed(2)} L of a saturated ${solute.name} solution without causing precipitation.`;
        }

        return { type, solute, targetM, targetV, prompt };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Formulation: ${this.wave}/${this.maxWaves}`;
        this.currentScenario = this.generateScenario();
        document.getElementById('scenario-prompt').innerHTML = this.currentScenario.prompt;

        const sMass = document.getElementById('slider-mass');
        const sVol = document.getElementById('slider-vol');
        
        // Reset and adjust constraints based on mode
        sVol.value = 0.05;
        this.prevVolume = 0.05;

        if (this.currentScenario.type === 'dilution') {
            sMass.value = this.currentScenario.targetM;
            sMass.disabled = true;
            sVol.min = (this.currentScenario.targetM / this.currentScenario.solute.M / this.currentScenario.solute.satC).toFixed(2); // Minimum volume to dissolve stock
        } else {
            sMass.value = 0;
            sMass.disabled = false;
            sVol.min = 0.05;
        }

        this.updateVisuals();
    }

    handleInput(e, type) {
        if (type === 'vol') {
            const currentVol = parseFloat(e.target.value);
            const stream = document.getElementById('fluid-stream');
            if (currentVol > this.prevVolume) {
                stream.classList.add('pouring');
                clearTimeout(this.pourTimeout);
                this.pourTimeout = setTimeout(() => stream.classList.remove('pouring'), 300);
            }
            this.prevVolume = currentVol;
        }
        this.updateVisuals();
    }

    updateVisuals() {
        const mass = parseFloat(document.getElementById('slider-mass').value);
        const vol = parseFloat(document.getElementById('slider-vol').value);
        
        document.getElementById('val-mass').innerText = mass.toFixed(1) + ' g';
        document.getElementById('val-vol').innerText = vol.toFixed(2) + ' L';

        const solute = this.currentScenario.solute;
        const moles = mass / solute.M;
        const conc = moles / vol;

        const liquid = document.getElementById('beaker-liquid');
        const crystals = document.getElementById('beaker-crystals');

        // Volume mapped to beaker height (Max 2.0L = 90% height)
        const heightPct = (vol / 2.0) * 90;
        liquid.style.height = `${Math.max(5, heightPct)}%`;

        // Color mapped to saturation
        const satRatio = Math.min(1.0, conc / solute.satC);
        const alpha = Math.max(0.1, satRatio * 0.9);
        liquid.style.backgroundColor = `rgba(${solute.rgb}, ${alpha})`;

        // Precipitation mechanics
        if (conc > solute.satC) {
            crystals.style.opacity = '1';
        } else {
            crystals.style.opacity = '0';
        }
    }

    checkAnswer() {
        const mass = parseFloat(document.getElementById('slider-mass').value);
        const vol = parseFloat(document.getElementById('slider-vol').value);
        
        const targetM = this.currentScenario.targetM;
        const targetV = this.currentScenario.targetV;
        const solute = this.currentScenario.solute;

        // Tolerance checks (5% margin)
        const massError = Math.abs(mass - targetM) / targetM;
        const volError = Math.abs(vol - targetV) / targetV;
        
        const isMassCorrect = massError <= 0.05;
        const isVolCorrect = volError <= 0.05;

        if (isMassCorrect && isVolCorrect) {
            this.initAudio();
            this.playHit();
            
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 600);
        } else {
            this.initAudio();
            this.playMiss();
            this.mistakes++;
            document.getElementById('health-box').innerText = `Budget Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            let diagnosticMsg = "";
            const conc = (mass / solute.M) / vol;

            if (this.currentScenario.type === 'prep') {
                if (!isVolCorrect) diagnosticMsg = "Check your volume setting. Read the target volume carefully!";
                else diagnosticMsg = "Incorrect mass. Did you convert Concentration to Moles (n = C×V), then Moles to Mass (m = n×M)?";
            } else if (this.currentScenario.type === 'dilution') {
                diagnosticMsg = "Incorrect final volume. Use the dilution formula (C₁V₁ = C₂V₂) or Moles/Target Concentration to find the required total volume.";
            } else if (this.currentScenario.type === 'saturation') {
                if (!isVolCorrect) diagnosticMsg = "Set the correct volume first before calculating saturation mass.";
                else if (conc > solute.satC) diagnosticMsg = "Precipitation detected! You exceeded the maximum solubility limit for this volume.";
                else diagnosticMsg = "Solution is unsaturated. More solute can be dissolved to reach the saturation point.";
            }

            const overlay = document.getElementById('diagnostic-overlay');
            document.getElementById('diagnostic-msg').innerText = diagnosticMsg;
            overlay.classList.add('active');

            if (this.mistakes >= this.maxMistakes) {
                setTimeout(() => this.endGame(false), 1500);
            }
        }
    }

    endGame(win) {
        this.stopTimer();
        const modal = document.querySelector('game-report-modal');
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        const desc = win 
            ? `Exceptional formulating! You successfully completed all scenarios with only ${this.mistakes} errors.${timeStr}`
            : `Budget depleted due to wasted chemical reagents. Review your concentration formulas and try again.`;

        modal.show(
            win ? 'Protocols Completed!' : 'Project Terminated!', 
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

window.addEventListener('DOMContentLoaded', () => new SolutionStrategist());