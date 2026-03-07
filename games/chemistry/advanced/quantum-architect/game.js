import { BaseGame } from '/games/shared/base-game.js';

const ELEMENTS =[
    { z: 1, sym: 'H', grp: 1, per: 1, mass: 1 },
    { z: 2, sym: 'He', grp: 18, per: 1, mass: 4 },
    { z: 3, sym: 'Li', grp: 1, per: 2, mass: 7, flame: '#dc2626' },
    { z: 4, sym: 'Be', grp: 2, per: 2, mass: 9 },
    { z: 5, sym: 'B', grp: 13, per: 2, mass: 11, flame: '#00ff00' },
    { z: 6, sym: 'C', grp: 14, per: 2, mass: 12 },
    { z: 7, sym: 'N', grp: 15, per: 2, mass: 14 },
    { z: 8, sym: 'O', grp: 16, per: 2, mass: 16 },
    { z: 9, sym: 'F', grp: 17, per: 2, mass: 19 },
    { z: 10, sym: 'Ne', grp: 18, per: 2, mass: 20 },
    { z: 11, sym: 'Na', grp: 1, per: 3, mass: 23, flame: '#ffb700' },
    { z: 12, sym: 'Mg', grp: 2, per: 3, mass: 24 },
    { z: 13, sym: 'Al', grp: 13, per: 3, mass: 27 },
    { z: 14, sym: 'Si', grp: 14, per: 3, mass: 28 },
    { z: 15, sym: 'P', grp: 15, per: 3, mass: 31 },
    { z: 16, sym: 'S', grp: 16, per: 3, mass: 32 },
    { z: 17, sym: 'Cl', grp: 17, per: 3, mass: 35 },
    { z: 18, sym: 'Ar', grp: 18, per: 3, mass: 40 },
    { z: 19, sym: 'K', grp: 1, per: 4, mass: 39, flame: '#c8a2c8' },
    { z: 20, sym: 'Ca', grp: 2, per: 4, mass: 40, flame: '#b22222' },
    { z: 21, sym: 'Sc', grp: 3, per: 4, mass: 45 },
    { z: 22, sym: 'Ti', grp: 4, per: 4, mass: 48 },
    { z: 23, sym: 'V', grp: 5, per: 4, mass: 51 },
    { z: 24, sym: 'Cr', grp: 6, per: 4, mass: 52 },
    { z: 25, sym: 'Mn', grp: 7, per: 4, mass: 55 },
    { z: 26, sym: 'Fe', grp: 8, per: 4, mass: 56 },
    { z: 27, sym: 'Co', grp: 9, per: 4, mass: 59 },
    { z: 28, sym: 'Ni', grp: 10, per: 4, mass: 59 },
    { z: 29, sym: 'Cu', grp: 11, per: 4, mass: 64, flame: '#008b8b' },
    { z: 30, sym: 'Zn', grp: 12, per: 4, mass: 65 },
    { z: 31, sym: 'Ga', grp: 13, per: 4, mass: 70 },
    { z: 32, sym: 'Ge', grp: 14, per: 4, mass: 73 },
    { z: 33, sym: 'As', grp: 15, per: 4, mass: 75 },
    { z: 34, sym: 'Se', grp: 16, per: 4, mass: 79 },
    { z: 35, sym: 'Br', grp: 17, per: 4, mass: 80 },
    { z: 36, sym: 'Kr', grp: 18, per: 4, mass: 84 }
];

class QuantumArchitect extends BaseGame {
    constructor() {
        super("Quantum Architect");
        
        const params = new URLSearchParams(window.location.search);
        this.isDaily = params.get('daily') === 'true';
        
        this.streak = 0;
        this.score = 0;
        this.tier = 1;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        this.maxStreaks = 12; // 3 per tier

        this.playerConfig = {};
        this.maxE = {};
        this.isLocked = false;
        
        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        this.nextPuzzle();
    }

