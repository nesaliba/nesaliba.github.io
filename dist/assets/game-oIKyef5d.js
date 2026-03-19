import{BaseGame as o}from"./base-game-C7ld9M3p.js";import{CalculusQuestionBank as a}from"./questions-CI0Je68n.js";import"./auth-modal-CbJnTvdh.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";class r extends o{constructor(){super("Calculus Time Reversal"),this.totalAnomalies=10,this.integrity=3,this.anomaliesFixed=0,this.mistakes=0,this.isPlaying=!1,this.currentQuestion=null,this.initUI()}initUI(){this.initDOM(),document.body.addEventListener("pointerdown",()=>this.initAudio(),{once:!0}),document.getElementById("btn-play-again").addEventListener("click",()=>{this.initAudio(),document.getElementById("report-modal").style.display="none",this.resetGame()});for(let t=0;t<4;t++){const e=document.getElementById(`btn-opt-${t}`);e.addEventListener("click",()=>{this.initAudio(),this.checkAnswer(e,e.dataset.correct==="true")})}this.resetGame()}initDOM(){const t=document.getElementById("game-mount");let e=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";t.innerHTML=`
            <header class="game-header">
                <a href="/Math.html" class="back-btn">← Back to Menu</a>
                <h1>Calculus Time Reversal</h1>
                <p>Compute precise instantaneous rates of change and critical points to reverse systemic failures and save the timeline!</p>
                <div class="game-stats">
                    <div id="integrity-display" class="stat-box hp-box">Timeline Integrity: ⏳⏳⏳</div>
                    <div id="score-display" class="stat-box">Anomalies Fixed: 0 / 10</div>
                    ${e}
                </div>
            </header>
            <main class="game-container">
                <div class="arena-panel">
                    <div class="timeline-container" id="timeline-container">
                        <div class="anomaly-warning" id="anomaly-warning">ANOMALY DETECTED</div>
                        <div class="reactor-core" id="reactor-core"><div class="core-pulse"></div></div>
                        <div class="status-text" id="status-text">System destabilizing...</div>
                    </div>
                </div>
                <div class="battle-panel">
                    <div class="prompt-container" id="prompt-container"><div id="prompt-display">\\( \\text{Initializing Time Reversal Protocol...} \\)</div></div>
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
                        <button id="btn-play-again" class="btn-action primary" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">Play Again</button>
                        <a href="/Math.html" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `,this.settings.timer==="on"&&this.startTimer("game-timer")}resetGame(){this.integrity=3,this.anomaliesFixed=0,this.mistakes=0,this.isPlaying=!0,this.updateHUD(),this.setReactorState("normal"),this.nextQuestion()}updateHUD(){const t=Array(this.integrity).fill("⏳").join("");document.getElementById("integrity-display").innerText=`Timeline Integrity: ${t||"💥"}`,document.getElementById("score-display").innerText=`Anomalies Fixed: ${this.anomaliesFixed} / ${this.totalAnomalies}`}setReactorState(t){const e=document.getElementById("reactor-core"),i=document.getElementById("status-text");t==="danger"?(e.classList.add("danger"),i.innerText="CRITICAL TIMELINE INSTABILITY!",i.style.color="var(--core-danger)"):(e.classList.remove("danger"),i.innerText="System destabilizing... Reversal required.",i.style.color="var(--text-dark)")}generateQuestion(){const t=a[Math.floor(Math.random()*a.length)],e=t();let i=[...new Set(e.distractors)],n=1;for(;i.length<3;)i.push(`Error_${n++}`);let s=[e.answer,i[0],i[1],i[2]];return s.sort(()=>Math.random()-.5),{prompt:e.prompt,options:s,answer:e.answer}}nextQuestion(){if(this.isPlaying){this.currentQuestion=this.generateQuestion(),document.getElementById("prompt-display").innerHTML=`\\[ ${this.currentQuestion.prompt} \\]`;for(let t=0;t<4;t++){const e=document.getElementById(`btn-opt-${t}`);e.innerHTML=`\\( ${this.currentQuestion.options[t]} \\)`,e.dataset.correct=this.currentQuestion.options[t]===this.currentQuestion.answer,e.disabled=!1,e.style.backgroundColor="",e.style.color=""}window.MathJax&&window.MathJax.typesetPromise&&window.MathJax.typesetPromise([document.getElementById("prompt-container"),document.getElementById("options-grid")]).catch(t=>console.log("MathJax error:",t))}}checkAnswer(t,e){if(!this.isPlaying)return;const i=document.querySelectorAll(".btn-option");if(i.forEach(n=>n.disabled=!0),e)this.playHit(),this.anomaliesFixed++,t.style.backgroundColor="#16a34a",t.style.color="white",this.updateHUD(),this.setReactorState("normal"),this.anomaliesFixed>=this.totalAnomalies?setTimeout(()=>this.gameOver(!0),600):setTimeout(()=>this.nextQuestion(),800);else{this.playMiss(),this.mistakes++,this.integrity--,t.style.backgroundColor="#dc2626",t.style.color="white",i.forEach(s=>{s.dataset.correct==="true"&&(s.style.backgroundColor="#16a34a",s.style.color="white")}),this.updateHUD(),this.setReactorState("danger");const n=document.querySelector(".game-container");n.classList.add("shake-screen"),setTimeout(()=>n.classList.remove("shake-screen"),300),this.integrity<=0?setTimeout(()=>this.gameOver(!1),1200):setTimeout(()=>this.nextQuestion(),1500)}}gameOver(t){this.isPlaying=!1,t?this.playVictory():this.playGameOver();const e=document.getElementById("report-modal"),i=document.getElementById("report-title"),n=document.getElementById("report-details");i.innerText=t?"Timeline Secured!":"Catastrophic Failure!",i.style.color=t?"var(--math-primary)":"#ef4444";let s=`<p><strong>Anomalies Fixed:</strong> ${this.anomaliesFixed} / ${this.totalAnomalies}</p>`;s+=`<p><strong>Calculation Errors:</strong> ${this.mistakes}</p>`,t&&this.mistakes===0&&(s+='<p style="color:var(--math-primary); font-weight:bold; margin-top:0.5rem;">Flawless Execution. The timeline is perfectly preserved!</p>'),n.innerHTML=s,e.style.display="flex",this.saveProgress(this.mistakes)}}window.addEventListener("DOMContentLoaded",()=>{new r});
