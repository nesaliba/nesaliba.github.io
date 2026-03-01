import { BaseGame } from '/games/shared/base-game.js';
import { StatisticsQuestionBank } from './questions.js';

class StatisticsHeist extends BaseGame {
    constructor() {
        super("Statistics Heist");
        this.totalVaults = 8;
        this.heat = 3; // Acts as HP
        this.vaultsCracked = 0;
        this.mistakes = 0;
        this.isPlaying = false;
        this.currentQuestion = null;
        this.initUI();
    }

    initUI() {
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

    resetGame() {
        this.heat = 3;
        this.vaultsCracked = 0;
        this.mistakes = 0;
        this.isPlaying = true;
        
        this.updateHUD();
        this.setAlarmState('secure');
        this.nextQuestion();
    }

    updateHUD() {
        const heatStr = Array(this.heat).fill('🟢').join('');
        document.getElementById('heat-display').innerText = `Security Tolerance: ${heatStr || '🚨'}`;
        document.getElementById('score-display').innerText = `Phases Cleared: ${this.vaultsCracked} / ${this.totalVaults}`;
    }

    setAlarmState(state) {
        const status = document.getElementById('alarm-status');
        const graphic = document.getElementById('vault-graphic');
        const container = document.getElementById('heist-container');
        const text = document.getElementById('status-text');
        
        if (state === 'danger') {
            status.classList.add('danger');
            graphic.classList.add('danger');
            container.classList.add('danger');
            status.innerText = "ALARM TRIGGERED!";
            text.innerText = "Heat level increasing. Rerouting...";
        } else {
            status.classList.remove('danger');
            graphic.classList.remove('danger');
            container.classList.remove('danger');
            status.innerText = "SYSTEM SECURE";
            text.innerText = "Awaiting next sequence...";
        }
    }

    generateQuestion() {
        const generator = StatisticsQuestionBank[Math.floor(Math.random() * StatisticsQuestionBank.length)];
        const rawQ = generator();
        
        // Ensure exactly 4 unique options
        let distractors =[...new Set(rawQ.distractors)];
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
            this.vaultsCracked++;
            selectedBtn.style.backgroundColor = '#22c55e';
            selectedBtn.style.color = 'white';
            
            this.updateHUD();
            this.setAlarmState('secure');

            if (this.vaultsCracked >= this.totalVaults) {
                setTimeout(() => this.gameOver(true), 600);
            } else {
                setTimeout(() => this.nextQuestion(), 800);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            this.heat--;
            
            selectedBtn.style.backgroundColor = '#ef4444';
            selectedBtn.style.color = 'white';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#22c55e';
                    b.style.color = 'white';
                }
            });

            this.updateHUD();
            this.setAlarmState('danger');

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.heat <= 0) {
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
        
        title.innerText = isVictory ? "Heist Successful!" : "BUSTED!";
        title.style.color = isVictory ? "var(--safe-green)" : "var(--alarm-red)";
        
        let html = `<p><strong>Phases Cleared:</strong> ${this.vaultsCracked} / ${this.totalVaults}</p>`;
        html += `<p><strong>Calculations Botched:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--blueprint-blue); font-weight:bold; margin-top:0.5rem;">Ghost Protocol achieved. No trace left behind!</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveProgress(this.mistakes);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new StatisticsHeist();
});