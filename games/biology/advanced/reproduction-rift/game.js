import { BaseGame } from '/games/shared/base-game.js';

class ReproductionRift extends BaseGame {
    constructor() {
        super('Reproduction Rift');
        this.currentLevel = 1;
        this.maxLevels = 5;
        this.levelAttempts = 0;
        this.totalMistakes = 0;
        this.isGameOver = false;
        this.currentQuestion = null;
        this.selectedWord = null;
        
        this.initDOM();

        if (this.settings.timer === 'on') {
            this.startTimer('game-timer');
        }
        
        this.loadLevel();
    }
    
    initDOM() {
        const mount = document.getElementById('game-mount');
        let timerHTML = this.settings.timer === 'on' ? `<div class="stat-box-rift" id="game-timer" style="${this.settings.timerVisible === 'hidden' ? 'visibility:hidden;' : ''}">00:00</div>` : '';
        mount.innerHTML = `
            <header class="rift-header">
                <a href="/Biology.html" class="back-btn glow-btn">← Back to Menu</a>
                <h1 class="glow-text-teal">Reproduction Rift</h1>
                <div class="game-stats-rift">
                    <div class="stat-box-rift" id="level-display">Level 1 / 5</div>
                    ${timerHTML}
                    <div class="stat-box-rift stars" id="stars-container">★★★</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
            </header>
            <main class="rift-container" id="rift-main">
                <div class="rift-healing-overlay" id="rift-animation"><div class="healing-core"></div></div>
                <div class="scenario-panel-rift">
                    <h2 id="scenario-title" class="glow-text-magenta">Scenario Title</h2>
                    <p id="scenario-desc" class="scenario-text">Stimulus description goes here.</p>
                    <div id="feedback-msg" class="feedback-msg-rift"></div>
                </div>
                <div class="interactive-area-rift" id="interactive-area"></div>
            </main>
        `;
    }

    // --- PROCEDURAL GENERATORS & QUESTION POOLS ---

