class ThermoTrialsGame {
    constructor() {
        this.parseSettings();
        this.applyTheme();
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        this.audioCtx = null;
        this.startTime = Date.now();
        this.timerInterval = null;
        this.elapsedSeconds = 0;

        // New: engagement systems
        this.streak = 0;
        this.maxStreak = 0;
        this.xp = 0;
        this.xpPerWave = 100;
        this.xpLevel = 1;
        this.xpThreshold = 500;
        this.particles = [];
        this.animFrame = null;
        this.coreHeat = 0; // 0-100, increases on wrong answers
        this.coreCanvas = null;
        this.coreCtx = null;
        this.coreAnimFrame = null;

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer();
        this.startCoreAnimation();
        this.nextWave();
    }

    parseSettings() {
        const params = new URLSearchParams(window.location.search);
        this.settings = {
            timer: params.get('timer') || 'off',
            timerVisible: params.get('timerVisible') || 'visible',
            maxMistakes: parseInt(params.get('maxMistakes')) || 10,
            mute: params.get('mute') === 'true',
            theme: params.get('theme') || localStorage.getItem('scitriad_theme') || 'light'
        };
    }

    applyTheme() {
        if (this.settings.theme === 'dark') document.body.classList.add('dark-theme');
    }

    initAudio() {
        if (this.settings.mute) return;
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (this.settings.mute || !this.audioCtx) return;
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

    playStreakSound(streak) {
        if (this.settings.mute || !this.audioCtx) return;
        const notes = [523, 659, 784, 1047];
        const count = Math.min(streak, 4);
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.playTone(notes[i], 'sine', 0.15, 0.12), i * 80);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('game-timer');
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    stopTimer() { if (this.timerInterval) clearInterval(this.timerInterval); }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on'
            ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>`
            : '';

        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Thermochemical Trials</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">
                        <span class="stat-label">STABILITY</span>
                        <span id="health-val">${this.maxMistakes - this.mistakes}/${this.maxMistakes}</span>
                    </div>
                    <div class="stat-box" id="wave-box">
                        <span class="stat-label">TARGET</span>
                        <span id="wave-val">${this.wave}/${this.maxWaves}</span>
                    </div>
                    <div class="stat-box" id="streak-box">
                        <span class="stat-label">STREAK</span>
                        <span id="streak-val">0🔥</span>
                    </div>
                </div>
            </header>

            <!-- XP Bar -->
            <div class="xp-bar-wrapper">
                <div class="xp-bar-inner">
                    <span class="xp-label">LVL <span id="xp-level">1</span></span>
                    <div class="xp-track">
                        <div class="xp-fill" id="xp-fill" style="width:0%"></div>
                        <span class="xp-text" id="xp-text">0 / 500 XP</span>
                    </div>
                </div>
            </div>

            <main class="game-container">
                <!-- Reactor Core Sidebar -->
                <div class="reactor-sidebar">
                    <div class="reactor-label">REACTOR CORE</div>
                    <canvas id="reactor-canvas" width="120" height="120"></canvas>
                    <div class="core-heat-wrapper">
                        <div class="core-heat-bar" id="core-heat-bar"></div>
                    </div>
                    <div class="core-temp-label">HEAT: <span id="core-temp">0%</span></div>
                    <div class="wave-progress-wrapper">
                        <div class="wave-dots" id="wave-dots"></div>
                    </div>
                </div>

                <div class="thermo-panel">
                    <div class="thermo-header">
                        <span class="pulse-dot"></span>
                        🔥 Energy Target Assessment
                        <span class="wave-badge" id="wave-badge">WAVE ${this.wave}</span>
                    </div>
                    <div class="data-display" id="data-display">Loading target parameters...</div>
                    <div class="thermo-text" id="question-text">Analyzing variables...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>

            <!-- Particle canvas overlay -->
            <canvas id="particle-canvas" style="position:fixed;top:0;left:0;pointer-events:none;z-index:9999;width:100%;height:100%;"></canvas>

            <!-- Streak popup -->
            <div class="streak-popup" id="streak-popup"></div>

            <!-- Wave Summary Modal -->
            <div class="modal-overlay wave-summary-overlay" id="waveSummaryModal" style="display:none;">
                <div class="wave-summary-card">
                    <div class="ws-badge" id="ws-badge">✓</div>
                    <h2 id="ws-title">Target Neutralized</h2>
                    <div class="ws-stats" id="ws-stats"></div>
                    <button class="modal-btn" id="ws-continue-btn">Next Target →</button>
                </div>
            </div>

            <!-- End Game Modal -->
            <div class="modal-overlay" id="endModal">
                <div class="modal-content" id="endModalContent">
                    <h2 id="end-title"></h2>
                    <p id="end-desc"></p>
                    <div class="end-stats" id="end-stats"></div>
                    <button class="modal-btn" onclick="location.reload()">Run New Trial</button>
                    <a href="/Chemistry.html" class="modal-btn btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;

        this.coreCanvas = document.getElementById('reactor-canvas');
        this.coreCtx = this.coreCanvas.getContext('2d');
        this.buildWaveDots();
        this.resizeParticleCanvas();
        window.addEventListener('resize', () => this.resizeParticleCanvas());
    }

    resizeParticleCanvas() {
        const pc = document.getElementById('particle-canvas');
        if (pc) {
            pc.width = window.innerWidth;
            pc.height = window.innerHeight;
        }
    }

    buildWaveDots() {
        const container = document.getElementById('wave-dots');
        container.innerHTML = '';
        for (let i = 1; i <= this.maxWaves; i++) {
            const dot = document.createElement('div');
            dot.className = 'wave-dot';
            dot.id = `wdot-${i}`;
            container.appendChild(dot);
        }
    }

    updateWaveDots() {
        for (let i = 1; i <= this.maxWaves; i++) {
            const dot = document.getElementById(`wdot-${i}`);
            if (!dot) continue;
            dot.className = 'wave-dot';
            if (i < this.wave) dot.classList.add('done');
            else if (i === this.wave) dot.classList.add('active');
        }
    }

    // ── Reactor Core Canvas Animation ──────────────────────────────────────────
    startCoreAnimation() {
        let t = 0;
        const draw = () => {
            this.coreAnimFrame = requestAnimationFrame(draw);
            t += 0.03;
            this.drawCore(t);
        };
        draw();
    }

    drawCore(t) {
        const ctx = this.coreCtx;
        const w = 120, h = 120, cx = 60, cy = 60;
        ctx.clearRect(0, 0, w, h);

        const heat = this.coreHeat / 100; // 0-1
        const danger = Math.max(0, (heat - 0.5) * 2); // 0-1 from 50% onwards
        // Core color: cool blue → yellow → red
        const r = Math.round(30 + heat * 220);
        const g = Math.round(180 - heat * 160);
        const b = Math.round(220 - heat * 210);

        // Outer pulse ring
        for (let ring = 3; ring >= 1; ring--) {
            const radius = 50 + Math.sin(t * (1 + ring * 0.3)) * (3 + ring * 2);
            const alpha = (0.08 + danger * 0.1) / ring;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Inner glow gradient
        const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 38);
        grd.addColorStop(0, `rgba(255,255,255,${0.6 + danger * 0.3})`);
        grd.addColorStop(0.3, `rgba(${r},${g},${b},0.9)`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0.1)`);
        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Rotating orbit lines
        for (let i = 0; i < 3; i++) {
            const angle = t * (0.8 + i * 0.4) + (i * Math.PI * 2 / 3);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, 45, 16 + i * 4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.25 + danger * 0.3})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            // Orbiting particle
            ctx.beginPath();
            ctx.arc(45, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.8 + Math.sin(t * 3) * 0.2})`;
            ctx.fill();
            ctx.restore();
        }

        // Danger warning flash
        if (danger > 0.4) {
            const flash = Math.abs(Math.sin(t * 6)) * danger * 0.3;
            ctx.beginPath();
            ctx.arc(cx, cy, 55, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,50,50,${flash})`;
            ctx.lineWidth = 6;
            ctx.stroke();
        }
    }

    updateCore() {
        const heatPct = Math.round((this.mistakes / this.maxMistakes) * 100);
        this.coreHeat = heatPct;
        const bar = document.getElementById('core-heat-bar');
        const label = document.getElementById('core-temp');
        if (bar) bar.style.width = `${heatPct}%`;
        if (label) label.textContent = `${heatPct}%`;
        // Color bar
        if (bar) {
            if (heatPct < 40) bar.style.background = 'linear-gradient(90deg,#22d3ee,#3b82f6)';
            else if (heatPct < 70) bar.style.background = 'linear-gradient(90deg,#f59e0b,#ef4444)';
            else bar.style.background = 'linear-gradient(90deg,#ef4444,#7f1d1d)';
        }
    }

    // ── XP System ──────────────────────────────────────────────────────────────
    addXP(amount) {
        this.xp += amount;
        let leveled = false;
        while (this.xp >= this.xpThreshold) {
            this.xp -= this.xpThreshold;
            this.xpLevel++;
            this.xpThreshold = Math.round(this.xpThreshold * 1.3);
            leveled = true;
        }
        const fill = document.getElementById('xp-fill');
        const text = document.getElementById('xp-text');
        const lvl = document.getElementById('xp-level');
        if (fill) fill.style.width = `${(this.xp / this.xpThreshold) * 100}%`;
        if (text) text.textContent = `${this.xp} / ${this.xpThreshold} XP`;
        if (lvl) lvl.textContent = this.xpLevel;
        if (leveled) this.showLevelUp();
    }

    showLevelUp() {
        const popup = document.getElementById('streak-popup');
        popup.className = 'streak-popup level-up show';
        popup.textContent = `⚡ LEVEL UP! LVL ${this.xpLevel}`;
        setTimeout(() => popup.classList.remove('show'), 2200);
        if (this.audioCtx) {
            setTimeout(() => this.playTone(600, 'sine', 0.15), 0);
            setTimeout(() => this.playTone(800, 'sine', 0.15), 120);
            setTimeout(() => this.playTone(1000, 'sine', 0.2), 240);
        }
    }

    // ── Streak System ──────────────────────────────────────────────────────────
    incrementStreak() {
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        const el = document.getElementById('streak-val');
        if (el) el.textContent = `${this.streak}🔥`;
        if (this.streak > 1) this.showStreakPopup();
        const box = document.getElementById('streak-box');
        if (box) {
            box.classList.remove('streak-active');
            void box.offsetWidth;
            box.classList.add('streak-active');
        }
    }

    resetStreak() {
        this.streak = 0;
        const el = document.getElementById('streak-val');
        if (el) el.textContent = `0🔥`;
        const box = document.getElementById('streak-box');
        if (box) box.classList.remove('streak-active');
    }

    showStreakPopup(custom) {
        const popup = document.getElementById('streak-popup');
        let msg;
        if (custom) {
            msg = custom;
        } else if (this.streak === 2) msg = '🔥 ON FIRE!';
        else if (this.streak === 3) msg = '⚡ UNSTOPPABLE!';
        else if (this.streak >= 5) msg = `🚀 ${this.streak}x MEGA STREAK!`;
        else msg = `🔥 ${this.streak}x STREAK!`;

        popup.className = 'streak-popup show';
        popup.textContent = msg;
        setTimeout(() => popup.classList.remove('show'), 1800);
    }

    // ── Particle Burst ─────────────────────────────────────────────────────────
    spawnParticles(x, y, color, count = 22) {
        const pc = document.getElementById('particle-canvas');
        if (!pc) return;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 3;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                alpha: 1,
                color,
                r: Math.random() * 6 + 3,
                gravity: 0.25
            });
        }
        if (!this.animFrame) this.runParticles();
    }

    runParticles() {
        const pc = document.getElementById('particle-canvas');
        if (!pc) return;
        const ctx = pc.getContext('2d');
        ctx.clearRect(0, 0, pc.width, pc.height);
        this.particles = this.particles.filter(p => p.alpha > 0.01);
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= 0.025;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        }
        if (this.particles.length > 0) {
            this.animFrame = requestAnimationFrame(() => this.runParticles());
        } else {
            ctx.clearRect(0, 0, pc.width, pc.height);
            this.animFrame = null;
        }
    }

    getBtnCenter(btn) {
        const rect = btn.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    // ── Question Generation ────────────────────────────────────────────────────
    generateQuestion() {
        const types = ['calorimetry', 'molar_enthalpy', 'hess_law', 'pe_diagram_ea', 'pe_diagram_dh'];
        const type = types[Math.floor(Math.random() * types.length)];

        let qText = "", dataText = "", correct = "", options = [];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'calorimetry') {
            const m = (Math.floor(Math.random() * 40) + 10) * 10;
            const dT = (Math.random() * 15 + 5).toFixed(1);
            const q = ((m * 4.19 * dT) / 1000).toFixed(2);

            dataText = `<strong>Mass of water (m):</strong> ${m} g<br><strong>Specific heat capacity (c):</strong> 4.19 J/(g·°C)<br><strong>Temperature change (ΔT):</strong> +${dT} °C`;
            qText = `Calculate the thermal energy (q) absorbed by the water in the calorimeter, in kilojoules (kJ).`;
            correct = `+${q} kJ`;
            options = [correct, `+${(q * 10).toFixed(2)} kJ`, `-${q} kJ`, `+${((m * 4.184 * dT) / 100).toFixed(2)} kJ`];
        }
        else if (type === 'molar_enthalpy') {
            const n = (Math.random() * 5 + 1).toFixed(2);
            const dH_mol = (Math.random() * 800 + 200).toFixed(1);
            const totalH = (n * dH_mol).toFixed(1);

            dataText = `<strong>Fuel Substance:</strong> Methane (CH<sub>4</sub>)<br><strong>Molar Enthalpy of Combustion (Δ<sub>c</sub>H):</strong> -${dH_mol} kJ/mol`;
            qText = `A reaction chamber precisely burns ${n} moles of the fuel. Determine the total enthalpy change (ΔH) for this reaction.`;
            correct = `-${totalH} kJ`;
            options = [correct, `+${totalH} kJ`, `-${(dH_mol / n).toFixed(1)} kJ`, `-${(totalH * 2).toFixed(1)} kJ`];
        }
        else if (type === 'hess_law') {
            const dH = (Math.random() * 300 + 50).toFixed(1);
            const factor = Math.floor(Math.random() * 3) + 2;

            dataText = `<strong>Reference Reaction:</strong><br>A(g) + 2B(g) &rightarrow; C(g) &nbsp;&nbsp;&nbsp; ΔH = -${dH} kJ`;
            qText = `Using Hess's Law, what is the enthalpy change for the reverse reaction scaled by a factor of ${factor}?<br><br><em>${factor}C(g) &rightarrow; ${factor}A(g) + ${factor * 2}B(g)</em>`;
            const newDH = (dH * factor).toFixed(1);
            correct = `+${newDH} kJ`;
            options = [correct, `-${newDH} kJ`, `+${dH} kJ`, `+${(dH / factor).toFixed(1)} kJ`];
        }
        else if (type === 'pe_diagram_ea') {
            const E_reactants = Math.floor(Math.random() * 50) + 20;
            const E_products = E_reactants + (Math.floor(Math.random() * 100) - 50);
            const E_activation = Math.floor(Math.random() * 150) + 80;
            const E_complex = E_reactants + E_activation;

            dataText = `<strong>Potential Energy Diagram Data:</strong><br>E<sub>p</sub>(reactants) = ${E_reactants} kJ<br>E<sub>p</sub>(activated complex) = ${E_complex} kJ<br>E<sub>p</sub>(products) = ${E_products} kJ`;
            qText = `Based on the provided energy levels, calculate the activation energy (E<sub>a</sub>) for the <em>forward</em> reaction.`;
            correct = `+${E_activation} kJ`;
            options = [correct, `+${E_complex} kJ`, `${(E_products - E_reactants) > 0 ? '+' : ''}${E_products - E_reactants} kJ`, `+${E_complex - E_products} kJ`];
        }
        else if (type === 'pe_diagram_dh') {
            const E_reactants = Math.floor(Math.random() * 80) + 50;
            const isExo = Math.random() > 0.5;
            const deltaH = Math.floor(Math.random() * 100) + 20;
            const E_products = isExo ? E_reactants - deltaH : E_reactants + deltaH;

            dataText = `<strong>Potential Energy Profile:</strong><br>E<sub>p</sub>(reactants) = ${E_reactants} kJ<br>E<sub>p</sub>(products) = ${E_products} kJ`;
            qText = `Calculate the enthalpy change (ΔH) for this reaction and classify it as endothermic or exothermic.`;
            correct = isExo ? `-${deltaH} kJ (Exothermic)` : `+${deltaH} kJ (Endothermic)`;
            options = [
                correct,
                isExo ? `+${deltaH} kJ (Endothermic)` : `-${deltaH} kJ (Exothermic)`,
                isExo ? `-${deltaH} kJ (Endothermic)` : `+${deltaH} kJ (Exothermic)`,
                isExo ? `+${E_reactants + E_products} kJ (Endothermic)` : `-${E_reactants + E_products} kJ (Exothermic)`
            ];
        }

        return { data: dataText, question: qText, options: shuffle(options.slice(0, 4)), answer: correct };
    }

    // ── Wave Flow ──────────────────────────────────────────────────────────────
    nextWave() {
        document.getElementById('wave-val').innerText = `${this.wave}/${this.maxWaves}`;
        document.getElementById('wave-badge').textContent = `WAVE ${this.wave}`;
        this.updateWaveDots();

        const gameData = this.generateQuestion();
        const panel = document.querySelector('.thermo-panel');
        if (panel) {
            panel.classList.remove('panel-enter');
            void panel.offsetWidth;
            panel.classList.add('panel-enter');
        }

        document.getElementById('data-display').innerHTML = gameData.data;
        document.getElementById('question-text').innerHTML = gameData.question;
        const optsContainer = document.getElementById('options-container');
        optsContainer.innerHTML = '';

        gameData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt;
            btn.style.animationDelay = `${idx * 80}ms`;
            btn.classList.add('btn-appear');
            btn.onclick = () => {
                this.initAudio();
                const isCorrect = (opt === gameData.answer);
                this.handleAnswer(btn, isCorrect, gameData.answer);
            };
            optsContainer.appendChild(btn);
        });
    }

    handleAnswer(btn, isCorrect, correctAnswer) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        const { x, y } = this.getBtnCenter(btn);

        if (isCorrect) {
            btn.classList.add('correct');
            this.playTone(600, 'sine', 0.15);
            this.incrementStreak();
            const streakBonus = Math.min(this.streak - 1, 5) * 20;
            const xpGained = this.xpPerWave + streakBonus;
            this.addXP(xpGained);
            this.showFloatingXP(btn, `+${xpGained} XP`);
            this.spawnParticles(x, y, '#10b981', 28);
            if (this.streak >= 2) this.playStreakSound(this.streak);
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.showWaveSummary(true, xpGained, () => this.nextWave());
            }, 900);
        } else {
            btn.classList.add('wrong');
            this.playTone(150, 'sawtooth', 0.3);
            buttons.forEach(b => { if (b.innerHTML === correctAnswer) b.classList.add('correct'); });
            this.spawnParticles(x, y, '#ef4444', 18);
            this.resetStreak();
            this.mistakes++;
            document.getElementById('health-val').innerText = `${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            this.updateCore();
            const hbox = document.getElementById('health-box');
            if (hbox) { hbox.classList.add('damage-shake'); setTimeout(() => hbox.classList.remove('damage-shake'), 500); }

            setTimeout(() => {
                if (this.mistakes >= this.maxMistakes) {
                    this.endGame(false);
                } else {
                    this.wave++;
                    if (this.wave > this.maxWaves) this.endGame(true);
                    else this.nextWave();
                }
            }, 2000);
        }
    }

    showFloatingXP(btn, text) {
        const rect = btn.getBoundingClientRect();
        const el = document.createElement('div');
        el.className = 'floating-xp';
        el.textContent = text;
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top = `${rect.top}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }

    showWaveSummary(win, xpGained, onContinue) {
        const modal = document.getElementById('waveSummaryModal');
        const badge = document.getElementById('ws-badge');
        const title = document.getElementById('ws-title');
        const stats = document.getElementById('ws-stats');
        const btn = document.getElementById('ws-continue-btn');

        badge.textContent = win ? '✓' : '✗';
        badge.style.background = win ? 'var(--success)' : 'var(--danger)';
        title.textContent = win ? 'Target Neutralized!' : 'Miscalculation';

        const streakText = this.streak > 1 ? `<div class="ws-stat"><span>🔥 Streak</span><strong>${this.streak}x</strong></div>` : '';
        stats.innerHTML = `
            <div class="ws-stat"><span>⚡ XP Gained</span><strong>+${xpGained}</strong></div>
            ${streakText}
            <div class="ws-stat"><span>🎯 Wave</span><strong>${this.wave - 1}/${this.maxWaves}</strong></div>
        `;

        modal.style.display = 'flex';

        const handler = () => {
            modal.style.display = 'none';
            btn.removeEventListener('click', handler);
            onContinue();
        };
        btn.addEventListener('click', handler);

        // Auto-dismiss after 3s if no click
        const autoTimer = setTimeout(() => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
                btn.removeEventListener('click', handler);
                onContinue();
            }
        }, 3000);
        btn.addEventListener('click', () => clearTimeout(autoTimer));
    }

    // ── End Game ───────────────────────────────────────────────────────────────
    endGame(win) {
        this.stopTimer();
        cancelAnimationFrame(this.coreAnimFrame);
        const modal = document.getElementById('endModal');
        const content = document.getElementById('endModalContent');
        const title = document.getElementById('end-title');
        const desc = document.getElementById('end-desc');
        const endStats = document.getElementById('end-stats');

        content.className = `modal-content ${win ? 'win' : 'lose'}`;
        title.innerText = win ? '⚡ Energy Targets Achieved!' : '💥 Core Depleted!';

        let timeStr = this.settings.timer === 'on'
            ? `${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s`
            : '—';

        desc.innerHTML = win
            ? `Exceptional work, Engineer. All thermochemical pathways have been stabilized.`
            : `Critical energy mismatch. Study your enthalpy laws and try again.`;

        const accuracy = Math.round(((this.maxWaves - this.mistakes) / this.maxWaves) * 100);
        endStats.innerHTML = `
            <div class="end-stat"><span>🎯 Accuracy</span><strong>${accuracy}%</strong></div>
            <div class="end-stat"><span>🔥 Best Streak</span><strong>${this.maxStreak}x</strong></div>
            <div class="end-stat"><span>⚡ Total XP</span><strong>${this.xpLevel > 1 ? `LVL ${this.xpLevel}` : `${this.xp} XP`}</strong></div>
            <div class="end-stat"><span>⏱ Time</span><strong>${timeStr}</strong></div>
        `;

        if (win) {
            setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
            setTimeout(() => this.playTone(600, 'sine', 0.2), 150);
            setTimeout(() => this.playTone(800, 'sine', 0.4), 300);
            // Fireworks burst
            const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
            this.spawnParticles(cx, cy, '#10b981', 40);
            setTimeout(() => this.spawnParticles(cx - 150, cy - 80, '#f59e0b', 30), 300);
            setTimeout(() => this.spawnParticles(cx + 150, cy - 80, '#3b82f6', 30), 600);
            this.saveProgress();
        } else {
            setTimeout(() => this.playTone(300, 'sawtooth', 0.2), 0);
            setTimeout(() => this.playTone(200, 'sawtooth', 0.4), 300);
        }

        modal.style.display = 'flex';
    }

    async saveProgress() {
        try {
            const fbModule = await import('/js/firebase-init.js');
            const { auth, db, collection, addDoc } = fbModule;
            if (auth && auth.currentUser) {
                await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                    title: "Thermochemical Trials",
                    time: this.elapsedSeconds,
                    mistakes: this.mistakes,
                    maxStreak: this.maxStreak,
                    xpLevel: this.xpLevel,
                    date: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn("Could not save progress.", error);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new ThermoTrialsGame());