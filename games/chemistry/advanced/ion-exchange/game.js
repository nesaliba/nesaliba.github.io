import { BaseGame } from '/games/shared/base-game.js';

class IonExchangeGame extends BaseGame {
    constructor() {
        super("Ion Exchange");
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        
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
                <h1>Ion Exchange</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">System Stability: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Mission: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="cell-panel">
                    <div class="cell-header">🔋 Electrochemical Cell Array</div>
                    <div class="cell-layout">
                        <div class="cell-wrapper" id="cell-visual">
                            <!-- Cell will be injected here -->
                        </div>
                    </div>
                    <div class="reference-box">
                        <strong>Standard Reduction Potentials (E&deg;):</strong>
                        Ag⁺ + e⁻ &rightarrow; Ag(s) : +0.80 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Cu²⁺ + 2e⁻ &rightarrow; Cu(s) : +0.34 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Pb²⁺ + 2e⁻ &rightarrow; Pb(s) : -0.13 V <br>
                        Ni²⁺ + 2e⁻ &rightarrow; Ni(s) : -0.26 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Zn²⁺ + 2e⁻ &rightarrow; Zn(s) : -0.76 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Mg²⁺ + 2e⁻ &rightarrow; Mg(s) : -2.37 V
                    </div>
                    <div class="cell-text" id="question-text">Loading mission parameters...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `;
    }

    generateQuestion() {
        const potentials = {
            "Ag": { ion: "Ag⁺", e: 0.80, color: "#cbd5e1", textColor: "#0f172a" },
            "Cu": { ion: "Cu²⁺", e: 0.34, color: "#b45309", textColor: "#ffffff" },
            "Pb": { ion: "Pb²⁺", e: -0.13, color: "#64748b", textColor: "#ffffff" },
            "Ni": { ion: "Ni²⁺", e: -0.26, color: "#10b981", textColor: "#ffffff" },
            "Zn": { ion: "Zn²⁺", e: -0.76, color: "#94a3b8", textColor: "#0f172a" },
            "Mg": { ion: "Mg²⁺", e: -2.37, color: "#f8fafc", textColor: "#0f172a" }
        };

        const pairs = Object.keys(potentials);
        let m1 = pairs[Math.floor(Math.random() * pairs.length)];
        let m2 = pairs[Math.floor(Math.random() * pairs.length)];
        while (m1 === m2) m2 = pairs[Math.floor(Math.random() * pairs.length)];

        // Ensure m1 is always the one with HIGHER E° (Cathode in Spontaneous/Galvanic cell)
        if (potentials[m1].e < potentials[m2].e) {
            let temp = m1; m1 = m2; m2 = temp;
        }

        const isLeftM1 = Math.random() > 0.5;
        const leftMetal = isLeftM1 ? m1 : m2;
        const rightMetal = isLeftM1 ? m2 : m1;

        const visualHTML = `
            <div class="beaker">
                <div class="electrode" style="background: ${potentials[leftMetal].color}; color: ${potentials[leftMetal].textColor}; border: 1px solid #334155;">${leftMetal}</div>
                <div class="ion">${potentials[leftMetal].ion}</div>
            </div>
            <div class="circuit-wire">
                <div class="meter">V</div>
            </div>
            <div class="beaker">
                <div class="electrode" style="background: ${potentials[rightMetal].color}; color: ${potentials[rightMetal].textColor}; border: 1px solid #334155;">${rightMetal}</div>
                <div class="ion">${potentials[rightMetal].ion}</div>
            </div>
        `;

        const eCellNum = potentials[m1].e - potentials[m2].e;
        const eCellSumNum = potentials[m1].e + potentials[m2].e;

        const formatV = (val) => (val > 0 ? '+' : '') + val.toFixed(2) + ' V';

        const getOxidation = (metal) => {
            const eCount = metal === "Ag" ? "e⁻" : "2e⁻";
            return `${metal}(s) &rightarrow; ${potentials[metal].ion} + ${eCount}`;
        };
        const getReduction = (metal) => {
            const eCount = metal === "Ag" ? "e⁻" : "2e⁻";
            return `${potentials[metal].ion} + ${eCount} &rightarrow; ${metal}(s)`;
        };

        const types =['galvanic_voltage', 'identify_anode', 'identify_cathode', 'electron_flow', 'electrolytic_voltage', 'half_reaction'];
        const type = types[Math.floor(Math.random() * types.length)];

        let qText = "", correct = "", options =[];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'galvanic_voltage') {
            qText = `Assume this is a Galvanic (Voltaic) cell. Calculate the standard cell potential (E&deg;<sub>cell</sub>).`;
            correct = formatV(eCellNum);
            options =[
                formatV(eCellNum),
                formatV(-eCellNum),
                formatV(eCellSumNum),
                formatV(-eCellSumNum)
            ];
        } 
        else if (type === 'identify_anode') {
            qText = `For this cell to operate spontaneously (Galvanic), which electrode must be the Anode?`;
            correct = `${m2}(s)`;
            options =[
                correct,
                `${m1}(s)`,
                `${potentials[m2].ion}(aq)`,
                `${potentials[m1].ion}(aq)`
            ];
        }
        else if (type === 'identify_cathode') {
            qText = `For this cell to operate spontaneously (Galvanic), which species undergoes reduction at the Cathode?`;
            correct = `${potentials[m1].ion}(aq)`;
            options =[
                correct,
                `${m1}(s)`,
                `${m2}(s)`,
                `${potentials[m2].ion}(aq)`
            ];
        }
        else if (type === 'electron_flow') {
            qText = `In a spontaneous setup, in which direction do electrons flow through the external wire?`;
            correct = `From ${m2} to ${m1}`;
            options =[
                correct,
                `From ${m1} to ${m2}`,
                `From ${potentials[m2].ion} to ${potentials[m1].ion}`,
                `From ${potentials[m1].ion} to ${potentials[m2].ion}`
            ];
        }
        else if (type === 'electrolytic_voltage') {
            qText = `Suppose we want to drive the non-spontaneous reaction (Electrolysis) where ${m2} is reduced and ${m1} is oxidized. What is the minimum external voltage required?`;
            correct = `> +${eCellNum.toFixed(2)} V`;
            options =[
                correct,
                `< +${eCellNum.toFixed(2)} V`,
                `> -${eCellNum.toFixed(2)} V`,
                `Exactly 0.00 V`
            ];
        }
        else if (type === 'half_reaction') {
            qText = `Which half-reaction occurs at the Anode in a spontaneous Galvanic cell?`;
            correct = getOxidation(m2);
            options =[
                correct,
                getOxidation(m1),
                getReduction(m2),
                getReduction(m1)
            ];
        }

        // Ensure 4 unique options
        options = [...new Set(options)];
        while(options.length < 4) {
            options.push(formatV((Math.random() * 3)));
            options = [...new Set(options)];
        }

        return { visual: visualHTML, question: qText, options: shuffle(options.slice(0, 4)), answer: correct };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Mission: ${this.wave}/${this.maxWaves}`;
        const data = this.generateQuestion();
        
        document.getElementById('cell-visual').innerHTML = data.visual;
        document.getElementById('question-text').innerHTML = data.question;
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
            // Visual feedback: animate meter indicator
            const meter = document.querySelector('.meter');
            if (meter) {
                meter.style.background = 'var(--success)';
                meter.style.color = 'white';
            }

            this.playHit();
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1000);
        } else {
            btn.classList.add('wrong');
            const meter = document.querySelector('.meter');
            if (meter) {
                meter.style.background = 'var(--danger)';
                meter.style.color = 'white';
                meter.classList.add('shake');
            }

            this.playMiss();
            buttons.forEach(b => { if (b.innerHTML === correctAnswer) b.classList.add('correct'); });
            
            this.mistakes++;
            document.getElementById('health-box').innerText = `System Stability: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            setTimeout(() => {
                if (this.mistakes >= this.maxMistakes) this.endGame(false);
                else {
                    this.wave++;
                    if (this.wave > this.maxWaves) this.endGame(true);
                    else this.nextWave();
                }
            }, 2000);
        }
    }

    endGame(win) {
        this.stopTimer();
        const modal = document.querySelector('game-report-modal');
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        const desc = win 
            ? `Excellent work, Engineer. You successfully managed the electrochemical cells with ${this.mistakes} mistakes.${timeStr}`
            : `System failure. Your incorrect cell configurations caused a meltdown.`;

        modal.show(
            win ? 'Cells Operational!' : 'System Failure!', 
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

window.addEventListener('DOMContentLoaded', () => new IonExchangeGame());