class FunctionFactory {
    constructor() {
        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = 30; // Pixels per math unit
        
        this.mode = 'practice'; // practice, timed, puzzle, challenge
        this.score = 0;
        this.moves = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.audioCtx = null;
        
        this.currentParams = { type: 'quadratic', a: 1, b: 1, h: 0, k: 0 };
        this.targetParams = null;

        this.initUI();
        this.generateTarget();
        this.updateGraphAndEquation();
    }

    initAudio() {
        if (window.userSettings && window.userSettings.muteSounds) return;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mute') === 'true') return;

        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (window.userSettings && window.userSettings.muteSounds) return;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mute') === 'true') return;

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

    playCorrect() { this.playTone(600, 'sine', 0.15); }
    playWrong() { this.playTone(150, 'sawtooth', 0.3); }
    playFinished() {
        setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(800, 'sine', 0.4), 350);
    }

    initUI() {
        // Init Audio on first interaction
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        // UI Elements
        this.sliders = {
            a: document.getElementById('slider-a'),
            b: document.getElementById('slider-b'),
            h: document.getElementById('slider-h'),
            k: document.getElementById('slider-k')
        };
        this.displays = {
            a: document.getElementById('val-a'),
            b: document.getElementById('val-b'),
            h: document.getElementById('val-h'),
            k: document.getElementById('val-k')
        };

        const parentSelect = document.getElementById('parent-function-select');
        
        // Listeners
        parentSelect.addEventListener('change', (e) => {
            this.initAudio();
            this.currentParams.type = e.target.value;
            this.moves++;
            this.updateMoves();
            this.updateGraphAndEquation();
        });

        ['a', 'b', 'h', 'k'].forEach(param => {
            this.sliders[param].addEventListener('input', (e) => {
                this.initAudio();
                let val = parseFloat(e.target.value);
                // Prevent a and b from being exactly 0
                if ((param === 'a' || param === 'b') && val === 0) {
                    val = 0.5; // Snap to nearest non-zero
                    this.sliders[param].value = val;
                }
                this.currentParams[param] = val;
                this.displays[param].innerText = val;
                this.moves++;
                this.updateMoves();
                this.updateGraphAndEquation();
                
                // Realtime check in practice/puzzle mode
                document.getElementById('feedback-message').innerText = '';
            });
        });

        // Buttons
        document.getElementById('btn-check').addEventListener('click', () => { this.initAudio(); this.checkMatch(); });
        document.getElementById('btn-next').addEventListener('click', () => { this.initAudio(); this.nextTarget(); });
        document.getElementById('btn-hint').addEventListener('click', () => { this.initAudio(); this.showHint(); });
        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.setMode(this.mode);
        });

        // Mode Setup
        const modes =['practice', 'timed', 'puzzle', 'challenge'];
        modes.forEach(mode => {
            document.getElementById(`btn-${mode}`).addEventListener('click', (e) => {
                this.initAudio();
                modes.forEach(m => document.getElementById(`btn-${m}`).classList.remove('active'));
                e.target.classList.add('active');
                this.setMode(mode);
            });
        });
    }

    setMode(mode) {
        this.mode = mode;
        this.score = 0;
        this.moves = 0;
        this.updateScore();
        this.updateMoves();
        document.getElementById('feedback-message').innerText = '';
        document.getElementById('mode-display').innerText = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
        
        clearInterval(this.timerInterval);
        
        const bSlider = document.querySelector('.challenge-only');
        if (mode === 'challenge') {
            bSlider.style.display = 'block';
        } else {
            bSlider.style.display = 'none';
            this.currentParams.b = 1;
            this.sliders.b.value = 1;
            this.displays.b.innerText = 1;
        }

        if (mode === 'timed') {
            this.timeRemaining = 60;
            document.getElementById('timer-display').innerText = `Time: 01:00`;
            this.timerInterval = setInterval(() => {
                this.timeRemaining--;
                const m = Math.floor(this.timeRemaining / 60).toString().padStart(2, '0');
                const s = (this.timeRemaining % 60).toString().padStart(2, '0');
                document.getElementById('timer-display').innerText = `Time: ${m}:${s}`;
                if (this.timeRemaining <= 0) this.endGame();
            }, 1000);
        } else {
            document.getElementById('timer-display').innerText = `Time: --:--`;
        }

        this.generateTarget();
        this.resetCurrentParams();
        this.updateGraphAndEquation();
    }

    resetCurrentParams() {
        this.currentParams = { type: this.currentParams.type, a: 1, b: 1, h: 0, k: 0 };
        ['a', 'b', 'h', 'k'].forEach(p => {
            this.sliders[p].value = this.currentParams[p];
            this.displays[p].innerText = this.currentParams[p];
        });
    }

    generateTarget() {
        const types =['linear', 'quadratic', 'absolute', 'sqrt', 'cubic', 'reciprocal'];
        
        // Randomly assign target parameters
        const randRange = (min, max, step) => {
            const steps = Math.floor((max - min) / step);
            return min + Math.floor(Math.random() * (steps + 1)) * step;
        };

        const type = types[Math.floor(Math.random() * types.length)];
        let a = randRange(-3, 3, 0.5);
        if (a === 0) a = 1;
        
        let b = 1;
        if (this.mode === 'challenge') {
            b = randRange(-2, 2, 0.5);
            if (b === 0) b = 1;
        }

        const h = randRange(-8, 8, 1);
        const k = randRange(-8, 8, 1);

        this.targetParams = { type, a, b, h, k };
        
        // Hide next button, show check button
        document.getElementById('btn-check').style.display = 'block';
        document.getElementById('btn-next').style.display = 'none';
        document.getElementById('hint-text').innerText = "Adjust the sliders to match the red target graph.";
    }

    mathEvaluate(x, params) {
        const { type, a, b, h, k } = params;
        const inner = b * (x - h);
        let yBase = 0;

        switch(type) {
            case 'linear': yBase = inner; break;
            case 'quadratic': yBase = inner * inner; break;
            case 'absolute': yBase = Math.abs(inner); break;
            case 'sqrt': yBase = inner >= 0 ? Math.sqrt(inner) : NaN; break;
            case 'cubic': yBase = Math.pow(inner, 3); break;
            case 'reciprocal': yBase = inner !== 0 ? 1 / inner : NaN; break;
        }
        
        return (a * yBase) + k;
    }

    getColors() {
        const isDark = document.body.classList.contains('dark-theme');
        return {
            grid: isDark ? '#334155' : '#e2e8f0',
            axes: isDark ? '#94a3b8' : '#475569',
            target: isDark ? '#f87171' : '#ef4444',
            current: isDark ? '#60a5fa' : '#2563eb'
        };
    }

    drawGrid() {
        const colors = this.getColors();
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Grid lines
        this.ctx.strokeStyle = colors.grid;
        this.ctx.lineWidth = 1;
        
        const originX = this.width / 2;
        const originY = this.height / 2;

        for (let x = 0; x <= this.width; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Axes
        this.ctx.strokeStyle = colors.axes;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(originX, 0);
        this.ctx.lineTo(originX, this.height);
        this.ctx.moveTo(0, originY);
        this.ctx.lineTo(this.width, originY);
        this.ctx.stroke();
    }

    drawFunction(params, colorType, isDashed = false) {
        const colors = this.getColors();
        this.ctx.strokeStyle = colorType === 'target' ? colors.target : colors.current;
        this.ctx.lineWidth = 3;
        if (isDashed) this.ctx.setLineDash([5, 5]);
        else this.ctx.setLineDash([]);

        this.ctx.beginPath();
        
        const originX = this.width / 2;
        const originY = this.height / 2;
        let isDrawing = false;
        let prevY = 0;

        for (let px = 0; px <= this.width; px++) {
            const mathX = (px - originX) / this.scale;
            const mathY = this.mathEvaluate(mathX, params);
            
            const py = originY - (mathY * this.scale);

            if (!isNaN(py)) {
                // Prevent drawing lines across vertical asymptotes (e.g., reciprocal)
                if (isDrawing && Math.abs(py - prevY) > this.height) {
                    this.ctx.stroke();
                    this.ctx.beginPath();
                } else if (!isDrawing) {
                    this.ctx.moveTo(px, py);
                    isDrawing = true;
                } else {
                    this.ctx.lineTo(px, py);
                }
                prevY = py;
            } else {
                if (isDrawing) {
                    this.ctx.stroke();
                    this.ctx.beginPath();
                }
                isDrawing = false;
            }
        }
        if (isDrawing) this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset
    }

    updateGraphAndEquation() {
        this.drawGrid();
        if (this.targetParams) {
            this.drawFunction(this.targetParams, 'target', true);
        }
        this.drawFunction(this.currentParams, 'current');
        this.updateEquation();
    }

    formatTermLatex(coef, isFirst, isMultiplier = true) {
        if (coef === 0 && !isMultiplier) return "";
        if (coef === 1 && isMultiplier) return isFirst ? "" : "+";
        if (coef === -1 && isMultiplier) return "-";
        if (coef > 0 && !isFirst) return `+ ${coef}`;
        if (coef < 0 && !isFirst) return `- ${Math.abs(coef)}`;
        return `${coef}`;
    }

    updateEquation() {
        const { type, a, b, h, k } = this.currentParams;
        
        let aStr = this.formatTermLatex(a, true, true);
        if (aStr === "" && a !== 1 && a !== -1) aStr = a; 
        
        let innerExp = "x";
        let hStr = "";
        if (h > 0) hStr = `- ${h}`;
        else if (h < 0) hStr = `+ ${Math.abs(h)}`;
        
        if (b !== 1 && h !== 0) {
            innerExp = `${b}\\left(x ${hStr}\\right)`;
        } else if (b !== 1) {
            innerExp = `${b}x`;
        } else if (h !== 0) {
            innerExp = `x ${hStr}`;
        }

        let eq = "y = ";
        let base = "";
        
        switch(type) {
            case 'linear': 
                if ((a !== 1 && a !== -1) && innerExp !== "x" && innerExp !== `${b}x`) {
                    base = `\\left(${innerExp}\\right)`;
                } else if (a === -1 && innerExp !== "x" && innerExp !== `${b}x`) {
                    base = `\\left(${innerExp}\\right)`;
                } else {
                    base = innerExp;
                }
                break;
            case 'quadratic': 
                base = innerExp === "x" ? `x^2` : `\\left(${innerExp}\\right)^2`; 
                break;
            case 'absolute': 
                base = `\\left|${innerExp}\\right|`; 
                break;
            case 'sqrt': 
                base = `\\sqrt{${innerExp}}`; 
                break;
            case 'cubic': 
                base = innerExp === "x" ? `x^3` : `\\left(${innerExp}\\right)^3`; 
                break;
            case 'reciprocal': 
                let num = "1";
                if (a === -1) num = "-1";
                else if (a !== 1) num = a.toString();
                base = `\\frac{${num}}{${innerExp}}`;
                aStr = ""; 
                break;
        }

        if (type !== 'reciprocal') {
            eq += `${aStr}${base}`;
        } else {
            eq += base;
        }

        if (k !== 0) {
            eq += ` ${k > 0 ? '+' : '-'} ${Math.abs(k)}`;
        }
        
        if (eq === "y = ") eq = "y = 0";

        const displayEl = document.getElementById('equation-display');
        displayEl.innerText = `\\( ${eq} \\)`;
        
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([displayEl]).catch(err => console.log('MathJax error:', err));
        }
    }

    checkMatch() {
        const p1 = this.currentParams;
        const p2 = this.targetParams;
        const feedback = document.getElementById('feedback-message');

        // Allow equivalent formulations (e.g. for reciprocal a=1, b=2 is same as a=0.5, b=1)
        // But for high school, strict matching of intended a,b,h,k parameters is best for pedagogical reasons
        let isMatch = (p1.type === p2.type && p1.a === p2.a && p1.b === p2.b && p1.h === p2.h && p1.k === p2.k);

        // Exceptional mathematical equivalents handling for simpler modes
        if (p1.type === 'linear' && p2.type === 'linear') {
            // a*(b*(x-h)) + k = a*b*x - a*b*h + k
            const m1 = p1.a * p1.b;
            const b1 = (-p1.a * p1.b * p1.h) + p1.k;
            const m2 = p2.a * p2.b;
            const b2 = (-p2.a * p2.b * p2.h) + p2.k;
            if (m1 === m2 && b1 === b2) isMatch = true;
        }

        if (isMatch) {
            this.playCorrect();
            feedback.innerText = "Excellent! Perfect Match!";
            feedback.className = "feedback-msg feedback-success";
            this.score++;
            this.updateScore();
            document.getElementById('btn-check').style.display = 'none';
            document.getElementById('btn-next').style.display = 'block';
            
            if (this.mode === 'puzzle' && this.score >= 5) {
                this.endGame();
            }
        } else {
            this.playWrong();
            feedback.innerText = "Not quite. Check your transformations!";
            feedback.className = "feedback-msg feedback-error";
            
            // Visual error shake
            const canvasContainer = document.querySelector('.canvas-container');
            canvasContainer.style.transform = "translateX(-5px)";
            setTimeout(() => canvasContainer.style.transform = "translateX(5px)", 50);
            setTimeout(() => canvasContainer.style.transform = "translateX(0)", 100);
        }
    }

    nextTarget() {
        document.getElementById('feedback-message').innerText = '';
        this.generateTarget();
        this.resetCurrentParams();
        this.updateGraphAndEquation();
    }

    showHint() {
        const p1 = this.currentParams;
        const p2 = this.targetParams;
        const hintEl = document.getElementById('hint-text');

        if (p1.type !== p2.type) {
            hintEl.innerText = "Hint: Start by selecting the correct Parent Function.";
        } else if (p1.h !== p2.h) {
            hintEl.innerText = "Hint: Look at the horizontal shift (left or right). Focus on 'h'.";
        } else if (p1.k !== p2.k) {
            hintEl.innerText = "Hint: Look at the vertical shift (up or down). Focus on 'k'.";
        } else if (p1.a !== p2.a) {
            if (Math.sign(p1.a) !== Math.sign(p2.a)) {
                hintEl.innerText = "Hint: The graph might need a vertical reflection across the x-axis.";
            } else {
                hintEl.innerText = "Hint: Check the vertical stretch or compression. Focus on 'a'.";
            }
        } else if (p1.b !== p2.b) {
            hintEl.innerText = "Hint: Check the horizontal stretch or reflection. Focus on 'b'.";
        } else {
            hintEl.innerText = "You're very close! Double check your values.";
        }
    }

    updateScore() {
        document.getElementById('score-display').innerText = `Matches: ${this.score}`;
    }

    updateMoves() {
        document.getElementById('moves-display').innerText = `Moves: ${this.moves}`;
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.playFinished();
        
        const modal = document.getElementById('report-modal');
        const details = document.getElementById('report-details');
        
        let reportHTML = `<p><strong>Mode:</strong> ${this.mode.charAt(0).toUpperCase() + this.mode.slice(1)}</p>`;
        reportHTML += `<p><strong>Total Matches:</strong> ${this.score}</p>`;
        
        if (this.mode === 'timed') {
            reportHTML += `<p>You completed ${this.score} matches in 60 seconds!</p>`;
        } else if (this.mode === 'puzzle') {
            reportHTML += `<p><strong>Total Moves:</strong> ${this.moves}</p>`;
            reportHTML += `<p>You completed 5 matches in ${this.moves} slider adjustments.</p>`;
            if (this.moves <= 15) reportHTML += `<p style="color:var(--math-primary); font-weight:bold;">Amazing efficiency!</p>`;
        } else {
            reportHTML += `<p><strong>Total Moves:</strong> ${this.moves}</p>`;
        }

        details.innerHTML = reportHTML;
        modal.style.display = 'flex';
        
        // Optionally trigger save to Firebase if auth is present
        this.saveProgress();
    }

    async saveProgress() {
        if (typeof window.isUserLoggedIn !== 'undefined' && window.isUserLoggedIn) {
            try {
                // Dynamically import firebase
                const fbModule = await import('../../../../js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Function Factory (${this.mode})`,
                        score: this.score,
                        mistakes: this.moves, // Using moves as 'mistakes' analog for UI
                        time: this.mode === 'timed' ? 60 : 0,
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
    new FunctionFactory();
});