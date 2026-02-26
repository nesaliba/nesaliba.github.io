// --- Data Setup ---
const columns =["", "State of Matter (s, l, g)", "Appearance", "Conductivity", "Malleability or Ductility"];
const rows = ["Metallic Elements", "Non-metallic Elements", "Metalloids"];

const propertyData =[
    // Metals
    { id: "m-state", text: "solids except Hg(l)" },
    { id: "m-app", text: "shiny, lustrous" },
    { id: "m-cond", text: "good conductors of heat and electricity" },
    { id: "m-mall", text: "malleable and ductile" },
    // Non-metals
    { id: "nm-state", text: "some gaseous state, some solids, bromine (l)" },
    { id: "nm-app", text: "non-shiny, non-lustrous, dull" },
    { id: "nm-cond", text: "poor conductors of heat and electricity" },
    { id: "nm-mall", text: "brittle, not very ductile" },
    // Metalloids
    { id: "md-state", text: "solids" },
    { id: "md-app", text: "lustrous or dull" },
    { id: "md-cond", text: "may conduct electricity, poor conductors of heat" },
    { id: "md-mall", text: "could be malleable or ductile" }
];

// --- Audio API Setup ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(frequency, type, duration, vol = 0.1) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function playCorrect() {
    playTone(600, 'sine', 0.15);
}

function playWrong() {
    playTone(150, 'sawtooth', 0.3);
}

function playFinished() {
    setTimeout(() => playTone(400, 'sine', 0.1), 0);
    setTimeout(() => playTone(500, 'sine', 0.1), 100);
    setTimeout(() => playTone(600, 'sine', 0.2), 200);
    setTimeout(() => playTone(800, 'sine', 0.4), 350);
}

// --- Game Logic ---
let selectedTileId = null;
let matchedCount = 0;

function initGame() {
    const board = document.getElementById('gameBoard');
    const bank = document.getElementById('tileBank');
    
    // 1. Build the Header Row
    columns.forEach(colHeader => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell grid-header';
        cell.textContent = colHeader;
        board.appendChild(cell);
    });

    // 2. Build the Grid Rows
    let dataIndex = 0;
    rows.forEach((rowHeader, rowIndex) => {
        // Row Header
        const headerCell = document.createElement('div');
        headerCell.className = 'grid-cell grid-header';
        headerCell.textContent = rowHeader;
        board.appendChild(headerCell);

        // 4 empty slots per row
        for(let i=0; i<4; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-cell grid-empty-slot';
            slot.dataset.targetId = propertyData[dataIndex].id;
            slot.addEventListener('click', () => handleSlotClick(slot));
            board.appendChild(slot);
            dataIndex++;
        }
    });

    // 3. Build & Shuffle Tile Bank
    const shuffledData = [...propertyData].sort(() => Math.random() - 0.5);
    
    shuffledData.forEach(item => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = item.text;
        tile.dataset.id = item.id;
        tile.addEventListener('click', () => handleTileSelection(tile));
        bank.appendChild(tile);
    });
}

function handleTileSelection(tileElement) {
    // Deselect previously selected
    const prevSelected = document.querySelector('.tile.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    
    // Select new
    tileElement.classList.add('selected');
    selectedTileId = tileElement.dataset.id;
}

function handleSlotClick(slotElement) {
    if (!selectedTileId) return; // Ignore if no tile selected
    
    const targetId = slotElement.dataset.targetId;
    
    if (selectedTileId === targetId) {
        // Match Correct
        playCorrect();
        
        // Move text to slot and style it as filled
        const activeTile = document.querySelector(`.tile[data-id="${selectedTileId}"]`);
        slotElement.textContent = activeTile.textContent;
        slotElement.classList.remove('grid-empty-slot');
        slotElement.style.backgroundColor = 'var(--cell-color)';
        slotElement.style.borderStyle = 'solid';
        
        // Remove click event so it can't be clicked again
        slotElement.replaceWith(slotElement.cloneNode(true));
        
        // Remove from bank
        activeTile.remove();
        
        selectedTileId = null;
        matchedCount++;
        
        checkWinCondition();
    } else {
        // Match Wrong
        playWrong();
        slotElement.classList.add('shake');
        setTimeout(() => {
            slotElement.classList.remove('shake');
        }, 300);
    }
}

function checkWinCondition() {
    if (matchedCount === propertyData.length) {
        playFinished();
        setTimeout(() => {
            document.getElementById('winModal').style.display = 'flex';
        }, 500);
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initGame);