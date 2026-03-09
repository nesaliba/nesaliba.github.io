import{BaseGame as v}from"./base-game-CS9j8eWU.js";import"./state-manager-DvNmcDpL.js";import"./firebase-init-ZMan-bHY.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";const c={CuSO4:{name:"Copper(II) Sulfate",rgb:"56, 182, 255",M:159.61,satC:1.4},KMnO4:{name:"Potassium Permanganate",rgb:"168, 85, 247",M:158.03,satC:.4},NaCl:{name:"Sodium Chloride",rgb:"203, 213, 225",M:58.44,satC:6.1}};class h extends v{constructor(){super("Solution Strategist"),this.wave=1,this.maxWaves=10,this.mistakes=0,this.maxMistakes=this.settings.maxMistakes||10,this.currentScenario=null,this.prevVolume=0,this.initDOM(),this.settings.timer==="on"&&this.startTimer("game-timer"),this.nextWave()}initDOM(){const e=document.getElementById("game-mount");let s=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";e.innerHTML=`
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Solution Strategist</h1>
                <div class="game-stats">
                    ${s}
                    <div class="stat-box" id="health-box">Budget Integrity: ${this.maxMistakes-this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Formulation: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="crisis-panel">
                    
                    <div class="diagnostic-overlay" id="diagnostic-overlay">
                        <div class="diagnostic-title">⚠️ Formulation Error</div>
                        <div class="diagnostic-message" id="diagnostic-msg">Review your parameters.</div>
                        <button class="btn-action primary" id="btn-dismiss-diag">Recalculate</button>
                    </div>

                    <div class="scenario-header">🧪 Laboratory Protocol</div>
                    <div class="scenario-text" id="scenario-prompt">Loading scenario...</div>

                    <details class="reference-panel">
                        <summary>📊 Quick Reference Guide</summary>
                        <div class="ref-content">
                            <strong>Formulas:</strong> C = n / V &nbsp;|&nbsp; n = m / M &nbsp;|&nbsp; C₁V₁ = C₂V₂<br><br>
                            <strong>Molar Masses:</strong> CuSO₄: 159.61 g/mol &nbsp;|&nbsp; KMnO₄: 158.03 g/mol &nbsp;|&nbsp; NaCl: 58.44 g/mol<br><br>
                            <strong>Saturation (@ 25°C):</strong> CuSO₄: 1.4 M &nbsp;|&nbsp; KMnO₄: 0.4 M &nbsp;|&nbsp; NaCl: 6.1 M
                        </div>
                    </details>

                    <div class="lab-bench">
                        <div class="fluid-stream" id="fluid-stream"></div>
                        <div class="beaker-container">
                            <div class="beaker">
                                <div class="liquid" id="beaker-liquid"></div>
                                <div class="crystals" id="beaker-crystals">
                                    <div class="crystal"></div><div class="crystal"></div><div class="crystal"></div>
                                    <div class="crystal"></div><div class="crystal"></div><div class="crystal"></div>
                                </div>
                                <div class="markings">
                                    <div class="mark"></div><div class="mark"></div><div class="mark"></div>
                                    <div class="mark"></div><div class="mark"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="controls-grid">
                        <div class="control-group">
                            <label>Solute Mass (g)</label>
                            <input type="range" id="slider-mass" min="0" max="1000" step="1" value="0">
                            <span class="control-value" id="val-mass">0 g</span>
                        </div>
                        <div class="control-group">
                            <label>Solution Volume (L)</label>
                            <input type="range" id="slider-vol" min="0" max="2.0" step="0.05" value="0.05">
                            <span class="control-value" id="val-vol">0.05 L</span>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <button class="btn-action primary" id="btn-submit" style="width: 100%; max-width: 300px;">Submit Formulation</button>
                    </div>

                </div>
            </main>
        `,document.getElementById("slider-mass").addEventListener("input",t=>this.handleInput(t,"mass")),document.getElementById("slider-vol").addEventListener("input",t=>this.handleInput(t,"vol")),document.getElementById("btn-submit").addEventListener("click",()=>this.checkAnswer()),document.getElementById("btn-dismiss-diag").addEventListener("click",()=>{document.getElementById("diagnostic-overlay").classList.remove("active")})}generateScenario(){const e=Object.keys(c),s=e[Math.floor(Math.random()*e.length)],t=c[s];let i;this.wave<=3?i="prep":this.wave<=7?i="dilution":i="saturation";let o,a,l;if(i==="prep"){a=Math.floor(Math.random()*15)*.1+.5;const d=t.satC*.8,n=(Math.random()*(d-.1)+.1).toFixed(2);o=n*a*t.M,l=`<strong>Water Treatment Scenario:</strong> Prepare exactly ${a.toFixed(2)} L of a ${n} M solution of ${t.name}. Set the correct mass and volume.`}else if(i==="dilution"){const n=(t.satC*.9*(Math.random()*.4+.1)).toFixed(2);a=Math.floor(Math.random()*15)*.1+.5,o=n*a*t.M,l=`<strong>Pharmacy Compounding:</strong> You pipetted stock solution containing exactly ${o.toFixed(1)} g of ${t.name} into the flask. Dilute it with water to reach a final concentration of ${n} M.`}else i==="saturation"&&(a=Math.floor(Math.random()*10)*.1+.5,o=t.satC*a*t.M,l=`<strong>Quality Control:</strong> Formulate exactly ${a.toFixed(2)} L of a saturated ${t.name} solution without causing precipitation.`);return{type:i,solute:t,targetM:o,targetV:a,prompt:l}}nextWave(){document.getElementById("wave-box").innerText=`Formulation: ${this.wave}/${this.maxWaves}`,this.currentScenario=this.generateScenario(),document.getElementById("scenario-prompt").innerHTML=this.currentScenario.prompt;const e=document.getElementById("slider-mass"),s=document.getElementById("slider-vol");s.value=.05,this.prevVolume=.05,this.currentScenario.type==="dilution"?(e.value=this.currentScenario.targetM,e.disabled=!0,s.min=(this.currentScenario.targetM/this.currentScenario.solute.M/this.currentScenario.solute.satC).toFixed(2)):(e.value=0,e.disabled=!1,s.min=.05),this.updateVisuals()}handleInput(e,s){if(s==="vol"){const t=parseFloat(e.target.value),i=document.getElementById("fluid-stream");t>this.prevVolume&&(i.classList.add("pouring"),clearTimeout(this.pourTimeout),this.pourTimeout=setTimeout(()=>i.classList.remove("pouring"),300)),this.prevVolume=t}this.updateVisuals()}updateVisuals(){const e=parseFloat(document.getElementById("slider-mass").value),s=parseFloat(document.getElementById("slider-vol").value);document.getElementById("val-mass").innerText=e.toFixed(1)+" g",document.getElementById("val-vol").innerText=s.toFixed(2)+" L";const t=this.currentScenario.solute,o=e/t.M/s,a=document.getElementById("beaker-liquid"),l=document.getElementById("beaker-crystals"),d=s/2*90;a.style.height=`${Math.max(5,d)}%`;const n=Math.min(1,o/t.satC),r=Math.max(.1,n*.9);a.style.backgroundColor=`rgba(${t.rgb}, ${r})`,o>t.satC?l.style.opacity="1":l.style.opacity="0"}checkAnswer(){const e=parseFloat(document.getElementById("slider-mass").value),s=parseFloat(document.getElementById("slider-vol").value),t=this.currentScenario.targetM,i=this.currentScenario.targetV,o=this.currentScenario.solute,a=Math.abs(e-t)/t,l=Math.abs(s-i)/i,d=a<=.05,n=l<=.05;if(d&&n)this.initAudio(),this.playHit(),setTimeout(()=>{this.wave++,this.wave>this.maxWaves?this.endGame(!0):this.nextWave()},600);else{this.initAudio(),this.playMiss(),this.mistakes++,document.getElementById("health-box").innerText=`Budget Integrity: ${Math.max(0,this.maxMistakes-this.mistakes)}/${this.maxMistakes}`;let r="";const m=e/o.M/s;this.currentScenario.type==="prep"?n?r="Incorrect mass. Did you convert Concentration to Moles (n = C×V), then Moles to Mass (m = n×M)?":r="Check your volume setting. Read the target volume carefully!":this.currentScenario.type==="dilution"?r="Incorrect final volume. Use the dilution formula (C₁V₁ = C₂V₂) or Moles/Target Concentration to find the required total volume.":this.currentScenario.type==="saturation"&&(n?m>o.satC?r="Precipitation detected! You exceeded the maximum solubility limit for this volume.":r="Solution is unsaturated. More solute can be dissolved to reach the saturation point.":r="Set the correct volume first before calculating saturation mass.");const u=document.getElementById("diagnostic-overlay");document.getElementById("diagnostic-msg").innerText=r,u.classList.add("active"),this.mistakes>=this.maxMistakes&&setTimeout(()=>this.endGame(!1),1500)}}endGame(e){this.stopTimer();const s=document.querySelector("game-report-modal");let t=this.settings.timer==="on"?`<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds/60)}m ${this.elapsedSeconds%60}s`:"";const i=e?`Exceptional formulating! You successfully completed all scenarios with only ${this.mistakes} errors.${t}`:"Budget depleted due to wasted chemical reagents. Review your concentration formulas and try again.";s.show(e?"Protocols Completed!":"Project Terminated!",i,e,"/Chemistry.html"),e?(this.playVictory(),this.saveProgress(this.mistakes)):this.playGameOver()}}window.addEventListener("DOMContentLoaded",()=>new h);
