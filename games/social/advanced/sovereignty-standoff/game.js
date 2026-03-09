import { BaseGame } from '/games/shared/base-game.js';
import { db, doc, getDoc } from '/js/firebase-init.js';
import { StateManager } from '/js/state-manager.js';

class SovereigntyStandoff extends BaseGame {
    constructor() {
        super("Sovereignty Standoff");
        
        this.maxCrises = 5;
        this.crisesResolved = 0;
        this.tension = 50;
        this.influence = 0;
        this.mistakes = 0;
        
        this.isPlaying = false;
        this.currentQuestion = null;
        this.questionBank = null;
        this.usedIndices =[];

        this.initUI();
    }

    async initUI() {
        this.initDOM();
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
        await this.loadQuestions();
        this.resetGame();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Social.html" class="back-btn">← Back to Menu</a>
                <h1>Sovereignty Standoff</h1>
                <p>Navigate high-stakes international crises. Balance national self-interest with global stability!</p>
                <div class="game-stats">
                    <div id="influence-display" class="stat-box">Diplomatic Influence: 0</div>
                    <div id="resolved-display" class="stat-box">Crises Resolved: 0 / 5</div>
                    ${timerHTML}
                </div>
                <div class="tension-container">
                    <div style="font-weight: bold; margin-bottom: 0.25rem; font-family: 'Courier Prime', monospace;">GLOBAL TENSION</div>
                    <div class="tension-bar"><div class="tension-fill" id="tension-fill" style="width: 50%;"></div></div>
                </div>
            </header>
            <main class="game-container">
                <div class="arena-panel">
                    <div class="dossier-container" id="dossier-container">
                        <div class="classified-stamp">TOP SECRET</div>
                        <div class="dossier-header"><span>DEPT: INTEL</span><span>DATE: CURRENT</span></div>
                        <div class="prompt-text" id="prompt-display">Establishing secure connection...</div>
                    </div>
                </div>
                <div class="battle-panel">
                    <h3 style="margin-bottom: 1rem; color: var(--text-dark); text-align: center; font-family: 'Courier Prime', monospace;">PROPOSED ACTIONS</h3>
                    <div class="options-grid" id="options-grid">
                        <button class="btn-option" id="btn-opt-0" disabled></button><button class="btn-option" id="btn-opt-1" disabled></button>
                        <button class="btn-option" id="btn-opt-2" disabled></button><button class="btn-option" id="btn-opt-3" disabled></button>
                    </div>
                </div>
            </main>
            <div class="modal-overlay" id="report-modal" style="display:none;">
                <div class="modal-content">
                    <h2 id="report-title"></h2>
                    <div id="report-details" style="margin: 1.5rem 0; font-size: 1.1rem; text-align: left; background: var(--details-bg); padding: 1rem; border-radius: 8px;"></div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                        <button id="btn-play-again" class="btn-action primary" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">Next Session</button>
                        <a href="/Social.html" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `;
        if (this.settings.timer === 'on') this.startTimer('game-timer');
    }

    async loadQuestions() {
        const promptDisplay = document.getElementById('prompt-display');
        promptDisplay.innerHTML = "Decrypting classified intel from secure database...";
        
        try {
            const docRef = doc(db, "questionBanks", "sovereignty-standoff");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.questionBank = docSnap.data().crises;
            } else {
                throw new Error("Question bank not found in database.");
            }
        } catch (error) {
            console.error("Error loading questions:", error);
            promptDisplay.innerHTML = "Unable to connect to intelligence network. Please disable your adblocker or tracking protection and refresh.";
            document.getElementById('options-grid').style.display = 'none';
        }
    }

    resetGame() {
        this.crisesResolved = 0;
        this.tension = 50;
        this.influence = 0;
        this.mistakes = 0;
        this.usedIndices =[];
        this.isPlaying = true;
        
        this.updateStatsUI();
        this.nextCrisis();
    }

    updateStatsUI() {
        document.getElementById('influence-display').innerText = `Diplomatic Influence: ${this.influence}`;
        document.getElementById('resolved-display').innerText = `Crises Resolved: ${this.crisesResolved} / ${this.maxCrises}`;
        
        const tensionFill = document.getElementById('tension-fill');
        tensionFill.style.width = `${Math.min(100, Math.max(0, this.tension))}%`;
        
        if (this.tension >= 75) {
            tensionFill.classList.add('critical');
        } else {
            tensionFill.classList.remove('critical');
        }
    }

    nextCrisis() {
        if (!this.isPlaying || !this.questionBank) return; 
        
        const availableIndices = this.questionBank.map((_, i) => i).filter(i => !this.usedIndices.includes(i));
        
        if (availableIndices.length === 0) {
            this.usedIndices =[]; 
        }

        const pickArray = availableIndices.length > 0 ? availableIndices : this.questionBank.map((_, i) => i);
        const randIndex = pickArray[Math.floor(Math.random() * pickArray.length)];
        this.usedIndices.push(randIndex);
        
        const rawQuestion = this.questionBank[randIndex];
        
        let distractors = rawQuestion.wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
        let options = [rawQuestion.answer, ...distractors].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            prompt: rawQuestion.prompt,
            answer: rawQuestion.answer,
            options: options
        };
        
        const dossier = document.getElementById('dossier-container');
        dossier.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('prompt-display').innerHTML = this.currentQuestion.prompt;
            
            for (let i = 0; i < 4; i++) {
                const btn = document.getElementById(`btn-opt-${i}`);
                btn.innerHTML = this.currentQuestion.options[i];
                btn.dataset.correct = (this.currentQuestion.options[i] === this.currentQuestion.answer);
                btn.disabled = false;
                
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }
            dossier.style.opacity = '1';
        }, 300);
    }

    checkAnswer(selectedBtn, isCorrect) {
        if (!this.isPlaying) return;
        
        const btns = document.querySelectorAll('.btn-option');
        btns.forEach(b => b.disabled = true);

        if (isCorrect) {
            this.playHit();
            selectedBtn.style.backgroundColor = '#0f766e';
            selectedBtn.style.borderColor = '#14b8a6';
            
            this.influence += 100;
            this.tension = Math.max(0, this.tension - 10);
            this.crisesResolved++;
            this.updateStatsUI();
            
            if (this.crisesResolved >= this.maxCrises) {
                setTimeout(() => this.gameOver(true), 1000);
            } else {
                setTimeout(() => this.nextCrisis(), 1200);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            selectedBtn.style.backgroundColor = '#991b1b';
            selectedBtn.style.borderColor = '#ef4444';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#0f766e';
                    b.style.borderColor = '#14b8a6';
                }
            });

            this.tension += 25;
            this.influence = Math.max(0, this.influence - 25);
            this.updateStatsUI();

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.tension >= 100) {
                setTimeout(() => this.gameOver(false), 1200);
            } else {
                setTimeout(() => this.nextCrisis(), 2000);
            }
        }
    }

    gameOver(isVictory) {
        this.isPlaying = false;
        if (isVictory) this.playVictory();
        else this.playGameOver();
        
        const modal = document.getElementById('report-modal');
        const title = document.getElementById('report-title');
        const details = document.getElementById('report-details');
        
        title.innerText = isVictory ? "World Stabilized!" : "Global Conflict Triggered!";
        title.style.color = isVictory ? "var(--subject-primary)" : "var(--danger-red)";
        
        let html = `<p><strong>Diplomatic Influence:</strong> ${this.influence}</p>`;
        html += `<p><strong>Crises Resolved:</strong> ${this.crisesResolved} / ${this.maxCrises}</p>`;
        html += `<p><strong>Final Tension Level:</strong> ${this.tension}%</p>`;
        html += `<p><strong>Policy Missteps:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--subject-primary); font-weight:bold; margin-top:0.5rem;">Flawless Diplomacy. A true statesman!</p>`;
        } else if (!isVictory) {
            html += `<p style="color:var(--danger-red); font-weight:bold; margin-top:0.5rem;">Your aggressive policies pushed the world into chaos.</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveCustomProgress(isVictory);
    }

    async saveCustomProgress(isVictory) {
        if (StateManager.isUserLoggedIn) {
            try {
                const fbModule = await import('/js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Sovereignty Standoff`,
                        score: this.influence,
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
    new SovereigntyStandoff();
});