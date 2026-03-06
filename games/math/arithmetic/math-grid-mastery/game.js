import { BaseGame } from '/games/shared/base-game.js';

class MathGridMastery extends BaseGame {
    constructor() {
        super("Math Grid Mastery");
        this.maxMistakes = 10;
        this.mistakes = 0;
        this.solvedCount = 0;
        this.totalCells = 16;
        this.isPlaying = false;
        
        this.unsolvedCells =[];
        this.mode = 'all';
        this.operator = '+';

        this.initUI();
        this.generateGrid();
    }

    initUI() {
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

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    gcd(a, b) { return b === 0 ? a : this.gcd(b, a % b); }
    lcm(a, b) { return (a * b) / this.gcd(a, b); }
    lcmOfArray(arr) { return arr.reduce((acc, val) => this.lcm(acc, val), 1); }

    generateGrid() {
        this.operator = document.getElementById('operator-select').value;
        this.mode = document.getElementById('mode-select').value;

        let cols =[];
        let rows =[];

        if (this.operator === '+') {
            cols = Array.from({length: 4}, () => this.rand(1, 20));
            rows = Array.from({length: 4}, () => this.rand(1, 20));
        } else if (this.operator === '-') {
            cols = Array.from({length: 4}, () => this.rand(1, 20));
            rows = Array.from({length: 4}, () => this.rand(1, 20));
        } else if (this.operator === '*') {
            cols = Array.from({length: 4}, () => this.rand(2, 12));
            rows = Array.from({length: 4}, () => this.rand(2, 12));
        } else if (this.operator === '/') {
            const sets = [[2, 4, 6, 8],
                [2, 3, 4, 6],[3, 6, 9, 12],[2, 5, 10, 20],
                [4, 8, 12, 16]
            ];
            let colSet = sets[this.rand(0, sets.length - 1)].sort(() => Math.random() - 0.5);
            cols = colSet;
            const l = this.lcmOfArray(cols);
            rows = Array.from({length: 4}, () => l * this.rand(1, 6));
        } else if (this.operator === 'bedmas') {
            cols = Array.from({length: 4}, () => this.rand(2, 10));
            rows = Array.from({length: 4}, () => this.rand(2, 10));
        }

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
                    <input type="number" id="${inputId}" data-ans="${ans}" autocomplete="off" disabled>
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
            const ans = parseInt(input.dataset.ans);
            
            if (this.mode === 'all') {
                input.disabled = false;
            }
            
            input.addEventListener('keyup', (e) => {
                if (!this.isPlaying) return;
                const val = parseInt(input.value);
                
                if (val === ans) {
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
        
        // Remove from unsolved array if in 'all' mode
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
        const timeStr = document.getElementById('timer-val').innerText;

        title.innerText = isWin ? "Grid Mastered!" : "Grid Failed!";
        title.style.color = isWin ? "var(--subject-primary)" : "#ef4444";
        
        details.innerHTML = `
            <p><strong>Mode:</strong> ${modeName}</p>
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