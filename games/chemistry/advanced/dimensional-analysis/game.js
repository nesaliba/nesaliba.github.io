import { BaseGame } from '/games/shared/base-game.js';

const PUZZLES = {
    beginner: [
        { start: '🔴', target: '⬛', hand: [{t:'⬛', b:'🔴'}], distractors: [{t:'▲', b:'⭐'}] },
        { start: '▲', target: '⭐', hand: [{t:'🔴', b:'▲'}, {t:'⭐', b:'🔴'}], distractors: [{t:'⬛', b:'🔴'}] },
        { start: '⬟', target: '🔴', hand: [{t:'▲', b:'⬟'}, {t:'⬛', b:'▲', flipped: true}, {t:'🔴', b:'⬛'}], distractors: [{t:'⭐', b:'▲'}, {t:'🔴', b:'⭐'}] },
        { start: '⭐', target: '⬟', hand: [{t:'⬛', b:'⭐'}, {t:'🔴', b:'⬛'}, {t:'▲', b:'🔴', flipped: true}, {t:'⬟', b:'▲'}], distractors: [{t:'⭐', b:'⬟'}] },
        { start: '🔴', target: '▲', hand: [{t:'⭐', b:'🔴'}, {t:'⬛', b:'⭐'}, {t:'⬟', b:'⬛'}, {t:'▲', b:'⬟', flipped: true}], distractors: [{t:'🔴', b:'▲'}] }
    ],
    intermediate: [
        { start: 'km', target: 'cm', hand: [{t:'1000 m', b:'1 km'}, {t:'100 cm', b:'1 m'}], distractors: [{t:'1 m', b:'1000 mm'}, {t:'1 km', b:'1000 m'}] },
        { start: 'days', target: 'seconds', hand: [{t:'24 h', b:'1 day'}, {t:'60 min', b:'1 h'}, {t:'60 s', b:'1 min'}], distractors: [{t:'1 min', b:'60 s', flipped: true}, {t:'3600 s', b:'1 day'}] },
        { start: 'kg', target: 'mg', hand: [{t:'1000 g', b:'1 kg'}, {t:'1000 mg', b:'1 g'}], distractors: [{t:'1 g', b:'1000 kg'}, {t:'1 kg', b:'1000 mg'}] },
        { start: 'km/h', target: 'm/s', hand: [{t:'1000 m', b:'1 km'}, {t:'1 h', b:'60 min'}, {t:'1 min', b:'60 s'}], distractors: [{t:'3600 s', b:'1 h'}, {t:'1 m', b:'100 cm'}] },
        { start: 'L', target: 'cm³', hand: [{t:'1000 mL', b:'1 L'}, {t:'1 cm³', b:'1 mL'}], distractors: [{t:'1 L', b:'1000 mL'}, {t:'1 m³', b:'100 cm³'}] }
    ],
    advanced: [
        { start: 'g CH₄', target: 'mol CH₄', hand: [{t:'1 mol CH₄', b:'16.04 g CH₄'}], distractors: [{t:'6.02×10²³ molecules', b:'1 mol'}, {t:'22.4 L', b:'1 mol'}] },
        { start: 'L NaOH', target: 'mol HCl', hand: [{t:'0.5 mol NaOH', b:'1 L NaOH'}, {t:'1 mol HCl', b:'1 mol NaOH'}], distractors: [{t:'36.46 g HCl', b:'1 mol HCl'}, {t:'1 L HCl', b:'0.5 mol NaOH'}] },
        { start: 'g H₂O', target: 'molecules H₂O', hand: [{t:'1 mol H₂O', b:'18.02 g H₂O'}, {t:'6.02×10²³ molecules', b:'1 mol H₂O'}], distractors: [{t:'18.02 g H₂O', b:'1 mol H₂O'}, {t:'1 L H₂O', b:'1000 g'}] },
        { start: 'kPa', target: 'atm', hand: [{t:'1 atm', b:'101.325 kPa'}], distractors: [{t:'760 mmHg', b:'1 atm'}, {t:'101.325 kPa', b:'1 atm'}] },
        { start: 'mol e⁻', target: 'Coulombs', hand: [{t:'96485 C', b:'1 mol e⁻'}], distractors: [{t:'1 A', b:'1 C/s'}, {t:'1 mol e⁻', b:'96485 C'}] }
    ]
};

