import { BaseGame } from '/games/shared/base-game.js';
import { COMPOUNDS, REACTIONS } from './data.js';

class OrganicCompoundCracker extends BaseGame {
    constructor() {
        super("Compound Cracker & Reaction Classifier");
        this.level = 1;
        this.maxLevels = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        this.score = 0;
        this.streak = 0;
        this.timeRemaining = 25; // Timer limit for rapid rounds
        this.rapidInterval = null;

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        this.nextChallenge();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Compound Cracker & Reaction Classifier</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Stability: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="level-box">Lock: ${this.level}/${this.maxLevels}</div>
                    <div class="stat-box" id="score-box">Score: 0</div>
                </div>
            </header>
            <main class="game-container">
                <div class="cracker-grid">
                    
                    <!-- Decryption Sector (Visual Structures) -->
                    <div class="decryption-sector">
                        <div class="sector-header">
                            <span class="status-indicator animate-pulse"></span>
                            <span id="sector-title">DECRYPTION INTERFACE</span>
                            <span class="rapid-timer" id="rapid-timer" style="display: none;">TIME: 25s</span>
                        </div>
                        <div class="structure-board" id="structure-board">
                            <!-- SVG or equation rendered here -->
                        </div>
                        <div class="equation-readout" id="equation-readout" style="display: none;"></div>
                    </div>

                    <!-- Terminal Controls -->
                    <div class="terminal-panel">
                        <div class="locks-hud" id="locks-hud"></div>
                        <div class="terminal-display">
                            <div class="prompt-title" id="terminal-title">System Status: Awaiting Analysis...</div>
                            <div class="prompt-text" id="terminal-prompt">Analyze the structural diagram on the left to identify the compound.</div>
                        </div>
                        
                        <div class="choices-container" id="choices-container"></div>
                        <div class="feedback-log" id="feedback-log"></div>
                    </div>

                </div>
            </main>
        `;

        this.renderLocksHUD();
    }

    renderLocksHUD() {
        const hud = document.getElementById('locks-hud');
        hud.innerHTML = '';
        for (let i = 1; i <= this.maxLevels; i++) {
            const indicator = document.createElement('div');
            indicator.className = `lock-node ${i < this.level ? 'unlocked' : (i === this.level ? 'active' : '')}`;
            indicator.innerHTML = i < this.level ? '🔓' : '🔒';
            hud.appendChild(indicator);
        }
    }

    drawSkeletal(svgType, container) {
        const width = 250;
        const height = 180;
        let innerHTML = '';

        if (svgType === 'ethane') {
            innerHTML = `<line x1="75" y1="100" x2="175" y2="80" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />`;
        } 
        else if (svgType === 'ethene') {
            innerHTML = `
                <line x1="75" y1="94" x2="175" y2="74" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="75" y1="106" x2="175" y2="86" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
            `;
        } 
        else if (svgType === 'ethyne') {
            innerHTML = `
                <line x1="75" y1="88" x2="175" y2="68" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="75" y1="100" x2="175" y2="80" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="75" y1="112" x2="175" y2="92" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
            `;
        } 
        else if (svgType === 'propane') {
            innerHTML = `
                <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
            `;
        } 
        else if (svgType === 'propene') {
            innerHTML = `
                <line x1="50" y1="107" x2="125" y2="57" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="50" y1="117" x2="125" y2="67" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="125" y1="62" x2="200" y2="112" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
            `;
        } 
        else if (svgType === 'propanol') {
            innerHTML = `
                <line x1="40" y1="110" x2="100" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="100" y1="65" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="160" y1="110" x2="210" y2="75" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="212" y="70" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
            `;
        } 
        else if (svgType === 'propanoic_acid') {
            innerHTML = `
                <line x1="40" y1="110" x2="100" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="100" y1="65" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="156" y1="110" x2="156" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="164" y1="110" x2="164" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="153" y="32" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                <line x1="160" y1="110" x2="210" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="214" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
            `;
        } 
        else if (svgType === 'bromoethane') {
            innerHTML = `
                <line x1="60" y1="110" x2="140" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="140" y1="65" x2="200" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="204" y="112" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">Br</text>
            `;
        } 
        else if (svgType === 'ethyl_ethanoate') {
            innerHTML = `
                <line x1="30" y1="110" x2="80" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="77" y1="70" x2="77" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="83" y1="70" x2="83" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="75" y="15" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                <line x1="80" y1="70" x2="130" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <text x="134" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                <line x1="150" y1="110" x2="190" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                <line x1="190" y1="70" x2="230" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
            `;
        }

        container.innerHTML = `
            <svg class="skeletal-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                ${innerHTML}
            </svg>
        `;
    }

    nextChallenge() {
        this.renderLocksHUD();
        document.getElementById('feedback-log').style.display = 'none';
        document.getElementById('equation-readout').style.display = 'none';
        
        // Handle Rapid-Fire timer
        if (this.level === 10) {
            this.startRapidTimer();
        } else {
            this.stopRapidTimer();
        }

        if (this.level <= 3) {
            this.setupCompoundCrackerPhase();
        } else if (this.level <= 6) {
            this.setupReactionClassifierPhase();
        } else if (this.level <= 9) {
            this.setupUnifiedPathwayPhase();
        } else {
            this.setupRapidFirePhase();
        }
    }

    startRapidTimer() {
        const timerLabel = document.getElementById('rapid-timer');
        timerLabel.style.display = 'block';
        this.timeRemaining = 25;
        timerLabel.innerText = `TIME: ${this.timeRemaining}s`;

        clearInterval(this.rapidInterval);
        this.rapidInterval = setInterval(() => {
            this.timeRemaining--;
            timerLabel.innerText = `TIME: ${this.timeRemaining}s`;
            if (this.timeRemaining <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    stopRapidTimer() {
        clearInterval(this.rapidInterval);
        document.getElementById('rapid-timer').style.display = 'none';
    }

    handleTimeout() {
        this.stopRapidTimer();
        this.initAudio();
        this.playMiss();
        this.mistakes++;
        document.getElementById('health-box').innerText = `Stability: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
        
        this.logFeedback("Decryption cycle timed out! Firewalls reset.", "error");

        setTimeout(() => {
            if (this.mistakes >= this.maxMistakes) this.endGame(false);
            else this.nextChallenge();
        }, 2000);
    }

