import { BaseGame } from '/games/shared/base-game.js';

const INDICATORS =[
    { name: "Methyl Orange", lowPH: 3.1, highPH: 4.4, lowColor: [255, 0, 0], highColor: [255, 255, 0] },
    { name: "Bromocresol Green", lowPH: 3.8, highPH: 5.4, lowColor:[255, 255, 0], highColor:[0, 0, 255] },
    { name: "Methyl Red", lowPH: 4.4, highPH: 6.2, lowColor: [255, 0, 0], highColor:[255, 255, 0] },
    { name: "Bromothymol Blue", lowPH: 6.0, highPH: 7.6, lowColor:[255, 255, 0], highColor: [0, 0, 255] },
    { name: "Phenol Red", lowPH: 6.4, highPH: 8.0, lowColor: [255, 255, 0], highColor:[255, 0, 0] },
    { name: "Phenolphthalein", lowPH: 8.2, highPH: 10.0, lowColor:[200, 200, 200], highColor: [255, 0, 255] }
];

const ZONES =[
    { type: "strong", name: "Strong Acid (e.g., HCl)", protons: 1, pKa: [-2] },
    { type: "weak", name: "Weak Acid (e.g., Acetic Acid)", protons: 1, pKa:[4.74] },
    { type: "polyprotic", name: "Polyprotic Acid (Diprotic)", protons: 2, pKa: [3.0, 8.0] }
];

