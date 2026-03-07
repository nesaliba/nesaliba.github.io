import { BaseGame } from '/games/shared/base-game.js';

const ELEMENTS = [
    // Alkali Metals
    { name: "Lithium", sym: "Li", radius: "152 pm", ie: "520 kJ/mol", en: "0.98", category: "alkali", note: "Highly reactive metal, low density. Trend indicates top-left region." },
    { name: "Sodium", sym: "Na", radius: "186 pm", ie: "496 kJ/mol", en: "0.93", category: "alkali", note: "Violently reactive with water. Trend indicates large radius, low IE." },
    { name: "Potassium", sym: "K", radius: "227 pm", ie: "419 kJ/mol", en: "0.82", category: "alkali", note: "Extremely reactive, oxidizes instantly. Very large atomic radius." },
    { name: "Rubidium", sym: "Rb", radius: "248 pm", ie: "403 kJ/mol", en: "0.82", category: "alkali", note: "Highly reactive alkali metal. Larger and less energetic than Potassium." },
    { name: "Cesium", sym: "Cs", radius: "265 pm", ie: "376 kJ/mol", en: "0.79", category: "alkali", note: "Largest alkali metal. Lowest electronegativity of any element." },

    // Alkaline Earth Metals
    { name: "Magnesium", sym: "Mg", radius: "160 pm", ie: "738 kJ/mol", en: "1.31", category: "transition", note: "Alkaline earth metal. Burns with a bright white light." },
    { name: "Calcium", sym: "Ca", radius: "197 pm", ie: "590 kJ/mol", en: "1.00", category: "transition", note: "Alkaline earth metal. Heavier and more reactive than Magnesium." },
    { name: "Barium", sym: "Ba", radius: "222 pm", ie: "503 kJ/mol", en: "0.89", category: "transition", note: "Heavy alkaline earth metal. Large radius, low ionization energy." },
    { name: "Beryllium", sym: "Be", radius: "112 pm", ie: "900 kJ/mol", en: "1.57", category: "transition", note: "Smallest alkaline earth metal. Unusually high IE for its group." },
    { name: "Strontium", sym: "Sr", radius: "215 pm", ie: "550 kJ/mol", en: "0.95", category: "transition", note: "Alkaline earth metal between Calcium and Barium in all trends." },

    // Transition Metals
    { name: "Iron", sym: "Fe", radius: "126 pm", ie: "762 kJ/mol", en: "1.83", category: "transition", note: "Dense, magnetic. Multiple oxidation states (+2, +3)." },
    { name: "Copper", sym: "Cu", radius: "128 pm", ie: "745 kJ/mol", en: "1.90", category: "transition", note: "Highly conductive, forms blue/green compounds." },
    { name: "Gold", sym: "Au", radius: "144 pm", ie: "890 kJ/mol", en: "2.54", category: "transition", note: "Highly unreactive transition metal. Very dense." },
    { name: "Silver", sym: "Ag", radius: "165 pm", ie: "731 kJ/mol", en: "1.93", category: "transition", note: "Highest electrical conductivity of all metals. Moderately reactive." },
    { name: "Zinc", sym: "Zn", radius: "122 pm", ie: "906 kJ/mol", en: "1.65", category: "transition", note: "Common transition metal. Relatively high IE for a d-block element." },
    { name: "Nickel", sym: "Ni", radius: "124 pm", ie: "737 kJ/mol", en: "1.91", category: "transition", note: "Magnetic transition metal. Similar radius to Iron and Copper." },
    { name: "Chromium", sym: "Cr", radius: "128 pm", ie: "653 kJ/mol", en: "1.66", category: "transition", note: "Hard, lustrous metal. Forms vivid colored compounds." },
    { name: "Manganese", sym: "Mn", radius: "127 pm", ie: "717 kJ/mol", en: "1.55", category: "transition", note: "Multiple oxidation states (+2 to +7). Found in steel alloys." },
    { name: "Titanium", sym: "Ti", radius: "147 pm", ie: "658 kJ/mol", en: "1.54", category: "transition", note: "Lightweight, corrosion-resistant. High strength-to-weight ratio." },
    { name: "Platinum", sym: "Pt", radius: "139 pm", ie: "870 kJ/mol", en: "2.28", category: "transition", note: "Very unreactive, dense transition metal. Used as a catalyst." },

    // Nonmetals
    { name: "Carbon", sym: "C", radius: "77 pm", ie: "1086 kJ/mol", en: "2.55", category: "nonmetal", note: "Nonmetal, forms massive covalent networks. Intermediate EN." },
    { name: "Oxygen", sym: "O", radius: "73 pm", ie: "1314 kJ/mol", en: "3.44", category: "nonmetal", note: "Highly electronegative gas, essential for combustion." },
    { name: "Nitrogen", sym: "N", radius: "75 pm", ie: "1402 kJ/mol", en: "3.04", category: "nonmetal", note: "Very high IE and EN. Triple bond in N2 makes it very stable." },
    { name: "Sulfur", sym: "S", radius: "104 pm", ie: "1000 kJ/mol", en: "2.58", category: "nonmetal", note: "Period 3 nonmetal. Larger radius and lower IE than Oxygen." },
    { name: "Phosphorus", sym: "P", radius: "107 pm", ie: "1012 kJ/mol", en: "2.19", category: "nonmetal", note: "Nonmetal below Nitrogen. Noticeably lower EN and higher radius." },
    { name: "Selenium", sym: "Se", radius: "117 pm", ie: "941 kJ/mol", en: "2.55", category: "nonmetal", note: "Chalcogen below Sulfur. Similar EN but larger radius." },
    { name: "Hydrogen", sym: "H", radius: "53 pm", ie: "1312 kJ/mol", en: "2.20", category: "nonmetal", note: "Smallest atom. High IE despite period 1 placement. Unique trends." },

    // Halogens
    { name: "Fluorine", sym: "F", radius: "71 pm", ie: "1681 kJ/mol", en: "3.98", category: "halogen", note: "Most electronegative element. Extremely reactive nonmetal." },
    { name: "Chlorine", sym: "Cl", radius: "99 pm", ie: "1251 kJ/mol", en: "3.16", category: "halogen", note: "Highly reactive, toxic gas. High electronegativity." },
    { name: "Bromine", sym: "Br", radius: "114 pm", ie: "1140 kJ/mol", en: "2.96", category: "halogen", note: "Liquid halogen at room temperature. Dense, corrosive." },
    { name: "Iodine", sym: "I", radius: "133 pm", ie: "1008 kJ/mol", en: "2.66", category: "halogen", note: "Solid halogen. Largest of the common halogens, lowest IE in group." },

    // Noble Gases
    { name: "Helium", sym: "He", radius: "32 pm", ie: "2372 kJ/mol", en: "N/A", category: "noble", note: "Highest ionization energy. Completely inert." },
    { name: "Neon", sym: "Ne", radius: "69 pm", ie: "2080 kJ/mol", en: "N/A", category: "noble", note: "Inert gas. Emits distinct glow under electrical discharge." },
    { name: "Argon", sym: "Ar", radius: "97 pm", ie: "1520 kJ/mol", en: "N/A", category: "noble", note: "Inert, heavily used to shield reactive processes." },
    { name: "Krypton", sym: "Kr", radius: "110 pm", ie: "1351 kJ/mol", en: "N/A", category: "noble", note: "Noble gas below Argon. Larger radius, lower IE than Argon." },
    { name: "Xenon", sym: "Xe", radius: "130 pm", ie: "1170 kJ/mol", en: "N/A", category: "noble", note: "Largest common noble gas. Can form compounds under extreme conditions." },

    // Metalloids & Post-transition
    { name: "Silicon", sym: "Si", radius: "111 pm", ie: "786 kJ/mol", en: "1.90", category: "nonmetal", note: "Semiconductor metalloid. Intermediate IE and EN, period 3." },
    { name: "Boron", sym: "B", radius: "87 pm", ie: "800 kJ/mol", en: "2.04", category: "nonmetal", note: "Metalloid with small radius. Higher IE than neighboring metals." },
    { name: "Arsenic", sym: "As", radius: "121 pm", ie: "947 kJ/mol", en: "2.18", category: "nonmetal", note: "Metalloid below Phosphorus. Larger radius, slightly lower IE." },
    { name: "Aluminum", sym: "Al", radius: "143 pm", ie: "577 kJ/mol", en: "1.61", category: "transition", note: "Lightweight post-transition metal. Low IE, forms Al3+ readily." },
    { name: "Lead", sym: "Pb", radius: "175 pm", ie: "716 kJ/mol", en: "2.33", category: "transition", note: "Heavy post-transition metal. Large radius for a period 6 metal." },
    { name: "Tin", sym: "Sn", radius: "141 pm", ie: "709 kJ/mol", en: "1.96", category: "transition", note: "Post-transition metal. Amphoteric oxide, two oxidation states." }
];