    // --- PHASE 1: COMPOUND CRACKER (Nomenclature) ---
    setupCompoundCrackerPhase() {
        document.getElementById('sector-title').innerText = "LOCK CODES: NOMENCLATURE DECRYPTION";
        document.getElementById('terminal-title').innerText = "Compound Lock Activated";
        document.getElementById('terminal-prompt').innerText = "Translate the skeletal structural diagram to decrypt the compound IUPAC name.";

        const target = COMPOUNDS[Math.floor(Math.random() * COMPOUNDS.length)];
        this.currentChallenge = { type: 'naming', data: target, answer: target.name };

        const board = document.getElementById('structure-board');
        this.drawSkeletal(target.svgType, board);

        this.renderChoices(target.name, target.distractors);
    }

    // --- PHASE 2: REACTION CLASSIFIER ---
    setupReactionClassifierPhase() {
        document.getElementById('sector-title').innerText = "LOCK CODES: REACTION PATHWAY CODES";
        document.getElementById('terminal-title').innerText = "Pathway Lock Activated";
        document.getElementById('terminal-prompt').innerText = "Classify this reaction pathway based on structural changes.";

        const target = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
        this.currentChallenge = { type: 'classification', data: target, answer: target.type };

        const board = document.getElementById('structure-board');
        board.innerHTML = `<div class="reaction-formula">${target.equation}</div>`;

        this.renderChoices(target.type, target.distractors);
    }

    // --- PHASE 3: UNIFIED PATHWAYS ---
    setupUnifiedPathwayPhase() {
        document.getElementById('sector-title').innerText = "LOCK CODES: INTEGRATED PIPELINE";
        
        // Unified Phase has two sub-steps:
        // Step 1: Identify compound reactant/product name
        // Step 2: Classify the pathway reaction type
        const reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
        const reactant = COMPOUNDS.find(c => c.id === reaction.reactant);

        this.currentChallenge = { 
            type: 'pipeline-step1', 
            reaction: reaction, 
            reactant: reactant,
            answer: reactant.name 
        };

        document.getElementById('terminal-title').innerText = "Unified Pipeline: Identify Molecule";
        document.getElementById('terminal-prompt').innerHTML = `Examine the reaction equation. Identify the reactant molecule: <br><br><span class="highlight-eq">${reaction.equation.split(' ')[0]}</span>`;

        const board = document.getElementById('structure-board');
        this.drawSkeletal(reactant.svgType, board);

        this.renderChoices(reactant.name, reactant.distractors);
    }

