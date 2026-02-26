class ScitriadTileGame {
    constructor(config) {
        this.config = config;
        this.matchedCount = 0;
        this.totalMatches = config.data.length;
        this.audioCtx = null;
        
        window.addEventListener('DOMContentLoaded', () => this.initDOM());
    }

    initAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
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

    playCorrect() { this.playTone(600, 'sine', 0.15); }
    playWrong() { this.playTone(150, 'sawtooth', 0.3); }
    playFinished() {
        setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(800, 'sine', 0.4), 350);
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        // Dynamic grid columns based on data
        const gridCols = `140px repeat(${this.config.columns.length - 1}, 1fr)`;
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="${this.config.backUrl}" class="back-btn">← Back to Menu</a>
                <h1>${this.config.title}</h1>
                <p>Click a property tile from the bank below, then click the correct empty slot in the grid to place it!</p>
            </header>
            <main class="game-container">
                <div class="table-wrapper">
                    <div class="grid-board" id="gameBoard" style="grid-template-columns: ${gridCols}; min-width: ${this.config.minWidth}px;"></div>
                </div>
                <div class="tile-bank-container">
                    <h2>Property Tiles</h2>
                    <div class="tile-bank" id="tileBank"></div>
                </div>
            </main>
            <div class="modal-overlay" id="winModal">
                <div class="modal-content">
                    <h2>Activity Complete!</h2>
                    <p>You have successfully classified all the properties.</p>
                    <button id="btn-replay">Play Again</button>
                    <a href="${this.config.backUrl}" class="btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;

        document.getElementById('btn-replay').addEventListener('click', () => location.reload());
        this.buildGrid();
        this.buildBank();
    }

    buildGrid() {
        const board = document.getElementById('gameBoard');
        
        // Render Header Row
        this.config.columns.forEach(col => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell grid-header';
            cell.textContent = col;
            board.appendChild(cell);
        });

        // Render Data Rows
        let dataIndex = 0;
        const dataColsCount = this.config.columns.length - 1;

        this.config.rows.forEach(rowHeader => {
            const headerCell = document.createElement('div');
            headerCell.className = 'grid-cell grid-header';
            headerCell.textContent = rowHeader;
            board.appendChild(headerCell);

            for(let i = 0; i < dataColsCount; i++) {
                const slot = document.createElement('div');
                slot.className = 'grid-cell grid-empty-slot';
                slot.dataset.targetId = this.config.data[dataIndex].matchId;
                slot.addEventListener('click', () => {
                    this.initAudio();
                    this.handleSlotClick(slot);
                });
                board.appendChild(slot);
                dataIndex++;
            }
        });
    }

    buildBank() {
        const bank = document.getElementById('tileBank');
        const shuffledData = [...this.config.data].sort(() => Math.random() - 0.5);
        
        shuffledData.forEach(item => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = item.text;
            tile.dataset.matchId = item.matchId;
            tile.addEventListener('click', () => {
                this.initAudio();
                this.handleTileSelection(tile);
            });
            bank.appendChild(tile);
        });
    }

    handleTileSelection(tileElement) {
        const prevSelected = document.querySelector('.tile.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        tileElement.classList.add('selected');
    }

    handleSlotClick(slotElement) {
        const activeTile = document.querySelector('.tile.selected');
        if (!activeTile) return;
        
        const targetId = slotElement.dataset.targetId;
        const selectedMatchId = activeTile.dataset.matchId;
        
        if (selectedMatchId === targetId) {
            this.playCorrect();
            slotElement.textContent = activeTile.textContent;
            slotElement.classList.remove('grid-empty-slot');
            slotElement.style.backgroundColor = 'var(--cell-color)';
            slotElement.style.borderStyle = 'solid';
            
            slotElement.replaceWith(slotElement.cloneNode(true)); // remove click listener
            activeTile.remove(); // Remove from bank
            this.matchedCount++;
            this.checkWinCondition();
        } else {
            this.playWrong();
            slotElement.classList.add('shake');
            setTimeout(() => slotElement.classList.remove('shake'), 300);
        }
    }

    checkWinCondition() {
        if (this.matchedCount === this.totalMatches) {
            this.playFinished();
            setTimeout(() => {
                document.getElementById('winModal').style.display = 'flex';
            }, 500);
        }
    }
}