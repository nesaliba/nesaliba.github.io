import { BaseGame } from '/games/shared/base-game.js';
import { PhysicsQuestionBank } from './questions.js';

class NewtonsArena extends BaseGame {
    constructor() {
        super("Newton's Arena");
        this.enemies =[
            { name: "Static Slime", emoji: "🧊", maxHp: 3, hp: 3, type: 'flat' },
            { name: "Incline Golem", emoji: "⛰️", maxHp: 4, hp: 4, type: 'incline' },
            { name: "Pulley Phantom", emoji: "🪢", maxHp: 5, hp: 5, type: 'pulley' }
        ];
        
        this.currentEnemyIndex = 0;
        this.playerHp = 3;
        this.score = 0;
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
        document.getElementById('player-hp-display').innerText = `Player HP: ${hpStr || '💔'}`;
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
            document.getElementById('enemy-sprite').innerText = enemy.emoji;
            this.updateEnemyHpUI();
            container.style.opacity = '1';
            this.nextQuestion();
        }, 300);
    }

    generateQuestion(enemyType) {
        const generators = PhysicsQuestionBank[enemyType];
        
        const randomIndex = Math.floor(Math.random() * generators.length);
        const selectedGenerator = generators[randomIndex];
        
        const rawQ = selectedGenerator();
        
        let distractors =[...new Set(rawQ.distractors)];
        while (distractors.length < 3) distractors.push(`0.0 \\text{ N}`);
        
        let options = [rawQ.answer, distractors[0], distractors[1], distractors[2]];
        options.sort(() => Math.random() - 0.5);

        return { 
            prompt: rawQ.prompt, 
            options: options, 
            answer: rawQ.answer 
        };
    }

    nextQuestion() {
        if (!this.isPlaying) return;
        
        const enemy = this.enemies[this.currentEnemyIndex];
        this.currentQuestion = this.generateQuestion(enemy.type);
        
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
                setTimeout(() => this.nextQuestion(), 800);
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
        
        title.innerText = isVictory ? "Arena Conquered!" : "Defeated!";
        title.style.color = isVictory ? "var(--phys-primary)" : "#ef4444";
        
        let html = `<p><strong>Score:</strong> ${this.score}</p>`;
        html += `<p><strong>Enemies Defeated:</strong> ${isVictory ? this.enemies.length : this.currentEnemyIndex}</p>`;
        html += `<p><strong>Mistakes Made:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--phys-primary); font-weight:bold; margin-top:0.5rem;">Flawless Victory!</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveProgress(this.mistakes);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new NewtonsArena();
});