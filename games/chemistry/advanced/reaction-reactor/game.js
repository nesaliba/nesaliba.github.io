class ReactionReactorGame {
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
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Reaction Reactor</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Reactor Stability: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Condition Shift: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="reactor-panel">
                    <div class="reactor-header">⚙️ System Alert</div>
                    <div class="reaction-display" id="reaction-formula">Loading reaction...</div>
                    <div class="reactor-text" id="question-text">Analyzing variables...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
            
            <div class="modal-overlay" id="endModal">
                <div class="modal-content" id="endModalContent">
                    <h2 id="end-title"></h2>
                    <p id="end-desc"></p>
                    <button class="modal-btn" onclick="location.reload()">Reinitialize Reactor</button>
                    <a href="/Chemistry.html" class="modal-btn btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;
    }

    generateQuestion() {
        const types =['le_chatelier_conc', 'le_chatelier_temp', 'le_chatelier_pressure', 'equilibrium_kc', 'catalyst', 'kinetics_rate'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let qText = "", rxnText = "", correct = "", options =[];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'le_chatelier_conc') {
            rxnText = `H<sub>2</sub>(g) + I<sub>2</sub>(g) &rightleftharpoons; 2HI(g)`;
            const isAdding = Math.random() > 0.5;
            const species = Math.random() > 0.5 ? "H<sub>2</sub>(g)" : "HI(g)";
            
            if (isAdding) {
                qText = `System is at equilibrium. An injection of ${species} is detected. According to Le Chatelier's principle, which way will the equilibrium shift?`;
                correct = species === "HI(g)" ? "Shift Left (Towards Reactants)" : "Shift Right (Towards Products)";
            } else {
                qText = `System is at equilibrium. A scrubber removes ${species} from the reactor. Which way will the equilibrium shift to compensate?`;
                correct = species === "HI(g)" ? "Shift Right (Towards Products)" : "Shift Left (Towards Reactants)";
            }
            options =["Shift Left (Towards Reactants)", "Shift Right (Towards Products)", "No Shift in Equilibrium", "The Equilibrium Constant (Kc) Changes"];
        } 
        else if (type === 'le_chatelier_temp') {
            const isExo = Math.random() > 0.5;
            if (isExo) {
                rxnText = `2SO<sub>2</sub>(g) + O<sub>2</sub>(g) &rightleftharpoons; 2SO<sub>3</sub>(g) + Heat`;
            } else {
                rxnText = `N<sub>2</sub>O<sub>4</sub>(g) + Heat &rightleftharpoons; 2NO<sub>2</sub>(g)`;
            }
            
            const tempChange = Math.random() > 0.5 ? "increases" : "decreases";
            qText = `Reactor core temperature suddenly <strong>${tempChange}</strong>. Which direction will the system shift to re-establish equilibrium?`;
            
            if (isExo) {
                correct = tempChange === "increases" ? "Shift Left (Towards Reactants)" : "Shift Right (Towards Products)";
            } else {
                correct = tempChange === "increases" ? "Shift Right (Towards Products)" : "Shift Left (Towards Reactants)";
            }
            options =["Shift Left (Towards Reactants)", "Shift Right (Towards Products)", "No Shift in Equilibrium", "Both rates decrease equally"];
        } 
        else if (type === 'le_chatelier_pressure') {
            rxnText = `N<sub>2</sub>(g) + 3H<sub>2</sub>(g) &rightleftharpoons; 2NH<sub>3</sub>(g)`;
            const volChange = Math.random() > 0.5 ? "compressed (pressure increased)" : "expanded (pressure decreased)";
            
            qText = `The reactor volume is <strong>${volChange}</strong>. How will the system respond?`;
            if (volChange.includes("compressed")) {
                correct = "Shift Right (Towards fewer moles of gas)";
            } else {
                correct = "Shift Left (Towards more moles of gas)";
            }
            options =[
                "Shift Right (Towards fewer moles of gas)", 
                "Shift Left (Towards more moles of gas)", 
                "No Shift (Moles of gas are equal)", 
                "Shift Right (Towards more moles of gas)"
            ];
        } 
        else if (type === 'equilibrium_kc') {
            rxnText = `A(g) + B(g) &rightleftharpoons; C(g)`;
            const A = (Math.random() * 0.4 + 0.1).toFixed(2);
            const B = (Math.random() * 0.4 + 0.1).toFixed(2);
            const C = (Math.random() * 0.8 + 0.2).toFixed(2);
            const Kc = (parseFloat(C) / (parseFloat(A) * parseFloat(B))).toFixed(2);
            
            qText = `At equilibrium, the reactor sensors read: [A] = ${A} M, [B] = ${B} M, and [C] = ${C} M. Calculate the equilibrium constant (K<sub>c</sub>).`;
            correct = Kc;
            options =[
                correct, 
                ((parseFloat(A)*parseFloat(B))/parseFloat(C)).toFixed(2), 
                (parseFloat(C)/(parseFloat(A)+parseFloat(B))).toFixed(2), 
                (parseFloat(C)*parseFloat(A)*parseFloat(B)).toFixed(2)
            ];
        } 
        else if (type === 'catalyst') {
            rxnText = `A(g) + B(g) &rightleftharpoons; AB(g)`;
            qText = `Reactor efficiency is sub-optimal. A solid catalyst is introduced into the chamber. What is the primary effect on the reaction's potential energy profile?`;
            correct = "Lowers activation energy for both forward & reverse reactions";
            options =[
                correct, 
                "Shifts equilibrium towards the products (Right)", 
                "Changes the enthalpy (ΔH) of the reaction", 
                "Increases activation energy to slow the reverse reaction"
            ];
        } 
        else if (type === 'kinetics_rate') {
            rxnText = `2N<sub>2</sub>O<sub>5</sub>(g) &rightarrow; 4NO<sub>2</sub>(g) + O<sub>2</sub>(g)`;
            const rate = (Math.random() * 0.05 + 0.01).toFixed(3);
            const correctRate = (parseFloat(rate) * 2).toFixed(3); // 4/2 = 2x
            
            qText = `Kinetics scan: The rate of disappearance of N<sub>2</sub>O<sub>5</sub> is ${rate} mol/(L·s). What is the rate of appearance of NO<sub>2</sub>?`;
            correct = `${correctRate} mol/(L·s)`;
            options =[
                correct, 
                `${(parseFloat(rate) / 2).toFixed(3)} mol/(L·s)`, 
                `${rate} mol/(L·s)`, 
                `${(parseFloat(rate) * 4).toFixed(3)} mol/(L·s)`
            ];
        }

        return { reaction: rxnText, question: qText, options: shuffle(options.slice(0, 4)), answer: correct };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Condition Shift: ${this.wave}/${this.maxWaves}`;
        const data = this.generateQuestion();
        
        document.getElementById('reaction-formula').innerHTML = data.reaction;
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
            document.getElementById('health-box').innerText = `Reactor Stability: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
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
        title.innerText = win ? 'Equilibrium Maintained!' : 'Reactor Meltdown!';
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time Elapsed:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        desc.innerHTML = win 
            ? `Outstanding operation! You perfectly managed the system shifts and maintained equilibrium with ${this.mistakes} mistake(s).${timeStr}`
            : `Critical failure. Reaction parameters went out of bounds and the reactor had to be shut down.`;

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
            const fbModule = await import('/js/firebase-init.js');
            const { auth, db, collection, addDoc } = fbModule;
            
            if (auth && auth.currentUser) {
                await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                    title: "Reaction Reactor",
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

window.addEventListener('DOMContentLoaded', () => new ReactionReactorGame());