    // Level 1: Cell Division (Procedural)
    generateLevel1() {
        const organisms = [{ n: 46, name: "human" }, { n: 78, name: "dog" }, { n: 38, name: "cat" }];
        const org = organisms[Math.floor(Math.random() * organisms.length)];
        
        const scenarios = [
            {
                q: `A ${org.name} cell (2n=${org.n}) completes Meiosis I. What is the ploidy and chromosome count of each daughter cell?`,
                a: `Haploid (n=${org.n/2}), with sister chromatids still attached`,
                w: [`Diploid (2n=${org.n}), with sister chromatids attached`, `Haploid (n=${org.n/2}), with single unreplicated chromosomes`, `Diploid (2n=${org.n}), with single unreplicated chromosomes`],
                exp: `Meiosis I separates homologous chromosomes, halving the chromosome number (haploid), but sister chromatids remain attached until Meiosis II.`
            },
            {
                q: `A ${org.name} cell (2n=${org.n}) is in Anaphase of Mitosis. How many individual chromosomes are currently moving toward the poles in the entire cell?`,
                a: `${org.n * 2}`,
                w: [`${org.n}`, `${org.n / 2}`, `${org.n * 4}`],
                exp: `During Anaphase of Mitosis, sister chromatids are pulled apart. Once separated, each chromatid is considered an individual chromosome, temporarily doubling the count.`
            }
        ];
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    // Level 2: Hormonal Cycle (Procedural - T/F + Justification)
    generateLevel2() {
        const scenarios = [
            {
                q: "It is Day 14 of the ovarian cycle. A patient's anterior pituitary fails to produce an LH surge. Evaluate the outcome:",
                a: "False. Reason: Ovulation will not occur because Luteinizing Hormone (LH) triggers follicular rupture.",
                w: [
                    "True. Reason: FSH alone is sufficient to cause ovulation.", 
                    "False. Reason: The endometrium will immediately shed due to lack of LH.", 
                    "True. Reason: Estrogen spikes will force the egg out of the ovary."
                ],
                exp: "The LH surge is the specific, essential biological trigger for ovulation (release of the secondary oocyte)."
            },
            {
                q: "During the luteal phase (Day 21), the corpus luteum prematurely degrades. Evaluate the outcome:",
                a: "True. Reason: Progesterone will drop, causing the endometrium to shed prematurely.",
                w: [
                    "False. Reason: Estrogen will maintain the uterine lining indefinitely.", 
                    "True. Reason: FSH will drop, causing a new follicle to mature instantly.", 
                    "False. Reason: LH will take over the function of maintaining the endometrium."
                ],
                exp: "The corpus luteum secretes progesterone to maintain the endometrium; its degradation leads to menstruation."
            }
        ];
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    // Level 3: Fertilization (Pre-built Pool)
    generateLevel3() {
        const scenarios = [
            {
                q: "A sperm cell reaches the secondary oocyte but its acrosome fails to function. What step of fertilization is blocked?",
                a: "Digestion of a path through the zona pellucida.",
                w: ["The cortical reaction hardening the egg.", "Binding to the plasma membrane receptors.", "Fusion of the male and female pronuclei."],
                exp: "The acrosome contains digestive enzymes necessary to break through the zona pellucida surrounding the egg."
            },
            {
                q: "If polyspermy occurs (multiple sperm fertilize one egg), what biological mechanism failed?",
                a: "The cortical reaction.",
                w: ["The acrosome reaction.", "Sperm capacitation.", "Meiosis II completion."],
                exp: "The cortical reaction releases enzymes that harden the zona pellucida immediately after one sperm enters, preventing lethal polyspermy."
            }
        ];
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    // Level 4: Embryology (Pre-built - Fill in the blank)
    generateLevel4() {
        return {
            type: 'fill-blank',
            title: "Embryonic Germ Layers",
            q: "Match the embryonic germ layers to the primary tissues they differentiate into during gastrulation.",
            sentences: [
                "The[BLANK1] forms the nervous system and epidermis (skin).",
                "The [BLANK2] forms the skeletal, muscular, and circulatory systems.",
                "The [BLANK3] forms the lining of the digestive and respiratory tracts."
            ],
            blanks: ["BLANK1", "BLANK2", "BLANK3"],
            answers: {"BLANK1": "Ectoderm", "BLANK2": "Mesoderm", "BLANK3": "Endoderm"},
            bank: ["Ectoderm", "Mesoderm", "Endoderm", "Trophoblast"],
            exp: "Ectoderm forms outer/neural tissues, Mesoderm forms middle structural tissues, and Endoderm forms inner organ linings."
        };
    }

    // Level 5: Biotechnology (Procedural)
    generateLevel5() {
        const scenarios = [
            {
                q: "During an IVF procedure, Preimplantation Genetic Screening (PGS) is performed on a 3-day-old cleavage stage embryo to check for aneuploidy. One cell is removed. Why doesn't this harm the embryo's development?",
                a: "Early blastomeres are totipotent and can still form a complete organism.",
                w: ["The removed cell is naturally replaced by the mother's stem cells.", "The embryo is already a fully differentiated fetus at day 3.", "Only the trophoblast is sampled at this early stage."],
                exp: "Early cleavage stage cells are totipotent, meaning the remaining cells can easily compensate and form all necessary embryonic and extraembryonic tissues."
            },
            {
                q: "A patient undergoes IVF. The physician extracts eggs without first administering an hCG (LH-mimicking) trigger shot. What is the likely result?",
                a: "The retrieved eggs will be immature and stuck in Prophase I.",
                w: ["The eggs will be fertilized immediately upon retrieval.", "The eggs will have already formed a diploid zygote.", "The eggs will lack a protective zona pellucida."],
                exp: "The LH surge (or hCG trigger) is essential to tell the primary oocyte to resume meiosis and mature prior to retrieval."
            }
        ];
        return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    // --- GAME ENGINE ---

    loadLevel() {
        if (this.currentLevel > this.maxLevels) {
            this.winGame();
            return;
        }

        this.levelAttempts = 0;
        this.updateStars();
        this.updateProgress();
        
        document.getElementById('level-display').textContent = `Level ${this.currentLevel} / ${this.maxLevels}`;
        document.getElementById('feedback-msg').textContent = '';
        
        let levelData;
        switch(this.currentLevel) {
            case 1: levelData = this.generateLevel1(); document.getElementById('scenario-title').textContent = "Phase 1: Cell Division"; break;
            case 2: levelData = this.generateLevel2(); document.getElementById('scenario-title').textContent = "Phase 2: Hormonal Cycles"; break;
            case 3: levelData = this.generateLevel3(); document.getElementById('scenario-title').textContent = "Phase 3: Fertilization"; break;
            case 4: levelData = this.generateLevel4(); document.getElementById('scenario-title').textContent = "Phase 4: Embryogenesis"; break;
            case 5: levelData = this.generateLevel5(); document.getElementById('scenario-title').textContent = "Phase 5: Biotechnology"; break;
        }
        
        this.currentQuestion = levelData;
        document.getElementById('scenario-desc').textContent = levelData.q;
        
        const area = document.getElementById('interactive-area');
        area.innerHTML = '';
        
        if (levelData.type === 'fill-blank') {
            this.renderFillBlank(area, levelData);
        } else {
            this.renderMultipleChoice(area, levelData);
        }
    }

    renderMultipleChoice(container, data) {
        const choices = [...data.w, data.a].sort(() => Math.random() - 0.5);
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.addEventListener('click', () => this.handleAnswer(choice === data.a, data.exp));
            container.appendChild(btn);
        });
    }

    renderFillBlank(container, data) {
        let html = '<div class="fib-container">';
        data.sentences.forEach(sentence => {
            let processed = sentence;
            data.blanks.forEach(b => {
                processed = processed.replace(`[${b}]`, `<span class="blank-slot" data-id="${b}">[   ]</span>`);
            });
            html += `<p>${processed}</p>`;
        });
        html += '</div><div class="word-bank">';
        
        const shuffledBank = [...data.bank].sort(() => Math.random() - 0.5);
        shuffledBank.forEach(word => {
            html += `<span class="word-bank-item">${word}</span>`;
        });
        
        html += '</div><button class="submit-fib-btn" id="fib-submit">Verify Sequence</button>';
        container.innerHTML = html;
        
        this.selectedWord = null;

        // Word Bank Clicks
        const words = container.querySelectorAll('.word-bank-item');
        words.forEach(w => {
            w.addEventListener('click', () => {
                this.initAudio();
                words.forEach(el => el.classList.remove('selected'));
                w.classList.add('selected');
                this.selectedWord = w.textContent;
            });
        });

        // Blank Clicks
        const blanks = container.querySelectorAll('.blank-slot');
        blanks.forEach(b => {
            b.addEventListener('click', () => {
                if (this.selectedWord) {
                    this.initAudio();
                    b.textContent = this.selectedWord;
                    words.forEach(el => el.classList.remove('selected'));
                    this.selectedWord = null;
                }
            });
        });

        // Submit Logic
        document.getElementById('fib-submit').addEventListener('click', () => {
            let allCorrect = true;
            let allFilled = true;
            
            blanks.forEach(b => {
                if (b.textContent === '[   ]') allFilled = false;
                if (b.textContent !== data.answers[b.dataset.id]) allCorrect = false;
            });

            if (!allFilled) {
                document.getElementById('feedback-msg').textContent = "Please fill all blanks before verifying.";
                return;
            }

            if (allCorrect) {
                this.handleAnswer(true, data.exp);
            } else {
                blanks.forEach(b => b.textContent = '[   ]'); // Reset
                this.handleAnswer(false, data.exp);
            }
        });
    }

    handleAnswer(isCorrect, explanation) {
        if (this.isGameOver) return;
        
        if (isCorrect) {
            this.playHit();
            document.getElementById('feedback-msg').innerHTML = "Correct! " + explanation;
            document.getElementById('feedback-msg').style.color = "var(--glow-teal)";
            this.showRiftHealed();
        } else {
            this.playMiss();
            this.levelAttempts++;
            this.totalMistakes++;
            this.updateStars();
            
            document.body.classList.add('red-pulse');
            setTimeout(() => document.body.classList.remove('red-pulse'), 600);
            
            // Appended visual cue prompting the user to try again in a distinct color
            document.getElementById('feedback-msg').innerHTML = "Incorrect. " + explanation + "<br><br><span style='color: var(--text-light); opacity: 0.9; display: inline-block; animation: pulse-alert 1s infinite;'>Please try answering the question again.</span>";
            document.getElementById('feedback-msg').style.color = "var(--glow-magenta)";
        }
    }

    updateStars() {
        const starsCount = Math.max(0, 3 - this.levelAttempts);
        document.getElementById('stars-container').textContent = '★'.repeat(starsCount) + '☆'.repeat(3 - starsCount);
    }

    updateProgress() {
        const percent = ((this.currentLevel - 1) / this.maxLevels) * 100;
        document.getElementById('progress-fill').style.width = `${percent}%`;
    }

    showRiftHealed() {
        this.isGameOver = true;
        const rift = document.getElementById('rift-animation');
        rift.classList.add('healing');
        
        setTimeout(() => {
            rift.classList.remove('healing');
            this.currentLevel++;
            this.isGameOver = false;
            this.loadLevel();
        }, 2500);
    }

    winGame() {
        this.isGameOver = true;
        this.stopTimer();
        this.playVictory();
        document.getElementById('progress-fill').style.width = `100%`;
        this.saveProgress(this.totalMistakes);
        
        const modal = document.querySelector('game-report-modal');
        let timeStr = this.settings.timer === 'on' ? `Time: ${document.getElementById('game-timer').textContent}` : '';
        modal.show(
            'Rift Fully Repaired!', 
            `You successfully stabilized all biological systems and mastered the Biology 30 outcomes!<br><br>${timeStr}<br>Total Mistakes: ${this.totalMistakes}`, 
            true, 
            '/Biology.html'
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReproductionRift();
});