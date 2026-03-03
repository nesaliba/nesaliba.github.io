import { BaseGame } from '/games/shared/base-game.js';
import { StateManager } from '/js/state-manager.js';

class FunctionFactory extends BaseGame {
    constructor() {
        super("Function Factory");
        
        this.mode = 'practice';
        this.score = 0;
        this.mistakes = 0;
        this.timeRemaining = 60;
        this.timerInterval = null;
        this.isPlaying = false;
        
        this.targetParams = null;
        this.playerParams = { type: 'quadratic', a: 1, h: 0, k: 0 };
        this.currentExpression = "";
        
        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initUI();
        this.setMode('practice');
    }

    initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        document.querySelectorAll('.btn-mode').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.initAudio();
                document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.setMode(e.target.id.replace('btn-', ''));
            });
        });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.setMode(this.mode);
        });
    }

    setMode(mode) {
        const existingPrompt = document.getElementById('order-prompt');
        if (existingPrompt) existingPrompt.remove();

        this.mode = mode;
        this.isPlaying = false;
        document.getElementById('mode-display').innerText = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
        this.score = 0;
        this.mistakes = 0;
        document.getElementById('score-display').innerText = `Score: 0`;
        
        clearInterval(this.timerInterval);
        document.getElementById('timer-display').style.display = mode === 'orders' ? 'block' : 'none';
        document.getElementById('mistakes-display').style.display = mode === 'orders' ? 'block' : 'none';
        
        if (mode === 'orders') {
            document.getElementById('timer-display').innerText = `Time: 60s`;
            document.getElementById('mistakes-display').innerText = `Mistakes: 0 / 10`;
        }
        
        this.showFeedback("", true);
        
        const controls = document.getElementById('game-controls');
        
        if (mode === 'practice' || mode === 'orders') {
            controls.innerHTML = `
                <div class="slider-group">
                    <label>Function Type</label>
                    <select id="type-select" style="width:100%; padding:0.5rem; border-radius:4px; font-weight:bold; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-dark);">
                        <option value="linear">Linear</option>
                        <option value="quadratic">Quadratic</option>
                        <option value="absolute">Absolute Value</option>
                    </select>
                </div>
                <div class="slider-group">
                    <label>a (Vertical Stretch/Direction): <span id="val-a">1</span></label>
                    <input type="range" id="slider-a" min="-5" max="5" step="1" value="1">
                </div>
                <div class="slider-group">
                    <label>h (Horizontal Shift): <span id="val-h">0</span></label>
                    <input type="range" id="slider-h" min="-10" max="10" step="1" value="0">
                </div>
                <div class="slider-group">
                    <label>k (Vertical Shift): <span id="val-k">0</span></label>
                    <input type="range" id="slider-k" min="-10" max="10" step="1" value="0">
                </div>
                ${mode === 'orders' ? `
                <button id="btn-submit" class="btn-action primary" style="width:100%; display:none;">Submit Order</button>
                <button id="btn-start" class="btn-action primary" style="width:100%;">Start Game</button>
                ` : `<button id="btn-next" class="btn-action primary" style="width:100%; display:none;">Next Graph</button>`}
            `;
            
            document.getElementById('type-select').addEventListener('change', (e) => {
                this.initAudio();
                this.playerParams.type = e.target.value;
                this.updateGraph();
            });['a', 'h', 'k'].forEach(param => {
                document.getElementById(`slider-${param}`).addEventListener('input', (e) => {
                    this.initAudio();
                    let val = parseFloat(e.target.value);
                    if (param === 'a' && val === 0) {
                        val = 1; 
                        e.target.value = 1;
                    }
                    document.getElementById(`val-${param}`).innerText = val;
                    this.playerParams[param] = val;
                    this.updateGraph();
                });
            });
            
            // Reset player params and DOM controls for practice/orders
            this.playerParams = { type: 'quadratic', a: 1, h: 0, k: 0 };
            document.getElementById('type-select').value = 'quadratic';['a', 'h', 'k'].forEach(param => {
                const val = param === 'a' ? 1 : 0;
                document.getElementById(`slider-${param}`).value = val;
                document.getElementById(`val-${param}`).innerText = val;
            });
            
            if (mode === 'orders') {
                // Inject prompt above the canvas in the graph panel
                const graphPanel = document.querySelector('.graph-panel');
                if (!document.getElementById('order-prompt')) {
                    graphPanel.insertAdjacentHTML('afterbegin', `<div id="order-prompt" class="prompt-box"></div>`);
                }
                document.getElementById('order-prompt').innerText = "Press Start Game when ready!";
                
                document.getElementById('btn-submit').addEventListener('click', () => {
                    this.initAudio();
                    this.checkOrder();
                });
                
                document.getElementById('btn-start').addEventListener('click', () => {
                    this.initAudio();
                    document.getElementById('btn-start').style.display = 'none';
                    document.getElementById('btn-submit').style.display = 'block';
                    this.startOrders();
                });
                
                this.updateGraph();
            } else {
                document.getElementById('btn-next').addEventListener('click', () => {
                    this.initAudio();
                    document.getElementById('btn-next').style.display = 'none';
                    this.generateTarget();
                });
                this.generateTarget();
            }
        } else if (mode === 'challenge') {
            controls.innerHTML = `
                <div class="math-field-container">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600; color:var(--text-dark);">Enter Equation:</label>
                    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; font-weight: bold; color: var(--text-dark);">
                        y = <math-field id="math-input" style="flex: 1;"></math-field>
                    </div>
                </div>
                <button id="btn-submit-math" class="btn-action primary" style="width:100%;">Verify Equation</button>
            `;
            
            const mf = document.getElementById('math-input');
            mf.addEventListener('input', () => {
                this.currentExpression = mf.getValue('ascii-math');
                this.updateGraph();
            });
            
            document.getElementById('btn-submit-math').addEventListener('click', () => {
                this.initAudio();
                this.checkChallenge();
            });
            
            this.generateTarget();
        }
    }

    generateTarget() {
        const types =['linear', 'quadratic', 'absolute'];
        const type = types[Math.floor(Math.random() * types.length)];
        let a = (Math.floor(Math.random() * 5) - 2); 
        if (a === 0) a = 1;
        const h = Math.floor(Math.random() * 11) - 5; 
        const k = Math.floor(Math.random() * 11) - 5;
        
        this.targetParams = { type, a, h, k };
        
        if (this.mode === 'challenge') {
            this.currentExpression = "";
            const mf = document.getElementById('math-input');
            if (mf) mf.value = "";
        }
        
        this.showFeedback("", true);
        this.updateGraph();
    }

    startOrders() {
        this.mistakes = 0;
        this.score = 0;
        this.isPlaying = true;
        document.getElementById('mistakes-display').innerText = `Mistakes: 0 / 10`;
        document.getElementById('score-display').innerText = `Score: 0`;
        this.nextOrder();
    }

    nextOrder() {
        this.timeRemaining = 60;
        document.getElementById('timer-display').innerText = `Time: 60s`;
        
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('timer-display').innerText = `Time: ${this.timeRemaining}s`;
            if (this.timeRemaining <= 0) {
                this.handleOrderTimeout();
            }
        }, 1000);
        
        this.generateTarget();
        document.getElementById('order-prompt').innerText = this.generateOrderPrompt(this.targetParams);
        this.showFeedback("New order received. Fulfill it quickly!", true);
        
        this.playerParams = { type: 'quadratic', a: 1, h: 0, k: 0 };
        document.getElementById('type-select').value = 'quadratic';['a', 'h', 'k'].forEach(param => {
            const val = param === 'a' ? 1 : 0;
            document.getElementById(`slider-${param}`).value = val;
            document.getElementById(`val-${param}`).innerText = val;
        });
        this.updateGraph();
    }

    generateOrderPrompt(params) {
        let name = '';
        let dir = '';
        let stretchStr = '';
        
        if (params.type === 'linear') {
            name = 'line';
            dir = params.a > 0 ? 'an increasing' : 'a decreasing';
            stretchStr = Math.abs(params.a) > 1 ? `a steep slope magnitude of ${Math.abs(params.a)}` : `a standard slope magnitude of 1`;
            return `Order: Create ${dir} ${name} passing through the point (${params.h}, ${params.k}) with ${stretchStr}.`;
        } else {
            name = params.type === 'quadratic' ? 'parabola' : 'absolute value function';
            dir = params.a > 0 ? 'an upward-opening' : 'a downward-opening';
            stretchStr = Math.abs(params.a) > 1 ? ` and a vertical stretch of ${Math.abs(params.a)}` : ` and standard width`;
            return `Order: Create ${dir} ${name} with a vertex at (${params.h}, ${params.k})${stretchStr}.`;
        }
    }

    checkOrder() {
        if (!this.isPlaying) return;
        
        if (this.playerParams.type === this.targetParams.type &&
            this.playerParams.a === this.targetParams.a &&
            this.playerParams.h === this.targetParams.h &&
            this.playerParams.k === this.targetParams.k) {
            
            this.playHit();
            this.score++;
            document.getElementById('score-display').innerText = `Score: ${this.score}`;
            
            if (this.score >= 10) {
                this.endOrders(true);
            } else {
                this.showFeedback("Order fulfilled!", true);
                clearInterval(this.timerInterval);
                setTimeout(() => this.nextOrder(), 1000);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            document.getElementById('mistakes-display').innerText = `Mistakes: ${this.mistakes} / 10`;
            this.showFeedback("Incorrect order configuration!", false);
            
            if (this.mistakes >= 10) {
                this.endOrders(false);
            }
        }
    }

    handleOrderTimeout() {
        if (!this.isPlaying) return;
        this.playMiss();
        this.mistakes++;
        document.getElementById('mistakes-display').innerText = `Mistakes: ${this.mistakes} / 10`;
        this.showFeedback("Out of time!", false);
        
        if (this.mistakes >= 10) {
            this.endOrders(false);
        } else {
            setTimeout(() => this.nextOrder(), 1000);
        }
    }

    endOrders(win) {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        if (win) this.playVictory();
        else this.playGameOver();
        
        const modal = document.getElementById('report-modal');
        document.getElementById('report-title').innerText = win ? "Shift Completed Successfully!" : "Fired!";
        document.getElementById('report-title').style.color = win ? "var(--subject-primary)" : "#ef4444";
        
        document.getElementById('report-details').innerHTML = `
            <p><strong>Orders Fulfilled:</strong> ${this.score}</p>
            <p><strong>Mistakes Made:</strong> ${this.mistakes} / 10</p>
        `;
        modal.style.display = 'flex';
        
        this.saveCustomProgress();
    }

    evaluateMath(ascii, xVal) {
        if (!ascii) return null;
        let code = ascii.replace(/\s+/g, '');
        
        code = code.replace(/abs\(/g, 'Math.abs(');
        code = code.replace(/\|([^\|]+)\|/g, 'Math.abs($1)');
        code = code.replace(/\\left\|/g, '|').replace(/\\right\|/g, '|'); 
        code = code.replace(/\|([^\|]+)\|/g, 'Math.abs($1)'); 
        
        code = code.replace(/\^/g, '**');
        code = code.replace(/(\d)([a-zA-Z\(])/g, '$1*$2'); 
        code = code.replace(/\)([\d\w\(])/g, ')*$1');
        code = code.replace(/cdot/g, '*');
        
        code = code.replace(/x/g, `(${xVal})`);
        
        try {
            let result = new Function(`return ${code};`)();
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) return result;
            return null;
        } catch(e) {
            return null;
        }
    }

    checkChallenge() {
        if (!this.currentExpression || this.currentExpression.trim() === '') {
            this.showFeedback("Please enter an equation.", false);
            return;
        }

        let correct = true;
        // Verify mathematical equivalency across the entire domain using 0.5 step sizes
        for (let x = -10; x <= 10; x += 0.5) {
            let expected = 0;
            if (this.targetParams.type === 'linear') {
                expected = this.targetParams.a * (x - this.targetParams.h) + this.targetParams.k;
            } else if (this.targetParams.type === 'quadratic') {
                expected = this.targetParams.a * Math.pow(x - this.targetParams.h, 2) + this.targetParams.k;
            } else if (this.targetParams.type === 'absolute') {
                expected = this.targetParams.a * Math.abs(x - this.targetParams.h) + this.targetParams.k;
            }
            
            let actual = this.evaluateMath(this.currentExpression, x);
            if (actual === null || Math.abs(expected - actual) > 0.1) {
                correct = false;
                break;
            }
        }
        
        if (correct) {
            this.playHit();
            this.score++;
            document.getElementById('score-display').innerText = `Score: ${this.score}`;
            this.showFeedback("Correct! Function matched perfectly.", true);
            setTimeout(() => this.generateTarget(), 1500);
        } else {
            this.playMiss();
            this.showFeedback("Equation does not match the target graph.", false);
        }
    }

    updateGraph() {
        this.drawGraph();
        
        if (this.mode === 'practice') {
            if (this.playerParams.type === this.targetParams.type &&
                this.playerParams.a === this.targetParams.a &&
                this.playerParams.h === this.targetParams.h &&
                this.playerParams.k === this.targetParams.k) {
                
                if (document.getElementById('btn-next').style.display !== 'block') {
                    this.playHit();
                    this.showFeedback("Perfect Match!", true);
                    document.getElementById('btn-next').style.display = 'block';
                }
            } else {
                this.showFeedback("", true);
                document.getElementById('btn-next').style.display = 'none';
            }
        }
    }

    showFeedback(msg, isSuccess) {
        const fb = document.getElementById('feedback-message');
        fb.innerText = msg;
        fb.className = `feedback-msg ${isSuccess ? 'feedback-success' : 'feedback-error'}`;
    }

    mapX(x) { return (x + 10) * (this.canvas.width / 20); }
    mapY(y) { return (10 - y) * (this.canvas.height / 20); }

    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        const range = 10;
        const step = width / (range * 2);
        
        ctx.strokeStyle = document.documentElement.classList.contains('dark-theme') ? '#334155' : '#e2e8f0';
        ctx.lineWidth = 1;
        
        for(let i = 0; i <= range * 2; i++) {
            ctx.beginPath();
            ctx.moveTo(i * step, 0);
            ctx.lineTo(i * step, height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * step);
            ctx.lineTo(width, i * step);
            ctx.stroke();
        }
        
        ctx.strokeStyle = document.documentElement.classList.contains('dark-theme') ? '#94a3b8' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
    }

    drawExpression(ascii, isTarget) {
        if (!ascii) return;
        const ctx = this.ctx;
        ctx.beginPath();
        
        ctx.strokeStyle = isTarget ? '#94a3b8' : '#991b1b';
        ctx.lineWidth = 3;
        if (isTarget) ctx.setLineDash([8, 8]);
        else ctx.setLineDash([]);
        
        let first = true;
        for(let px = 0; px <= this.canvas.width; px += 2) {
            let x = (px / (this.canvas.width / 20)) - 10;
            let y = this.evaluateMath(ascii, x);
            if (y === null || isNaN(y)) continue;
            
            let py = this.mapY(y);
            // Optimization trick to prevent Canvas glitching out
            if (py < -1000 || py > this.canvas.height + 1000) continue;
            
            if (first) {
                ctx.moveTo(px, py);
                first = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawFunction(params, isTarget) {
        const ctx = this.ctx;
        const isDark = document.documentElement.classList.contains('dark-theme');

        ctx.strokeStyle = isTarget ? (isDark ? '#64748b' : '#94a3b8') : '#991b1b';
        ctx.lineWidth = isTarget ? 2.5 : 3;
        if (isTarget) ctx.setLineDash([8, 8]);
        else ctx.setLineDash([]);

        const b = params.b || 1;

        // Handle discontinuous functions (reciprocal) by breaking on asymptotes
        const segments =[];
        let currentSeg =[];

        for (let px = 0; px <= this.canvas.width; px += 1.5) {
            const x = (px / (this.canvas.width / 20)) - 10;
            const xInner = b * (x - params.h);
            let y = null;

            switch (params.type) {
                case 'linear':
                    y = params.a * xInner + params.k;
                    break;
                case 'quadratic':
                    y = params.a * Math.pow(xInner, 2) + params.k;
                    break;
                case 'absolute':
                    y = params.a * Math.abs(xInner) + params.k;
                    break;
                case 'cubic':
                    y = params.a * Math.pow(xInner, 3) + params.k;
                    break;
                case 'sqrt':
                    if (xInner >= 0) y = params.a * Math.sqrt(xInner) + params.k;
                    break;
                case 'reciprocal':
                    if (Math.abs(xInner) > 0.05) y = params.a / xInner + params.k;
                    break;
            }

            if (y === null || isNaN(y) || !isFinite(y)) {
                if (currentSeg.length > 0) {
                    segments.push(currentSeg);
                    currentSeg =[];
                }
                continue;
            }

            const py = this.mapY(y);
            if (py < -800 || py > this.canvas.height + 800) {
                if (currentSeg.length > 0) {
                    segments.push(currentSeg);
                    currentSeg =[];
                }
                continue;
            }

            currentSeg.push({ px, py });
        }
        if (currentSeg.length > 0) segments.push(currentSeg);

        for (const seg of segments) {
            if (seg.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(seg[0].px, seg[0].py);
            for (let i = 1; i < seg.length; i++) {
                ctx.lineTo(seg[i].px, seg[i].py);
            }
            ctx.stroke();
        }

        ctx.setLineDash([]);
    }

    drawGraph() {
        this.drawGrid();
        const ctx = this.ctx;
        const isDark = document.documentElement.classList.contains('dark-theme');

        // Draw axis labels
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        const step = this.canvas.width / 20;
        for (let i = -9; i <= 9; i++) {
            if (i === 0) continue;
            // X axis numbers
            ctx.fillText(i, this.mapX(i), this.mapY(0) + 14);
            // Y axis numbers
            ctx.textAlign = 'right';
            ctx.fillText(i, this.mapX(0) - 4, this.mapY(i) + 4);
            ctx.textAlign = 'center';
        }

        if (this.mode === 'practice') {
            // Draw dotted target graph
            if (this.targetParams) this.drawFunction(this.targetParams, true);
            // Draw player's live graph
            this.drawFunction(this.playerParams, false);

        } else if (this.mode === 'orders') {
            // No reference graph — player works from description alone
            this.drawFunction(this.playerParams, false);

        } else if (this.mode === 'challenge') {
            // Draw dotted target graph
            if (this.targetParams) this.drawFunction(this.targetParams, true);
            // Draw player's typed expression if any
            if (this.currentExpression) {
                this.drawExpression(this.currentExpression, false);
            }
        }
    }

    saveCustomProgress() {
        // Hook for external progress tracking (e.g. via StateManager or Firebase)
        // Called after completing Timed Orders mode
        try {
            if (typeof StateManager !== 'undefined' && StateManager.saveProgress) {
                StateManager.saveProgress('function-factory', {
                    mode: this.mode,
                    score: this.score,
                    mistakes: this.mistakes,
                    timestamp: Date.now()
                });
            }
        } catch (e) {
            // Progress saving is non-critical; fail silently
        }
    }
}

new FunctionFactory();