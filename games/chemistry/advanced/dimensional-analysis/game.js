import { BaseGame } from '/games/shared/base-game.js';
import { PuzzleGenerator } from './generator.js';

export class DimensionalAnalysisGame extends BaseGame {
    constructor() {
        super("Dimensional Analysis 2.0");
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        
        this.mode = null; 
        this.difficulty = null; 
        
        this.currentLevel = 0;
        this.chain = [];
        this.hand = [];
        this.aiHand = [];
        this.deck = [];
        this.isPlayerTurn = true;
        this.gameActive = false;
        
        this.aiTimeout = null;
        this.levelTransitionTimeout = null;

        this.startUnit = '';
        this.targetUnit = '';

        this.hintsEnabled = true;

        this.generator = new PuzzleGenerator();

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Dimensional Analysis 2.0</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="mistakes-box" style="display:none;">Mistakes: 0/${this.maxMistakes}</div>
                    <div class="stat-box" id="level-box" style="display:none;">Level: 1</div>
                </div>
            </header>
            <main class="da-container">
                <div id="da-menu" class="da-panel">
                    <h2 class="da-title">Select Protocol</h2>
                    <div class="da-menu-grid">
                        <div class="da-mode-card" onclick="document.getElementById('mode-puzzle').click()">
                            <h3>🧩 Puzzle Mode</h3>
                            <p>Assemble valid conversion chains to reach target units. Master the core mechanics of dimensional analysis.</p>
                            <input type="radio" name="da-mode" id="mode-puzzle" value="puzzle" checked style="display:none;">
                        </div>
                        <div class="da-mode-card" onclick="document.getElementById('mode-faceoff').click()">
                            <h3>⚔️ Faceoff Mode</h3>
                            <p>Compete against the AI in a strategic race. Be the one to place the final conversion domino!</p>
                            <input type="radio" name="da-mode" id="mode-faceoff" value="faceoff" style="display:none;">
                        </div>
                    </div>
                    
                    <h2 class="da-title" style="margin-top: 2rem;">Select Complexity</h2>
                    <div class="da-difficulty-grid">
                        <button class="da-btn da-diff-btn" data-diff="beginner">Beginner (Shapes)</button>
                        <button class="da-btn da-diff-btn" data-diff="intermediate">Intermediate (Units)</button>
                        <button class="da-btn da-diff-btn" data-diff="advanced">Advanced (Stoich)</button>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1.75rem;">
                        <label for="hints-toggle" style="font-weight: 600; color: var(--da-text); cursor: pointer; user-select: none;">
                            💡 Hint Glow
                        </label>
                        <button id="hints-toggle" class="da-btn" style="padding: 0.4rem 1rem; font-size: 0.9rem; min-width: 80px;" aria-pressed="true">ON</button>
                    </div>
                </div>

                <div id="da-game" class="da-panel" style="display: none; position: relative;">
                    
                    <div style="display: flex; justify-content: flex-start; margin-bottom: 1rem; margin-top: -1rem;">
                        <button class="da-btn" id="btn-return-menu" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: transparent; border-color: var(--da-border); color: var(--da-text);">
                            ↩ Change Protocol
                        </button>
                    </div>

                    <div class="da-target-banner" id="da-target-banner">
                        Objective: Convert to <strong id="da-target-unit" class="target-highlight">cm</strong>
                    </div>

                    <div class="da-chain-area" id="da-chain-area">
                        <!-- Chain dominoes go here -->
                    </div>

                    <div class="da-faceoff-hud" id="da-faceoff-hud" style="display:none;">
                        <div>AI Opponent Cards: <span id="ai-card-count">0</span></div>
                        <button class="da-btn" id="btn-draw" style="padding: 0.5rem 1rem;">Draw Domino</button>
                    </div>

                    <div class="da-hand-header" id="da-hand-header">Your Conversions (Drag or Click to Play, 🔃 to Flip)</div>
                    <div class="da-hand-area" id="da-hand-area">
                        <!-- Hand dominoes go here -->
                    </div>

                    <div id="da-toast-container" class="da-toast-container"></div>
                </div>
            </main>
        `;

        document.querySelectorAll('.da-diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mode = document.querySelector('input[name="da-mode"]:checked').value;
                this.difficulty = e.target.getAttribute('data-diff');
                this.startGame();
            });
        });
        
        document.querySelectorAll('.da-mode-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.da-mode-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
        document.querySelector('.da-mode-card').classList.add('active');
        
        document.getElementById('btn-draw').addEventListener('click', () => this.drawDomino(true));
        document.getElementById('btn-return-menu').addEventListener('click', () => this.returnToMenu());

        document.getElementById('hints-toggle').addEventListener('click', (e) => {
            this.hintsEnabled = !this.hintsEnabled;
            e.target.textContent = this.hintsEnabled ? 'ON' : 'OFF';
            e.target.setAttribute('aria-pressed', this.hintsEnabled);
            e.target.style.background = this.hintsEnabled ? '' : 'transparent';
        });
    }

    showToast(msg, type = 'info') {
        const container = document.getElementById('da-toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `da-toast toast-${type}`;
        toast.innerHTML = msg;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    returnToMenu() {
        this.gameActive = false;
        
        clearTimeout(this.aiTimeout);
        clearTimeout(this.levelTransitionTimeout);
        
        document.getElementById('da-game').style.display = 'none';
        document.getElementById('da-menu').style.display = 'flex';
        document.getElementById('mistakes-box').style.display = 'none';
        document.getElementById('level-box').style.display = 'none';
        
        document.body.classList.remove('theme-beginner', 'theme-intermediate', 'theme-advanced');
    }

    startGame() {
        this.gameActive = true;
        document.getElementById('da-menu').style.display = 'none';
        document.getElementById('da-game').style.display = 'flex';
        document.getElementById('mistakes-box').style.display = 'block';
        document.getElementById('level-box').style.display = 'block';

        document.body.classList.remove('theme-beginner', 'theme-intermediate', 'theme-advanced');
        document.body.classList.add(`theme-${this.difficulty}`);

        this.currentLevel = 0;
        this.mistakes = 0;
        this.updateStats();

        if (this.mode === 'puzzle') {
            document.getElementById('da-faceoff-hud').style.display = 'none';
            this.loadPuzzle();
        } else {
            document.getElementById('da-faceoff-hud').style.display = 'flex';
            document.getElementById('da-hand-header').innerText = "Your Conversions (Drag or Click to Play, 🔃 to Flip)";
            this.loadFaceoff();
        }
    }

    updateStats() {
        document.getElementById('mistakes-box').innerText = `Mistakes: ${this.mistakes}/${this.maxMistakes}`;
        document.getElementById('level-box').innerText = `Level: ${this.currentLevel + 1}`;
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    getUnit(str) {
        return str.replace(/^[0-9\.\s×eE\+\-⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/, '').trim();
    }

    generatePuzzleData() {
        if (this.difficulty === 'beginner') return this.generator.genBeginner(this.currentLevel);
        if (this.difficulty === 'intermediate') return this.generator.genIntermediate(this.currentLevel);
        return this.generator.genAdvanced(this.currentLevel);
    }

    // --- PUZZLE MODE LOGIC ---
    
    loadPuzzle() {
        if (this.currentLevel >= 10) {
            return this.endGame(true);
        }

        const p = this.generatePuzzleData();
        this.chain = [];
        this.hand = [];
        this.isPlayerTurn = true;
        
        this.startUnit = p.start;
        this.targetUnit = p.target;

        document.getElementById('da-target-unit').innerText = this.targetUnit;

        const allDominoes = [...p.hand, ...p.distractors];
        allDominoes.forEach(d => {
            let top = d.t;
            let bottom = d.b;
            if (d.flipped) { top = d.b; bottom = d.t; }
            this.hand.push({ id: this.generateId(), top, bottom });
        });
        
        this.hand.sort(() => Math.random() - 0.5);

        this.renderChain();
        this.renderHand();
    }

    // --- FACEOFF MODE LOGIC ---

    loadFaceoff() {
        if (this.currentLevel >= 3) {
            return this.endGame(true);
        }

        this.chain = [];
        this.hand = [];
        this.aiHand = [];
        this.deck = [];
        this.isPlayerTurn = true;

        const p = this.generatePuzzleData();
        
        this.startUnit = p.start;
        this.targetUnit = p.target;
        this.faceoffPath = p.hand;
        this.faceoffDistractors = p.distractors;

        document.getElementById('da-target-unit').innerText = this.targetUnit;

        this.fillDeck();

        for(let i=0; i<5; i++) {
            this.hand.push(this.deck.pop());
            this.aiHand.push(this.deck.pop());
        }

        this.renderChain();
        this.renderHand();
        this.updateFaceoffHUD();
    }

    fillDeck() {
        for (let i = 0; i < 3; i++) {
            this.faceoffPath.forEach(step => {
                let top = step.t;
                let bottom = step.b;
                if (step.flipped) { top = step.b; bottom = step.t; }
                this.deck.push({ id: this.generateId(), top, bottom });
            });
        }
        
        if (this.faceoffDistractors) {
            for (let i = 0; i < 2; i++) {
                this.faceoffDistractors.forEach(dist => {
                    let top = dist.t;
                    let bottom = dist.b;
                    if (dist.flipped) { top = dist.b; bottom = dist.t; }
                    this.deck.push({ id: this.generateId(), top, bottom });
                });
            }
        }
        
        this.deck.sort(() => Math.random() - 0.5);
    }

    drawDomino(isPlayer) {
        if (!this.gameActive) return;
        if (this.deck.length === 0) this.fillDeck();
        
        if (isPlayer && this.isPlayerTurn) {
            this.initAudio();
            this.hand.push(this.deck.pop());
            this.isPlayerTurn = false;
            this.renderHand();
            this.updateFaceoffHUD();
            this.showToast("You drew a card.", "info");
            this.aiTimeout = setTimeout(() => this.playAITurn(), 1500);
        } else if (!isPlayer) {
            this.aiHand.push(this.deck.pop());
            this.updateFaceoffHUD();
        }
    }

    updateFaceoffHUD() {
        if (this.mode !== 'faceoff') return;
        document.getElementById('ai-card-count').innerText = this.aiHand.length;
        
        const drawBtn = document.getElementById('btn-draw');
        drawBtn.disabled = !this.isPlayerTurn;
        
        const hud = document.getElementById('da-faceoff-hud');
        if (this.isPlayerTurn) {
            hud.style.borderColor = 'var(--da-primary)';
            drawBtn.innerText = `Draw Domino`;
        } else {
            hud.style.borderColor = '#ef4444';
            drawBtn.innerText = "AI is thinking...";
        }
    }

    playAITurn() {
        if (!this.gameActive || this.mode !== 'faceoff') return;

        const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
        const requiredUnit = this.getUnit(currentLead);

        let playedIdx = -1;
        let needsFlip = false;

        for (let i = 0; i < this.aiHand.length; i++) {
            const d = this.aiHand[i];
            if (this.getUnit(d.bottom) === requiredUnit) { playedIdx = i; break; }
            if (this.getUnit(d.top) === requiredUnit) { playedIdx = i; needsFlip = true; break; }
        }

        if (playedIdx !== -1) {
            const d = this.aiHand.splice(playedIdx, 1)[0];
            if (needsFlip) {
                const temp = d.top; d.top = d.bottom; d.bottom = temp;
            }
            d.isNew = true; 
            this.chain.push(d);
            this.initAudio();
            this.playHit();
            this.showToast("AI placed a conversion!", "ai");
            this.renderChain();
            
            if (this.getUnit(d.top) === this.getUnit(this.targetUnit)) {
                this.playGameOver();
                this.showToast("AI reached the target first!", "error");
                
                const banner = document.getElementById('da-target-banner');
                if (banner) banner.classList.add('failed');

                this.mistakes++;
                this.updateStats();
                this.levelTransitionTimeout = setTimeout(() => {
                    if (!this.gameActive) return;
                    if (banner) banner.classList.remove('failed');
                    if (this.mistakes >= this.maxMistakes) this.endGame(false);
                    else {
                        this.currentLevel++;
                        this.loadFaceoff();
                    }
                }, 3000);
                return;
            }
        } else {
            this.showToast("AI drew a card.", "ai");
            this.drawDomino(false);
        }

        this.isPlayerTurn = true;
        this.updateFaceoffHUD();
        this.renderChain();
        this.renderHand();
    }

    // --- PUZZLE SOLVABILITY CHECK ---

    isPuzzleSolvable(remainingHand, currentLeadUnit, targetUnit) {
        // BFS over remaining dominoes treated as a directed graph.
        // Each domino can be used in either orientation (player can flip).
        // We need to find any ordering of a subset of dominoes that chains
        // from currentLeadUnit to targetUnit.

        const visited = new Set([currentLeadUnit]);
        const queue = [currentLeadUnit];

        while (queue.length > 0) {
            const unit = queue.shift();

            if (unit === targetUnit) return true;

            for (const d of remainingHand) {
                const bottomUnit = this.getUnit(d.bottom);
                const topUnit    = this.getUnit(d.top);

                if (bottomUnit === unit && !visited.has(topUnit)) {
                    visited.add(topUnit);
                    queue.push(topUnit);
                }
                // Flipped orientation
                if (topUnit === unit && !visited.has(bottomUnit)) {
                    visited.add(bottomUnit);
                    queue.push(bottomUnit);
                }
            }
        }

        return false;
    }

    checkPuzzleSolvabilityAndReset() {
        const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
        const currentLeadUnit = this.getUnit(currentLead);
        const targetUnit = this.getUnit(this.targetUnit);

        if (!this.isPuzzleSolvable(this.hand, currentLeadUnit, targetUnit)) {
            this.showToast("No valid path remaining — resetting level!", "error");
            this.levelTransitionTimeout = setTimeout(() => {
                if (!this.gameActive) return;
                this.loadPuzzle();
            }, 1800);
        }
    }

    // --- COMMON RENDERING & MECHANICS ---

    flipDomino(id) {
        this.initAudio();
        const domino = this.hand.find(d => d.id === id);
        if (domino) {
            const temp = domino.top;
            domino.top = domino.bottom;
            domino.bottom = temp;
            this.renderHand();
        }
    }

    attemptPlayDomino(id) {
        if (!this.gameActive || (this.mode === 'faceoff' && !this.isPlayerTurn)) return;

        const dominoIdx = this.hand.findIndex(d => d.id === id);
        if (dominoIdx === -1) return;
        const domino = this.hand[dominoIdx];

        const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
        const requiredUnit = this.getUnit(currentLead);

        if (this.getUnit(domino.bottom) === requiredUnit) {
            this.initAudio();
            this.playHit();
            this.hand.splice(dominoIdx, 1);
            domino.isNew = true; 
            this.chain.push(domino);
            this.renderHand();
            this.renderChain();

            if (this.mode === 'puzzle') {
                if (this.getUnit(domino.top) === this.getUnit(this.targetUnit)) {
                    this.showToast("Puzzle Complete!", "success");
                    this.isPlayerTurn = false; 
                    this.renderHand();
                    
                    const banner = document.getElementById('da-target-banner');
                    if (banner) banner.classList.add('completed');

                    this.levelTransitionTimeout = setTimeout(() => {
                        if (!this.gameActive) return;
                        if (banner) banner.classList.remove('completed');
                        this.currentLevel++;
                        this.updateStats();
                        this.loadPuzzle();
                    }, 2000);
                } else {
                    this.checkPuzzleSolvabilityAndReset();
                }
            } else if (this.mode === 'faceoff') {
                if (this.getUnit(domino.top) === this.getUnit(this.targetUnit)) {
                    this.showToast("You reached the target first!", "success");
                    this.isPlayerTurn = false;
                    this.renderHand();
                    
                    const banner = document.getElementById('da-target-banner');
                    if (banner) banner.classList.add('completed');

                    this.levelTransitionTimeout = setTimeout(() => {
                        if (!this.gameActive) return;
                        if (banner) banner.classList.remove('completed');
                        this.currentLevel++;
                        this.updateStats();
                        this.loadFaceoff();
                    }, 2500);
                } else {
                    this.isPlayerTurn = false;
                    this.renderHand();
                    this.updateFaceoffHUD();
                    this.aiTimeout = setTimeout(() => this.playAITurn(), 1500);
                }
            }

        } else {
            this.initAudio();
            this.playMiss();
            
            const el = document.getElementById(`domino-${id}`);
            if (el) {
                el.classList.add('shake');
                setTimeout(() => el.classList.remove('shake'), 400);
            }

            if (this.mode === 'puzzle') {
                this.mistakes++;
                this.updateStats();
                if (this.mistakes >= this.maxMistakes) {
                    this.levelTransitionTimeout = setTimeout(() => {
                        if (this.gameActive) this.endGame(false);
                    }, 1000);
                }
            }
        }
    }

    renderChain() {
        const area = document.getElementById('da-chain-area');
        area.innerHTML = '';
        
        const startBlock = document.createElement('div');
        startBlock.className = 'da-domino starting-domino';
        startBlock.innerHTML = `
            <div class="da-top" style="color:var(--da-primary);">${this.startUnit}</div>
            <div class="da-line"></div>
            <div class="da-bottom">1</div>
        `;
        area.appendChild(startBlock);
        
        this.chain.forEach(d => {
            const mult = document.createElement('div');
            mult.className = 'da-chain-mult';
            mult.textContent = '×';
            area.appendChild(mult);

            const el = document.createElement('div');
            let classes = 'da-domino played';
            if (d.isNew) {
                classes += ' domino-pop';
                delete d.isNew;
            }
            el.className = classes;
            el.innerHTML = `
                <div class="da-top">${d.top}</div>
                <div class="da-line"></div>
                <div class="da-bottom cancelled">${d.bottom}</div>
            `;
            area.appendChild(el);
        });

        if (this.isPlayerTurn) {
            const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
            const requiredUnit = this.getUnit(currentLead);
            
            const multPlaceholder = document.createElement('div');
            multPlaceholder.className = 'da-chain-mult';
            multPlaceholder.textContent = '×';
            area.appendChild(multPlaceholder);

            const placeholder = document.createElement('div');
            placeholder.className = 'da-domino placeholder';
            placeholder.innerHTML = `<div class="placeholder-text">Drop Here<br><br>Needs:<br><strong style="color:var(--da-primary); font-size:1.1rem;">${requiredUnit}</strong></div>`;
            
            placeholder.addEventListener('dragover', (e) => {
                e.preventDefault();
                placeholder.classList.add('drag-over');
            });
            
            placeholder.addEventListener('dragleave', () => {
                placeholder.classList.remove('drag-over');
            });
            
            placeholder.addEventListener('drop', (e) => {
                e.preventDefault();
                placeholder.classList.remove('drag-over');
                const id = e.dataTransfer.getData('text/plain');
                if (id) this.attemptPlayDomino(id);
            });

            area.appendChild(placeholder);
        }

        area.scrollLeft = area.scrollWidth;
    }

    renderHand() {
        const area = document.getElementById('da-hand-area');
        area.innerHTML = '';
        
        const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
        const requiredUnit = this.getUnit(currentLead);
        
        this.hand.forEach(d => {
            const isPlayable = this.getUnit(d.bottom) === requiredUnit;
            const shouldGlow = isPlayable && this.isPlayerTurn && this.hintsEnabled;
            
            const el = document.createElement('div');
            el.className = `da-domino ${!this.isPlayerTurn ? 'disabled' : ''} ${shouldGlow ? 'playable-glow' : ''}`;
            el.id = `domino-${d.id}`;
            
            if (this.isPlayerTurn) {
                el.draggable = true;
                el.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', d.id);
                    el.style.opacity = '0.5';
                });
                el.addEventListener('dragend', () => {
                    el.style.opacity = '1';
                });
            }
            
            el.innerHTML = `
                <div class="da-flip-btn" title="Flip Conversion Factor">🔃</div>
                <div class="da-top">${d.top}</div>
                <div class="da-line"></div>
                <div class="da-bottom">${d.bottom}</div>
            `;

            el.querySelector('.da-flip-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.mode === 'faceoff' && !this.isPlayerTurn) return;
                this.flipDomino(d.id);
            });

            el.addEventListener('click', () => {
                this.attemptPlayDomino(d.id);
            });

            area.appendChild(el);
        });
    }

    endGame(win) {
        this.gameActive = false;
        this.stopTimer();
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        
        const desc = win 
            ? `Excellent analytical skills! You successfully mastered the unit chains with ${this.mistakes} mistakes.${timeStr}`
            : `Too many invalid conversions. Remember that the denominator of your next domino must exactly match the numerator of the current chain.`;

        modal.show(
            win ? 'Analysis Complete!' : 'Calculation Failed!', 
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

window.addEventListener('DOMContentLoaded', () => new DimensionalAnalysisGame());