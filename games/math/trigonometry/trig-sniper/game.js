const UNIT_CIRCLE =[
    { id: 0, rad: "0", deg: "0^\\circ", val: 0, x: "1", y: "0", tan: "0", csc: "undef", sec: "1", cot: "undef", q: "axis" },
    { id: 1, rad: "\\frac{\\pi}{6}", deg: "30^\\circ", val: Math.PI/6, x: "\\frac{\\sqrt{3}}{2}", y: "\\frac{1}{2}", tan: "\\frac{\\sqrt{3}}{3}", csc: "2", sec: "\\frac{2\\sqrt{3}}{3}", cot: "\\sqrt{3}", q: 1 },
    { id: 2, rad: "\\frac{\\pi}{4}", deg: "45^\\circ", val: Math.PI/4, x: "\\frac{\\sqrt{2}}{2}", y: "\\frac{\\sqrt{2}}{2}", tan: "1", csc: "\\sqrt{2}", sec: "\\sqrt{2}", cot: "1", q: 1 },
    { id: 3, rad: "\\frac{\\pi}{3}", deg: "60^\\circ", val: Math.PI/3, x: "\\frac{1}{2}", y: "\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", csc: "\\frac{2\\sqrt{3}}{3}", sec: "2", cot: "\\frac{\\sqrt{3}}{3}", q: 1 },
    { id: 4, rad: "\\frac{\\pi}{2}", deg: "90^\\circ", val: Math.PI/2, x: "0", y: "1", tan: "undef", csc: "1", sec: "undef", cot: "0", q: "axis" },
    { id: 5, rad: "\\frac{2\\pi}{3}", deg: "120^\\circ", val: 2*Math.PI/3, x: "-\\frac{1}{2}", y: "\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", csc: "\\frac{2\\sqrt{3}}{3}", sec: "-2", cot: "-\\frac{\\sqrt{3}}{3}", q: 2 },
    { id: 6, rad: "\\frac{3\\pi}{4}", deg: "135^\\circ", val: 3*Math.PI/4, x: "-\\frac{\\sqrt{2}}{2}", y: "\\frac{\\sqrt{2}}{2}", tan: "-1", csc: "\\sqrt{2}", sec: "-\\sqrt{2}", cot: "-1", q: 2 },
    { id: 7, rad: "\\frac{5\\pi}{6}", deg: "150^\\circ", val: 5*Math.PI/6, x: "-\\frac{\\sqrt{3}}{2}", y: "\\frac{1}{2}", tan: "-\\frac{\\sqrt{3}}{3}", csc: "2", sec: "-\\frac{2\\sqrt{3}}{3}", cot: "-\\sqrt{3}", q: 2 },
    { id: 8, rad: "\\pi", deg: "180^\\circ", val: Math.PI, x: "-1", y: "0", tan: "0", csc: "undef", sec: "-1", cot: "undef", q: "axis" },
    { id: 9, rad: "\\frac{7\\pi}{6}", deg: "210^\\circ", val: 7*Math.PI/6, x: "-\\frac{\\sqrt{3}}{2}", y: "-\\frac{1}{2}", tan: "\\frac{\\sqrt{3}}{3}", csc: "-2", sec: "-\\frac{2\\sqrt{3}}{3}", cot: "\\sqrt{3}", q: 3 },
    { id: 10, rad: "\\frac{5\\pi}{4}", deg: "225^\\circ", val: 5*Math.PI/4, x: "-\\frac{\\sqrt{2}}{2}", y: "-\\frac{\\sqrt{2}}{2}", tan: "1", csc: "-\\sqrt{2}", sec: "-\\sqrt{2}", cot: "1", q: 3 },
    { id: 11, rad: "\\frac{4\\pi}{3}", deg: "240^\\circ", val: 4*Math.PI/3, x: "-\\frac{1}{2}", y: "-\\frac{\\sqrt{3}}{2}", tan: "\\sqrt{3}", csc: "-\\frac{2\\sqrt{3}}{3}", sec: "-2", cot: "\\frac{\\sqrt{3}}{3}", q: 3 },
    { id: 12, rad: "\\frac{3\\pi}{2}", deg: "270^\\circ", val: 3*Math.PI/2, x: "0", y: "-1", tan: "undef", csc: "-1", sec: "undef", cot: "0", q: "axis" },
    { id: 13, rad: "\\frac{5\\pi}{3}", deg: "300^\\circ", val: 5*Math.PI/3, x: "\\frac{1}{2}", y: "-\\frac{\\sqrt{3}}{2}", tan: "-\\sqrt{3}", csc: "-\\frac{2\\sqrt{3}}{3}", sec: "2", cot: "-\\frac{\\sqrt{3}}{3}", q: 4 },
    { id: 14, rad: "\\frac{7\\pi}{4}", deg: "315^\\circ", val: 7*Math.PI/4, x: "\\frac{\\sqrt{2}}{2}", y: "-\\frac{\\sqrt{2}}{2}", tan: "-1", csc: "-\\sqrt{2}", sec: "\\sqrt{2}", cot: "-1", q: 4 },
    { id: 15, rad: "\\frac{11\\pi}{6}", deg: "330^\\circ", val: 11*Math.PI/6, x: "\\frac{\\sqrt{3}}{2}", y: "-\\frac{1}{2}", tan: "-\\frac{\\sqrt{3}}{3}", csc: "-2", sec: "\\frac{2\\sqrt{3}}{3}", cot: "-\\sqrt{3}", q: 4 }
];

