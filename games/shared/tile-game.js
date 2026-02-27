class ScitriadTileGame {
    constructor(config) {
        this.config = config;
        this.matchedCount = 0;
        this.totalMatches = config.data.length;
        this.audioCtx = null;
        
        // Parse settings from URL
        const params = new URLSearchParams(window.location.search);
        this.settings = {
            timer: params.get('timer') || 'off',
            timerVisible: params.get('timerVisible') || 'visible',
            tileMode: params.get('tileMode') || 'all',
            maxMistakes: params.has('maxMistakes') ? parseInt(params.get('maxMistakes')) : 10,
            mute: params.get('mute') === 'true',
            theme: params.get('theme') || localStorage.getItem('scitriad_theme') || 'light'
        };
        
        // Apply Global Theme robustly avoiding FOUC
        if (this.settings.theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            if (document.body) {
                document.body.classList.add('dark-theme');
            }
        }

        this.mistakesCount = 0;
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        
        // State for One Tile At A Time
        this.remainingTilesData =[];
        this.currentTileData = null;
        this.upcomingTileData = null;
        
        window.addEventListener('DOMContentLoaded', () => this.initDOM());
    }

    initAudio() {
        if (this.settings.mute) return;
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (this.settings.mute) return;
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
    playGameOver() {
        setTimeout(() => this.playTone(300, 'sawtooth', 0.2), 0);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.2), 200);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.4), 400);
    }

    startTimer() {
        const timerDisplay = document.getElementById('game-timer');
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
            if(timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }
    
    stopTimer() {
        if(this.timerInterval) clearInterval(this.timerInterval);
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        // Dynamic grid columns based on data
        const gridCols = `140px repeat(${this.config.columns.length - 1}, 1fr)`;
        
        let timerHTML = '';
        if (this.settings.timer === 'on') {
            timerHTML = `<div id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility: hidden;' : ''}">00:00</div>`;
        }
        
        let mistakeHTML = `<div id="game-mistakes">Mistakes: 0 / ${this.settings.maxMistakes}</div>`;
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="${this.config.backUrl}" class="back-btn">← Back to Menu</a>
                <h1>${this.config.title}</h1>
                <p>Click a property tile from the bank below, then click the correct empty slot in the grid to place it!</p>
                <div class="game-stats">
                    ${timerHTML}
                    ${mistakeHTML}
                </div>
            </header>
            <main class="game-container">
                <div id="one-tile-mode-container" style="display: none;">
                    <div class="one-tile-board">
                        <div class="current-tile-box">
                            <h3>Current Tile</h3>
                            <div id="current-tile-display" class="tile selected"></div>
                        </div>
                        <div class="upcoming-tile-box">
                            <h3>Upcoming Tile</h3>
                            <div id="upcoming-tile-display" class="tile upcoming"></div>
                        </div>
                    </div>
                </div>
                <div class="table-wrapper">
                    <div class="grid-board" id="gameBoard" style="grid-template-columns: ${gridCols}; min-width: ${this.config.minWidth}px;"></div>
                </div>
                <div class="tile-bank-container" id="tileBankContainer">
                    <h2>Property Tiles</h2>
                    <div class="tile-bank" id="tileBank"></div>
                </div>
            </main>
            <div class="modal-overlay" id="winModal">
                <div class="modal-content">
                    <h2>Activity Complete!</h2>
                    <p id="win-message">You have successfully classified all the properties.</p>
                    <button id="btn-replay">Play Again</button>
                    <a href="${this.config.backUrl}" class="btn-secondary">Return to Menu</a>
                </div>
            </div>
            <div class="modal-overlay" id="loseModal">
                <div class="modal-content">
                    <h2>Game Over!</h2>
                    <p>You made too many wrong placements.</p>
                    <button id="btn-replay-lose">Try Again</button>
                    <a href="${this.config.backUrl}" class="btn-secondary">Return to Menu</a>
                </div>
            </div>
        `;

        document.getElementById('btn-replay').addEventListener('click', () => location.reload());
        document.getElementById('btn-replay-lose').addEventListener('click', () => location.reload());
        
        this.buildGrid();
        
        if (this.settings.tileMode === 'one') {
            document.getElementById('tileBankContainer').style.display = 'none';
            document.getElementById('one-tile-mode-container').style.display = 'block';
            this.initOneTileMode();
            document.querySelector('.game-header p').textContent = "Place the Current Tile into the correct empty slot in the grid!";
        } else {
            this.buildBank();
        }
        
        if (this.settings.timer === 'on') {
            this.startTimer();
        }
    }

    buildGrid() {
        const board = document.getElementById('gameBoard');
        
        this.config.columns.forEach(col => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell grid-header';
            cell.innerHTML = col; 
            board.appendChild(cell);
        });

        let dataIndex = 0;
        const dataColsCount = this.config.columns.length - 1;

        this.config.rows.forEach(rowHeader => {
            const headerCell = document.createElement('div');
            headerCell.className = 'grid-cell grid-header';
            headerCell.innerHTML = rowHeader; 
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
        const shuffledData =[...this.config.data].sort(() => Math.random() - 0.5);
        
        shuffledData.forEach(item => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.innerHTML = item.text;
            tile.dataset.matchId = item.matchId;
            tile.addEventListener('click', () => {
                this.initAudio();
                this.handleTileSelection(tile);
            });
            bank.appendChild(tile);
        });
    }

    initOneTileMode() {
        this.remainingTilesData =[...this.config.data].sort(() => Math.random() - 0.5);
        this.advanceOneTileMode();
    }
    
    advanceOneTileMode() {
        const currentDisplay = document.getElementById('current-tile-display');
        const upcomingDisplay = document.getElementById('upcoming-tile-display');
        
        if (this.remainingTilesData.length > 0) {
            this.currentTileData = this.remainingTilesData.shift();
            currentDisplay.innerHTML = this.currentTileData.text;
            currentDisplay.dataset.matchId = this.currentTileData.matchId;
            currentDisplay.style.visibility = 'visible';
        } else {
            this.currentTileData = null;
            currentDisplay.style.visibility = 'hidden';
        }
        
        if (this.remainingTilesData.length > 0) {
            this.upcomingTileData = this.remainingTilesData[0];
            upcomingDisplay.innerHTML = this.upcomingTileData.text;
            upcomingDisplay.style.visibility = 'visible';
        } else {
            this.upcomingTileData = null;
            upcomingDisplay.style.visibility = 'hidden';
        }
    }

    handleTileSelection(tileElement) {
        if (this.settings.tileMode === 'one') return;
        const prevSelected = document.querySelector('.tile.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        tileElement.classList.add('selected');
    }

    handleSlotClick(slotElement) {
        let activeTile;
        let selectedMatchId;
        
        if (this.settings.tileMode === 'one') {
            activeTile = document.getElementById('current-tile-display');
            if (!this.currentTileData) return;
            selectedMatchId = this.currentTileData.matchId;
        } else {
            activeTile = document.querySelector('.tile.selected');
            if (!activeTile) return;
            selectedMatchId = activeTile.dataset.matchId;
        }
        
        const targetId = slotElement.dataset.targetId;
        
        if (selectedMatchId === targetId) {
            this.playCorrect();
            slotElement.innerHTML = activeTile.innerHTML;
            slotElement.classList.remove('grid-empty-slot');
            slotElement.style.backgroundColor = 'var(--cell-color)';
            slotElement.style.borderStyle = 'solid';
            
            slotElement.replaceWith(slotElement.cloneNode(true));
            
            if (this.settings.tileMode === 'one') {
                this.advanceOneTileMode();
            } else {
                activeTile.remove();
            }
            
            this.matchedCount++;
            this.checkWinCondition();
        } else {
            this.playWrong();
            slotElement.classList.add('shake');
            setTimeout(() => slotElement.classList.remove('shake'), 300);
            
            this.mistakesCount++;
            const mistakesDisplay = document.getElementById('game-mistakes');
            if (mistakesDisplay) {
                mistakesDisplay.textContent = `Mistakes: ${this.mistakesCount} / ${this.settings.maxMistakes}`;
            }
            
            if (this.mistakesCount > this.settings.maxMistakes) {
                this.triggerGameOver();
            }
        }
    }
    
    triggerGameOver() {
        this.stopTimer();
        this.playGameOver();
        document.querySelectorAll('.grid-empty-slot').forEach(slot => {
            slot.style.pointerEvents = 'none';
        });
        setTimeout(() => {
            document.getElementById('loseModal').style.display = 'flex';
        }, 500);
    }
    
    checkWinCondition() {
        if (this.matchedCount === this.totalMatches) {
            this.stopTimer();
            this.playFinished();
            this.saveProgress();
            
            const winMessage = document.getElementById('win-message');
            let msg = `You have successfully classified all the properties with ${this.mistakesCount} mistake(s).`;
            if (this.settings.timer === 'on') {
                const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
                const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
                msg += `<br><br>Time taken: <strong>${mins}:${secs}</strong>`;
            }
            winMessage.innerHTML = msg;
            
            setTimeout(() => {
                document.getElementById('winModal').style.display = 'flex';
            }, 500);
        }
    }

    async saveProgress() {
        try {
            const scriptTag = document.querySelector('script[src*="tile-game.js"]');
            let rootUrl = '/';
            if (scriptTag) {
                const scriptSrc = scriptTag.src;
                rootUrl = scriptSrc.split('games/shared/tile-game.js')[0];
            }
            
            const fbModule = await import(rootUrl + 'js/firebase-init.js');
            const { auth, db, collection, addDoc } = fbModule;
            
            if (auth && auth.currentUser) {
                await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                    title: this.config.title,
                    time: this.elapsedSeconds,
                    mistakes: this.mistakesCount,
                    date: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn("Could not save game progress. Ensure you have an active internet connection.", error);
        }
    }
}