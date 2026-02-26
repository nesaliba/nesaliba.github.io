// --- Data Setup ---
const columns = ["", "Alkali Metals", "Halogens", "Alkaline Earth Metals", "Noble Gases"];
const rows =[
    "Group or Family", 
    "Property of Metal or Non-Metal", 
    "Number of Valence e-", 
    "Relative Reactivity", 
    "Example Element A Symbol", 
    "Example Element B Name"
];

// Data is ordered left-to-right, top-to-bottom relative to the 4 data columns.
const propertyData =[
    // Group or Family
    { matchId: "am-grp", text: "Group 1 Column 1" },
    { matchId: "hal-grp", text: "Group 17 Column 17" },
    { matchId: "aem-grp", text: "Group 2 Column 2" },
    { matchId: "ng-grp", text: "Group 18 Column 18" },
    
    // Property of Metal or Non-Metal
    { matchId: "am-prop", text: "shiny, solid, conductor of electricity" },
    { matchId: "hal-prop", text: "non-malleable, non-shiny, solid, liquid, or gas" },
    { matchId: "aem-prop", text: "malleable, ductile, conductor of electricity" },
    { matchId: "ng-prop", text: "solid, liquid, gas, non-shiny" },
    
    // Number of Valence e-
    { matchId: "am-val", text: "1 valence e-" },
    { matchId: "hal-val", text: "7 valence e-" },
    { matchId: "aem-val", text: "2 valence e-" },
    { matchId: "ng-val", text: "8 valence e-" },
    
    // Relative Reactivity
    { matchId: "am-react", text: "metal with high reactivity" },
    { matchId: "hal-react", text: "Non-metal with very high reactivity" },
    { matchId: "aem-react", text: "Metal with very high reactivity" },
    { matchId: "ng-react", text: "Non-reactive non-metal" },
    
    // Example Element A Symbol
    { matchId: "am-sym", text: "Li" },
    { matchId: "hal-sym", text: "F" },
    { matchId: "aem-sym", text: "Mg" },
    { matchId: "ng-sym", text: "He" },
    
    // Example Element B Name
    { matchId: "am-name", text: "potassium" },
    { matchId: "hal-name", text: "chlorine" },
    { matchId: "aem-name", text: "calcium" },
    { matchId: "ng-name", text: "neon" }
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
    const dataColumnsCount = columns.length - 1; // 4 data columns

    rows.forEach((rowHeader) => {
        // Row Header (Leftmost column)
        const headerCell = document.createElement('div');
        headerCell.className = 'grid-cell grid-header';
        headerCell.textContent = rowHeader;
        board.appendChild(headerCell);

        // Fill slots for each group category
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
    const shuffledData =[...propertyData].sort(() => Math.random() - 0.5);
    
    shuffledData.forEach((item, index) => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = item.text;
        tile.dataset.matchId = item.matchId;
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