class TrigSniper {
    constructor() {
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
        this.timerInterval = null;
        this.audioCtx = null;
        
        this.validTargets = [];
        this.effects =[];
        this.hoveredNode = -1;

        // Listen for dark mode class toggles to dynamically redraw
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

        const modes =['rookie', 'marksman', 'sniper'];
        modes.forEach(mode => {
            document.getElementById(`btn-${mode}`).addEventListener('click', (e) => {
                this.initAudio();
                if (this.isPlaying) return; // Disallow changing mode while playing
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
        const pt = UNIT_CIRCLE[Math.floor(Math.random() * 16)];
        let promptText = "";

        if (this.mode === 'rookie') {
            const type = Math.floor(Math.random() * 3);
            if (type === 0) promptText = `\\text{Locate Angle: } ${pt.rad}`;
            else if (type === 1) promptText = `\\text{Locate Angle: } ${pt.deg}`;
            else promptText = `\\text{Locate Point: } \\left(${pt.x}, ${pt.y}\\right)`;
            
            this.validTargets =[pt.id];
        } 
        else if (this.mode === 'marksman') {
            const useSin = Math.random() > 0.5;
            const funcKey = useSin ? 'y' : 'x';
            const val = pt[funcKey];

            let condSign = '';
            let isAxisCond = pt.q === 'axis';

            if (!isAxisCond) {
                const otherValNum = useSin ? Math.cos(pt.val) : Math.sin(pt.val);
                condSign = otherValNum > 0 ? '>' : '<';
            }

            this.validTargets = UNIT_CIRCLE.filter(p => {
                if (p[funcKey] !== val) return false;
                if (isAxisCond) return p.q === 'axis';
                const checkVal = useSin ? Math.cos(p.val) : Math.sin(p.val);
                return condSign === '>' ? checkVal > 0.001 : checkVal < -0.001;
            }).map(p => p.id);

            const funcStr = useSin ? '\\sin(\\theta)' : '\\cos(\\theta)';
            const otherFuncStr = useSin ? '\\cos(\\theta)' : '\\sin(\\theta)';
            promptText = `\\text{Find } \\theta \\text{ where } ${funcStr} = ${val}`;
            if (isAxisCond) promptText += ` \\text{ on an axis}`;
            else promptText += ` \\text{ and } ${otherFuncStr} ${condSign} 0`;
        } 
        else if (this.mode === 'sniper') {
            const funcs =['tan', 'csc', 'sec', 'cot'];
            let chosenFunc = '';
            let val = 'undef';
            while(val === 'undef') {
                chosenFunc = funcs[Math.floor(Math.random() * funcs.length)];
                val = pt[chosenFunc];
            }

            let checkFunc = Math.random() > 0.5 ? 'sin' : 'cos';
            let condSign = '';
            let isAxisCond = pt.q === 'axis';

            if (!isAxisCond) {
                const numVal = checkFunc === 'sin' ? Math.sin(pt.val) : Math.cos(pt.val);
                condSign = numVal > 0 ? '>' : '<';
            }

            this.validTargets = UNIT_CIRCLE.filter(p => {
                if (p[chosenFunc] !== val) return false;
                if (isAxisCond) return p.q === 'axis';
                const checkVal = checkFunc === 'sin' ? Math.sin(p.val) : Math.cos(p.val);
                return condSign === '>' ? checkVal > 0.001 : checkVal < -0.001;
            }).map(p => p.id);

            promptText = `\\text{Find } \\theta \\text{ where } \\${chosenFunc}(\\theta) = ${val}`;
            if (isAxisCond) promptText += ` \\text{ on an axis}`;
            else promptText += ` \\text{ and } \\${checkFunc}(\\theta) ${condSign} 0`;
        }

        this.updatePromptDisplay(promptText);
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

        // Draw Axes
        this.ctx.strokeStyle = colors.axis;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(originX, 20); this.ctx.lineTo(originX, this.height - 20);
        this.ctx.moveTo(20, originY); this.ctx.lineTo(this.width - 20, originY);
        this.ctx.stroke();

        // Draw Main Circle
        this.ctx.strokeStyle = colors.circle;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(originX, originY, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw Nodes
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
        this.ctx.shadowBlur = 0; // Reset

        // Draw Effects
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const originX = this.width / 2;
        const originY = this.height / 2;

        this.hoveredNode = -1;
        for (const pt of UNIT_CIRCLE) {
            const cx = originX + this.radius * Math.cos(pt.val);
            const cy = originY - this.radius * Math.sin(pt.val);
            if (Math.hypot(x - cx, y - cy) < 20) {
                this.hoveredNode = pt.id;
                break;
            }
        }
    }

    handleClick(e) {
        if (!this.isPlaying || this.hoveredNode === -1) return;

        const pt = UNIT_CIRCLE[this.hoveredNode];
        const originX = this.width / 2;
        const originY = this.height / 2;
        const cx = originX + this.radius * Math.cos(pt.val);
        const cy = originY - this.radius * Math.sin(pt.val);

        this.attempts++;

        if (this.validTargets.includes(this.hoveredNode)) {
            // Hit!
            this.playHit();
            this.score++;
            this.effects.push({ x: cx, y: cy, r: 10, alpha: 1.0, type: 'correct' });
            
            // Re-calc accuracy
            const acc = Math.round((this.score / this.attempts) * 100);
            document.getElementById('score-display').innerText = `Hits: ${this.score}`;
            document.getElementById('accuracy-display').innerText = `Accuracy: ${acc}%`;

            this.generateTarget();
        } else {
            // Miss!
            this.playMiss();
            this.effects.push({ x: cx, y: cy, r: 10, alpha: 1.0, type: 'wrong' });
            this.timeRemaining = Math.max(0, this.timeRemaining - 3); // Penalty
            
            const acc = Math.round((this.score / this.attempts) * 100);
            document.getElementById('accuracy-display').innerText = `Accuracy: ${acc}%`;

            // Flash screen red briefly
            this.canvas.style.boxShadow = "inset 0 0 50px rgba(239, 68, 68, 0.5)";
            setTimeout(() => this.canvas.style.boxShadow = "inset 0 0 20px rgba(0,0,0,0.5)", 150);
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.isPlaying = false;
        this.playFinished();
        
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
        
        this.saveProgress(acc);
    }

    async saveProgress(accuracy) {
        if (typeof window.isUserLoggedIn !== 'undefined' && window.isUserLoggedIn) {
            try {
                const fbModule = await import('../../../../js/firebase-init.js');
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

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    new TrigSniper();
});