    getDailySeed(puzzleIndex) {
        let d = new Date();
        return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) * 1000 + puzzleIndex;
    }

    rand() {
        if (this.isDaily) {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        }
        return Math.random();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header qa-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Quantum Architect</h1>
                <div class="game-stats" style="margin-top: 0.5rem; font-size: 1rem;">
                    ${timerHTML}
                    <div class="stat-box">Score: <span id="score-disp">0</span></div>
                    <div class="stat-box">Tier: <span id="tier-disp">1</span></div>
                    <div class="stat-box">Phase: <span id="streak-disp">0</span>/${this.maxStreaks}</div>
                    <div class="stat-box" style="color: var(--qa-red);">Mistakes: <span id="mistake-disp">0</span>/${this.maxMistakes}</div>
                </div>
                <button id="btn-codex" class="btn-action primary" style="position: absolute; right: 1.5rem; top: 1.5rem; background: var(--qa-panel); border: 1px solid var(--qa-cyan); color: var(--qa-cyan);">Element Codex</button>
            </header>
            
            <main class="qa-container">
                <!-- Evidence Panel -->
                <div class="qa-panel evidence-panel">
                    <h2>Experimental Evidence</h2>
                    <div id="clues-container"></div>
                    <button id="btn-hint" class="btn-action" style="background: transparent; border: 1px solid var(--qa-amber); color: var(--qa-amber); margin-top: auto;">Request Hint (Cost: 50 pts)</button>
                    <div id="hint-text" style="color: var(--qa-amber); font-size: 0.95rem; margin-top: 1rem; line-height: 1.4;"></div>
                </div>
                
                <!-- Builder Panel -->
                <div class="qa-panel build-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--qa-amber); margin-bottom: 1.5rem; padding-bottom: 0.5rem;">
                        <h2 style="border: none; margin: 0; padding: 0;">Configuration Builder</h2>
                        <div id="charge-indicator" style="color: var(--qa-cyan); font-weight: bold; font-size: 1.2rem;"></div>
                    </div>
                    <div id="builder-container" style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;"></div>
                    <button id="btn-lock" class="btn-action primary" style="margin-top: 1.5rem; width: 100%; background: var(--qa-cyan); color: #000;">Lock Configuration</button>
                    <div id="feedback-text" style="margin-top: 1rem; font-weight: bold; min-height: 3rem; text-align: center; font-size: 1.1rem;"></div>
                </div>
                
                <!-- Periodic Table Panel -->
                <div class="qa-panel pt-panel locked" id="pt-panel">
                    <h2>Identify Element</h2>
                    <div id="pt-grid" class="pt-grid"></div>
                </div>
            </main>

            <!-- Codex Modal -->
            <div class="modal-overlay" id="codex-modal" style="display: none; z-index: 2000;">
                <div class="modal-content qa-panel" style="max-width: 700px; width: 90%; text-align: left;">
                    <h2 style="color: var(--qa-cyan); border-bottom: 1px solid var(--qa-cyan);">Element Codex</h2>
                    <p style="font-size: 0.9rem; margin-bottom: 1rem;">Identify elements in the simulation to permanently record their spectral and physical data in your codex.</p>
                    <div id="codex-grid" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; max-height: 400px; overflow-y: auto;"></div>
                    <div style="text-align: right; margin-top: 1.5rem;">
                        <button class="btn-action primary" id="btn-close-codex" style="background: var(--qa-cyan); color: #000;">Close Codex</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-hint').addEventListener('click', () => this.requestHint());
        document.getElementById('btn-lock').addEventListener('click', () => this.lockConfig());
        document.getElementById('btn-codex').addEventListener('click', () => this.showCodex());
        document.getElementById('btn-close-codex').addEventListener('click', () => {
            document.getElementById('codex-modal').style.display = 'none';
        });
    }

    nextPuzzle() {
        if (this.isDaily) this.seed = this.getDailySeed(this.streak);

        if (this.streak < 3) this.tier = 1;
        else if (this.streak < 6) this.tier = 2;
        else if (this.streak < 9) this.tier = 3;
        else this.tier = 4;

        this.isLocked = false;
        this.hintsUsed = 0;
        
        document.getElementById('pt-panel').classList.add('locked');
        document.getElementById('btn-lock').disabled = false;
        document.getElementById('hint-text').innerText = '';
        document.getElementById('feedback-text').innerText = '';
        document.getElementById('charge-indicator').innerText = '';

        let validElements =[];
        if (this.tier === 1) validElements = ELEMENTS.filter(e => e.z <= 20);
        else if (this.tier === 2) validElements = ELEMENTS.filter(e => e.z <= 36 && e.z !== 24 && e.z !== 29);
        else if (this.tier === 3) validElements = ELEMENTS.filter(e => e.z >= 21 && e.z <= 30);
        else validElements = ELEMENTS.filter(e => e.z <= 36 && e.grp !== 14 && e.grp !== 18);

        this.targetEl = validElements[Math.floor(this.rand() * validElements.length)];
        
        this.targetCharge = 0;
        if (this.tier === 4) {
            if (this.targetEl.grp === 1) this.targetCharge = +1;
            else if (this.targetEl.grp === 2) this.targetCharge = +2;
            else if (this.targetEl.grp === 13) this.targetCharge = +3;
            else if (this.targetEl.grp === 15) this.targetCharge = -3;
            else if (this.targetEl.grp === 16) this.targetCharge = -2;
            else if (this.targetEl.grp === 17) this.targetCharge = -1;
            else if (this.targetEl.grp >= 3 && this.targetEl.grp <= 12) this.targetCharge = (this.rand() > 0.5 ? +2 : +3);
            else this.targetCharge = +1;
            
            document.getElementById('charge-indicator').innerText = `Species Charge: ${this.targetCharge > 0 ? '+' : ''}${this.targetCharge}`;
        }

        let pool =['mass', 'reactivity', 'spectrum'];
        if (this.targetEl.flame) pool.push('flame');
        if (this.targetEl.grp <= 2 || this.targetEl.grp >= 13) pool.push('ie');

        pool.sort(() => this.rand() - 0.5);
        let numClues = Math.floor(this.rand() * 3) + 2;
        this.currentClues = pool.slice(0, numClues);
        if (this.tier === 4) this.currentClues.unshift('charge');

        this.resetBuilder();
        this.renderClues();
        this.renderBuilder();
        this.renderPT();
        this.updateStats();
    }

    resetBuilder() {
        this.playerConfig = {};
        if (this.tier === 1) {
            ['Shell 1', 'Shell 2', 'Shell 3', 'Shell 4'].forEach(s => this.playerConfig[s] = 0);
            this.maxE = { 'Shell 1': 2, 'Shell 2': 8, 'Shell 3': 8, 'Shell 4': 2 };
        } else {['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'].forEach(s => this.playerConfig[s] = 0);
            this.maxE = { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6 };
        }
    }

    getSpectralLines(z) {
        let lines =[];
        let tempSeed = z * 1234.5678;
        let count = 3 + (Math.floor(tempSeed) % 3);
        for (let i = 0; i < count; i++) {
            tempSeed = (tempSeed * 9301 + 49297) % 233280;
            let pos = 10 + (tempSeed / 233280) * 80;
            let hue = 280 - (pos / 100) * 280;
            lines.push({ pos, color: `hsl(${hue}, 100%, 50%)` });
        }
        return lines;
    }

    renderClues() {
        const container = document.getElementById('clues-container');
        container.innerHTML = '';
        
        this.currentClues.forEach(c => {
            if (c === 'mass') {
                let n = this.targetEl.mass - this.targetEl.z;
                container.innerHTML += `
                    <div class="clue-box">
                        <div class="clue-title">Mass Spectrometry</div>
                        <div style="font-family: monospace; font-size: 0.95rem;">
                            Dominant Isotope Mass: ${this.targetEl.mass} amu<br>
                            Isotope distribution indicates approx ${n} neutrons.
                        </div>
                    </div>`;
            } else if (c === 'reactivity') {
                let text = "Exhibits intermediate reactivity, characteristic of p-block elements.";
                let g = this.targetEl.grp;
                if (g === 1) text = "Reacts violently with water, forming alkaline solutions and H₂ gas.";
                else if (g === 2) text = "Reacts slowly with water; forms basic oxides.";
                else if (g >= 3 && g <= 12) text = "Forms colorful complexes and can exist in multiple oxidation states.";
                else if (g === 17) text = "Highly reactive nonmetal; readily forms salts with Group 1 elements.";
                else if (g === 18) text = "Extremely inert monatomic gas; rarely forms compounds.";
                
                container.innerHTML += `
                    <div class="clue-box">
                        <div class="clue-title">Chemical Reactivity</div>
                        <div style="font-size: 0.95rem;">${text}</div>
                    </div>`;
            } else if (c === 'ie') {
                let val = this.targetEl.grp <= 2 ? this.targetEl.grp : (this.targetEl.grp >= 13 ? this.targetEl.grp - 10 : 2);
                let html = `<div class="clue-box"><div class="clue-title">Successive Ionization Energies</div><div class="ie-graph">`;
                for (let i = 1; i <= val + 2 && i <= 8; i++) {
                    let h = i <= val ? 10 + i * 5 : 80 + (i - val) * 5;
                    let color = i <= val ? 'var(--qa-cyan)' : 'var(--qa-amber)';
                    html += `<div class="ie-bar" style="height: ${h}%; background: ${color};" title="IE ${i}"></div>`;
                }
                html += `</div></div>`;
                container.innerHTML += html;
            } else if (c === 'flame') {
                container.innerHTML += `
                    <div class="clue-box">
                        <div class="clue-title">Flame Test Emission</div>
                        <div class="flame-container">
                            <div class="flame" style="background: radial-gradient(ellipse at bottom, white 10%, ${this.targetEl.flame} 60%, transparent 100%);"></div>
                        </div>
                    </div>`;
            } else if (c === 'spectrum') {
                let lines = this.getSpectralLines(this.targetEl.z);
                let html = `<div class="clue-box"><div class="clue-title">Emission Spectrum</div><div class="spectrum-strip">`;
                lines.forEach(l => {
                    html += `<div class="spec-line" style="left: ${l.pos}%; background: ${l.color}; box-shadow: 0 0 5px ${l.color};"></div>`;
                });
                html += `</div></div>`;
                container.innerHTML += html;
            } else if (c === 'charge') {
                container.innerHTML += `
                    <div class="clue-box" style="border-color: var(--qa-cyan); background: rgba(0, 240, 255, 0.05);">
                        <div class="clue-title" style="color: var(--qa-text);">Isolated Species Charge</div>
                        <div style="font-size: 1.2rem; font-weight: bold; color: var(--qa-cyan);">
                            Charge: ${this.targetCharge > 0 ? '+' : ''}${this.targetCharge}
                        </div>
                    </div>`;
            }
        });
    }

    adjustSub(sub, delta) {
        if (this.isLocked) return;
        let current = this.playerConfig[sub];
        let max = this.maxE[sub];
        if (current + delta >= 0 && current + delta <= max) {
            this.playerConfig[sub] += delta;
            this.renderBuilder();
        }
    }

    renderBuilder() {
        const container = document.getElementById('builder-container');
        container.innerHTML = '';

        if (this.tier === 1) {
            container.innerHTML = `
                <div id="bohr-diagram" class="bohr-diagram">
                    <div class="bohr-nucleus"></div>
                    <div class="bohr-ring" data-shell="1"></div>
                    <div class="bohr-ring" data-shell="2"></div>
                    <div class="bohr-ring" data-shell="3"></div>
                    <div class="bohr-ring" data-shell="4"></div>
                </div>
                <div id="electron-pool" class="electron-pool"></div>
            `;

            const diagram = document.getElementById('bohr-diagram');
            const radii = { 1: 40, 2: 70, 3: 100, 4: 130 };
            const ringThickness = 18;

            for (let s = 1; s <= 4; s++) {
                let count = this.playerConfig[`Shell ${s}`];
                let r = radii[s];
                for (let i = 0; i < count; i++) {
                    let angle = (i / count) * Math.PI * 2;
                    let x = 150 + r * Math.cos(angle);
                    let y = 150 + r * Math.sin(angle);
                    let el = document.createElement('div');
                    el.className = 'bohr-electron';
                    el.style.left = x + 'px';
                    el.style.top = y + 'px';
                    if (!this.isLocked) {
                        el.onclick = () => {
                            this.playerConfig[`Shell ${s}`]--;
                            this.renderBuilder();
                        };
                    }
                    diagram.appendChild(el);
                }
            }

            const pool = document.getElementById('electron-pool');
            let totalPlaced = Object.values(this.playerConfig).reduce((a, b) => a + b, 0);
            const totalElectrons = this.targetEl.z - this.targetCharge;
            let poolCount = totalElectrons - totalPlaced;
            for (let i = 0; i < poolCount; i++) {
                let e = document.createElement('div');
                e.className = 'pool-electron';
                if (!this.isLocked) {
                    e.draggable = true;
                    e.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', 'electron');
                }
                pool.appendChild(e);
            }

            if (!this.isLocked) {
                for (let s = 1; s <= 4; s++) {
                    const r = radii[s];
                    const size = r * 2 + ringThickness;
                    const hitZone = document.createElement('div');
                    hitZone.style.cssText = `
                        position: absolute;
                        top: 50%; left: 50%;
                        width: ${size}px; height: ${size}px;
                        margin-left: ${-size / 2}px; margin-top: ${-size / 2}px;
                        border-radius: 50%;
                        cursor: pointer;
                        z-index: ${5 - s};
                        background: transparent;
                    `;
                    if (s > 1) {
                        const innerR = radii[s - 1];
                        const innerSize = innerR * 2 + ringThickness;
                        hitZone.style.clipPath = `path('evenodd')`;
                        hitZone.style.setProperty('--inner-ratio', `${(innerSize / size) * 50}%`);
                    }
                    hitZone.ondragover = (ev) => ev.preventDefault();
                    hitZone.onclick = () => {
                        if (this.playerConfig[`Shell ${s}`] < this.maxE[`Shell ${s}`]) {
                            this.playerConfig[`Shell ${s}`]++;
                            this.renderBuilder();
                        }
                    };
                    hitZone.ondrop = (ev) => {
                        ev.preventDefault();
                        if (ev.dataTransfer.getData('text/plain') === 'electron') {
                            if (this.playerConfig[`Shell ${s}`] < this.maxE[`Shell ${s}`]) {
                                this.playerConfig[`Shell ${s}`]++;
                                this.renderBuilder();
                            }
                        }
                    };
                    diagram.appendChild(hitZone);
                }
            }
        } else {
            const orbitalBoard = document.createElement('div');
            orbitalBoard.className = 'orbital-board';
            
            const subshells =['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'];
            subshells.forEach(sub => {
                let count = this.playerConfig[sub];
                let max = this.maxE[sub];
                let numBoxes = max / 2;
                
                let row = document.createElement('div');
                row.className = 'subshell-row';
                
                let label = document.createElement('div');
                label.className = 'sub-label';
                label.innerText = sub;
                
                let btnMinus = document.createElement('button');
                btnMinus.className = 'btn-sub';
                btnMinus.innerText = '-';
                btnMinus.disabled = this.isLocked;
                btnMinus.onclick = () => this.adjustSub(sub, -1);
                
                let boxesContainer = document.createElement('div');
                boxesContainer.className = 'orbital-boxes';
                for (let i = 0; i < numBoxes; i++) {
                    let up = count > i ? '↑' : '';
                    let down = count > i + numBoxes ? '↓' : '';
                    let box = document.createElement('div');
                    box.className = 'orb-box';
                    box.innerHTML = `<span class="arr-up">${up}</span><span class="arr-down">${down}</span>`;
                    boxesContainer.appendChild(box);
                }
                
                let btnPlus = document.createElement('button');
                btnPlus.className = 'btn-sub';
                btnPlus.innerText = '+';
                btnPlus.disabled = this.isLocked;
                btnPlus.onclick = () => this.adjustSub(sub, 1);
                
                row.appendChild(label);
                row.appendChild(btnMinus);
                row.appendChild(boxesContainer);
                row.appendChild(btnPlus);
                
                orbitalBoard.appendChild(row);
            });
            container.appendChild(orbitalBoard);
        }
    }

    renderPT() {
        const pt = document.getElementById('pt-grid');
        pt.innerHTML = '';
        for(let r = 1; r <= 4; r++) {
            for(let c = 1; c <= 18; c++) {
                const el = ELEMENTS.find(e => e.per === r && e.grp === c);
                const cell = document.createElement('div');
                cell.className = 'pt-cell';
                if (el) {
                    cell.innerText = el.sym;
                    cell.onclick = () => this.selectElement(el.z, cell);
                } else {
                    cell.classList.add('empty');
                }
                pt.appendChild(cell);
            }
        }
    }

    lockConfig() {
        this.isLocked = true;
        this.renderBuilder();
        document.getElementById('pt-panel').classList.remove('locked');
        document.getElementById('btn-lock').disabled = true;
        this.showFeedback("Configuration locked! Now identify the element on the Periodic Table.", "var(--qa-cyan)");
    }

    showFeedback(msg, color) {
        const el = document.getElementById('feedback-text');
        el.innerText = msg;
        el.style.color = color;
    }

    updateStats() {
        document.getElementById('score-disp').innerText = this.score;
        document.getElementById('streak-disp').innerText = this.streak;
        document.getElementById('mistake-disp').innerText = this.mistakes;
        document.getElementById('tier-disp').innerText = this.tier;
    }

    requestHint() {
        if (this.hintsUsed >= 3) return;
        this.hintsUsed++;
        this.score -= 50;
        this.updateStats();
        
        const hintEl = document.getElementById('hint-text');
        if (this.hintsUsed === 1) {
            hintEl.innerText = "Hint 1: Analyze mass or reactivity to find the chemical family. Check flame or spectra for specifics.";
        } else if (this.hintsUsed === 2) {
            let val = this.targetEl.grp <= 2 ? this.targetEl.grp : (this.targetEl.grp >= 13 ? this.targetEl.grp - 10 : '?');
            hintEl.innerText = `Hint 2: This species neutral state is located in Period ${this.targetEl.per}.`;
        } else {
            hintEl.innerText = `Hint 3: The element belongs to Group ${this.targetEl.grp}.`;
        }
    }

    getTier1Config(z, charge) {
        let e = z - charge;
        let config = { 'Shell 1': 0, 'Shell 2': 0, 'Shell 3': 0, 'Shell 4': 0 };
        const fillOrder =['Shell 1', 'Shell 2', 'Shell 3', 'Shell 4'];
        let remaining = e;
        for (let sub of fillOrder) {
            let add = Math.min(remaining, this.maxE[sub]);
            config[sub] = add;
            remaining -= add;
            if (remaining === 0) break;
        }
        return config;
    }

    getCorrectConfig(z, charge) {
        let config = { '1s': 0, '2s': 0, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0, '4p': 0 };
        const fillOrder =['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'];
        
        let remaining = z;
        for (let sub of fillOrder) {
            let add = Math.min(remaining, this.maxE[sub]);
            config[sub] = add;
            remaining -= add;
            if (remaining === 0) break;
        }

        // Anomalous configurations
        if (z === 24) { config['4s'] = 1; config['3d'] = 5; }
        if (z === 29) { config['4s'] = 1; config['3d'] = 10; }

        if (charge > 0) {
            let toRemove = charge;
            const removeOrder =['4p', '4s', '3d', '3p', '3s', '2p', '2s', '1s'];
            for (let sub of removeOrder) {
                if (toRemove === 0) break;
                if (config[sub] > 0) {
                    let take = Math.min(config[sub], toRemove);
                    config[sub] -= take;
                    toRemove -= take;
                }
            }
        } else if (charge < 0) {
            let toAdd = -charge;
            for (let sub of fillOrder) {
                if (toAdd === 0) break;
                let space = this.maxE[sub] - config[sub];
                if (space > 0) {
                    let give = Math.min(space, toAdd);
                    config[sub] += give;
                    toAdd -= give;
                }
            }
        }

        return config;
    }

    selectElement(z, cell) {
        if (!this.isLocked) {
            this.showFeedback("Lock your configuration first before identifying the element!", "var(--qa-amber)");
            return;
        }
        
        const expected = this.tier === 1 ? this.getTier1Config(this.targetEl.z, this.targetCharge) : this.getCorrectConfig(this.targetEl.z, this.targetCharge);
        let configCorrect = true;
        for (let k in expected) {
            if (this.playerConfig[k] !== expected[k]) { configCorrect = false; break; }
        }

        if (!configCorrect) {
            this.playMiss();
            this.showFeedback("Configuration incorrect! Review electron ordering, Hund's rule, or 4s/3d ion logic.", "var(--qa-red)");
            this.mistakes++;
            this.isLocked = false;
            document.getElementById('btn-lock').disabled = false;
            document.getElementById('pt-panel').classList.add('locked');
            this.renderBuilder();
            this.updateStats();
            this.checkGameOver();
            return;
        }

        if (z !== this.targetEl.z) {
            this.playMiss();
            this.showFeedback("Element incorrect! Review the evidence (Mass, Reactivity, IE).", "var(--qa-red)");
            this.mistakes++;
            this.updateStats();
            this.checkGameOver();
            return;
        }

        this.playVictory();
        this.showFeedback(`Correct! The element is ${this.targetEl.sym}.`, "var(--qa-green)");
        
        let codex = JSON.parse(localStorage.getItem('scitriad_qa_codex') || '[]');
        if (!codex.includes(this.targetEl.z)) {
            codex.push(this.targetEl.z);
            localStorage.setItem('scitriad_qa_codex', JSON.stringify(codex));
        }

        this.score += 100 * (5 - this.currentClues.length) - (this.hintsUsed * 50);
        this.streak++;
        this.updateStats();
        
        setTimeout(() => {
            if (this.streak >= this.maxStreaks) {
                this.endGame(true);
            } else {
                this.nextPuzzle();
            }
        }, 2000);
    }

    checkGameOver() {
        if (this.mistakes >= this.maxMistakes) {
            setTimeout(() => this.endGame(false), 1500);
        }
    }

    showCodex() {
        const grid = document.getElementById('codex-grid');
        grid.innerHTML = '';
        const codex = JSON.parse(localStorage.getItem('scitriad_qa_codex') || '[]');

        ELEMENTS.forEach(el => {
            const box = document.createElement('div');
            box.className = 'codex-box' + (codex.includes(el.z) ? ' unlocked' : '');
            box.innerText = el.sym;
            if (codex.includes(el.z)) {
                box.title = `Z=${el.z} | Mass: ${el.mass} | Group ${el.grp}, Period ${el.per}`;
            } else {
                box.title = 'Not yet identified';
            }
            grid.appendChild(box);
        });

        document.getElementById('codex-modal').style.display = 'flex';
    }

    endGame(won) {
        const finalScore = Math.max(0, this.score);
        this.submitScore(finalScore);

        const report = document.querySelector('game-report-modal');
        if (report) {
            report.show({
                won,
                score: finalScore,
                streak: this.streak,
                maxStreaks: this.maxStreaks,
                mistakes: this.mistakes,
                maxMistakes: this.maxMistakes,
                tier: this.tier,
                message: won
                    ? `Outstanding work, Quantum Architect! You identified all ${this.maxStreaks} elements across all tiers.`
                    : `Lab collapsed after ${this.streak} correct identifications. Review your electron configuration logic and try again.`
            });
        }
    }
}

new QuantumArchitect();