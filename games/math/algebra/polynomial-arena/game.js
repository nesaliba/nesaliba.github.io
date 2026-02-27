class PolynomialArena {
    constructor() {
        this.enemies =[
            { name: "Quadratic Slime", emoji: "🟢", maxHp: 3, hp: 3, type: 'quad' },
            { name: "Cubic Knight", emoji: "🛡️", maxHp: 4, hp: 4, type: 'cubic' },
            { name: "Rational Dragon", emoji: "🐉", maxHp: 5, hp: 5, type: 'rational' }
        ];
        
        this.currentEnemyIndex = 0;
        this.playerHp = 3;
        this.score = 0;
        this.mistakes = 0;
        
        this.audioCtx = null;
        this.isPlaying = false;
        this.currentQuestion = null;

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

    rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    nonZeroRand(min, max) { let v = 0; while(v === 0) v = this.rand(min, max); return v; }

    fmt(c, p) {
        if (c === 0) return "";
        let term = "";
        if (p === 0) term = Math.abs(c);
        else if (p === 1) term = (Math.abs(c) === 1 ? "x" : Math.abs(c) + "x");
        else term = (Math.abs(c) === 1 ? "x^" + p : Math.abs(c) + "x^" + p);
        return (c < 0 ? "- " : "+ ") + term;
    }

    buildPoly(coeffs) {
        let s = "";
        let deg = coeffs.length - 1;
        for(let i=0; i<=deg; i++) {
            let c = coeffs[i];
            let p = deg - i;
            if (c === 0) continue;
            let term = this.fmt(c, p);
            if (s === "") {
                if (c < 0) s = "-" + term.substring(2);
                else s = term.substring(2);
            } else {
                s += " " + term;
            }
        }
        return s === "" ? "0" : s;
    }

    generateQuestion(enemyType) {
        let promptStr = "";
        let correctAns = "";
        let distractors =[];
        let qType = this.rand(0, 2);

        if (enemyType === 'quad') {
            let r1 = this.nonZeroRand(-5, 5);
            let r2 = this.nonZeroRand(-5, 5);
            let b = -(r1 + r2);
            let c = r1 * r2;
            let poly = this.buildPoly([1, b, c]);

            if (qType === 0) {
                promptStr = `\\text{Find the zeros of } f(x) = ${poly}`;
                correctAns = `x = ${r1}, x = ${r2}`;
                if (r1 === r2) correctAns = `x = ${r1}`;
                distractors =[
                    `x = ${-r1}, x = ${-r2}`,
                    `x = ${r1 + 1}, x = ${r2 - 1}`,
                    `x = ${-r1}, x = ${r2}`
                ];
                if (r1 === r2) distractors =[`x = ${-r1}`, `x = ${r1+1}`, `x = ${r1-1}`];
            } else if (qType === 1) {
                promptStr = `\\text{Factor the expression } ${poly}`;
                const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
                const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
                correctAns = r1 === r2 ? `${f1}^2` : `${f1}${f2}`;
                
                const d1 = r1 < 0 ? `(x - ${-r1})` : `(x + ${r1})`;
                const d2 = r2 < 0 ? `(x - ${-r2})` : `(x + ${r2})`;
                distractors =[
                    r1 === r2 ? `${d1}^2` : `${d1}${d2}`,
                    `${f1}${d2}`,
                    `${d1}${f2}`
                ];
            } else {
                let yInt = this.nonZeroRand(-6, 6);
                promptStr = `\\text{Which equation represents a parabola opening upward with vertex at } (0, ${yInt})?`;
                correctAns = `y = x^2 ${yInt > 0 ? '+' : '-'} ${Math.abs(yInt)}`;
                distractors =[
                    `y = -x^2 ${yInt > 0 ? '+' : '-'} ${Math.abs(yInt)}`,
                    `y = (x ${yInt > 0 ? '-' : '+'} ${Math.abs(yInt)})^2`,
                    `y = x^2 ${yInt > 0 ? '-' : '+'} ${Math.abs(yInt)}`
                ];
            }
        } else if (enemyType === 'cubic') {
            if (qType === 0) {
                let a = this.nonZeroRand(-3, 3);
                let poly = this.buildPoly([a, this.rand(-5,5), this.rand(-5,5), this.rand(-5,5)]);
                promptStr = `\\text{Determine the end behavior of } f(x) = ${poly}`;
                if (a > 0) {
                    correctAns = `x \\to \\infty, y \\to \\infty \\text{ and } x \\to -\\infty, y \\to -\\infty`;
                    distractors =[
                        `x \\to \\infty, y \\to -\\infty \\text{ and } x \\to -\\infty, y \\to \\infty`,
                        `x \\to \\pm\\infty, y \\to \\infty`,
                        `x \\to \\pm\\infty, y \\to -\\infty`
                    ];
                } else {
                    correctAns = `x \\to \\infty, y \\to -\\infty \\text{ and } x \\to -\\infty, y \\to \\infty`;
                    distractors =[
                        `x \\to \\infty, y \\to \\infty \\text{ and } x \\to -\\infty, y \\to -\\infty`,
                        `x \\to \\pm\\infty, y \\to \\infty`,
                        `x \\to \\pm\\infty, y \\to -\\infty`
                    ];
                }
            } else if (qType === 1) {
                let r1 = this.nonZeroRand(-4, 4);
                let r2 = this.nonZeroRand(-4, 4);
                let r3 = this.nonZeroRand(-4, 4);
                const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
                const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
                const f3 = r3 < 0 ? `(x + ${-r3})` : `(x - ${r3})`;
                promptStr = `\\text{Find the zeros of } f(x) = ${f1}${f2}${f3}`;
                
                let roots = [...new Set([r1, r2, r3])].sort((a,b)=>a-b);
                correctAns = `x = ` + roots.join(", ");
                distractors = [
                    `x = ` + [...new Set([-r1, -r2, -r3])].sort((a,b)=>a-b).join(", "),
                    `x = ` + [...new Set([r1+1, r2, r3])].sort((a,b)=>a-b).join(", "),
                    `x = ` + [...new Set([-r1, r2, -r3])].sort((a,b)=>a-b).join(", ")
                ];
            } else {
                let r1 = this.nonZeroRand(-3, 3);
                let r2 = this.nonZeroRand(-3, 3);
                promptStr = `\\text{Which cubic has roots } x=${r1} \\text{ (multiplicity 2) and } x=${r2}?`;
                const f1 = r1 < 0 ? `(x + ${-r1})` : `(x - ${r1})`;
                const f2 = r2 < 0 ? `(x + ${-r2})` : `(x - ${r2})`;
                correctAns = `f(x) = ${f1}^2 ${f2}`;
                
                const d1 = r1 < 0 ? `(x - ${-r1})` : `(x + ${r1})`;
                const d2 = r2 < 0 ? `(x - ${-r2})` : `(x + ${r2})`;
                distractors =[
                    `f(x) = ${f1} ${f2}^2`,
                    `f(x) = ${d1}^2 ${d2}`,
                    `f(x) = ${d1} ${d2}^2`
                ];
            }
        } else {
            if (qType === 0) {
                let va = this.nonZeroRand(-5, 5);
                let root = this.nonZeroRand(-5, 5);
                if (va === root) root++;
                const num = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
                const den = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
                promptStr = `\\text{Find the vertical asymptote of } f(x) = \\frac{${num}}{${den}}`;
                correctAns = `x = ${va}`;
                distractors =[`x = ${-va}`, `y = ${va}`, `x = ${root}`];
            } else if (qType === 1) {
                let a = this.nonZeroRand(1, 5);
                let b = this.nonZeroRand(1, 5);
                if (a===b) a++;
                let polyNum = this.buildPoly([a, this.rand(-3,3), this.rand(-3,3)]);
                let polyDen = this.buildPoly([b, this.rand(-3,3), this.rand(-3,3)]);
                promptStr = `\\text{Find the horizontal asymptote of } f(x) = \\frac{${polyNum}}{${polyDen}}`;
                
                const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
                let g = gcd(Math.abs(a), Math.abs(b));
                let simpA = a/g; let simpB = b/g;
                if (simpB < 0) { simpA = -simpA; simpB = -simpB; }
                let ans = simpB === 1 ? `${simpA}` : `\\frac{${simpA}}{${simpB}}`;
                
                correctAns = `y = ${ans}`;
                distractors =[`y = 0`, `\\text{No horizontal asymptote}`, `x = ${ans}`];
            } else {
                let va = this.nonZeroRand(-5, 5);
                let root = this.nonZeroRand(-5, 5);
                if (va === root) root++;
                promptStr = `\\text{Which function has a vertical asymptote at } x=${va} \\text{ and an } x\\text{-intercept at } x=${root}?`;
                const num = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
                const den = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
                correctAns = `f(x) = \\frac{${num}}{${den}}`;
                
                const dNum = va < 0 ? `(x + ${-va})` : `(x - ${va})`;
                const dDen = root < 0 ? `(x + ${-root})` : `(x - ${root})`;
                distractors =[
                    `f(x) = \\frac{${dNum}}{${dDen}}`,
                    `f(x) = \\frac{${num}^2}{${den}}`,
                    `f(x) = \\frac{${dNum}}{${den}}`
                ];
            }
        }

        distractors =[...new Set(distractors)];
        while (distractors.length < 3) distractors.push(distractors[0] + " + 1");
        
        let options = [correctAns, distractors[0], distractors[1], distractors[2]];
        options.sort(() => Math.random() - 0.5);

        return { prompt: promptStr, options: options, answer: correctAns };
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
        title.style.color = isVictory ? "var(--math-primary)" : "#ef4444";
        
        let html = `<p><strong>Score:</strong> ${this.score}</p>`;
        html += `<p><strong>Enemies Defeated:</strong> ${isVictory ? this.enemies.length : this.currentEnemyIndex}</p>`;
        html += `<p><strong>Mistakes Made:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--math-primary); font-weight:bold; margin-top:0.5rem;">Flawless Victory!</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveProgress(isVictory);
    }

    async saveProgress(isVictory) {
        if (typeof window.isUserLoggedIn !== 'undefined' && window.isUserLoggedIn) {
            try {
                const fbModule = await import('../../../../js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Polynomial Arena`,
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
    new PolynomialArena();
});