class TitrationTowerGame extends BaseGame {
    constructor() {
        super("Titration Tower");
        this.floor = 1;
        this.maxFloors = 9;
        this.integrity = 100;
        this.score = 0;
        
        this.hintsUsed = 0;
        this.graphData =[];
        this.currentVb = 0;
        this.currentPH = 7.0;

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        
        window.addEventListener('resize', () => this.resizeCanvas());
        this.nextFloor();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>TITRATION TOWER</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Structural Integrity: 100%</div>
                    <div class="stat-box" id="wave-box">Floor: 1/9</div>
                </div>
            </header>
            <main class="game-container titration-tower" id="tower-main">
                <div class="tower-panel">
                    
                    <div class="diagnostic-overlay" id="diagnostic-overlay">
                        <div class="diagnostic-title" id="diag-title">⚠️ Protocol Breach</div>
                        <div class="diagnostic-message" id="diagnostic-msg">Error Details</div>
                        <button class="btn-submit primary" id="btn-dismiss-diag" style="padding: 0.5rem 1.5rem; max-width: 200px;">Acknowledge</button>
                    </div>

                    <div class="tower-header">🔬 Laboratory Operation</div>
                    
                    <div class="tower-ui">
                        <div class="monitor-panel">
                            <div class="crt-overlay"></div>
                            <canvas id="curve-canvas"></canvas>
                            <div class="monitor-text">LIVE TELEMETRY: TITRATION CURVE</div>
                        </div>

                        <div class="bench-panel">
                            <div class="controls-panel">
                                <div class="info-readout" id="info-readout">Loading Floor...</div>
                                
                                <div class="titrant-buttons">
                                    <button class="btn-add" data-vol="0.1">+0.1 mL</button>
                                    <button class="btn-add" data-vol="1.0">+1.0 mL</button>
                                    <button class="btn-add" data-vol="5.0">+5.0 mL</button>
                                </div>
                                
                                <div class="submit-section">
                                    <input type="number" id="input-ca" class="input-ca" step="0.001" placeholder="Calculated Ca (M)">
                                    <button id="btn-submit" class="btn-submit">Submit Neutralization</button>
                                </div>

                                <button id="btn-hint" class="btn-hint">Request Diagnostic Hint (-50 pts)</button>
                                <div class="hint-display" id="hint-display"></div>
                            </div>

                            <div class="vials-container" id="vials-container"></div>
                            
                            <div class="flask-assembly">
                                <div class="flask-neck"></div>
                                <div class="flask-glass">
                                    <div class="flask-liquid" id="flask-liquid"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        `;

        this.canvas = document.getElementById('curve-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => this.addTitrant(parseFloat(e.target.dataset.vol)));
        });

        document.getElementById('btn-submit').addEventListener('click', () => this.checkNeutralization());
        document.getElementById('btn-hint').addEventListener('click', () => this.requestHint());
        document.getElementById('btn-dismiss-diag').addEventListener('click', () => {
            document.getElementById('diagnostic-overlay').classList.remove('active');
        });

        this.resizeCanvas();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.parentElement.clientWidth - 20;
        this.canvas.height = 300;
        this.drawGraph();
    }

    getPH(Vb, Va, Ca, Cb, acidProfile) {
        const na = Ca * Va;
        const nb = Cb * Vb;
        const Vt = Va + Vb;
        
        if (acidProfile.type === "strong") {
            if (na > nb) {
                let H = (na - nb) / Vt;
                if (H < 1e-7) H = 1e-7;
                return -Math.log10(H);
            } else {
                let OH = (nb - na) / Vt;
                if (OH < 1e-7) OH = 1e-7;
                return 14 + Math.log10(OH);
            }
        } else if (acidProfile.type === "weak") {
            const Ka = Math.pow(10, -acidProfile.pKa[0]);
            if (nb <= 0) return -Math.log10(Math.sqrt(Ka * Ca));
            
            if (nb < na) {
                let diff = na - nb;
                if (diff < 1e-5) diff = 1e-5;
                let pH = acidProfile.pKa[0] + Math.log10(nb / diff);
                let pH_eq = 14 + Math.log10(Math.sqrt((1e-14/Ka) * (na/Vt)));
                return Math.min(pH, pH_eq);
            } else if (Math.abs(na - nb) < 1e-5) {
                return 14 + Math.log10(Math.sqrt((1e-14/Ka) * (na/Vt)));
            } else {
                let OH = (nb - na) / Vt;
                let OH_from_salt = Math.sqrt((1e-14/Ka) * (na/Vt));
                OH = Math.max(OH, OH_from_salt);
                if (OH < 1e-7) OH = 1e-7;
                return 14 + Math.log10(OH);
            }
        } else if (acidProfile.type === "polyprotic") {
            const pKa1 = acidProfile.pKa[0];
            const pKa2 = acidProfile.pKa[1];
            const Ka1 = Math.pow(10, -pKa1);
            const Ka2 = Math.pow(10, -pKa2);
            
            if (nb <= 0) return -Math.log10(Math.sqrt(Ka1 * Ca));
            
            if (nb < na) {
                let diff = na - nb;
                if (diff < 1e-5) diff = 1e-5;
                let pH = pKa1 + Math.log10(nb / diff);
                let pH_eq1 = (pKa1 + pKa2) / 2;
                return Math.min(pH, pH_eq1);
            } else if (nb < 2*na) {
                let diff = 2*na - nb;
                if (diff < 1e-5) diff = 1e-5;
                let pH = pKa2 + Math.log10((nb - na) / diff);
                let pH_eq2 = 14 + Math.log10(Math.sqrt((1e-14/Ka2) * (na/Vt)));
                return Math.min(Math.max(pH, (pKa1+pKa2)/2), pH_eq2);
            } else {
                let OH = (nb - 2*na) / Vt;
                let OH_from_salt = Math.sqrt((1e-14/Ka2) * (na/Vt));
                OH = Math.max(OH, OH_from_salt);
                if (OH < 1e-7) OH = 1e-7;
                return 14 + Math.log10(OH);
            }
        }
    }

    nextFloor() {
        document.getElementById('wave-box').innerText = `Floor: ${this.floor}/${this.maxFloors}`;
        this.hintsUsed = 0;
        document.getElementById('hint-display').innerText = "";
        document.getElementById('input-ca').value = "";
        
        let zoneIdx = Math.floor((this.floor - 1) / 3);
        if(zoneIdx > 2) zoneIdx = 2;
        this.acidProfile = ZONES[zoneIdx];
        
        this.Ca = (Math.floor(Math.random() * 15) + 5) / 100; // 0.05 to 0.20 M
        this.Va = 25.0;
        this.Cb = 0.100;
        
        this.currentIndicators = [...INDICATORS].sort(()=>Math.random()-0.5).slice(0, 3);
        
        this.currentVb = 0;
        this.currentPH = this.getPH(0, this.Va, this.Ca, this.Cb, this.acidProfile);
        this.graphData =[{v: 0, ph: this.currentPH}];
        
        let infoHtml = `<span>Type:</span> ${this.acidProfile.name}<br>`;
        infoHtml += `<span>Sample Vol:</span> ${this.Va.toFixed(1)} mL<br>`;
        infoHtml += `<span>Titrant:</span> ${this.Cb.toFixed(3)} M NaOH<br>`;
        if(this.acidProfile.protons > 1) infoHtml += `<span>Target:</span> Final Equivalence Point`;
        document.getElementById('info-readout').innerHTML = infoHtml;
        
        this.buildVials();
        this.enableControls(true);
        this.updateUI();
    }

    buildVials() {
        const container = document.getElementById('vials-container');
        container.innerHTML = '';
        this.currentIndicators.forEach((ind, index) => {
            container.innerHTML += `
                <div class="vial-wrapper">
                    <div class="vial-label">${ind.name}</div>
                    <div class="vial-glass">
                        <div class="vial-liquid" id="vial-liquid-${index}"></div>
                    </div>
                </div>
            `;
        });
    }

    enableControls(enabled) {
        document.querySelectorAll('.btn-add').forEach(btn => btn.disabled = !enabled);
        document.getElementById('btn-submit').disabled = !enabled;
        document.getElementById('btn-hint').disabled = !enabled || (this.hintsUsed >= 3);
    }

    addTitrant(amount) {
        if (this.currentVb >= 60) return;
        this.initAudio();
        
        const steps = amount / 0.1;
        for(let i=0; i<steps; i++) {
            this.currentVb += 0.1;
            if(this.currentVb > 60) { this.currentVb = 60; break; }
            this.currentPH = this.getPH(this.currentVb, this.Va, this.Ca, this.Cb, this.acidProfile);
            this.graphData.push({v: this.currentVb, ph: this.currentPH});
        }
        this.updateUI();
    }

    interpolateColor(c1, c2, factor) {
        return[
            Math.round(c1[0] + factor * (c2[0] - c1[0])),
            Math.round(c1[1] + factor * (c2[1] - c1[1])),
            Math.round(c1[2] + factor * (c2[2] - c1[2]))
        ];
    }

    getIndicatorColor(indicator, pH) {
        if (pH <= indicator.lowPH) return indicator.lowColor;
        if (pH >= indicator.highPH) return indicator.highColor;
        const factor = (pH - indicator.lowPH) / (indicator.highPH - indicator.lowPH);
        return this.interpolateColor(indicator.lowColor, indicator.highColor, factor);
    }

    updateUI() {
        this.currentIndicators.forEach((ind, index) => {
            const c = this.getIndicatorColor(ind, this.currentPH);
            const rgbStr = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.8)`;
            const el = document.getElementById(`vial-liquid-${index}`);
            if(el) el.style.backgroundColor = rgbStr;
            if(index === 0) document.getElementById('flask-liquid').style.backgroundColor = rgbStr;
        });
        this.drawGraph();
    }

    drawGraph() {
        if(!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.ctx.clearRect(0, 0, w, h);
        
        this.ctx.strokeStyle = 'var(--crt-grid)';
        this.ctx.fillStyle = 'var(--crt-grid)';
        this.ctx.font = '10px "Share Tech Mono"';
        this.ctx.lineWidth = 1;
        
        for(let i=0; i<=60; i+=10) {
            let x = 30 + (i/60)*(w-40);
            this.ctx.beginPath(); this.ctx.moveTo(x, 10); this.ctx.lineTo(x, h-20); this.ctx.stroke();
            this.ctx.fillText(i, x-5, h-5);
        }
        for(let i=0; i<=14; i+=2) {
            let y = h - 20 - (i/14)*(h-30);
            this.ctx.beginPath(); this.ctx.moveTo(30, y); this.ctx.lineTo(w-10, y); this.ctx.stroke();
            this.ctx.fillText(i, 5, y+3);
        }
        
        this.ctx.strokeStyle = 'var(--primary)';
        this.ctx.beginPath();
        this.ctx.moveTo(30, 10); this.ctx.lineTo(30, h-20); this.ctx.lineTo(w-10, h-20);
        this.ctx.stroke();
        
        if (this.graphData.length === 0) return;

        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'var(--primary)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for(let i=0; i<this.graphData.length; i++) {
            let pt = this.graphData[i];
            let x = 30 + (pt.v/60)*(w-40);
            let y = h - 20 - (pt.ph/14)*(h-30);
            if(i===0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    requestHint() {
        if(this.hintsUsed >= 3) return;
        this.hintsUsed++;
        this.score -= 50;
        
        let hintText = "";
        if(this.hintsUsed === 1) {
            hintText = `Look at the ${this.currentIndicators[0].name} indicator. Its color shifts between pH ${this.currentIndicators[0].lowPH} and ${this.currentIndicators[0].highPH}.`;
        } else if(this.hintsUsed === 2) {
            const formula = this.acidProfile.protons === 1 ? "Ca * Va = Cb * Vb" : `${this.acidProfile.protons} * Ca * Va = Cb * Vb`;
            hintText = `Use the titration formula: ${formula}. Find the steep jump on the graph to get Vb.`;
        } else if(this.hintsUsed === 3) {
            const trueVeq = (this.acidProfile.protons * this.Ca * this.Va) / this.Cb;
            hintText = `The true equivalence point volume is exactly ${trueVeq.toFixed(1)} mL.`;
        }
        document.getElementById('hint-display').innerText = hintText;
        if(this.hintsUsed >= 3) document.getElementById('btn-hint').disabled = true;
    }

    showDiagnostic(msg, isError, canDismiss=false) {
        const overlay = document.getElementById('diagnostic-overlay');
        const title = document.getElementById('diag-title');
        const desc = document.getElementById('diagnostic-msg');
        const btn = document.getElementById('btn-dismiss-diag');
        
        title.innerText = isError ? "⚠️ Protocol Breach" : "✅ Floor Stabilized";
        title.style.color = isError ? "var(--danger)" : "var(--success)";
        desc.innerHTML = msg;
        
        btn.style.display = canDismiss ? 'inline-block' : 'none';
        overlay.classList.add('active');
    }

    checkNeutralization() {
        this.initAudio();
        const playerCa = parseFloat(document.getElementById('input-ca').value);
        if(isNaN(playerCa)) {
            this.playMiss();
            this.showDiagnostic("Error: No concentration entered. Please calculate Ca.", true, true);
            return;
        }
        
        this.enableControls(false);

        const trueVeq = (this.acidProfile.protons * this.Ca * this.Va) / this.Cb;
        const errV = Math.abs(this.currentVb - trueVeq);
        let dmgV = 0;
        if (errV > 1.5) dmgV = 25;
        else if (errV > 0.5) dmgV = 10;
        
        const errC = Math.abs(playerCa - this.Ca) / this.Ca;
        let dmgC = 0;
        if (errC > 0.15) dmgC = 20;
        else if (errC > 0.05) dmgC = 10;
        
        const totalDmg = dmgV + dmgC;
        this.integrity -= totalDmg;
        document.getElementById('health-box').innerText = `Structural Integrity: ${Math.max(0, this.integrity)}%`;
        
        if (totalDmg === 0) {
            this.playHit();
            this.score += 1000;
            this.showDiagnostic("Perfect Neutralization! Structural integrity maintained.", false, false);
        } else {
            this.playMiss();
            this.score += Math.max(0, 500 - totalDmg * 10);
            const tower = document.getElementById('tower-main');
            const flask = document.querySelector('.flask-glass');
            
            tower.classList.add('shake-tower');
            if (errV > 1.5) flask.classList.add('flash-flask');
            
            setTimeout(() => {
                tower.classList.remove('shake-tower');
                flask.classList.remove('flash-flask');
            }, 500);
            
            let msg = `Suboptimal Neutralization. Took ${totalDmg}% structural damage.<br>`;
            if(dmgV > 0) msg += `<br>- Titrant volume was off by ${errV.toFixed(1)} mL.`;
            if(dmgC > 0) msg += `<br>- Calculated concentration was inaccurate.`;
            this.showDiagnostic(msg, true, false);
        }
        
        if (this.integrity <= 0) {
            setTimeout(() => this.endGame(false), 2500);
        } else {
            setTimeout(() => {
                document.getElementById('diagnostic-overlay').classList.remove('active');
                this.floor++;
                if(this.floor > this.maxFloors) this.endGame(true);
                else this.nextFloor();
            }, 3500);
        }
    }

    endGame(win) {
        this.stopTimer();
        const modal = document.querySelector('game-report-modal');
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        const desc = win 
            ? `Laboratory Secured! You flawlessly navigated complex titration environments. Total Score: ${this.score}${timeStr}`
            : `Laboratory Collapse! Molar calculation errors compromised the facility. Review your titration reasoning and try again.`;

        modal.show(
            win ? 'Tower Conquered!' : 'Structural Failure!', 
            desc, 
            win, 
            '/Chemistry.html'
        );

        if (win) {
            this.playVictory();
            // Inverting integrity loss to save as 'mistakes' for consistency with Scitriad tracking
            this.saveProgress(100 - Math.max(0, this.integrity));
        } else {
            this.playGameOver();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new TitrationTowerGame());