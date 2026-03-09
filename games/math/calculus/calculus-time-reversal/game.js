import { BaseGame } from '/games/shared/base-game.js';
import { CalculusQuestionBank } from './questions.js';

class CalculusTimeReversal extends BaseGame {
    constructor() {
        super("Calculus Time Reversal");
        this.totalAnomalies = 10;
        this.integrity = 3;
        this.anomaliesFixed = 0;
        this.mistakes = 0;
        this.isPlaying = false;
        this.currentQuestion = null;
        this.initUI();
    }

    initUI() {
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
        this.resetGame();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Math.html" class="back-btn">← Back to Menu</a>
                <h1>Calculus Time Reversal</h1>
                <p>Compute precise instantaneous rates of change and critical points to reverse systemic failures and save the timeline!</p>
                <div class="game-stats">
                    <div id="integrity-display" class="stat-box hp-box">Timeline Integrity: ⏳⏳⏳</div>
                    <div id="score-display" class="stat-box">Anomalies Fixed: 0 / 10</div>
                    ${timerHTML}
                </div>
            </header>
            <main class="game-container">
                <div class="arena-panel">
                    <div class="timeline-container" id="timeline-container">
                        <div class="anomaly-warning" id="anomaly-warning">ANOMALY DETECTED</div>
                        <div class="reactor-core" id="reactor-core"><div class="core-pulse"></div></div>
                        <div class="status-text" id="status-text">System destabilizing...</div>
                    </div>
                </div>
                <div class="battle-panel">
                    <div class="prompt-container" id="prompt-container"><div id="prompt-display">\\( \\text{Initializing Time Reversal Protocol...} \\)</div></div>
                    <div class="options-grid" id="options-grid">
                        <button class="btn-option" id="btn-opt-0"></button><button class="btn-option" id="btn-opt-1"></button>
                        <button class="btn-option" id="btn-opt-2"></button><button class="btn-option" id="btn-opt-3"></button>
                    </div>
                </div>
            </main>
            <div class="modal-overlay" id="report-modal" style="display:none;">
                <div class="modal-content">
                    <h2 id="report-title"></h2>
                    <div id="report-details" style="margin: 1.5rem 0; font-size: 1.1rem; text-align: left; background: var(--details-bg); padding: 1rem; border-radius: 8px;"></div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                        <button id="btn-play-again" class="btn-action primary" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">Play Again</button>
                        <a href="/Math.html" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `;
        if (this.settings.timer === 'on') this.startTimer('game-timer');
    }

    resetGame() {
        this.integrity = 3;
        this.anomaliesFixed = 0;
        this.mistakes = 0;
        this.isPlaying = true;
        
        this.updateHUD();
        this.setReactorState('normal');
        this.nextQuestion();
    }

    updateHUD() {
        const hpStr = Array(this.integrity).fill('⏳').join('');
        document.getElementById('integrity-display').innerText = `Timeline Integrity: ${hpStr || '💥'}`;
        document.getElementById('score-display').innerText = `Anomalies Fixed: ${this.anomaliesFixed} / ${this.totalAnomalies}`;
    }

    setReactorState(state) {
        const reactor = document.getElementById('reactor-core');
        const text = document.getElementById('status-text');
        
        if (state === 'danger') {
            reactor.classList.add('danger');
            text.innerText = "CRITICAL TIMELINE INSTABILITY!";
            text.style.color = "var(--core-danger)";
        } else {
            reactor.classList.remove('danger');
            text.innerText = "System destabilizing... Reversal required.";
            text.style.color = "var(--text-dark)";
        }
    }

    generateQuestion() {
        const generator = CalculusQuestionBank[Math.floor(Math.random() * CalculusQuestionBank.length)];
        const rawQ = generator();
        
        // Ensure exactly 4 unique options
        let distractors = [...new Set(rawQ.distractors)];
        let extraCounter = 1;
        while (distractors.length < 3) {
            distractors.push(`Error_${extraCounter++}`);
        }
        
        let options = [rawQ.answer, distractors[0], distractors[1], distractors[2]];
        
        // Shuffle options
        options.sort(() => Math.random() - 0.5);

        return { 
            prompt: rawQ.prompt, 
            options: options, 
            answer: rawQ.answer 
        };
    }

    nextQuestion() {
        if (!this.isPlaying) return;
        
        this.currentQuestion = this.generateQuestion();
        document.getElementById('prompt-display').innerHTML = `\\[ ${this.currentQuestion.prompt} \\]`;
        
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.innerHTML = `\\( ${this.currentQuestion.options[i]} \\)`;
            btn.dataset.correct = (this.currentQuestion.options[i] === this.currentQuestion.answer);
            btn.disabled = false;
            
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }

        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([
                document.getElementById('prompt-container'),
                document.getElementById('options-grid')
            ]).catch(err => console.log('MathJax error:', err));
        }
    }

    checkAnswer(selectedBtn, isCorrect) {
        if (!this.isPlaying) return;
        
        const btns = document.querySelectorAll('.btn-option');
        btns.forEach(b => b.disabled = true);

        if (isCorrect) {
            this.playHit();
            this.anomaliesFixed++;
            selectedBtn.style.backgroundColor = '#16a34a';
            selectedBtn.style.color = 'white';
            
            this.updateHUD();
            this.setReactorState('normal');

            if (this.anomaliesFixed >= this.totalAnomalies) {
                setTimeout(() => this.gameOver(true), 600);
            } else {
                setTimeout(() => this.nextQuestion(), 800);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            this.integrity--;
            
            selectedBtn.style.backgroundColor = '#dc2626';
            selectedBtn.style.color = 'white';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#16a34a';
                    b.style.color = 'white';
                }
            });

            this.updateHUD();
            this.setReactorState('danger');

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.integrity <= 0) {
                setTimeout(() => this.gameOver(false), 1200);
            } else {
                setTimeout(() => this.nextQuestion(), 1500);
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
        
        title.innerText = isVictory ? "Timeline Secured!" : "Catastrophic Failure!";
        title.style.color = isVictory ? "var(--math-primary)" : "#ef4444";
        
        let html = `<p><strong>Anomalies Fixed:</strong> ${this.anomaliesFixed} / ${this.totalAnomalies}</p>`;
        html += `<p><strong>Calculation Errors:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--math-primary); font-weight:bold; margin-top:0.5rem;">Flawless Execution. The timeline is perfectly preserved!</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveProgress(this.mistakes);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new CalculusTimeReversal();
});