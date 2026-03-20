import { BaseGame } from '/games/shared/base-game.js';

class AcidAllianceGame extends BaseGame {
    constructor() {
        super("Acid Alliance"); 
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5; // Reduced max mistakes to fit defense pacing
        
        this.isPlaying = true;
        this.currentEnemy = null;
        this.projectiles = [];
        this.lastTime = performance.now();
        this.animate = this.animate.bind(this);
        
        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        
        // Start animation loop
        requestAnimationFrame(this.animate);
        
        this.nextWave();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Acid Alliance</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Core Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Threat Wave: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="defense-panel">
                    
                    <div class="defense-grid" id="defense-grid">
                        <div class="grid-lines"></div>
                        <div class="core-base" id="core-base">
                            <div class="core-glow"></div>
                            <div class="turret"></div>
                        </div>
                        <div class="track-area" id="track-area">
                            <!-- Enemies and projectiles injected here -->
                        </div>
                    </div>

                    <div class="armory-panel">
                        <div class="armory-header" id="armory-header">⚠️ Incoming Threat — Select Neutralizing Agent:</div>
                        <div class="options-grid" id="options-container"></div>
                    </div>
                    
                </div>
            </main>
        `;
    }

    generateQuestion() {
        const types = ['ph_calc', 'poh_calc', 'conjugate', 'titration', 'buffer', 'strong_weak', 'neutralization'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let qText = "", correct = "", options = [];
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        if (type === 'ph_calc') {
            const exp = Math.floor(Math.random() * 4) + 2; 
            const coeff = (Math.random() * 8 + 1).toFixed(1); 
            const concStr = coeff + " × 10<sup>-" + exp + "</sup>";
            const concNum = parseFloat(coeff) * Math.pow(10, -exp);
            const ph = (-Math.log10(concNum)).toFixed(2);
            
            qText = `<b>Threat:</b> [H<sub>3</sub>O<sup>+</sup>] = ${concStr} M<br><b>Action:</b> Neutralize to pH`;
            correct = ph;
            options = [
                correct, 
                (-Math.log10(concNum) + 1).toFixed(2), 
                (-Math.log10(concNum) - 1).toFixed(2), 
                (14 - (-Math.log10(concNum))).toFixed(2)
            ];
        } 
        else if (type === 'poh_calc') {
            const exp = Math.floor(Math.random() * 4) + 2;
            const coeff = (Math.random() * 8 + 1).toFixed(1);
            const concStr = coeff + " × 10<sup>-" + exp + "</sup>";
            const concNum = parseFloat(coeff) * Math.pow(10, -exp);
            const poh = (-Math.log10(concNum)).toFixed(2);
            const ph = (14 - parseFloat(poh)).toFixed(2);
            
            qText = `<b>Threat (Alkaline):</b> [OH<sup>-</sup>] = ${concStr} M<br><b>Action:</b> Determine pH`;
            correct = ph;
            options = [
                correct, 
                poh, 
                (parseFloat(ph) - 1).toFixed(2), 
                (parseFloat(poh) + 1).toFixed(2)
            ];
        }
        else if (type === 'conjugate') {
            const pairs = [
                { acid: "CH<sub>3</sub>COOH", base: "CH<sub>3</sub>COO<sup>-</sup>" },
                { acid: "H<sub>2</sub>CO<sub>3</sub>", base: "HCO<sub>3</sub><sup>-</sup>" },
                { acid: "NH<sub>4</sub><sup>+</sup>", base: "NH<sub>3</sub>" },
                { acid: "H<sub>3</sub>PO<sub>4</sub>", base: "H<sub>2</sub>PO<sub>4</sub><sup>-</sup>" },
                { acid: "H<sub>2</sub>SO<sub>4</sub>", base: "HSO<sub>4</sub><sup>-</sup>" }
            ];
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const isAcid = Math.random() > 0.5;
            
            if (isAcid) {
                qText = `<b>Target:</b> ${pair.acid}<br><b>Action:</b> Deploy Conjugate Base`;
                correct = pair.base;
                options = [correct, pair.acid + "H<sup>+</sup>", pair.acid.replace("H", ""), "OH<sup>-</sup>"];
            } else {
                qText = `<b>Target:</b> ${pair.base}<br><b>Action:</b> Deploy Conjugate Acid`;
                correct = pair.acid;
                options = [correct, pair.base.replace("<sup>-</sup>", "<sup>2-</sup>").replace("NH<sub>3</sub>", "NH<sub>2</sub><sup>-</sup>"), pair.base.replace("H", ""), "H<sub>3</sub>O<sup>+</sup>"];
            }
        }
        else if (type === 'titration') {
            const isStrongBase = Math.random() > 0.5;
            if (isStrongBase) {
                qText = `<b>Threat:</b> Weak Acid titrated with Strong Base<br><b>Action:</b> Predict Eq. Point pH`;
                correct = "pH > 7.00";
                options = [correct, "pH < 7.00", "pH = 7.00", "Depends on indicator"];
            } else {
                qText = `<b>Threat:</b> Weak Base titrated with Strong Acid<br><b>Action:</b> Predict Eq. Point pH`;
                correct = "pH < 7.00";
                options = [correct, "pH > 7.00", "pH = 7.00", "Depends on indicator"];
            }
        }
        else if (type === 'buffer') {
            qText = `<b>Threat:</b> Severe pH Fluctuations<br><b>Action:</b> Deploy Buffer System`;
            correct = "Weak Acid + Conjugate Base";
            options = [
                correct, 
                "Strong Acid + Strong Base", 
                "Weak Acid + Strong Acid", 
                "Two Weak Bases"
            ];
        }
        else if (type === 'strong_weak') {
            qText = `<b>Threat:</b> Unknown Acid (100% Ionization)<br><b>Action:</b> Classify Agent`;
            correct = "Strong Acid";
            options = [correct, "Weak Acid", "Concentrated Acid", "Dilute Acid"];
        }
        else if (type === 'neutralization') {
            const v1 = Math.floor(Math.random() * 20) + 10;
            const m1 = (Math.random() * 0.5 + 0.1).toFixed(2);
            const v2 = Math.floor(Math.random() * 20) + 10;
            const m2 = ((m1 * v1) / v2).toFixed(2);
            
            qText = `<b>Threat:</b> ${v2}mL NaOH neutralized by ${v1}mL of ${m1}M HCl<br><b>Action:</b> Find [NaOH]`;
            correct = `${m2} M`;
            
            options = [
                correct,
                `${((m1 * v2) / v1).toFixed(2)} M`,
                `${(m1 * v1 * v2).toFixed(2)} M`,
                `${(parseFloat(m1) / 2).toFixed(2)} M`
            ];
        }

        let uniqueOptions = [...new Set(options)];
        while (uniqueOptions.length < 4) {
            uniqueOptions.push((Math.random() * 14).toFixed(2) + (type === 'neutralization' ? ' M' : ''));
            uniqueOptions = [...new Set(uniqueOptions)];
        }

        return { question: qText, options: shuffle(uniqueOptions.slice(0, 4)), answer: correct };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Threat Wave: ${this.wave}/${this.maxWaves}`;
        const data = this.generateQuestion();
        
        // Spawn Enemy
        const trackArea = document.getElementById('track-area');
        const enemyEl = document.createElement('div');
        enemyEl.className = 'enemy-card';
        enemyEl.innerHTML = data.question;
        trackArea.appendChild(enemyEl);
        
        // Speed increases slightly each wave
        const speed = 3.5 + (this.wave * 0.4); 
        this.currentEnemy = { el: enemyEl, x: 90, speed: speed, isDead: false };
        
        // Setup Armory Options
        const optsContainer = document.getElementById('options-container');
        optsContainer.innerHTML = '';
        
        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = opt;
            btn.onclick = () => {
                if (!this.currentEnemy || this.currentEnemy.isDead) return;
                
                this.initAudio();
                const isCorrect = (opt === data.answer);
                this.fireProjectile(btn, isCorrect, data.answer);
            };
            optsContainer.appendChild(btn);
        });
    }

    fireProjectile(btn, isCorrect, correctAnswer) {
        // Cooldown to prevent spamming
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        setTimeout(() => {
            if (this.isPlaying && this.currentEnemy && !this.currentEnemy.isDead) {
                buttons.forEach(b => b.disabled = false);
            }
        }, 600);

        // Spawn visual projectile
        const trackArea = document.getElementById('track-area');
        const projEl = document.createElement('div');
        projEl.className = isCorrect ? 'projectile correct-proj' : 'projectile wrong-proj';
        trackArea.appendChild(projEl);

        this.projectiles.push({
            el: projEl,
            x: 10, // Starts at the core
            speed: 80, // Very fast
            isCorrect: isCorrect,
            correctAnswer: correctAnswer,
            btn: btn
        });
    }

    animate(time) {
        if (!this.isPlaying) return;
        requestAnimationFrame(this.animate);
        
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Move Enemy
        if (this.currentEnemy && !this.currentEnemy.isDead) {
            this.currentEnemy.x -= this.currentEnemy.speed * dt;
            this.currentEnemy.el.style.left = `${this.currentEnemy.x}%`;

            if (this.currentEnemy.x <= 10) {
                this.handleEnemyImpact();
            }
        }

        // Move Projectiles & Check Collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.speed * dt;
            
            if (p.el) p.el.style.left = `${p.x}%`;

            // Collision check
            if (this.currentEnemy && !this.currentEnemy.isDead && p.x + 5 >= this.currentEnemy.x) {
                this.handleCollision(p);
                this.projectiles.splice(i, 1);
            } 
            // Off screen
            else if (p.x > 100) {
                if (p.el) p.el.remove();
                this.projectiles.splice(i, 1);
            }
        }
    }

    handleCollision(projectile) {
        if (projectile.el) projectile.el.remove();
        
        if (projectile.isCorrect) {
            this.playHit();
            projectile.btn.classList.add('correct');
            
            this.currentEnemy.isDead = true;
            this.currentEnemy.el.classList.add('explode');
            
            // Disable all buttons
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

            setTimeout(() => {
                if (this.currentEnemy && this.currentEnemy.el) this.currentEnemy.el.remove();
                this.currentEnemy = null;
                
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1000);
            
        } else {
            this.playMiss();
            projectile.btn.classList.add('wrong');
            
            // Deflect visual on enemy
            this.currentEnemy.el.classList.add('deflect');
            setTimeout(() => {
                if (this.currentEnemy && this.currentEnemy.el) this.currentEnemy.el.classList.remove('deflect');
            }, 300);

            this.mistakes++;
            document.getElementById('health-box').innerText = `Core Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            if (this.mistakes >= this.maxMistakes) {
                // Highlight correct answer before dying
                document.querySelectorAll('.option-btn').forEach(b => {
                    if (b.innerHTML === projectile.correctAnswer) b.classList.add('correct');
                });
                this.endGame(false);
            }
        }
    }

    handleEnemyImpact() {
        this.playMiss();
        this.currentEnemy.isDead = true;
        this.currentEnemy.el.classList.add('explode-core');
        
        const coreBase = document.getElementById('core-base');
        coreBase.classList.add('shake-core');
        setTimeout(() => coreBase.classList.remove('shake-core'), 500);

        this.mistakes++;
        document.getElementById('health-box').innerText = `Core Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
        
        // Disable buttons
        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

        setTimeout(() => {
            if (this.currentEnemy && this.currentEnemy.el) this.currentEnemy.el.remove();
            this.currentEnemy = null;
            
            if (this.mistakes >= this.maxMistakes) {
                this.endGame(false);
            } else {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }
        }, 1000);
    }

    endGame(win) {
        this.isPlaying = false;
        this.stopTimer();
        const modal = document.querySelector('game-report-modal');
        
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        const desc = win 
            ? `Excellent work, Commander. You neutralized the threats and protected the core with ${this.mistakes} mistakes.${timeStr}`
            : `System integrity compromised. The toxic spills breached the defense grid.`;

        modal.show(
            win ? 'Grid Secured!' : 'Defense Failure!', 
            desc, 
            win, 
            '/Chemistry.html'
        );

        if (win) {
            this.playVictory();
            this.saveProgress(this.mistakes);
        } else {
            this.playGameOver();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new AcidAllianceGame());