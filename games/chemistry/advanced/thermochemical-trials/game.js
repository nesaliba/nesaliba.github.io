class ThermoTrialsGame {
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
                <h1>Thermochemical Trials</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Energy Core Stability: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Target: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="thermo-panel">
                    <div class="thermo-header">🔥 Energy Target Assessment</div>
                    <div class="data-display" id="data-display">Loading target parameters...</div>
                    <div class="thermo-text" id="question-text">Analyzing variables...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
            
            <div class="modal-overlay" id="endModal">
                <div class="modal-content" id="endModalContent">
                    <h2 id="end-title"></h2>
                    <p id="end-desc"></p>
                    <button class="modal-btn" onclick="location.reload()">Run New Trial</button>
                    <a href="/Chemistry.html" class="modal-btn btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;
    }

    generateQuestion() {
        const types =['calorimetry', 'molar_enthalpy', 'hess_law', 'pe_diagram_ea', 'pe_diagram_dh'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let qText = "", dataText = "", correct = "", options =[];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'calorimetry') {
            const m = (Math.floor(Math.random() * 40) + 10) * 10; // 100g to 500g
            const dT = (Math.random() * 15 + 5).toFixed(1); // 5.0 to 20.0 deg C
            // Using typical specific heat capacity of water for Alberta curriculum (4.19 J/g°C)
            const q = ((m * 4.19 * dT) / 1000).toFixed(2); // Convert to kJ
            
            dataText = `<strong>Mass of water (m):</strong> ${m} g<br><strong>Specific heat capacity (c):</strong> 4.19 J/(g·°C)<br><strong>Temperature change (ΔT):</strong> +${dT} °C`;
            qText = `Calculate the thermal energy (q) absorbed by the water in the calorimeter, in kilojoules (kJ).`;
            correct = `+${q} kJ`;
            
            options =[
                correct, 
                `+${(q * 10).toFixed(2)} kJ`, 
                `-${q} kJ`, 
                `+${((m * 4.184 * dT) / 100).toFixed(2)} kJ`
            ];
        } 
        else if (type === 'molar_enthalpy') {
            const n = (Math.random() * 5 + 1).toFixed(2);
            const dH_mol = (Math.random() * 800 + 200).toFixed(1); // 200 to 1000 kJ/mol
            const totalH = (n * dH_mol).toFixed(1);
            
            dataText = `<strong>Fuel Substance:</strong> Methane (CH<sub>4</sub>)<br><strong>Molar Enthalpy of Combustion (Δ<sub>c</sub>H):</strong> -${dH_mol} kJ/mol`;
            qText = `A reaction chamber precisely burns ${n} moles of the fuel. Determine the total enthalpy change (ΔH) for this reaction.`;
            correct = `-${totalH} kJ`;
            
            options =[
                correct, 
                `+${totalH} kJ`, 
                `-${(dH_mol / n).toFixed(1)} kJ`, 
                `-${(totalH * 2).toFixed(1)} kJ`
            ];
        } 
        else if (type === 'hess_law') {
            const dH = (Math.random() * 300 + 50).toFixed(1);
            const factor = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
            
            dataText = `<strong>Reference Reaction:</strong><br>A(g) + 2B(g) &rightarrow; C(g) &nbsp;&nbsp;&nbsp; ΔH = -${dH} kJ`;
            qText = `Using Hess's Law, what is the enthalpy change for the reverse reaction scaled by a factor of ${factor}?<br><br><em>${factor}C(g) &rightarrow; ${factor}A(g) + ${factor*2}B(g)</em>`;
            
            const newDH = (dH * factor).toFixed(1);
            correct = `+${newDH} kJ`;
            
            options =[
                correct, 
                `-${newDH} kJ`, 
                `+${dH} kJ`, 
                `+${(dH / factor).toFixed(1)} kJ`
            ];
        } 
        else if (type === 'pe_diagram_ea') {
            const E_reactants = Math.floor(Math.random() * 50) + 20;
            const E_products = E_reactants + (Math.floor(Math.random() * 100) - 50); // Can be endo or exo
            const E_activation = Math.floor(Math.random() * 150) + 80;
            const E_complex = E_reactants + E_activation;
            
            dataText = `<strong>Potential Energy Diagram Data:</strong><br>E<sub>p</sub>(reactants) = ${E_reactants} kJ<br>E<sub>p</sub>(activated complex) = ${E_complex} kJ<br>E<sub>p</sub>(products) = ${E_products} kJ`;
            qText = `Based on the provided energy levels, calculate the activation energy (E<sub>a</sub>) for the <em>forward</em> reaction.`;
            
            correct = `+${E_activation} kJ`;
            
            options =[
                correct, 
                `+${E_complex} kJ`, 
                `${(E_products - E_reactants) > 0 ? '+' : ''}${E_products - E_reactants} kJ`, 
                `+${E_complex - E_products} kJ`
            ];
        }
        else if (type === 'pe_diagram_dh') {
            const E_reactants = Math.floor(Math.random() * 80) + 50;
            const isExo = Math.random() > 0.5;
            const deltaH = Math.floor(Math.random() * 100) + 20;
            const E_products = isExo ? E_reactants - deltaH : E_reactants + deltaH;
            
            dataText = `<strong>Potential Energy Profile:</strong><br>E<sub>p</sub>(reactants) = ${E_reactants} kJ<br>E<sub>p</sub>(products) = ${E_products} kJ`;
            qText = `Calculate the enthalpy change (ΔH) for this reaction and classify it as endothermic or exothermic.`;
            
            correct = isExo ? `-${deltaH} kJ (Exothermic)` : `+${deltaH} kJ (Endothermic)`;
            
            options =[
                correct, 
                isExo ? `+${deltaH} kJ (Endothermic)` : `-${deltaH} kJ (Exothermic)`, 
                isExo ? `-${deltaH} kJ (Endothermic)` : `+${deltaH} kJ (Exothermic)`,
                isExo ? `+${E_reactants + E_products} kJ (Endothermic)` : `-${E_reactants + E_products} kJ (Exothermic)`
            ];
        }

        return { data: dataText, question: qText, options: shuffle(options.slice(0, 4)), answer: correct };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Target: ${this.wave}/${this.maxWaves}`;
        const gameData = this.generateQuestion();
        
        document.getElementById('data-display').innerHTML = gameData.data;
        document.getElementById('question-text').innerHTML = gameData.question;
        const optsContainer = document.getElementById('options-container');
        optsContainer.innerHTML = '';
        
        gameData.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt;
            btn.onclick = () => {
                this.initAudio();
                const isCorrect = (opt === gameData.answer);
                this.handleAnswer(btn, isCorrect, gameData.answer);
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
            document.getElementById('health-box').innerText = `Energy Core Stability: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
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
        title.innerText = win ? 'Energy Targets Achieved!' : 'Core Depleted!';
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time Elapsed:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        desc.innerHTML = win 
            ? `Fantastic engineering! You correctly balanced the thermochemical pathways with only ${this.mistakes} error(s).${timeStr}`
            : `Critical energy mismatch. Your calculations led to a core shutdown. Study your enthalpy laws and try again.`;

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
                    title: "Thermochemical Trials",
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

window.addEventListener('DOMContentLoaded', () => new ThermoTrialsGame());