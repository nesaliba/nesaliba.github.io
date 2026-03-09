import { BaseGame } from '/games/shared/base-game.js';
import { TrigQuestionBank, UNIT_CIRCLE } from './questions.js';
import { StateManager } from '/js/state-manager.js';

class TrigSniper extends BaseGame {
constructor() {
        super("Trig Sniper");
        this.initDOM(); // Initialize DOM before looking up the canvas
        
        this.canvas = document.getElementById('sniper-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.radius = 220; 
        
        this.mode = 'rookie';
        this.isPlaying = false;
        this.score = 0;
        this.attempts = 0;
        this.timeRemaining = 60;
        
        this.validTargets = [];
        this.effects =[];
        this.hoveredNode = -1;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') this.drawCanvas();
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        if (document.body) observer.observe(document.body, { attributes: true });

        this.initUI();
        this.drawCanvas();
        this.startRenderLoop();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let globalTimerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Math.html" class="back-btn">← Back to Menu</a>
                <h1>Trig Sniper</h1>
                <p>Target the correct points on the unit circle based on the trigonometric prompts!</p>
                <div class="game-stats">
                    <div id="mode-display" class="stat-box">Mode: Rookie</div>
                    <div id="timer-display" class="stat-box">Time: 60</div>
                    <div id="score-display" class="stat-box">Hits: 0</div>
                    <div id="accuracy-display" class="stat-box">Accuracy: 100%</div>
                    ${globalTimerHTML}
                </div>
            </header>
            <main class="game-container">
                <div class="controls-panel">
                    <div class="control-group">
                        <h3>Game Mode</h3>
                        <div class="mode-buttons">
                            <button id="btn-rookie" class="btn-mode active">Rookie</button>
                            <button id="btn-marksman" class="btn-mode">Marksman</button>
                            <button id="btn-sniper" class="btn-mode">Sniper</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <h3>Controls</h3>
                        <button id="btn-start" class="btn-action primary" style="width: 100%; margin-bottom: 1rem;">Start Game</button>
                    </div>
                </div>
                <div class="graph-panel">
                    <div class="prompt-container" id="prompt-container"><div id="prompt-display">\\( \\text{Press Start to begin!} \\)</div></div>
                    <div class="canvas-container"><canvas id="sniper-canvas" width="600" height="600"></canvas></div>
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

    playFinished() {
        this.playVictory();
    }

    initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        const modes =['rookie', 'marksman', 'sniper'];
        modes.forEach(mode => {
            document.getElementById(`btn-${mode}`).addEventListener('click', (e) => {
                this.initAudio();
                if (this.isPlaying) return;
                modes.forEach(m => document.getElementById(`btn-${m}`).classList.remove('active'));
                e.target.classList.add('active');
                this.mode = mode;
                document.getElementById('mode-display').innerText = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
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

        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    resetGameReady() {
        this.isPlaying = false;
        this.validTargets =[];
        this.effects =[];
        this.hoveredNode = -1;
        document.getElementById('btn-start').disabled = false;
        this.updatePromptDisplay("\\text{Press Start to begin!}");
        document.getElementById('timer-display').innerText = `Time: 60`;
        document.getElementById('score-display').innerText = `Hits: 0`;
        document.getElementById('accuracy-display').innerText = `Accuracy: 100%`;
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.attempts = 0;
        this.timeRemaining = 60;
        this.effects =[];
        this.hoveredNode = -1;
        
        document.getElementById('btn-start').disabled = true;
        document.getElementById('score-display').innerText = `Hits: 0`;
        document.getElementById('accuracy-display').innerText = `Accuracy: 100%`;
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('timer-display').innerText = `Time: ${this.timeRemaining}`;
            if (this.timeRemaining <= 0) this.endGame();
        }, 1000);

        this.generateTarget();
    }

    generateTarget() {
        const generators = TrigQuestionBank[this.mode];
        const generator = generators[Math.floor(Math.random() * generators.length)];
        const result = generator();
        
        this.validTargets = result.targets;
        this.updatePromptDisplay(result.prompt);
    }

    updatePromptDisplay(latexString) {
        const displayEl = document.getElementById('prompt-display');
        displayEl.innerHTML = `\\( ${latexString} \\)`;
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([displayEl]).catch(err => console.log('MathJax error:', err));
        }
    }

    getColors() {
        const isDark = document.documentElement.classList.contains('dark-theme') || 
                       (document.body && document.body.classList.contains('dark-theme'));
        return {
            axis: isDark ? '#334155' : '#cbd5e1',
            circle: isDark ? '#475569' : '#94a3b8',
            node: isDark ? '#94a3b8' : '#64748b',
            nodeHover: '#ffffff',
            correct: '#22c55e',
            wrong: '#ef4444'
        };
    }

    startRenderLoop() {
        const loop = () => {
            this.drawCanvas();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    drawCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        const colors = this.getColors();
        const originX = this.width / 2;
        const originY = this.height / 2;

        this.ctx.strokeStyle = colors.axis;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(originX, 20); this.ctx.lineTo(originX, this.height - 20);
        this.ctx.moveTo(20, originY); this.ctx.lineTo(this.width - 20, originY);
        this.ctx.stroke();

        this.ctx.strokeStyle = colors.circle;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(originX, originY, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        UNIT_CIRCLE.forEach(pt => {
            const cx = originX + this.radius * Math.cos(pt.val);
            const cy = originY - this.radius * Math.sin(pt.val);
            const isHovered = (pt.id === this.hoveredNode);

            this.ctx.beginPath();
            this.ctx.arc(cx, cy, isHovered ? 12 : 8, 0, Math.PI * 2);
            this.ctx.fillStyle = isHovered ? colors.nodeHover : colors.node;
            
            if (isHovered) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = colors.nodeHover;
            } else {
                this.ctx.shadowBlur = 0;
            }
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const ef = this.effects[i];
            this.ctx.beginPath();
            this.ctx.arc(ef.x, ef.y, ef.r, 0, Math.PI * 2);
            this.ctx.strokeStyle = ef.type === 'correct' ? colors.correct : colors.wrong;
            this.ctx.globalAlpha = ef.alpha;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;

            ef.r += 2;
            ef.alpha -= 0.04;
            if (ef.alpha <= 0) this.effects.splice(i, 1);
        }
    }

    handleMouseMove(e) {
        if (!this.isPlaying) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const originX = this.width / 2;
        const originY = this.height / 2;

        this.hoveredNode = -1;
        for (const pt of UNIT_CIRCLE) {
            const cx = originX + this.radius * Math.cos(pt.val);
            const cy = originY - this.radius * Math.sin(pt.val);
            
            if (Math.hypot(x - cx, y - cy) < 30) {
                this.hoveredNode = pt.id;
                break;
            }
        }
    }

    handleClick(e) {
        if (!this.isPlaying) return;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const originX = this.width / 2;
        const originY = this.height / 2;

        let clickedNode = -1;
        for (const pt of UNIT_CIRCLE) {
            const cx = originX + this.radius * Math.cos(pt.val);
            const cy = originY - this.radius * Math.sin(pt.val);
            
            if (Math.hypot(x - cx, y - cy) < 30) {
                clickedNode = pt.id;
                break;
            }
        }

        if (clickedNode === -1) return;

        const pt = UNIT_CIRCLE[clickedNode];
        const cx = originX + this.radius * Math.cos(pt.val);
        const cy = originY - this.radius * Math.sin(pt.val);

        this.attempts++;

        if (this.validTargets.includes(clickedNode)) {
            this.playHit();
            this.score++;
            this.effects.push({ x: cx, y: cy, r: 10, alpha: 1.0, type: 'correct' });
            
            const acc = Math.round((this.score / this.attempts) * 100);
            document.getElementById('score-display').innerText = `Hits: ${this.score}`;
            document.getElementById('accuracy-display').innerText = `Accuracy: ${acc}%`;

            this.generateTarget();
        } else {
            this.playMiss();
            this.effects.push({ x: cx, y: cy, r: 10, alpha: 1.0, type: 'wrong' });
            this.timeRemaining = Math.max(0, this.timeRemaining - 3); 
            
            const acc = Math.round((this.score / this.attempts) * 100);
            document.getElementById('accuracy-display').innerText = `Accuracy: ${acc}%`;

            this.canvas.style.boxShadow = "inset 0 0 50px rgba(239, 68, 68, 0.5)";
            setTimeout(() => this.canvas.style.boxShadow = "inset 0 0 20px rgba(0,0,0,0.5)", 150);
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.isPlaying = false;
        this.playFinished();
        this.hoveredNode = -1; 
        this.drawCanvas(); 
        
        const acc = this.attempts === 0 ? 0 : Math.round((this.score / this.attempts) * 100);
        
        const modal = document.getElementById('report-modal');
        const details = document.getElementById('report-details');
        
        let reportHTML = `<p><strong>Mode:</strong> ${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)}</p>`;
        reportHTML += `<p><strong>Total Hits:</strong> ${this.score}</p>`;
        reportHTML += `<p><strong>Accuracy:</strong> ${acc}%</p>`;
        
        if (this.score > 15 && acc > 90) {
            reportHTML += `<p style="color:var(--math-primary); font-weight:bold; margin-top:0.5rem;">Unbelievable marksmanship!</p>`;
        }

        details.innerHTML = reportHTML;
        modal.style.display = 'flex';
        
        this.saveCustomProgress();
    }

    async saveCustomProgress() {
        if (StateManager.isUserLoggedIn) {
            try {
                const fbModule = await import('/js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Trig Sniper (${this.mode})`,
                        score: this.score,
                        mistakes: this.attempts - this.score, 
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

window.addEventListener('DOMContentLoaded', () => {
    new TrigSniper();
});