    advancePipelineStep2() {
        const reaction = this.currentChallenge.reaction;
        this.currentChallenge.type = 'pipeline-step2';
        this.currentChallenge.answer = reaction.type;

        document.getElementById('terminal-title').innerText = "Unified Pipeline: Classify Pathway";
        document.getElementById('terminal-prompt').innerText = "Specify the reaction pathway mechanism for this process.";

        const board = document.getElementById('structure-board');
        board.innerHTML = `<div class="reaction-formula">${reaction.equation}</div>`;

        this.renderChoices(reaction.type, reaction.distractors);
    }

    // --- PHASE 4: RAPID FIRE ROUND ---
    setupRapidFirePhase() {
        document.getElementById('sector-title').innerText = "ALARM SYSTEM: BREACH MITIGATION CYCLE";
        document.getElementById('terminal-title').innerText = "OVERLOAD ALERT - AUTOMATED FIREWALLS";
        document.getElementById('terminal-prompt').innerText = "Deconstruct the formula or classify the reaction before lockout.";

        const isNamingChallenge = Math.random() > 0.5;
        if (isNamingChallenge) {
            const target = COMPOUNDS[Math.floor(Math.random() * COMPOUNDS.length)];
            this.currentChallenge = { type: 'rapid-naming', data: target, answer: target.name };
            
            const board = document.getElementById('structure-board');
            board.innerHTML = `<div class="rapid-formula">${target.condensed}<br><small>(${target.formula})</small></div>`;
            this.renderChoices(target.name, target.distractors);
        } else {
            const target = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            this.currentChallenge = { type: 'rapid-class', data: target, answer: target.type };

            const board = document.getElementById('structure-board');
            board.innerHTML = `<div class="reaction-formula">${target.equation}</div>`;
            this.renderChoices(target.type, target.distractors);
        }
    }

    renderChoices(correct, distractors) {
        const container = document.getElementById('choices-container');
        container.innerHTML = '';

        const pool = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3);
        pool.push(correct);
        const choices = pool.sort(() => Math.random() - 0.5);

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = choice;
            btn.onclick = () => this.handleSelection(btn, choice);
            container.appendChild(btn);
        });
    }

    handleSelection(btn, selected) {
        this.initAudio();
        const correct = this.currentChallenge.answer;

        const isCorrect = (selected === correct);

        if (isCorrect) {
            this.playHit();
            btn.classList.add('correct');
            this.score += this.level === 10 ? 250 : 150;
            this.streak++;
            document.getElementById('score-box').innerText = `Score: ${this.score}`;
            
            this.logFeedback("Decryption key matching... Verified!", "success");

            document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

            setTimeout(() => {
                if (this.currentChallenge.type === 'pipeline-step1') {
                    this.advancePipelineStep2();
                } else {
                    this.level++;
                    if (this.level > this.maxLevels) {
                        this.endGame(true);
                    } else {
                        this.nextChallenge();
                    }
                }
            }, 1200);

        } else {
            this.playMiss();
            btn.classList.add('wrong');
            this.mistakes++;
            this.streak = 0;
            document.getElementById('health-box').innerText = `Stability: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            // Highlight correct choice
            document.querySelectorAll('.choice-btn').forEach(b => {
                if (b.innerHTML === correct) b.classList.add('correct');
                b.disabled = true;
            });

            this.logFeedback(`Decryption mismatched. True key sequence: ${correct}`, "error");

            setTimeout(() => {
                if (this.mistakes >= this.maxMistakes) {
                    this.endGame(false);
                } else {
                    this.level++;
                    if (this.level > this.maxLevels) {
                        this.endGame(true);
                    } else {
                        this.nextChallenge();
                    }
                }
            }, 2200);
        }
    }

    logFeedback(msg, status) {
        const log = document.getElementById('feedback-log');
        log.style.display = 'block';
        log.innerText = `> ${msg}`;
        log.className = `feedback-log ${status === 'success' ? 'verified' : 'breached'}`;
    }

    endGame(win) {
        this.stopRapidTimer();
        this.stopTimer();

        const report = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        
        const desc = win 
            ? `Decryption accomplished! You safely unlocked all compound files and stabilized the molecular lock controls with a score of ${this.score} pts.${timeStr}`
            : `Facility lockout activated. Unstable reactions and compromised naming sequences triggered structural isolation safety measures.`;

        report.show(
            win ? 'Decryption Completed!' : 'System Fault Lockout',
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

window.addEventListener('DOMContentLoaded', () => new OrganicCompoundCracker());