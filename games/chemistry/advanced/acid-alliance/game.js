class AcidAllianceGame {
    constructor() {
        this.parseSettings();
        this.applyTheme();
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        this.audioCtx = null;
        this.startTime = Date.now();
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        
        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer();
        this.nextWave();
    }

    parseSettings() {
        const params = new URLSearchParams(window.location.search);
        this.settings = {
            timer: params.get('timer') || 'off',
            timerVisible: params.get('timerVisible') || 'visible',
            maxMistakes: parseInt(params.get('maxMistakes')) || 10,
            mute: params.get('mute') === 'true',
            theme: params.get('theme') || localStorage.getItem('scitriad_theme') || 'light'
        };
    }

    applyTheme() {
        if (this.settings.theme === 'dark') document.body.classList.add('dark-theme');
    }

    initAudio() {
        if (this.settings.mute) return;
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (this.settings.mute || !this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('game-timer');
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    stopTimer() { if (this.timerInterval) clearInterval(this.timerInterval); }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="../../../../Chemistry.html" class="back-btn">← Back to Menu</a>
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
            
            <div class="modal-overlay" id="endModal">
                <div class="modal-content" id="endModalContent">
                    <h2 id="end-title"></h2>
                    <p id="end-desc"></p>
                    <button class="modal-btn" onclick="location.reload()">Play Again</button>
                    <a href="../../../../Chemistry.html" class="modal-btn btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;
    }

    generateQuestion() {
        const types =['ph', 'poh', 'titration', 'buffer', 'conjugate', 'strongweak', 'polyprotic'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let qText = "", correct = "", options =[];
        const toSci = (num) => {
            let [mantissa, exponent] = num.toExponential(2).split('e');
            return `${mantissa} × 10<sup>${exponent}</sup>`;
        };
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'ph') {
            const exp = Math.floor(Math.random() * 12) + 1;
            const mantissa = (Math.random() * 8 + 1).toFixed(2);
            const conc = parseFloat(`${mantissa}e-${exp}`);
            const ph = -Math.log10(conc);
            qText = `System breached! A chemical spill has a hydronium ion concentration,[H<sub>3</sub>O<sup>+</sup>], of ${toSci(conc)} mol/L. Calculate the pH to deploy the neutralizer.`;
            correct = ph.toFixed(2);
            options =[correct, (14 - ph).toFixed(2), (ph + Math.random()*2 + 0.5).toFixed(2), Math.abs(ph - Math.random()*2 - 0.5).toFixed(2)];
        } 
        else if (type === 'poh') {
            const exp = Math.floor(Math.random() * 12) + 1;
            const mantissa = (Math.random() * 8 + 1).toFixed(2);
            const conc = parseFloat(`${mantissa}e-${exp}`);
            const poh = -Math.log10(conc);
            const ph = 14 - poh;
            qText = `Alkaline hazard detected! The hydroxide ion concentration, [OH<sup>-</sup>], is ${toSci(conc)} mol/L. What is the pH of this system?`;
            correct = ph.toFixed(2);
            options =[correct, poh.toFixed(2), (ph > 7 ? ph - 2 : ph + 2).toFixed(2), Math.abs(14 - (poh + 1)).toFixed(2)];
        } 
        else if (type === 'titration') {
            const vA = Math.floor(Math.random() * 40) + 10;
            const cA = (Math.random() * 0.4 + 0.1).toFixed(3);
            const cB = (Math.random() * 0.4 + 0.1).toFixed(3);
            const vB = ((cA * vA) / cB).toFixed(1);
            qText = `Neutralization required. You have ${vA} mL of ${cA} M HCl. What volume of ${cB} M NaOH is required to reach the equivalence point?`;
            correct = `${vB} mL`;
            options =[correct, ((cB * vA) / cA).toFixed(1) + " mL", ((cA * cB) / vA).toFixed(1) + " mL", (vA * 1.5).toFixed(1) + " mL"];
        } 
        else if (type === 'buffer') {
            qText = `Buffer collapse imminent! Select the correct conjugate acid-base pair that can form a buffer system to stabilize the pH.`;
            correct = "CH<sub>3</sub>COOH and NaCH<sub>3</sub>COO";
            options =[correct, "HCl and NaCl", "HNO<sub>3</sub> and KNO<sub>3</sub>", "H<sub>2</sub>SO<sub>4</sub> and Na<sub>2</sub>SO<sub>4</sub>"];
        } 
        else if (type === 'conjugate') {
            const pairs =[
                {a: "H<sub>2</sub>PO<sub>4</sub><sup>-</sup>", b: "HPO<sub>4</sub><sup>2-</sup>"},
                {a: "H<sub>2</sub>CO<sub>3</sub>", b: "HCO<sub>3</sub><sup>-</sup>"},
                {a: "NH<sub>4</sub><sup>+</sup>", b: "NH<sub>3</sub>"},
                {a: "HSO<sub>4</sub><sup>-</sup>", b: "SO<sub>4</sub><sup>2-</sup>"}
            ];
            const p = pairs[Math.floor(Math.random() * pairs.length)];
            qText = `Identify the conjugate base of the amphiprotic species ${p.a} to complete the reaction pathway.`;
            correct = p.b;
            const distractors =["H<sub>3</sub>O<sup>+</sup>", "OH<sup>-</sup>", "PO<sub>4</sub><sup>3-</sup>", "CO<sub>3</sub><sup>2-</sup>", "NH<sub>2</sub><sup>-</sup>", "H<sub>2</sub>SO<sub>4</sub>"].filter(x => x !== p.b).sort(()=>0.5-Math.random()).slice(0,3);
            options = [correct, ...distractors];
        } 
        else if (type === 'strongweak') {
            const acids =[
                {name: "HCl", type: "strong"}, {name: "HNO<sub>3</sub>", type: "strong"}, {name: "H<sub>2</sub>SO<sub>4</sub>", type: "strong"},
                {name: "CH<sub>3</sub>COOH", type: "weak"}, {name: "HF", type: "weak"}, {name: "HCN", type: "weak"}
            ];
            const a = acids[Math.floor(Math.random() * acids.length)];
            qText = `System scan indicates the presence of ${a.name}. Is this acid classified as strong or weak, and what is its expected percent ionization?`;
            if (a.type === "strong") {
                correct = "Strong acid, ~100% ionization";
                options =[correct, "Weak acid, < 5% ionization", "Strong acid, < 5% ionization", "Weak acid, ~100% ionization"];
            } else {
                correct = "Weak acid, < 5% ionization";
                options =[correct, "Strong acid, ~100% ionization", "Weak acid, ~100% ionization", "Strong acid, < 5% ionization"];
            }
        }
        else if (type === 'polyprotic') {
            qText = `Polyprotic analysis required: How many equivalence points are visible on a titration curve when a sample of H<sub>3</sub>PO<sub>4</sub> is titrated with a strong base?`;
            correct = "3";
            options = ["1", "2", "3", "4"];
        }

        options = [...new Set(options)];
        while(options.length < 4) options.push((Math.random() * 14).toFixed(2));
        
        return { question: qText, options: shuffle(options.slice(0,4)), answer: correct };
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
            this.playTone(600, 'sine', 0.15);
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1000);
        } else {
            btn.classList.add('wrong');
            this.playTone(150, 'sawtooth', 0.3);
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
        const modal = document.getElementById('endModal');
        const content = document.getElementById('endModalContent');
        const title = document.getElementById('end-title');
        const desc = document.getElementById('end-desc');

        content.className = `modal-content ${win ? 'win' : 'lose'}`;
        title.innerText = win ? 'System Stabilized!' : 'System Failure!';
        
        let timeStr = this.settings.timer === 'on' ? `<br>Time: ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        desc.innerHTML = win 
            ? `Excellent work, Commander. You neutralized the threats with ${this.mistakes} mistakes.${timeStr}`
            : `System integrity compromised. You made too many miscalculations.`;

        if (win) {
            setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
            setTimeout(() => this.playTone(600, 'sine', 0.2), 150);
            setTimeout(() => this.playTone(800, 'sine', 0.4), 300);
            this.saveProgress();
        } else {
            setTimeout(() => this.playTone(300, 'sawtooth', 0.2), 0);
            setTimeout(() => this.playTone(200, 'sawtooth', 0.4), 300);
        }

        modal.style.display = 'flex';
    }

    async saveProgress() {
        try {
            const fbModule = await import('../../../../js/firebase-init.js');
            const { auth, db, collection, addDoc } = fbModule;
            
            if (auth && auth.currentUser) {
                await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                    title: "Acid Alliance",
                    time: this.elapsedSeconds,
                    mistakes: this.mistakes,
                    date: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn("Could not save progress.", error);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new AcidAllianceGame());