import { db, doc, getDoc, setDoc } from '/js/firebase-init.js';

class RhetoricRoyale {
    constructor() {
        this.enemies =[
            { name: "The Sophist", subtitle: "Master of Fallacies", emoji: "🤡", maxHp: 3, hp: 3, type: 'sophist' },
            { name: "The Demagogue", subtitle: "Manipulator of Appeals", emoji: "🗣️", maxHp: 4, hp: 4, type: 'demagogue' },
            { name: "The Master Orator", subtitle: "Historical Synthesizer", emoji: "🏛️", maxHp: 5, hp: 5, type: 'master' }
        ];
        
        this.currentEnemyIndex = 0;
        this.playerHp = 3;
        this.score = 0;
        this.mistakes = 0;
        
        this.audioCtx = null;
        this.isPlaying = false;
        this.currentQuestion = null;
        this.questionBank = null;

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
    playVictory() {
        setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(800, 'sine', 0.4), 350);
    }
    playGameOver() {
        setTimeout(() => this.playTone(300, 'sawtooth', 0.2), 0);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.2), 200);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.4), 400);
    }

    async initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.resetGame();
        });

        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.addEventListener('click', () => {
                this.initAudio();
                this.checkAnswer(btn, btn.dataset.correct === 'true');
            });
        }

        // Wait for questions to load before resetting the game
        await this.loadQuestions();
        this.resetGame();
    }

    async loadQuestions() {
        const promptDisplay = document.getElementById('prompt-display');
        promptDisplay.innerHTML = "Connecting to Debate Archives...";
        
        try {
            const docRef = doc(db, "questionBanks", "rhetoric-royale");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.questionBank = docSnap.data();
            } else {
                // AUTO-MIGRATION SCRIPT
                promptDisplay.innerHTML = "Uploading debate strategies to cloud...";
                
                // FIX: Temporarily define the missing buildQuestion function
                window.buildQuestion = (prompt, answer, wrongOptions) => {
                    return { prompt, answer, options: [answer, ...wrongOptions] };
                };

                const cloudData = { sophist: [], demagogue: [], master:[] };
                
                for (const type of['sophist', 'demagogue', 'master']) {
                    const generators = window.RhetoricQuestionBank[type];
                    cloudData[type] = generators.map(gen => {
                        const q = gen();
                        return {
                            prompt: q.prompt,
                            answer: q.answer,
                            wrongOptions: q.options.filter(opt => opt !== q.answer)
                        };
                    });
                }
                
                await setDoc(docRef, cloudData);
                this.questionBank = cloudData;
                console.log("Rhetoric Royale questions migrated!");
            }
        } catch (error) {
            console.error("Error loading questions:", error);
            promptDisplay.innerHTML = "Error accessing archives.";
        }
    }

    resetGame() {
        this.enemies.forEach(e => e.hp = e.maxHp);
        this.currentEnemyIndex = 0;
        this.playerHp = 3;
        this.score = 0;
        this.mistakes = 0;
        this.isPlaying = true;
        
        document.getElementById('score-display').innerText = `Score: 0`;
        this.updatePlayerHpUI();
        this.loadEnemy();
    }

    updatePlayerHpUI() {
        const hpStr = Array(this.playerHp).fill('❤️').join('');
        document.getElementById('player-hp-display').innerText = `Player Credibility: ${hpStr || '💔'}`;
    }

    updateEnemyHpUI() {
        const enemy = this.enemies[this.currentEnemyIndex];
        const pct = (enemy.hp / enemy.maxHp) * 100;
        document.getElementById('enemy-hp-fill').style.width = `${Math.max(0, pct)}%`;
    }

    loadEnemy() {
        const enemy = this.enemies[this.currentEnemyIndex];
        const container = document.getElementById('enemy-container');
        
        container.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('enemy-name').innerText = enemy.name;
            document.getElementById('enemy-subtitle').innerText = enemy.subtitle;
            document.getElementById('enemy-sprite').innerText = enemy.emoji;
            this.updateEnemyHpUI();
            container.style.opacity = '1';
            this.nextQuestion();
        }, 300);
    }

    nextQuestion() {
        if (!this.isPlaying || !this.questionBank) return; 
        
        const enemy = this.enemies[this.currentEnemyIndex];
        
        // Read from Firestore bank
        const rawList = this.questionBank[enemy.type];
        const rawQuestion = rawList[Math.floor(Math.random() * rawList.length)];
        
        // Shuffle dynamically
        let distractors = rawQuestion.wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
        let options =[rawQuestion.answer, ...distractors].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            prompt: rawQuestion.prompt,
            answer: rawQuestion.answer,
            options: options
        };
        
        document.getElementById('prompt-display').innerHTML = this.currentQuestion.prompt;
        
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.innerHTML = this.currentQuestion.options[i];
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

        if (isCorrect) {
            this.playHit();
            selectedBtn.style.backgroundColor = '#16a34a';
            selectedBtn.style.color = 'white';
            
            const enemy = this.enemies[this.currentEnemyIndex];
            enemy.hp--;
            this.score += 10;
            document.getElementById('score-display').innerText = `Score: ${this.score}`;
            
            this.updateEnemyHpUI();
            
            const sprite = document.getElementById('enemy-sprite');
            sprite.classList.add('shake-enemy');
            setTimeout(() => sprite.classList.remove('shake-enemy'), 400);

            if (enemy.hp <= 0) {
                setTimeout(() => this.defeatEnemy(), 600);
            } else {
                setTimeout(() => this.nextQuestion(), 1200);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            selectedBtn.style.backgroundColor = '#dc2626';
            selectedBtn.style.color = 'white';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#16a34a';
                    b.style.color = 'white';
                }
            });

            this.playerHp--;
            this.updatePlayerHpUI();

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.playerHp <= 0) {
                setTimeout(() => this.gameOver(false), 1200);
            } else {
                setTimeout(() => this.nextQuestion(), 1500);
            }
        }
    }

    defeatEnemy() {
        this.currentEnemyIndex++;
        if (this.currentEnemyIndex >= this.enemies.length) {
            this.gameOver(true);
        } else {
            this.loadEnemy();
        }
    }

    gameOver(isVictory) {
        this.isPlaying = false;
        if (isVictory) this.playVictory();
        else this.playGameOver();
        
        const modal = document.getElementById('report-modal');
        const title = document.getElementById('report-title');
        const details = document.getElementById('report-details');
        
        title.innerText = isVictory ? "Debate Won!" : "Argument Dismantled!";
        title.style.color = isVictory ? "var(--eng-primary)" : "#ef4444";
        
        let html = `<p><strong>Score:</strong> ${this.score}</p>`;
        html += `<p><strong>Opponents Defeated:</strong> ${isVictory ? this.enemies.length : this.currentEnemyIndex}</p>`;
        html += `<p><strong>Logical Flaws (Mistakes):</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--eng-primary); font-weight:bold; margin-top:0.5rem;">Flawless Rhetoric!</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveProgress(isVictory);
    }

    async saveProgress(isVictory) {
        if (typeof window.isUserLoggedIn !== 'undefined' && window.isUserLoggedIn) {
            try {
                const fbModule = await import('/js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Rhetoric Royale`,
                        score: this.score,
                        mistakes: this.mistakes,
                        time: 0,
                        date: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn("Could not save progress.", error);
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new RhetoricRoyale();
});