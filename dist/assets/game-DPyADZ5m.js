import{BaseGame as r}from"./base-game-CS9j8eWU.js";import{StatisticsQuestionBank as n}from"./questions-CbWp0bxR.js";import"./state-manager-DvNmcDpL.js";import"./firebase-init-ZMan-bHY.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";class o extends r{constructor(){super("Statistics Heist"),this.totalVaults=8,this.heat=3,this.vaultsCracked=0,this.mistakes=0,this.isPlaying=!1,this.currentQuestion=null,this.initUI()}initUI(){this.initDOM(),document.body.addEventListener("pointerdown",()=>this.initAudio(),{once:!0}),document.getElementById("btn-play-again").addEventListener("click",()=>{this.initAudio(),document.getElementById("report-modal").style.display="none",this.resetGame()});for(let t=0;t<4;t++){const e=document.getElementById(`btn-opt-${t}`);e.addEventListener("click",()=>{this.initAudio(),this.checkAnswer(e,e.dataset.correct==="true")})}this.resetGame()}initDOM(){const t=document.getElementById("game-mount");let e=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";t.innerHTML=`
            <header class="game-header">
                <a href="/Math.html" class="back-btn">← Back to Menu</a>
                <h1>Statistics Heist</h1>
                <p>Plan and execute the perfect heist using probability, expected value, permutations, and combinations!</p>
                <div class="game-stats">
                    <div id="heat-display" class="stat-box hp-box">Heat Level: 🟢🟢🟢</div>
                    <div id="score-display" class="stat-box">Vaults Cracked: 0 / 8</div>
                    ${e}
                </div>
            </header>
            <main class="game-container">
                <div class="arena-panel blueprint-panel">
                    <div class="heist-container" id="heist-container">
                        <div class="alarm-status" id="alarm-status">SYSTEM SECURE</div>
                        <div class="vault-graphic" id="vault-graphic"><div class="vault-wheel"></div></div>
                        <div class="status-text" id="status-text">Awaiting next sequence...</div>
                    </div>
                </div>
                <div class="battle-panel">
                    <div class="prompt-container" id="prompt-container"><div id="prompt-display">\\( \\text{Reviewing heist blueprints...} \\)</div></div>
                    <div class="options-grid" id="options-grid">
                        <button class="btn-option" id="btn-opt-0"></button><button class="btn-option" id="btn-opt-1"></button>
                        <button class="btn-option" id="btn-opt-2"></button><button class="btn-option" id="btn-opt-3"></button>
                    </div>
                </div>
            </main>
            <div class="modal-overlay" id="report-modal" style="display:none;">
                <div class="modal-content">
                    <h2 id="report-title"></h2>
                    <div id="report-details" style="margin: 1.5rem 0; font-size: 1.1rem; text-align: left; background: var(--details-bg); padding: 1rem; border-radius: 8px;"></div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                        <button id="btn-play-again" class="btn-action primary" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">Plan Another Heist</button>
                        <a href="/Math.html" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `,this.settings.timer==="on"&&this.startTimer("game-timer")}resetGame(){this.heat=3,this.vaultsCracked=0,this.mistakes=0,this.isPlaying=!0,this.updateHUD(),this.setAlarmState("secure"),this.nextQuestion()}updateHUD(){const t=Array(this.heat).fill("🟢").join("");document.getElementById("heat-display").innerText=`Security Tolerance: ${t||"🚨"}`,document.getElementById("score-display").innerText=`Phases Cleared: ${this.vaultsCracked} / ${this.totalVaults}`}setAlarmState(t){const e=document.getElementById("alarm-status"),s=document.getElementById("vault-graphic"),a=document.getElementById("heist-container"),i=document.getElementById("status-text");t==="danger"?(e.classList.add("danger"),s.classList.add("danger"),a.classList.add("danger"),e.innerText="ALARM TRIGGERED!",i.innerText="Heat level increasing. Rerouting..."):(e.classList.remove("danger"),s.classList.remove("danger"),a.classList.remove("danger"),e.innerText="SYSTEM SECURE",i.innerText="Awaiting next sequence...")}generateQuestion(){const t=n[Math.floor(Math.random()*n.length)],e=t();let s=[...new Set(e.distractors)],a=1;for(;s.length<3;)s.push(`Error_${a++}`);let i=[e.answer,s[0],s[1],s[2]];return i.sort(()=>Math.random()-.5),{prompt:e.prompt,options:i,answer:e.answer}}nextQuestion(){if(this.isPlaying){this.currentQuestion=this.generateQuestion(),document.getElementById("prompt-display").innerHTML=`\\[ ${this.currentQuestion.prompt} \\]`;for(let t=0;t<4;t++){const e=document.getElementById(`btn-opt-${t}`);e.innerHTML=`\\( ${this.currentQuestion.options[t]} \\)`,e.dataset.correct=this.currentQuestion.options[t]===this.currentQuestion.answer,e.disabled=!1,e.style.backgroundColor="",e.style.color=""}window.MathJax&&window.MathJax.typesetPromise&&window.MathJax.typesetPromise([document.getElementById("prompt-container"),document.getElementById("options-grid")]).catch(t=>console.log("MathJax error:",t))}}checkAnswer(t,e){if(!this.isPlaying)return;const s=document.querySelectorAll(".btn-option");if(s.forEach(a=>a.disabled=!0),e)this.playHit(),this.vaultsCracked++,t.style.backgroundColor="#22c55e",t.style.color="white",this.updateHUD(),this.setAlarmState("secure"),this.vaultsCracked>=this.totalVaults?setTimeout(()=>this.gameOver(!0),600):setTimeout(()=>this.nextQuestion(),800);else{this.playMiss(),this.mistakes++,this.heat--,t.style.backgroundColor="#ef4444",t.style.color="white",s.forEach(i=>{i.dataset.correct==="true"&&(i.style.backgroundColor="#22c55e",i.style.color="white")}),this.updateHUD(),this.setAlarmState("danger");const a=document.querySelector(".game-container");a.classList.add("shake-screen"),setTimeout(()=>a.classList.remove("shake-screen"),300),this.heat<=0?setTimeout(()=>this.gameOver(!1),1200):setTimeout(()=>this.nextQuestion(),1500)}}gameOver(t){this.isPlaying=!1,t?this.playVictory():this.playGameOver();const e=document.getElementById("report-modal"),s=document.getElementById("report-title"),a=document.getElementById("report-details");s.innerText=t?"Heist Successful!":"BUSTED!",s.style.color=t?"var(--safe-green)":"var(--alarm-red)";let i=`<p><strong>Phases Cleared:</strong> ${this.vaultsCracked} / ${this.totalVaults}</p>`;i+=`<p><strong>Calculations Botched:</strong> ${this.mistakes}</p>`,t&&this.mistakes===0&&(i+='<p style="color:var(--blueprint-blue); font-weight:bold; margin-top:0.5rem;">Ghost Protocol achieved. No trace left behind!</p>'),a.innerHTML=i,e.style.display="flex",this.saveProgress(this.mistakes)}}window.addEventListener("DOMContentLoaded",()=>{new o});
