import { BaseGame } from '/games/shared/base-game.js';

class MathGridMastery extends BaseGame {
    constructor() {
        super("Math Grid Mastery");
        this.maxMistakes = this.settings.maxMistakes || 10;
        this.mistakes = 0;
        this.solvedCount = 0;
        this.totalCells = 16;
        this.isPlaying = false;
        
        this.unsolvedCells =[];
        this.mode = 'all';
        this.operator = '+';
        this.difficulty = 'easy';

        this.initUI();
        this.renderBlankGrid();
    }

    initUI() {
        this.initDOM();
        if (this.settings.timer !== 'on') {
            const timerContainer = document.getElementById('timer-container');
            if (timerContainer) timerContainer.style.display = 'none';
        } else if (this.settings.timerVisible === 'hidden') {
            const timerVal = document.getElementById('timer-val');
            if (timerVal) timerVal.style.visibility = 'hidden';
        }
        document.getElementById('mistakes-display').innerText = `Mistakes: 0 / ${this.maxMistakes}`;
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });
        
        document.getElementById('btn-start').addEventListener('click', () => {
            this.initAudio();
            this.startGame();
        });
        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.startGame();
        });
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Math.html" class="back-btn">← Back to Menu</a>
                <h1>Math Grid Mastery</h1>
                <p>Master arithmetic and order of operations in an interactive grid!</p>
                <div class="game-stats">
                    <div class="stat-box" id="timer-container">Time: <span id="timer-val">00:00</span></div>
                    <div id="mistakes-display" class="stat-box hp-box">Mistakes: 0 / 10</div>
                </div>
            </header>
            <main class="game-container">
                <div class="controls-panel">
                    <div class="control-group">
                        <label>Operator Mode:</label>
                        <select id="operator-select" class="game-select"><option value="+">Addition (+)</option><option value="-">Subtraction (−)</option><option value="*">Multiplication (×)</option><option value="/">Division (÷)</option><option value="bedmas">Mixed / BEDMAS</option></select>
                    </div>
                    <div class="control-group">
                        <label>Difficulty:</label>
                        <select id="difficulty-select" class="game-select"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
                    </div>
                    <div class="control-group">
                        <label>Game Mode:</label>
                        <select id="mode-select" class="game-select"><option value="all">All Tiles Visible</option><option value="one">One Tile at a Time</option></select>
                    </div>
                    <button id="btn-start" class="btn-action primary">Start Game</button>
                </div>
                <div class="grid-panel"><div id="grid-board" class="math-grid"></div></div>
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
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    gcd(a, b) { return b === 0 ? a : this.gcd(b, a % b); }
    lcm(a, b) { return (a * b) / this.gcd(a, b); }
    lcmOfArray(arr) { return arr.reduce((acc, val) => this.lcm(acc, val), 1); }

    getUniqueRandoms(count, min, max) {
        let set = new Set();
        while(set.size < count) {
            let val = this.rand(min, max);
            if (val === 0 && this.operator === '/') continue;
            set.add(val);
        }
        return Array.from(set);
    }

    generateGridNumbers() {
        let cols = [];
        let rows =[];

        if (this.operator === '+' || this.operator === '-') {
            if (this.difficulty === 'easy') {
                cols = this.getUniqueRandoms(4, 1, 15);
                rows = this.getUniqueRandoms(4, 1, 15);
            } else if (this.difficulty === 'medium') {
                cols = this.getUniqueRandoms(4, -20, 30);
                rows = this.getUniqueRandoms(4, -20, 30);
            } else {
                cols = this.getUniqueRandoms(4, -100, 200);
                rows = this.getUniqueRandoms(4, -100, 200);
            }
        } else if (this.operator === '*') {
            if (this.difficulty === 'easy') {
                cols = this.getUniqueRandoms(4, 2, 12);
                rows = this.getUniqueRandoms(4, 2, 12);
            } else if (this.difficulty === 'medium') {
                cols = this.getUniqueRandoms(4, -12, 15);
                rows = this.getUniqueRandoms(4, -12, 15);
            } else {
                cols = this.getUniqueRandoms(4, 15, 50);
                rows = this.getUniqueRandoms(4, 15, 50);
            }
        } else if (this.operator === '/') {
            if (this.difficulty === 'easy') {
                const sets = [[2, 4, 6, 8], [2, 3, 4, 6], [3, 6, 9, 12],[2, 5, 10, 20]];
                cols = sets[this.rand(0, sets.length - 1)].sort(() => Math.random() - 0.5);
                const l = this.lcmOfArray(cols);
                rows = this.getUniqueRandoms(4, 1, 6).map(x => x * l);
            } else if (this.difficulty === 'medium') {
                const pools = [[4, 6, 8, 12],[3, 6, 9, 15], [5, 10, 15, 20],[6, 12, 18, 24]];
                cols = pools[this.rand(0, pools.length - 1)].sort(() => Math.random() - 0.5);
                const l = this.lcmOfArray(cols);
                rows = this.getUniqueRandoms(4, 2, 10).map(x => x * l);
            } else {
                const pools = [[12, 15, 20, 30],[8, 16, 24, 32], [10, 25, 50, 100]];
                cols = pools[this.rand(0, pools.length - 1)].sort(() => Math.random() - 0.5);
                const l = this.lcmOfArray(cols);
                rows = this.getUniqueRandoms(4, 5, 20).map(x => x * l);
            }
        } else if (this.operator === 'bedmas') {
            if (this.difficulty === 'easy') {
                cols = this.getUniqueRandoms(4, 2, 10);
                rows = this.getUniqueRandoms(4, 2, 10);
            } else if (this.difficulty === 'medium') {
                cols = this.getUniqueRandoms(4, -10, 15);
                rows = this.getUniqueRandoms(4, -10, 15);
            } else {
                cols = this.getUniqueRandoms(4, -30, 30);
                rows = this.getUniqueRandoms(4, -30, 30);
            }
        }

        return { cols, rows };
    }

    renderBlankGrid() {
        const gridBoard = document.getElementById('grid-board');
        gridBoard.innerHTML = '';
        
        const corner = document.createElement('div');
        corner.className = 'grid-header corner';
        corner.innerText = '?';
        gridBoard.appendChild(corner);
        
        for (let i = 0; i < 4; i++) {
            const header = document.createElement('div');
            header.className = 'grid-header';
            header.innerText = '-';
            gridBoard.appendChild(header);
        }
        
        for (let r = 0; r < 4; r++) {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'grid-header';
            rowHeader.innerText = '-';
            gridBoard.appendChild(rowHeader);
            
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.innerHTML = `<input type="number" step="any" disabled>`;
                gridBoard.appendChild(cell);
            }
        }
    }

    generateGrid() {
        this.operator = document.getElementById('operator-select').value;
        this.mode = document.getElementById('mode-select').value;
        this.difficulty = document.getElementById('difficulty-select').value;

        const { cols, rows } = this.generateGridNumbers();

        const gridBoard = document.getElementById('grid-board');
        gridBoard.innerHTML = '';
        
        const corner = document.createElement('div');
        corner.className = 'grid-header corner';
        const symbolMap = { '+': '+', '-': '−', '*': '×', '/': '÷', 'bedmas': 'Mixed' };
        corner.innerText = symbolMap[this.operator];
        gridBoard.appendChild(corner);
        
        cols.forEach(c => {
            const header = document.createElement('div');
            header.className = 'grid-header';
            header.innerText = c;
            gridBoard.appendChild(header);
        });
        
        this.unsolvedCells =[];
        
        rows.forEach((r, rIdx) => {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'grid-header';
            rowHeader.innerText = r;
            gridBoard.appendChild(rowHeader);
            
            cols.forEach((c, cIdx) => {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                const inputId = `cell-${rIdx}-${cIdx}`;
                
                let ans = 0;
                let exprHtml = '';
                
                if (this.operator === '+') ans = r + c;
                else if (this.operator === '-') ans = r - c;
                else if (this.operator === '*') ans = r * c;
                else if (this.operator === '/') ans = r / c;
                else if (this.operator === 'bedmas') {
                    let x = this.rand(2, 5);
                    if (this.difficulty === 'medium') x = this.rand(2, 8);
                    if (this.difficulty === 'hard') x = this.rand(5, 15);
                    let type = this.rand(0, 3);
                    if (type === 0) {
                        exprHtml = `<div class="bedmas-expr">(${r} + ${c}) × ${x}</div>`;
                        ans = (r + c) * x;
                    } else if (type === 1) {
                        exprHtml = `<div class="bedmas-expr">(${r} × ${x}) - ${c}</div>`;
                        ans = (r * x) - c;
                    } else if (type === 2) {
                        exprHtml = `<div class="bedmas-expr">(${r} - ${c}) × ${x}</div>`;
                        ans = (r - c) * x;
                    } else {
                        exprHtml = `<div class="bedmas-expr">${r} + (${c} × ${x})</div>`;
                        ans = r + (c * x);
                    }
                }
                
                cell.innerHTML = `
                    ${exprHtml}
                    <input type="number" step="any" id="${inputId}" data-ans="${ans}" autocomplete="off" disabled>
                `;
                gridBoard.appendChild(cell);
                this.unsolvedCells.push(inputId);
            });
        });
    }

    startGame() {
        this.stopTimer();
        this.elapsedSeconds = 0;
        document.getElementById('timer-val').innerText = '00:00';
        
        this.mistakes = 0;
        this.solvedCount = 0;
        this.updateMistakes();
        this.generateGrid();

        this.unsolvedCells.forEach(id => {
            const input = document.getElementById(id);
            const ans = parseFloat(input.dataset.ans);
            
            if (this.mode === 'all') {
                input.disabled = false;
            }
            
            input.addEventListener('keyup', (e) => {
                if (!this.isPlaying) return;
                const val = parseFloat(input.value);
                
                if (Math.abs(val - ans) < 0.0001) {
                    this.handleCorrect(input);
                } else if (e.key === 'Enter') {
                    if (input.value !== "") {
                        this.handleIncorrect(input);
                    }
                }
            });
        });

        this.isPlaying = true;
        this.startTimer('timer-val');

        if (this.mode === 'one') {
            this.unsolvedCells.sort(() => Math.random() - 0.5);
            this.activateNextCell();
        }
    }

    activateNextCell() {
        if (this.unsolvedCells.length === 0) return;
        const activeId = this.unsolvedCells.pop();
        const input = document.getElementById(activeId);
        input.disabled = false;
        input.parentElement.classList.add('active-tile');
        input.focus();
    }

    handleCorrect(input) {
        this.playHit();
        input.disabled = true;
        input.parentElement.classList.remove('active-tile');
        input.parentElement.classList.add('solved-tile');
        
        if (this.mode === 'all') {
            const idx = this.unsolvedCells.indexOf(input.id);
            if (idx > -1) this.unsolvedCells.splice(idx, 1);
        }
        
        this.solvedCount++;
        
        if (this.solvedCount === this.totalCells) {
            this.winGame();
        } else if (this.mode === 'one') {
            this.activateNextCell();
        }
    }

    handleIncorrect(input) {
        this.playMiss();
        this.mistakes++;
        this.updateMistakes();
        
        input.parentElement.classList.add('shake');
        input.value = "";
        setTimeout(() => input.parentElement.classList.remove('shake'), 300);
        
        if (this.mistakes >= this.maxMistakes) {
            this.loseGame();
        }
    }

    updateMistakes() {
        document.getElementById('mistakes-display').innerText = `Mistakes: ${this.mistakes} / ${this.maxMistakes}`;
    }

    winGame() {
        this.isPlaying = false;
        this.stopTimer();
        this.playVictory();
        this.showReport(true);
        this.saveProgress(this.mistakes);
    }

    loseGame() {
        this.isPlaying = false;
        this.stopTimer();
        this.playGameOver();
        this.unsolvedCells.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.disabled = true;
        });
        document.querySelectorAll('.active-tile').forEach(el => el.classList.remove('active-tile'));
        this.showReport(false);
    }

    showReport(isWin) {
        const modal = document.getElementById('report-modal');
        const title = document.getElementById('report-title');
        const details = document.getElementById('report-details');
        
        const operatorNames = { '+': 'Addition', '-': 'Subtraction', '*': 'Multiplication', '/': 'Division', 'bedmas': 'Mixed / BEDMAS' };
        const modeName = this.mode === 'one' ? 'One Tile at a Time' : 'All Tiles Visible';
        const diffName = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        const timeStr = document.getElementById('timer-val').innerText;

        title.innerText = isWin ? "Grid Mastered!" : "Grid Failed!";
        title.style.color = isWin ? "var(--subject-primary)" : "#ef4444";
        
        details.innerHTML = `
            <p><strong>Mode:</strong> ${modeName}</p>
            <p><strong>Difficulty:</strong> ${diffName}</p>
            <p><strong>Operator:</strong> ${operatorNames[this.operator]}</p>
            <p><strong>Time Taken:</strong> ${timeStr}</p>
            <p><strong>Mistakes Made:</strong> ${this.mistakes} / ${this.maxMistakes}</p>
        `;
        
        modal.style.display = 'flex';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new MathGridMastery();
});