const BIOMES = [
    { id: 'volcanic', name: 'Volcanic Badlands', hazard: 'explosion' },
    { id: 'trench', name: 'Deep-Sea Trench', hazard: 'pressure' },
    { id: 'arctic', name: 'Arctic Tundra', hazard: 'corrosion' },
    { id: 'cave', name: 'Ancient Caverns', hazard: 'explosion' }
];

class PeriodicProspector extends BaseGame {
    constructor() {
        super("Periodic Prospector");
        this.wave = 1;
        this.maxWaves = 10;
        this.mistakes = 0;
        this.maxMistakes = this.settings.maxMistakes || 5;
        this.lastElementName = null;

        this.initDOM();
        if (this.settings.timer === 'on') this.startTimer('game-timer');
        this.nextWave();
    }

    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        
        mount.innerHTML = `
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Periodic Prospector</h1>
                <div class="game-stats">
                    ${timerHTML}
                    <div class="stat-box" id="health-box">Suit Integrity: ${this.maxMistakes - this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Dig Site: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="prospector-panel" id="main-panel">
                    <div class="panel-header">
                        <span>🛰️ Field Scanner Active</span>
                        <span id="biome-label" style="color: #94a3b8; font-size: 0.9rem;">Locating...</span>
                    </div>
                    
                    <div class="hud-layout">
                        <div class="viewport-frame" id="viewport">
                            <div class="biome-bg volcanic" id="biome-bg"></div>
                            <div class="env-particles"></div>
                            <div class="deposit-node" id="deposit-node">
                                <div class="rock-shell" id="rock-shell" data-sym="?"></div>
                            </div>
                        </div>

                        <div class="scanner-hud">
                            <div class="hud-title">Data Readout</div>
                            <div class="data-line">
                                <span class="data-label">Radius:</span>
                                <span class="data-value" id="val-radius">Scanning...</span>
                            </div>
                            <div class="data-line">
                                <span class="data-label">Ion. Energy:</span>
                                <span class="data-value" id="val-ie">Scanning...</span>
                            </div>
                            <div class="data-line">
                                <span class="data-label">Electroneg:</span>
                                <span class="data-value" id="val-en">Scanning...</span>
                            </div>
                            <div class="field-notes" id="val-note">
                                Analyzing reactivity signature...
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 1rem; color: #cbd5e1; font-weight: 600;">Identify the element based on periodic trends:</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `;
    }

    generateScenario() {
        const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

        // Avoid back-to-back repeat of the same element
        const available = this.lastElementName
            ? ELEMENTS.filter(e => e.name !== this.lastElementName)
            : ELEMENTS;
        const element = available[Math.floor(Math.random() * available.length)];

        const biome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
        
        // Generate options (1 correct, 3 distractors)
        let distractors = ELEMENTS.filter(e => e.name !== element.name);
        distractors = shuffle(distractors).slice(0, 3);
        
        let options = distractors.map(d => d.name);
        options.push(element.name);
        options = shuffle(options);

        return { element, biome, options };
    }

    nextWave() {
        document.getElementById('wave-box').innerText = `Dig Site: ${this.wave}/${this.maxWaves}`;
        this.currentScenario = this.generateScenario();
        const { element, biome, options } = this.currentScenario;

        // Reset Visuals
        const viewport = document.getElementById('viewport');
        const depositNode = document.getElementById('deposit-node');
        const rockShell = document.getElementById('rock-shell');
        
        viewport.className = 'viewport-frame'; // remove hazard classes
        depositNode.className = 'deposit-node'; // remove revealed class
        rockShell.setAttribute('data-sym', '?');
        
        document.getElementById('biome-bg').className = `biome-bg ${biome.id}`;
        document.getElementById('biome-label').innerText = `Location: ${biome.name}`;

        // Populate HUD
        document.getElementById('val-radius').innerText = element.radius;
        document.getElementById('val-ie').innerText = element.ie;
        document.getElementById('val-en').innerText = element.en;
        document.getElementById('val-note').innerText = `> ${element.note}`;

        // Build Options
        const optsContainer = document.getElementById('options-container');
        optsContainer.innerHTML = '';
        
        options.forEach(optName => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = optName;
            btn.onclick = () => {
                this.initAudio();
                const isCorrect = (optName === element.name);
                this.handleAnswer(btn, isCorrect, element.name);
            };
            optsContainer.appendChild(btn);
        });
    }

    handleAnswer(btn, isCorrect, correctAnswer) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const { element, biome } = this.currentScenario;
        const depositNode = document.getElementById('deposit-node');
        const rockShell = document.getElementById('rock-shell');
        const viewport = document.getElementById('viewport');

        // Track the answered element to prevent back-to-back repeats
        this.lastElementName = element.name;

        if (isCorrect) {
            btn.classList.add('correct');
            this.playHit();
            
            // Reveal Crystal Animation
            depositNode.className = `deposit-node revealed cat-${element.category}`;
            rockShell.setAttribute('data-sym', element.sym);
            
            setTimeout(() => {
                this.wave++;
                if (this.wave > this.maxWaves) this.endGame(true);
                else this.nextWave();
            }, 1800);

        } else {
            btn.classList.add('wrong');
            this.playMiss();
            buttons.forEach(b => { if (b.innerHTML === correctAnswer) b.classList.add('correct'); });
            
            this.mistakes++;
            document.getElementById('health-box').innerText = `Suit Integrity: ${Math.max(0, this.maxMistakes - this.mistakes)}/${this.maxMistakes}`;
            
            // Hazard Consequence Animation
            viewport.classList.add(`hazard-${biome.hazard}`);
            
            setTimeout(() => {
                if (this.mistakes >= this.maxMistakes) this.endGame(false);
                else {
                    this.wave++;
                    if (this.wave > this.maxWaves) this.endGame(true);
                    else this.nextWave();
                }
            }, 2000);
        }
    }

    endGame(win) {
        this.stopTimer();
        
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds / 60)}m ${this.elapsedSeconds % 60}s` : '';
        
        const errorWord = this.mistakes === 1 ? 'error' : 'errors';
        const desc = win 
            ? `<span style="color:#1e293b;">Expedition successful! You masterfully applied periodic trends to identify unknown elements with only ${this.mistakes} ${errorWord}.${timeStr}</span>`
            : `<span style="color:#1e293b;">Suit integrity critically compromised due to unexpected chemical reactions. Review your periodic trends (radius, electronegativity, ionization energy) before venturing out again.</span>`;

        modal.show(
            win ? 'Prospector Elite!' : 'Evacuation Required!', 
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

window.addEventListener('DOMContentLoaded', () => new PeriodicProspector());