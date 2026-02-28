class SyntaxSurgeon {
    constructor() {
        this.mode = 'novice';
        this.isPlaying = false;
        this.score = 0;
        this.mistakes = 0;
        this.timeRemaining = 60;
        this.timerInterval = null;
        this.audioCtx = null;
        this.currentQuestion = null;

        this.initUI();
    }

    initAudio() {
        if (window.userSettings && window.userSettings.muteSounds) return;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mute') === 'true' || localStorage.getItem('scitriad_mute') === 'true') return;

        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (!this.audioCtx) return;
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

    playHit() { this.playTone(800, 'sine', 0.1); }
    playMiss() { this.playTone(150, 'sawtooth', 0.3); }
    playFinished() {
        setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(800, 'sine', 0.4), 350);
    }

    initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        const modes = ['novice', 'resident', 'attending'];
        modes.forEach(mode => {
            document.getElementById(`btn-${mode}`).addEventListener('click', (e) => {
                this.initAudio();
                if (this.isPlaying) return;
                modes.forEach(m => document.getElementById(`btn-${m}`).classList.remove('active'));
                e.target.classList.add('active');
                this.mode = mode;
                document.getElementById('mode-display').innerText = `Ward: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
            });
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            this.initAudio();
            this.startGame();
        });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.resetGameReady();
        });

        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.addEventListener('click', () => {
                this.initAudio();
                this.checkAnswer(btn, btn.dataset.correct === 'true');
            });
        }
    }

    resetGameReady() {
        this.isPlaying = false;
        document.getElementById('btn-start').disabled = false;
        
        const monitor = document.getElementById('monitor-container');
        monitor.classList.remove('error', 'success');
        document.getElementById('prompt-display').innerText = "Waiting for patient... Press Start Operation.";
        
        document.getElementById('timer-display').innerText = `Time: 60`;
        document.getElementById('score-display').innerText = `Repairs: 0`;
        document.getElementById('accuracy-display').innerText = `Vitals: Stable`;
        document.getElementById('accuracy-display').style.color = "var(--text-dark)";

        const btns = document.querySelectorAll('.btn-option');
        btns.forEach(b => {
            b.innerText = `Tool ${b.id.slice(-1)}`;
            b.disabled = true;
            b.style.backgroundColor = '';
            b.style.color = '';
        });
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.mistakes = 0;
        this.timeRemaining = 60;
        
        document.getElementById('btn-start').disabled = true;
        document.getElementById('score-display').innerText = `Repairs: 0`;
        this.updateVitalsDisplay();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('timer-display').innerText = `Time: ${this.timeRemaining}`;
            if (this.timeRemaining <= 0) this.endGame();
        }, 1000);

        this.nextPatient();
    }

    updateVitalsDisplay() {
        const vitalsDisplay = document.getElementById('accuracy-display');
        if (this.mistakes === 0) {
            vitalsDisplay.innerText = `Vitals: Stable`;
            vitalsDisplay.style.color = "#16a34a";
        } else if (this.mistakes < 3) {
            vitalsDisplay.innerText = `Vitals: Elevated`;
            vitalsDisplay.style.color = "#eab308";
        } else {
            vitalsDisplay.innerText = `Vitals: Critical!`;
            vitalsDisplay.style.color = "#ef4444";
        }
    }

    nextPatient() {
        if (!this.isPlaying) return;
        
        const monitor = document.getElementById('monitor-container');
        monitor.classList.remove('error', 'success');

        const generators = window.SyntaxQuestionBank[this.mode];
        const generator = generators[Math.floor(Math.random() * generators.length)];
        
        this.currentQuestion = generator();
        
        document.getElementById('prompt-display').innerText = `[Flawed Syntax Detected]\n"${this.currentQuestion.prompt}"`;
        
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.innerText = this.currentQuestion.options[i];
            btn.dataset.correct = (this.currentQuestion.options[i] === this.currentQuestion.answer);
            btn.disabled = false;
            
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }
    }

    checkAnswer(selectedBtn, isCorrect) {
        if (!this.isPlaying) return;
        
        const btns = document.querySelectorAll('.btn-option');
        btns.forEach(b => b.disabled = true);
        const monitor = document.getElementById('monitor-container');

        if (isCorrect) {
            this.playHit();
            monitor.classList.add('success');
            selectedBtn.style.backgroundColor = '#16a34a';
            selectedBtn.style.color = 'white';
            
            this.score++;
            this.timeRemaining += 2; // +2 seconds for a good repair
            
            document.getElementById('score-display').innerText = `Repairs: ${this.score}`;
            document.getElementById('timer-display').innerText = `Time: ${this.timeRemaining}`;
            
            setTimeout(() => this.nextPatient(), 600);
        } else {
            this.playMiss();
            this.mistakes++;
            monitor.classList.add('error');
            selectedBtn.style.backgroundColor = '#dc2626';
            selectedBtn.style.color = 'white';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#16a34a';
                    b.style.color = 'white';
                }
            });

            this.timeRemaining -= 5; // -5 seconds time penalty
            this.updateVitalsDisplay();
            
            document.getElementById('timer-display').innerText = `Time: ${this.timeRemaining}`;

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.timeRemaining <= 0) {
                setTimeout(() => this.endGame(), 1000);
            } else {
                setTimeout(() => this.nextPatient(), 1500);
            }
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.isPlaying = false;
        this.playFinished();
        
        const modal = document.getElementById('report-modal');
        const details = document.getElementById('report-details');
        
        let reportHTML = `<p><strong>Ward Operated:</strong> ${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)}</p>`;
        reportHTML += `<p><strong>Successful Repairs:</strong> ${this.score}</p>`;
        reportHTML += `<p><strong>Surgical Errors:</strong> ${this.mistakes}</p>`;
        
        if (this.score > 10 && this.mistakes === 0) {
            reportHTML += `<p style="color:var(--eng-primary); font-weight:bold; margin-top:0.5rem;">Flawless Operation! Chief of Surgery material.</p>`;
        } else if (this.mistakes >= 5) {
            reportHTML += `<p style="color:#ef4444; font-weight:bold; margin-top:0.5rem;">Too many casualties! Study your syntax.</p>`;
        }

        details.innerHTML = reportHTML;
        modal.style.display = 'flex';
        
        this.saveProgress();
    }

    async saveProgress() {
        if (typeof window.isUserLoggedIn !== 'undefined' && window.isUserLoggedIn) {
            try {
                const fbModule = await import('../../../js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Syntax Surgeon (${this.mode})`,
                        score: this.score,
                        mistakes: this.mistakes, 
                        time: 60,
                        date: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn("Could not save progress.", error);
            }
        }
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new SyntaxSurgeon();
});