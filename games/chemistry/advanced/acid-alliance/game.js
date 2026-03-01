import { BaseGame } from '../../../shared/base-game.js';

class AcidAllianceGame extends BaseGame {
    constructor() {
        super("Acid Alliance"); // Passes title to parent for Firebase saving
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        
        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer'); // Inherited method
        this.nextWave();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        // Notice the massive HTML reduction (No modal HTML needed!)
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
        `;
    }

    generateQuestion() {
        // ... Keep existing logic exactly the same ...
        // (Copy the original generateQuestion logic here intact)
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
                this.initAudio(); // Inherited method
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
            this.playHit(); // Inherited method replaces playTone(600, ...)
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1000);
        } else {
            btn.classList.add('wrong');
            this.playMiss(); // Inherited method
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
        this.stopTimer(); // Inherited
        const modal = document.querySelector('game-report-modal');
        
        let timeStr = this.settings.timer === 'on' ? `<br>Time: ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        const desc = win 
            ? `Excellent work, Commander. You neutralized the threats with ${this.mistakes} mistakes.${timeStr}`
            : `System integrity compromised. You made too many miscalculations.`;

        // Use the centralized Web Component
        modal.show(
            win ? 'System Stabilized!' : 'System Failure!', 
            desc, 
            win, 
            '../../../../Chemistry.html'
        );

        if (win) {
            this.playVictory(); // Inherited
            this.saveProgress(this.mistakes); // Inherited Firebase save
        } else {
            this.playGameOver(); // Inherited
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new AcidAllianceGame());