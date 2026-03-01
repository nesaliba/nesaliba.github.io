import { BaseGame } from '/games/shared/base-game.js';

class AcidAllianceGame extends BaseGame {
    constructor() {
        super("Acid Alliance"); 
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
                <h1>Acid Alliance</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Crisis: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="crisis-panel">
                    <div class="crisis-header">⚠️ Incoming Crisis Protocol</div>
                    <div class="crisis-text" id="question-text">Loading system metrics...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `;
    }

    generateQuestion() {
        const types =['ph_calc', 'poh_calc', 'conjugate', 'titration', 'buffer', 'strong_weak', 'neutralization'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let qText = "", correct = "", options =[];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'ph_calc') {
            const exp = Math.floor(Math.random() * 4) + 2; 
            const coeff = (Math.random() * 8 + 1).toFixed(1); 
            const concStr = coeff + " &times; 10<sup>-" + exp + "</sup>";
            const concNum = parseFloat(coeff) * Math.pow(10, -exp);
            const ph = (-Math.log10(concNum)).toFixed(2);
            
            qText = `Core leak detected.[H<sub>3</sub>O<sup>+</sup>] is measured at ${concStr} M. Calculate the pH.`;
            correct = ph;
            options =[
                correct, 
                (-Math.log10(concNum) + 1).toFixed(2), 
                (-Math.log10(concNum) - 1).toFixed(2), 
                (14 - (-Math.log10(concNum))).toFixed(2)
            ];
        } 
        else if (type === 'poh_calc') {
            const exp = Math.floor(Math.random() * 4) + 2;
            const coeff = (Math.random() * 8 + 1).toFixed(1);
            const concStr = coeff + " &times; 10<sup>-" + exp + "</sup>";
            const concNum = parseFloat(coeff) * Math.pow(10, -exp);
            const poh = (-Math.log10(concNum)).toFixed(2);
            const ph = (14 - parseFloat(poh)).toFixed(2);
            
            qText = `Alkaline breach! [OH<sup>-</sup>] is ${concStr} M. What is the pH of the system?`;
            correct = ph;
            options =[
                correct, 
                poh, 
                (parseFloat(ph) - 1).toFixed(2), 
                (parseFloat(poh) + 1).toFixed(2)
            ];
        }
        else if (type === 'conjugate') {
            const pairs =[
                { acid: "CH<sub>3</sub>COOH", base: "CH<sub>3</sub>COO<sup>-</sup>" },
                { acid: "H<sub>2</sub>CO<sub>3</sub>", base: "HCO<sub>3</sub><sup>-</sup>" },
                { acid: "NH<sub>4</sub><sup>+</sup>", base: "NH<sub>3</sub>" },
                { acid: "H<sub>3</sub>PO<sub>4</sub>", base: "H<sub>2</sub>PO<sub>4</sub><sup>-</sup>" },
                { acid: "H<sub>2</sub>SO<sub>4</sub>", base: "HSO<sub>4</sub><sup>-</sup>" }
            ];
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const isAcid = Math.random() > 0.5;
            
            if (isAcid) {
                qText = `Identify the conjugate base of ${pair.acid}.`;
                correct = pair.base;
                options =[
                    correct, 
                    pair.acid + "H<sup>+</sup>", 
                    pair.acid.replace("H", ""),
                    "OH<sup>-</sup>"
                ];
            } else {
                qText = `Identify the conjugate acid of ${pair.base}.`;
                correct = pair.acid;
                options =[
                    correct, 
                    pair.base.replace("<sup>-</sup>", "<sup>2-</sup>").replace("NH<sub>3</sub>", "NH<sub>2</sub><sup>-</sup>"), 
                    pair.base.replace("H", ""), 
                    "H<sub>3</sub>O<sup>+</sup>"
                ];
            }
        }
        else if (type === 'titration') {
            const isStrongBase = Math.random() > 0.5;
            if (isStrongBase) {
                qText = `A weak acid is being titrated with a strong base. What is the expected pH at the equivalence point?`;
                correct = "pH > 7.00";
                options =[correct, "pH < 7.00", "pH = 7.00", "Depends on the indicator"];
            } else {
                qText = `A weak base is being titrated with a strong acid. What is the expected pH at the equivalence point?`;
                correct = "pH < 7.00";
                options =[correct, "pH > 7.00", "pH = 7.00", "Depends on the indicator"];
            }
        }
        else if (type === 'buffer') {
            qText = `To create a buffer system to stabilize the reactor pH, which combination should be injected?`;
            correct = "A weak acid and its conjugate base";
            options =[
                correct, 
                "A strong acid and a strong base", 
                "A weak acid and a strong acid", 
                "Two weak bases"
            ];
        }
        else if (type === 'strong_weak') {
            qText = `System sensors show an acid that ionizes 100% in water. How is this classified?`;
            correct = "Strong Acid";
            options =[correct, "Weak Acid", "Concentrated Acid", "Dilute Acid"];
        }
        else if (type === 'neutralization') {
            const v1 = Math.floor(Math.random() * 20) + 10;
            const m1 = (Math.random() * 0.5 + 0.1).toFixed(2);
            const v2 = Math.floor(Math.random() * 20) + 10;
            
            const m2 = ((m1 * v1) / v2).toFixed(2);
            
            qText = `Titration required! ${v1} mL of ${m1} M HCl neutralizes ${v2} mL of NaOH. What is the concentration of the NaOH?`;
            correct = `${m2} M`;
            
            options =[
                correct,
                `${((m1 * v2) / v1).toFixed(2)} M`,
                `${(m1 * v1 * v2).toFixed(2)} M`,
                `${(parseFloat(m1) / 2).toFixed(2)} M`
            ];
        }

        let uniqueOptions = [...new Set(options)];
        while (uniqueOptions.length < 4) {
            uniqueOptions.push((Math.random() * 14).toFixed(2) + (type === 'neutralization' ? ' M' : ''));
            uniqueOptions = [...new Set(uniqueOptions)];
        }

        return { question: qText, options: shuffle(uniqueOptions.slice(0, 4)), answer: correct };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Crisis: ${this.wave}/${this.maxWaves}`;
        const data = this.generateQuestion();
        
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
            this.playHit();
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1000);
        } else {
            btn.classList.add('wrong');
            this.playMiss();
            buttons.forEach(b => { if (b.innerHTML === correctAnswer) b.classList.add('correct'); });
            
            this.mistakes++;
            document.getElementById('health-box').innerText = `Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
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
            ? `Excellent work, Commander. You neutralized the threats with ${this.mistakes} mistakes.${timeStr}`
            : `System integrity compromised. You made too many miscalculations.`;

        modal.show(
            win ? 'System Stabilized!' : 'System Failure!', 
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

window.addEventListener('DOMContentLoaded', () => new AcidAllianceGame());