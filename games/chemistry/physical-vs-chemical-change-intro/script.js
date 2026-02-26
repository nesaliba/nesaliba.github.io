// --- Data Setup ---
const columns = ["", "Physical Change", "Chemical Change"];
const rows =["Reversibility", "Description", "Example 1", "Example 2", "Example 3", "Example 4"];

// Data is ordered left-to-right, top-to-bottom relative to the 2 data columns.
// Examples now use shared 'p-ex' and 'c-ex' match IDs so they can be placed in any example row.
const propertyData =[
    // Reversibility
    { matchId: "p-rev", text: "Reversible Reaction" },
    { matchId: "c-rev", text: "Difficult to reverse the reaction" },
    
    // Description
    { matchId: "p-desc", text: "substance changes state (s, l, g)" },
    { matchId: "c-desc", text: "new substance formed" },
    
    // Example 1
    { matchId: "p-ex", text: "water condenses on the window" },
    { matchId: "c-ex", text: "two clear solutions mix together to produce a white solid" },
    
    // Example 2
    { matchId: "p-ex", text: "melting ice" },
    { matchId: "c-ex", text: "heat produced or absorbed" },
    
    // Example 3
    { matchId: "p-ex", text: "chopping carrots" },
    { matchId: "c-ex", text: "indicator changes from yellow to blue colour" },
    
    // Example 4
    { matchId: "p-ex", text: "green coloured solution" },
    { matchId: "c-ex", text: "cooking eggs" }
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
    const dataColumnsCount = columns.length - 1; // 2 data columns

    rows.forEach((rowHeader) => {
        // Row Header (Leftmost column)
        const headerCell = document.createElement('div');
        headerCell.className = 'grid-cell grid-header';
        headerCell.textContent = rowHeader;
        board.appendChild(headerCell);

        // Fill slots for Physical and Chemical Change
        for(let i = 0; i < dataColumnsCount; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-cell grid-empty-slot';
            slot.dataset.targetId = propertyData[dataIndex].matchId;
            slot.addEventListener('click', () => handleSlotClick(slot));
            board.appendChild(slot);
            dataIndex++;
        }
    });

    // 3. Build & Shuffle Tile Bank
    const shuffledData = [...propertyData].sort(() => Math.random() - 0.5);
    
    shuffledData.forEach((item, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = item.text;
        tile.dataset.matchId = item.matchId;
        // Use a unique ID just for DOM identification if needed, but we rely on .selected
        tile.id = `tile-${index}`;
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
}

function handleSlotClick(slotElement) {
    // Grab the actual DOM element that is currently selected
    const activeTile = document.querySelector('.tile.selected');
    
    if (!activeTile) return; // Ignore if no tile is selected
    
    const targetId = slotElement.dataset.targetId;
    const selectedMatchId = activeTile.dataset.matchId;
    
    if (selectedMatchId === targetId) {
        // Match Correct
        playCorrect();
        
        // Move text to slot and style it as filled
        slotElement.textContent = activeTile.textContent;
        slotElement.classList.remove('grid-empty-slot');
        slotElement.style.backgroundColor = 'var(--cell-color)';
        slotElement.style.borderStyle = 'solid';
        
        // Remove click event so it can't be clicked again
        slotElement.replaceWith(slotElement.cloneNode(true));
        
        // Remove the exact selected tile from the bank
        activeTile.remove();
        
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