export class DimensionalAnalysisGame extends BaseGame {
    constructor() {
        super("Dimensional Analysis 2.0");
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 10;
        
        this.mode = null; 
        this.difficulty = null; 
        this.hintsEnabled = true;
        
        this.currentLevel = 0;
        this.chain = [];
        this.hand = [];
        this.aiHand = [];
        this.deck = [];
        this.isPlayerTurn = true;
        
        this.startUnit = '';
        this.targetUnit = '';

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
                    
                    <h2 class="da-title" style="margin-top: 1rem;">Game Options</h2>
                    <div class="da-options-container">
                        <label class="da-checkbox-label">
                            <input type="checkbox" id="toggle-hints" checked>
                            Enable Visual Hints (Glowing Playable Dominoes)
                        </label>
                    </div>

                    <h2 class="da-title" style="margin-top: 2rem;">Select Complexity</h2>
                    <div class="da-difficulty-grid">
                        <button class="da-btn da-diff-btn" data-diff="beginner">Beginner (Shapes)</button>
                        <button class="da-btn da-diff-btn" data-diff="intermediate">Intermediate (Units)</button>
                        <button class="da-btn da-diff-btn" data-diff="advanced">Advanced (Stoich)</button>
                    </div>
                </div>

                <div id="da-game" class="da-panel" style="display: none;">
                    
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
                </div>
            </main>
        `;

        document.querySelectorAll('.da-diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mode = document.querySelector('input[name="da-mode"]:checked').value;
                this.difficulty = e.target.getAttribute('data-diff');
                this.hintsEnabled = document.getElementById('toggle-hints').checked;
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
    }

    startGame() {
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
        // Strip numbers, decimals, sci notation, and spaces at the start
        let unit = str.replace(/^[0-9\.\s×eE\+\-²³]+/, '').trim().toLowerCase();
        
        // Normalize synonyms and plurals so matching works flawlessly
        if (unit === 'days') return 'day';
        if (unit === 'seconds' || unit === 'sec') return 's';
        if (unit === 'minutes') return 'min';
        if (unit === 'hours' || unit === 'hr') return 'h';
        if (unit === 'molecules') return 'molecule';
        if (unit === 'atoms') return 'atom';
        if (unit === 'grams') return 'g';
        if (unit === 'coulombs') return 'c';
        
        return unit;
    }

    // --- PUZZLE MODE LOGIC ---
    
    loadPuzzle() {
        if (this.currentLevel >= PUZZLES[this.difficulty].length) {
            return this.endGame(true);
        }

        const p = PUZZLES[this.difficulty][this.currentLevel];
        this.chain = [];
        this.hand = [];
        
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

        const units = this.difficulty === 'beginner' 
            ? ['🔴', '▲', '⬛', '⭐', '⬟', '🌙']
            : (this.difficulty === 'intermediate' 
                ? ['mm', 'cm', 'm', 'km', 'mi', 'ly'] 
                : ['g A', 'mol A', 'mol B', 'g B', 'L B', 'atoms B']);

        this.startUnit = units[0];
        this.targetUnit = units[units.length - 1];

        document.getElementById('da-target-unit').innerText = this.targetUnit;

        for (let i = 0; i < units.length - 1; i++) {
            this.deck.push({ id: this.generateId(), top: units[i+1], bottom: units[i] });
            this.deck.push({ id: this.generateId(), top: units[i+1], bottom: units[i] });
        }
        this.deck.push({ id: this.generateId(), top: units[3], bottom: units[1] });
        this.deck.push({ id: this.generateId(), top: units[units.length-1], bottom: units[2] });
        
        this.deck.sort(() => Math.random() - 0.5);

        for(let i=0; i<5; i++) {
            this.hand.push(this.deck.pop());
            this.aiHand.push(this.deck.pop());
        }

        this.renderChain();
        this.renderHand();
        this.updateFaceoffHUD();
    }

    replenishDeck() {
        const units = this.difficulty === 'beginner' 
            ? ['🔴', '▲', '⬛', '⭐', '⬟', '🌙']
            : (this.difficulty === 'intermediate' 
                ? ['mm', 'cm', 'm', 'km', 'mi', 'ly'] 
                : ['g A', 'mol A', 'mol B', 'g B', 'L B', 'atoms B']);

        for (let i = 0; i < 5; i++) {
            const top = units[Math.floor(Math.random() * units.length)];
            let bottom = units[Math.floor(Math.random() * units.length)];
            while(bottom === top) bottom = units[Math.floor(Math.random() * units.length)];
            this.deck.push({ id: this.generateId(), top, bottom });
        }
    }

    drawDomino(isPlayer) {
        if (this.deck.length === 0) {
            this.replenishDeck();
        }
        
        if (isPlayer && this.isPlayerTurn) {
            this.initAudio();
            this.hand.push(this.deck.pop());
            this.isPlayerTurn = false;
            this.renderHand();
            this.updateFaceoffHUD();
            setTimeout(() => this.playAITurn(), 400);
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
            drawBtn.innerText = `Draw Domino (${this.deck.length} left)`;
        } else {
            hud.style.borderColor = '#ef4444';
            drawBtn.innerText = "AI is thinking...";
        }
    }

    playAITurn() {
        if (this.mode !== 'faceoff') return;

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
            this.chain.push(d);
            this.initAudio();
            this.playHit();
            this.renderChain();
            
            if (this.getUnit(d.top) === this.getUnit(this.targetUnit)) {
                this.playGameOver();
                this.mistakes++;
                this.updateStats();
                setTimeout(() => {
                    if (this.mistakes >= this.maxMistakes) this.endGame(false);
                    else {
                        this.currentLevel++;
                        this.loadFaceoff();
                    }
                }, 800);
                return;
            }
        } else {
            this.drawDomino(false);
        }

        this.isPlayerTurn = true;
        this.updateFaceoffHUD();
        this.renderChain();
        this.renderHand();
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
        if (this.mode === 'faceoff' && !this.isPlayerTurn) return;

        const dominoIdx = this.hand.findIndex(d => d.id === id);
        if (dominoIdx === -1) return;
        const domino = this.hand[dominoIdx];

        const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
        const requiredUnit = this.getUnit(currentLead);

        if (this.getUnit(domino.bottom) === requiredUnit) {
            this.initAudio();
            this.playHit();
            this.hand.splice(dominoIdx, 1);
            this.chain.push(domino);
            this.renderHand();
            this.renderChain();

            if (this.mode === 'puzzle') {
                if (this.getUnit(domino.top) === this.getUnit(this.targetUnit)) {
                    setTimeout(() => {
                        this.currentLevel++;
                        this.updateStats();
                        this.loadPuzzle();
                    }, 400); // Snappy level transition
                }
            } else if (this.mode === 'faceoff') {
                if (this.getUnit(domino.top) === this.getUnit(this.targetUnit)) {
                    setTimeout(() => {
                        this.currentLevel++;
                        this.updateStats();
                        this.loadFaceoff();
                    }, 600); // Snappy round win
                } else {
                    this.isPlayerTurn = false;
                    this.renderHand();
                    this.updateFaceoffHUD();
                    setTimeout(() => this.playAITurn(), 400); // Faster AI response
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
                    setTimeout(() => this.endGame(false), 800);
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
            <div class="da-top" style="color:var(--da-primary); font-size:1.3rem;">${this.startUnit}</div>
            <div class="da-line"></div>
            <div class="da-bottom">1</div>
        `;
        area.appendChild(startBlock);
        
        this.chain.forEach(d => {
            const el = document.createElement('div');
            el.className = 'da-domino played';
            el.innerHTML = `
                <div class="da-top">${d.top}</div>
                <div class="da-line"></div>
                <div class="da-bottom cancelled">${d.bottom}</div>
            `;
            area.appendChild(el);
        });

        if (this.mode === 'puzzle' || this.isPlayerTurn) {
            const currentLead = this.chain.length === 0 ? this.startUnit : this.chain[this.chain.length - 1].top;
            const requiredUnit = this.getUnit(currentLead);
            
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
            const shouldGlow = this.hintsEnabled && isPlayable && this.isPlayerTurn;
            
            const el = document.createElement('div');
            el.className = `da-domino ${(!this.isPlayerTurn && this.mode === 'faceoff') ? 'disabled' : ''} ${shouldGlow ? 'playable-glow' : ''}`;
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