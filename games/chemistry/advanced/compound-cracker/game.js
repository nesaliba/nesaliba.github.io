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

    // --- MODULAR PROCEDURAL DRAWING ENGINE ---
    drawSkeletal(id, container) {
        const width = 250;
        const height = 180;
        let innerHTML = '';

        // Hexagon coordinates for Aromatics & Cycloalkanes
        const hex = [
            { x: 125, y: 40 },  // Top
            { x: 175, y: 65 },  // Top-Right
            { x: 175, y: 115 }, // Bottom-Right
            { x: 125, y: 140 }, // Bottom
            { x: 75, y: 115 },  // Bottom-Left
            { x: 75, y: 65 }    // Top-Left
        ];

        // Pentagon coordinates for Cyclopentane
        const pent = [
            { x: 125, y: 40 },  // Top
            { x: 175, y: 76 },  // Mid-Right
            { x: 156, y: 135 }, // Bottom-Right
            { x: 94, y: 135 },  // Bottom-Left
            { x: 75, y: 76 }    // Mid-Left
        ];

        switch (id) {
            // ==========================================
            // ALKANES, ALKENES & ALKYNES
            // ==========================================
            case 'methane':
                innerHTML = `<text x="100" y="95" fill="var(--neon-green)" font-weight="bold" font-family="monospace" font-size="28">CH₄</text>`;
                break;
            case 'ethane':
                innerHTML = `<line x1="75" y1="100" x2="175" y2="80" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />`;
                break;
            case 'propane':
                innerHTML = `
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'butane':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="110" x2="220" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'pentane':
                innerHTML = `
                    <line x1="40" y1="110" x2="85" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="85" y1="60" x2="130" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="130" y1="110" x2="175" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="175" y1="60" x2="220" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case '2-methylpropane':
                innerHTML = `
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="125" y2="130" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case '2-methylbutane':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="110" x2="220" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="100" y2="130" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'ethene':
                innerHTML = `
                    <line x1="75" y1="94" x2="175" y2="74" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="75" y1="106" x2="175" y2="86" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'propene':
            case 'prop-1-ene':
                innerHTML = `
                    <line x1="50" y1="107" x2="125" y2="57" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="50" y1="117" x2="125" y2="67" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="62" x2="200" y2="112" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'but-1-ene':
                innerHTML = `
                    <line x1="40" y1="107" x2="100" y2="57" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="40" y1="117" x2="100" y2="67" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="62" x2="160" y2="112" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="112" x2="220" y2="62" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'but-2-ene':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="57" x2="160" y2="107" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="67" x2="160" y2="117" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="112" x2="220" y2="62" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case '2-methylpropene':
                innerHTML = `
                    <line x1="50" y1="107" x2="125" y2="57" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="50" y1="117" x2="125" y2="67" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="62" x2="200" y2="112" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="62" x2="125" y2="132" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'ethyne':
                innerHTML = `
                    <line x1="75" y1="88" x2="175" y2="68" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="75" y1="100" x2="175" y2="80" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="75" y1="112" x2="175" y2="92" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'propyne':
                innerHTML = `
                    <line x1="50" y1="98" x2="125" y2="48" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="50" y1="122" x2="125" y2="72" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'but-1-yne':
                innerHTML = `
                    <line x1="40" y1="98" x2="100" y2="48" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="40" y1="122" x2="100" y2="72" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="110" x2="220" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'but-2-yne':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="48" x2="160" y2="98" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="72" x2="160" y2="122" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="110" x2="220" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;

            // ==========================================
            // CYCLICS & AROMATICS
            // ==========================================
            case 'cyclopentane':
                innerHTML = `
                    <polygon points="${pent[0].x},${pent[0].y} ${pent[1].x},${pent[1].y} ${pent[2].x},${pent[2].y} ${pent[3].x},${pent[3].y} ${pent[4].x},${pent[4].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                `;
                break;
            case 'cyclohexane':
                innerHTML = `
                    <polygon points="${hex[0].x},${hex[0].y} ${hex[1].x},${hex[1].y} ${hex[2].x},${hex[2].y} ${hex[3].x},${hex[3].y} ${hex[4].x},${hex[4].y} ${hex[5].x},${hex[5].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                `;
                break;
            case 'cyclohexene':
                innerHTML = `
                    <polygon points="${hex[0].x},${hex[0].y} ${hex[1].x},${hex[1].y} ${hex[2].x},${hex[2].y} ${hex[3].x},${hex[3].y} ${hex[4].x},${hex[4].y} ${hex[5].x},${hex[5].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                    <line x1="${hex[0].x + 8}" y1="${hex[0].y + 4}" x2="${hex[1].x - 4}" y2="${hex[1].y + 2}" stroke="var(--neon-green)" stroke-width="2" />
                `;
                break;
            case 'benzene':
                innerHTML = `
                    <polygon points="${hex[0].x},${hex[0].y} ${hex[1].x},${hex[1].y} ${hex[2].x},${hex[2].y} ${hex[3].x},${hex[3].y} ${hex[4].x},${hex[4].y} ${hex[5].x},${hex[5].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                    <circle cx="125" cy="90" r="30" fill="none" stroke="var(--neon-green)" stroke-width="3" stroke-dasharray="8,6" />
                `;
                break;
            case 'toluene':
                innerHTML = `
                    <polygon points="${hex[0].x},${hex[0].y} ${hex[1].x},${hex[1].y} ${hex[2].x},${hex[2].y} ${hex[3].x},${hex[3].y} ${hex[4].x},${hex[4].y} ${hex[5].x},${hex[5].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                    <circle cx="125" cy="90" r="30" fill="none" stroke="var(--neon-green)" stroke-width="3" stroke-dasharray="8,6" />
                    <line x1="${hex[0].x}" y1="${hex[0].y}" x2="125" y2="10" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'phenol':
                innerHTML = `
                    <polygon points="${hex[0].x},${hex[0].y} ${hex[1].x},${hex[1].y} ${hex[2].x},${hex[2].y} ${hex[3].x},${hex[3].y} ${hex[4].x},${hex[4].y} ${hex[5].x},${hex[5].y}" fill="none" stroke="var(--neon-green)" stroke-width="4" stroke-linejoin="round" />
                    <circle cx="125" cy="90" r="30" fill="none" stroke="var(--neon-green)" stroke-width="3" stroke-dasharray="8,6" />
                    <line x1="${hex[0].x}" y1="${hex[0].y}" x2="125" y2="12" stroke="var(--neon-green)" stroke-width="4" />
                    <text x="114" y="8" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="15">OH</text>
                `;
                break;

            // ==========================================
            // ALCOHOLS & HALIDES
            // ==========================================
            case 'methanol':
                innerHTML = `<text x="75" y="95" fill="var(--neon-green)" font-weight="bold" font-family="monospace" font-size="24">CH₃-OH</text>`;
                break;
            case 'ethanol':
            case 'bromoethane':
            case 'chloroethane':
                const grpText = id === 'ethanol' ? 'OH' : (id === 'bromoethane' ? 'Br' : 'Cl');
                innerHTML = `
                    <line x1="60" y1="110" x2="130" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="130" y1="65" x2="190" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="194" y="112" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">${grpText}</text>
                `;
                break;
            case 'propan-1-ol':
            case '1-bromopropane':
            case '1-chloropropane':
                const grp3 = id === 'propan-1-ol' ? 'OH' : (id === '1-bromopropane' ? 'Br' : 'Cl');
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="160" y1="110" x2="200" y2="75" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="204" y="70" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">${grp3}</text>
                `;
                break;
            case 'propan-2-ol':
            case '2-bromopropane':
                const grpSec = id === 'propan-2-ol' ? 'OH' : 'Br';
                innerHTML = `
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="125" y2="125" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="114" y="140" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">${grpSec}</text>
                `;
                break;
            case 'butan-1-ol':
            case '1-bromobutane':
                const grp4Primary = id === 'butan-1-ol' ? 'OH' : 'Br';
                innerHTML = `
                    <line x1="40" y1="110" x2="90" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="90" y1="60" x2="140" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="140" y1="110" x2="190" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="190" y1="60" x2="220" y2="85" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="222" y="100" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">${grp4Primary}</text>
                `;
                break;
            case 'butan-2-ol':
            case '2-bromobutane':
                const grp4Sec = id === 'butan-2-ol' ? 'OH' : 'Br';
                innerHTML = `
                    <line x1="40" y1="110" x2="95" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="95" y1="60" x2="150" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="150" y1="110" x2="210" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="95" y1="60" x2="95" y2="125" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="85" y="140" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">${grp4Sec}</text>
                `;
                break;
            case '2-methylpropan-2-ol':
                innerHTML = `
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="125" y2="125" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="114" y="140" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">CH₃</text>
                    <line x1="125" y1="60" x2="125" y2="10" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="115" y="8" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
                `;
                break;
            case 'chloromethane':
            case 'bromomethane':
                const halogenText = id === 'chloromethane' ? 'Cl' : 'Br';
                innerHTML = `<text x="75" y="95" fill="var(--neon-green)" font-weight="bold" font-family="monospace" font-size="24">CH₃-${halogenText}</text>`;
                break;

            // ==========================================
            // CARBONYLS (ALDEHYDES & KETONES)
            // ==========================================
            case 'methanal':
                innerHTML = `
                    <line x1="121" y1="100" x2="121" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="129" y1="100" x2="129" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="120" y="30" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="125" y1="100" x2="75" y2="135" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="100" x2="175" y2="135" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="55" y="145" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                    <text x="178" y="145" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                `;
                break;
            case 'ethanal':
                innerHTML = `
                    <line x1="60" y1="110" x2="140" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="136" y1="65" x2="136" y2="15" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="144" y1="65" x2="144" y2="15" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="135" y="10" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="140" y1="65" x2="190" y2="95" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="194" y="105" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                `;
                break;
            case 'propanal':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="60" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="156" y1="110" x2="156" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="164" y1="110" x2="164" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="155" y="42" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="160" y1="110" x2="210" y2="140" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="214" y="150" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                `;
                break;
            case 'butanal':
                innerHTML = `
                    <line x1="40" y1="110" x2="90" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="90" y1="60" x2="140" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="140" y1="110" x2="190" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="186" y1="60" x2="186" y2="5" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="194" y1="60" x2="194" y2="5" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="185" y="0" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="190" y1="60" x2="230" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="232" y="105" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                `;
                break;
            case 'propanone':
                innerHTML = `
                    <line x1="50" y1="110" x2="125" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="125" y1="60" x2="200" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="121" y1="60" x2="121" y2="120" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="129" y1="60" x2="129" y2="120" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="120" y="135" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                `;
                break;
            case 'butanone':
                innerHTML = `
                    <line x1="40" y1="110" x2="95" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="95" y1="60" x2="150" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="150" y1="110" x2="210" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="91" y1="60" x2="91" y2="120" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="99" y1="60" x2="99" y2="120" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="90" y="135" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                `;
                break;
            case 'pentan-3-one':
                innerHTML = `
                    <line x1="40" y1="110" x2="85" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="85" y1="60" x2="130" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="130" y1="110" x2="175" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="175" y1="60" x2="220" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="126" y1="110" x2="126" y2="160" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="134" y1="110" x2="134" y2="160" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="125" y="175" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                `;
                break;

            // ==========================================
            // CARBOXYLIC ACIDS
            // ==========================================
            case 'methanoic_acid':
                innerHTML = `
                    <line x1="121" y1="100" x2="121" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="129" y1="100" x2="129" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="120" y="30" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="125" y1="100" x2="75" y2="135" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="55" y="145" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">H</text>
                    <line x1="125" y1="100" x2="175" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="178" y="105" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
                `;
                break;
            case 'ethanoic_acid':
                innerHTML = `
                    <line x1="60" y1="110" x2="140" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="136" y1="65" x2="136" y2="15" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="144" y1="65" x2="144" y2="15" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="135" y="10" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="140" y1="65" x2="190" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="194" y="70" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
                `;
                break;
            case 'propanoic_acid':
                innerHTML = `
                    <line x1="40" y1="110" x2="100" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="100" y1="65" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="156" y1="110" x2="156" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="164" y1="110" x2="164" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="153" y="32" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="160" y1="110" x2="210" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="214" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
                `;
                break;
            case 'butanoic_acid':
                innerHTML = `
                    <line x1="40" y1="110" x2="90" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="90" y1="60" x2="140" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="140" y1="110" x2="190" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="186" y1="60" x2="186" y2="5" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="194" y1="60" x2="194" y2="5" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="185" y="0" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="190" y1="60" x2="230" y2="60" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="232" y="65" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">OH</text>
                `;
                break;

            // ==========================================
            // ESTERS
            // ==========================================
            case 'methyl_methanoate':
                innerHTML = `
                    <line x1="60" y1="100" x2="110" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="106" y1="100" x2="106" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="114" y1="100" x2="114" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="105" y="32" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="110" y1="100" x2="150" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="154" y="105" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="170" y1="100" x2="210" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'methyl_ethanoate':
                innerHTML = `
                    <line x1="40" y1="110" x2="90" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="86" y1="70" x2="86" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="94" y1="70" x2="94" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="85" y="15" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="90" y1="70" x2="130" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="134" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="150" y1="110" x2="190" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'ethyl_ethanoate':
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
                break;
            case 'propyl_methanoate':
                innerHTML = `
                    <line x1="40" y1="100" x2="90" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="86" y1="100" x2="86" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="94" y1="100" x2="94" y2="40" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="85" y="32" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="90" y1="100" x2="130" y2="100" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="134" y="105" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="150" y1="100" x2="185" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="185" y1="65" x2="225" y2="105" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'methyl_propanoate':
                innerHTML = `
                    <line x1="40" y1="110" x2="80" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="80" y1="65" x2="120" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="116" y1="110" x2="116" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="124" y1="110" x2="124" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="115" y="42" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="120" y1="110" x2="160" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="164" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="180" y1="110" x2="220" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'ethyl_propanoate':
                innerHTML = `
                    <line x1="30" y1="110" x2="70" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="70" y1="65" x2="110" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="106" y1="110" x2="106" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="114" y1="110" x2="114" y2="50" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="105" y="42" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="110" y1="110" x2="150" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="154" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="170" y1="110" x2="205" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="205" y1="70" x2="240" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'propyl_ethanoate':
                innerHTML = `
                    <line x1="30" y1="110" x2="75" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="71" y1="70" x2="71" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="79" y1="70" x2="79" y2="20" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="70" y="15" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="75" y1="70" x2="120" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="124" y="115" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="140" y1="110" x2="175" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="175" y1="70" x2="210" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="210" y1="110" x2="245" y2="70" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;

            // ==========================================
            // ETHERS
            // ==========================================
            case 'dimethyl_ether':
                innerHTML = `
                    <line x1="60" y1="90" x2="115" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="119" y="96" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="135" y1="90" x2="190" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'diethyl_ether':
                innerHTML = `
                    <line x1="40" y1="110" x2="80" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="80" y1="65" x2="115" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="119" y="96" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="135" y1="90" x2="170" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="170" y1="65" x2="210" y2="110" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;
            case 'methyl_ethyl_ether':
                innerHTML = `
                    <line x1="40" y1="110" x2="80" y2="65" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <line x1="80" y1="65" x2="115" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                    <text x="119" y="96" fill="var(--neon-amber)" font-weight="bold" font-family="monospace" font-size="16">O</text>
                    <line x1="135" y1="90" x2="185" y2="90" stroke="var(--neon-green)" stroke-width="4" stroke-linecap="round" />
                `;
                break;

            // ==========================================
            // DEFAULT FALLBACK (Fallback to text formula)
            // ==========================================
            default:
                const fallbackCompound = COMPOUNDS.find(c => c.id === id);
                const displayText = fallbackCompound ? fallbackCompound.condensed : id;
                innerHTML = `<text x="50%" y="55%" fill="var(--neon-green)" font-weight="bold" font-family="monospace" font-size="18" dominant-baseline="middle" text-anchor="middle">${displayText}</text>`;
                break;
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
        this.drawSkeletal(target.id, board);

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
        this.drawSkeletal(reactant.id, board);

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