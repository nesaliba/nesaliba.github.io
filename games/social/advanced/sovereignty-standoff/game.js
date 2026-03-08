import { BaseGame } from '/games/shared/base-game.js';
import { db, doc, getDoc, setDoc } from '/js/firebase-init.js';
import { StateManager } from '/js/state-manager.js';

class SovereigntyStandoff extends BaseGame {
    constructor() {
        super("Sovereignty Standoff");
        
        this.maxCrises = 5;
        this.crisesResolved = 0;
        this.tension = 50;
        this.influence = 0;
        this.mistakes = 0;
        
        this.isPlaying = false;
        this.currentQuestion = null;
        this.questionBank = null;
        this.usedIndices =[];

        this.initUI();
    }

    async initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            this.resetGame();
        });

        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById(`btn-opt-${i}`);
            btn.addEventListener('click', () => {
                this.initAudio();
                this.checkAnswer(btn, btn.dataset.correct === 'true');
            });
        }

        await this.loadQuestions();
        this.resetGame();
    }

    async loadQuestions() {
        const promptDisplay = document.getElementById('prompt-display');
        promptDisplay.innerHTML = "Decrypting classified intel from secure database...";
        
        try {
            const docRef = doc(db, "questionBanks", "sovereignty-standoff");
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.questionBank = docSnap.data().crises;
            } else {
                promptDisplay.innerHTML = "First-time setup: Uploading default dossier to secure server...";
                
                const defaultCrises =[
                    {
                        prompt: "SUBJECT: ARCTIC RESOURCE CORRIDOR\n\nTwo rival nations claim overlapping Exclusive Economic Zones in the newly thawed Arctic. A skirmish has broken out between coast guards over a newly discovered oil reserve.",
                        answer: "Propose a joint-custody resource extraction treaty under UNCLOS arbitration.",
                        wrongOptions:[
                            "Deploy naval strike groups to enforce unilateral sovereignty.",
                            "Completely abandon the claim to appease the rival nation.",
                            "Fund a proxy rebel group in the rival's capital to distract them."
                        ]
                    },
                    {
                        prompt: "SUBJECT: COLLAPSING CEASEFIRE\n\nA fragile ceasefire in a resource-rich region is breaking down after a leaked communiqué revealed unauthorized troop movements by the leading military faction.",
                        answer: "Dispatch international peacekeeping observers while freezing targeted assets of violating generals.",
                        wrongOptions:[
                            "Immediately launch preemptive airstrikes on suspected military buildups.",
                            "Ignore the intelligence and continue funding the regional government unconditionally.",
                            "Withdraw all diplomatic staff and close borders to all refugees fleeing the area."
                        ]
                    },
                    {
                        prompt: "SUBJECT: REFUGEE EMERGENCY\n\nA sudden regime collapse has pushed 500,000 refugees to your heavily militarized border. Winter is approaching rapidly, and resources are critically low.",
                        answer: "Establish UNHCR-managed humanitarian corridors while processing asylum claims sequentially.",
                        wrongOptions:[
                            "Seal the border completely using military force to protect domestic stability.",
                            "Detain all incoming populations in indefinite holding facilities without processing.",
                            "Deport all refugees back into the active conflict zone immediately."
                        ]
                    },
                    {
                        prompt: "SUBJECT: SOVEREIGNTY VS INTERVENTION\n\nA sovereign state is accused of severe human rights violations against an ethnic minority. The state claims these internal matters are protected by absolute sovereignty.",
                        answer: "Invoke the Responsibility to Protect (R2P) doctrine to push for targeted Security Council sanctions.",
                        wrongOptions:[
                            "Invade the country unilaterally without a UN mandate.",
                            "Publicly support the state's right to absolute sovereignty regardless of actions.",
                            "Cut off all global internet and civilian trade access to the region."
                        ]
                    },
                    {
                        prompt: "SUBJECT: PANDEMIC NATIONALISM\n\nA highly infectious new virus has emerged. Your nation holds the only patent for an effective vaccine, while developing nations face a massive health collapse.",
                        answer: "Waive intellectual property rights temporarily to allow global generic manufacturing.",
                        wrongOptions:[
                            "Hoard all supplies for your own population, ignoring the global outbreak.",
                            "Sell the vaccine at a 500% markup to the highest bidding nations only.",
                            "Seize all medical shipments crossing through your international airspace."
                        ]
                    },
                    {
                        prompt: "SUBJECT: CYBER ELECTION INTERFERENCE\n\nIntelligence agencies confirm a foreign superpower has launched a massive misinformation cyber-campaign to destabilize your upcoming democratic elections.",
                        answer: "Publicly declassify the evidence and impose coordinated multilateral economic sanctions.",
                        wrongOptions:[
                            "Launch a destructive retaliatory cyber-attack on their civilian power grid.",
                            "Cancel the democratic elections indefinitely for 'national security'.",
                            "Cover up the interference to prevent public panic."
                        ]
                    }
                ];

                await setDoc(docRef, { crises: defaultCrises });
                this.questionBank = defaultCrises;
            }
        } catch (error) {
            console.error("Error loading questions:", error);
            promptDisplay.innerHTML = "Unable to connect to intelligence network. Please disable your adblocker or tracking protection and refresh.";
            document.getElementById('options-grid').style.display = 'none';
        }
    }

    resetGame() {
        this.crisesResolved = 0;
        this.tension = 50;
        this.influence = 0;
        this.mistakes = 0;
        this.usedIndices =[];
        this.isPlaying = true;
        
        this.updateStatsUI();
        this.nextCrisis();
    }

    updateStatsUI() {
        document.getElementById('influence-display').innerText = `Diplomatic Influence: ${this.influence}`;
        document.getElementById('resolved-display').innerText = `Crises Resolved: ${this.crisesResolved} / ${this.maxCrises}`;
        
        const tensionFill = document.getElementById('tension-fill');
        tensionFill.style.width = `${Math.min(100, Math.max(0, this.tension))}%`;
        
        if (this.tension >= 75) {
            tensionFill.classList.add('critical');
        } else {
            tensionFill.classList.remove('critical');
        }
    }

    nextCrisis() {
        if (!this.isPlaying || !this.questionBank) return; 
        
        const availableIndices = this.questionBank.map((_, i) => i).filter(i => !this.usedIndices.includes(i));
        
        if (availableIndices.length === 0) {
            this.usedIndices =[]; 
        }

        const pickArray = availableIndices.length > 0 ? availableIndices : this.questionBank.map((_, i) => i);
        const randIndex = pickArray[Math.floor(Math.random() * pickArray.length)];
        this.usedIndices.push(randIndex);
        
        const rawQuestion = this.questionBank[randIndex];
        
        let distractors = rawQuestion.wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
        let options = [rawQuestion.answer, ...distractors].sort(() => Math.random() - 0.5);
        
        this.currentQuestion = {
            prompt: rawQuestion.prompt,
            answer: rawQuestion.answer,
            options: options
        };
        
        const dossier = document.getElementById('dossier-container');
        dossier.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('prompt-display').innerHTML = this.currentQuestion.prompt;
            
            for (let i = 0; i < 4; i++) {
                const btn = document.getElementById(`btn-opt-${i}`);
                btn.innerHTML = this.currentQuestion.options[i];
                btn.dataset.correct = (this.currentQuestion.options[i] === this.currentQuestion.answer);
                btn.disabled = false;
                
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }
            dossier.style.opacity = '1';
        }, 300);
    }

    checkAnswer(selectedBtn, isCorrect) {
        if (!this.isPlaying) return;
        
        const btns = document.querySelectorAll('.btn-option');
        btns.forEach(b => b.disabled = true);

        if (isCorrect) {
            this.playHit();
            selectedBtn.style.backgroundColor = '#0f766e';
            selectedBtn.style.borderColor = '#14b8a6';
            
            this.influence += 100;
            this.tension = Math.max(0, this.tension - 10);
            this.crisesResolved++;
            this.updateStatsUI();
            
            if (this.crisesResolved >= this.maxCrises) {
                setTimeout(() => this.gameOver(true), 1000);
            } else {
                setTimeout(() => this.nextCrisis(), 1200);
            }
        } else {
            this.playMiss();
            this.mistakes++;
            selectedBtn.style.backgroundColor = '#991b1b';
            selectedBtn.style.borderColor = '#ef4444';
            
            btns.forEach(b => {
                if (b.dataset.correct === 'true') {
                    b.style.backgroundColor = '#0f766e';
                    b.style.borderColor = '#14b8a6';
                }
            });

            this.tension += 25;
            this.influence = Math.max(0, this.influence - 25);
            this.updateStatsUI();

            const container = document.querySelector('.game-container');
            container.classList.add('shake-screen');
            setTimeout(() => container.classList.remove('shake-screen'), 300);

            if (this.tension >= 100) {
                setTimeout(() => this.gameOver(false), 1200);
            } else {
                setTimeout(() => this.nextCrisis(), 2000);
            }
        }
    }

    gameOver(isVictory) {
        this.isPlaying = false;
        if (isVictory) this.playVictory();
        else this.playGameOver();
        
        const modal = document.getElementById('report-modal');
        const title = document.getElementById('report-title');
        const details = document.getElementById('report-details');
        
        title.innerText = isVictory ? "World Stabilized!" : "Global Conflict Triggered!";
        title.style.color = isVictory ? "var(--subject-primary)" : "var(--danger-red)";
        
        let html = `<p><strong>Diplomatic Influence:</strong> ${this.influence}</p>`;
        html += `<p><strong>Crises Resolved:</strong> ${this.crisesResolved} / ${this.maxCrises}</p>`;
        html += `<p><strong>Final Tension Level:</strong> ${this.tension}%</p>`;
        html += `<p><strong>Policy Missteps:</strong> ${this.mistakes}</p>`;
        
        if (isVictory && this.mistakes === 0) {
            html += `<p style="color:var(--subject-primary); font-weight:bold; margin-top:0.5rem;">Flawless Diplomacy. A true statesman!</p>`;
        } else if (!isVictory) {
            html += `<p style="color:var(--danger-red); font-weight:bold; margin-top:0.5rem;">Your aggressive policies pushed the world into chaos.</p>`;
        }
        
        details.innerHTML = html;
        modal.style.display = 'flex';
        
        this.saveCustomProgress(isVictory);
    }

    async saveCustomProgress(isVictory) {
        if (StateManager.isUserLoggedIn) {
            try {
                const fbModule = await import('/js/firebase-init.js');
                const { auth, db, collection, addDoc } = fbModule;
                
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: `Sovereignty Standoff`,
                        score: this.influence,
                        mistakes: this.mistakes,
                        time: 0,
                        date: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn("Could not save progress.", error);
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new SovereigntyStandoff();
});