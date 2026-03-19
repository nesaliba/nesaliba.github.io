const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/auth-modal-CbJnTvdh.js","assets/auth-modal-B9R-_un4.css"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper-BXl3LOEh.js";import{BaseGame as m}from"./base-game-C7ld9M3p.js";import{d as u,S as p}from"./auth-modal-CbJnTvdh.js";import{doc as y,getDoc as h,setDoc as g}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";class b extends m{constructor(){super("Syntax Surgeon"),this.mode="novice",this.isPlaying=!1,this.score=0,this.mistakes=0,this.timeRemaining=60,this.currentQuestion=null,this.questionBank=null,this.initUI()}playFinished(){this.playVictory()}initUI(){this.initDOM(),document.body.addEventListener("pointerdown",()=>this.initAudio(),{once:!0});const e=["novice","resident","attending"];e.forEach(i=>{document.getElementById(`btn-${i}`).addEventListener("click",t=>{this.initAudio(),!this.isPlaying&&(e.forEach(o=>document.getElementById(`btn-${o}`).classList.remove("active")),t.target.classList.add("active"),this.mode=i,document.getElementById("mode-display").innerText=`Ward: ${i.charAt(0).toUpperCase()+i.slice(1)}`)})}),document.getElementById("btn-start").addEventListener("click",()=>{this.initAudio(),this.startGame()}),document.getElementById("btn-play-again").addEventListener("click",()=>{this.initAudio(),document.getElementById("report-modal").style.display="none",this.resetGameReady()});for(let i=0;i<4;i++){const t=document.getElementById(`btn-opt-${i}`);t.addEventListener("click",()=>{this.initAudio(),this.checkAnswer(t,t.dataset.correct==="true")})}this.loadQuestions()}initDOM(){const e=document.getElementById("game-mount");let i=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";e.innerHTML=`
            <header class="game-header">
                <a href="/English.html" class="back-btn">← Back to Menu</a>
                <h1>Syntax Surgeon</h1>
                <p>Operate on flawed sentences under pressure. Improve flow, fix errors, and save the paragraph!</p>
                <div class="game-stats">
                    <div id="mode-display" class="stat-box">Ward: Novice</div>
                    <div id="timer-display" class="stat-box">Time: 60</div>
                    <div id="score-display" class="stat-box">Repairs: 0</div>
                    <div id="accuracy-display" class="stat-box">Vitals: Stable</div>
                    ${i}
                </div>
            </header>
            <main class="game-container">
                <div class="controls-panel">
                    <div class="control-group">
                        <h3>Select Ward</h3>
                        <div class="mode-buttons">
                            <button id="btn-novice" class="btn-mode active">Novice (Grammar & Punctuation)</button>
                            <button id="btn-resident" class="btn-mode">Resident (Modifiers & Structure)</button>
                            <button id="btn-attending" class="btn-mode">Attending (Style & Conciseness)</button>
                        </div>
                    </div>
                    <div class="control-group">
                        <h3>Operation Tools</h3>
                        <button id="btn-start" class="btn-action primary" style="width: 100%; margin-bottom: 1rem;">Start Operation</button>
                        <p id="instruction-text" style="font-size: 0.95rem; color: var(--text-dark);">Click <strong>Start Operation</strong> to begin. Select the most accurate revision.</p>
                    </div>
                </div>
                <div class="battle-panel">
                    <div class="monitor-container" id="monitor-container">
                        <div class="scan-line"></div>
                        <div id="prompt-display">Waiting for patient... Press Start Operation.</div>
                    </div>
                    <div class="options-grid" id="options-grid">
                        <button class="btn-option" id="btn-opt-0" disabled>Tool 1</button>
                        <button class="btn-option" id="btn-opt-1" disabled>Tool 2</button>
                        <button class="btn-option" id="btn-opt-2" disabled>Tool 3</button>
                        <button class="btn-option" id="btn-opt-3" disabled>Tool 4</button>
                    </div>
                </div>
            </main>
            <div class="modal-overlay" id="report-modal" style="display:none;">
                <div class="modal-content">
                    <h2 id="report-title"></h2>
                    <div id="report-details" style="margin: 1.5rem 0; font-size: 1.1rem; text-align: left; background: var(--details-bg); padding: 1rem; border-radius: 8px;"></div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                        <button id="btn-play-again" class="btn-action primary" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">New Patient</button>
                        <a href="/English.html" class="btn-secondary" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `}async loadQuestions(){const e=document.getElementById("prompt-display"),i=document.getElementById("btn-start");e.innerText="Connecting to hospital database...",i.disabled=!0;try{const t=y(u,"questionBanks","syntax-surgeon"),o=await h(t);if(o.exists())this.questionBank=o.data();else{e.innerText="First-time setup: Uploading patient files to cloud...";const n={novice:[],resident:[],attending:[]};if(window.SyntaxQuestionBank){for(const s of["novice","resident","attending"]){const a=window.SyntaxQuestionBank[s];n[s]=a.map(d=>{const r=d();return{prompt:r.prompt,answer:r.answer,wrongOptions:r.options.filter(l=>l!==r.answer)}})}await g(t,n),this.questionBank=n}}e.innerText="Patient files loaded. Ready to operate.",i.disabled=!1}catch(t){console.error("Error loading questions:",t),e.innerText="Connection blocked. Please disable your adblocker or tracking protection and refresh.",i.disabled=!0}}resetGameReady(){this.isPlaying=!1,document.getElementById("btn-start").disabled=!1,document.getElementById("monitor-container").classList.remove("error","success"),document.getElementById("prompt-display").innerText="Waiting for patient... Press Start Operation.",document.getElementById("timer-display").innerText="Time: 60",document.getElementById("score-display").innerText="Repairs: 0",document.getElementById("accuracy-display").innerText="Vitals: Stable",document.getElementById("accuracy-display").style.color="var(--text-dark)",document.querySelectorAll(".btn-option").forEach(t=>{t.innerText=`Tool ${t.id.slice(-1)}`,t.disabled=!0,t.style.backgroundColor="",t.style.color=""})}startGame(){this.isPlaying=!0,this.score=0,this.mistakes=0,this.timeRemaining=60,document.getElementById("btn-start").disabled=!0,document.getElementById("score-display").innerText="Repairs: 0",this.updateVitalsDisplay(),this.timerInterval=setInterval(()=>{this.timeRemaining--,document.getElementById("timer-display").innerText=`Time: ${this.timeRemaining}`,this.timeRemaining<=0&&this.endGame()},1e3),this.nextPatient()}updateVitalsDisplay(){const e=document.getElementById("accuracy-display");this.mistakes===0?(e.innerText="Vitals: Stable",e.style.color="#16a34a"):this.mistakes<3?(e.innerText="Vitals: Elevated",e.style.color="#eab308"):(e.innerText="Vitals: Critical!",e.style.color="#ef4444")}nextPatient(){if(!this.isPlaying)return;document.getElementById("monitor-container").classList.remove("error","success");const i=this.questionBank[this.mode],t=i[Math.floor(Math.random()*i.length)];let o=t.wrongOptions.sort(()=>Math.random()-.5).slice(0,3),n=[t.answer,...o].sort(()=>Math.random()-.5);this.currentQuestion={prompt:t.prompt,answer:t.answer,options:n},document.getElementById("prompt-display").innerText=`[Flawed Syntax Detected]
"${this.currentQuestion.prompt}"`;for(let s=0;s<4;s++){const a=document.getElementById(`btn-opt-${s}`);a.innerText=this.currentQuestion.options[s],a.dataset.correct=this.currentQuestion.options[s]===this.currentQuestion.answer,a.disabled=!1,a.style.backgroundColor="",a.style.color=""}}checkAnswer(e,i){if(!this.isPlaying)return;const t=document.querySelectorAll(".btn-option");t.forEach(n=>n.disabled=!0);const o=document.getElementById("monitor-container");if(i)this.playHit(),o.classList.add("success"),e.style.backgroundColor="#16a34a",e.style.color="white",this.score++,this.timeRemaining+=2,document.getElementById("score-display").innerText=`Repairs: ${this.score}`,document.getElementById("timer-display").innerText=`Time: ${this.timeRemaining}`,setTimeout(()=>this.nextPatient(),600);else{this.playMiss(),this.mistakes++,o.classList.add("error"),e.style.backgroundColor="#dc2626",e.style.color="white",t.forEach(s=>{s.dataset.correct==="true"&&(s.style.backgroundColor="#16a34a",s.style.color="white")}),this.timeRemaining-=5,this.updateVitalsDisplay(),document.getElementById("timer-display").innerText=`Time: ${this.timeRemaining}`;const n=document.querySelector(".game-container");n.classList.add("shake-screen"),setTimeout(()=>n.classList.remove("shake-screen"),300),this.timeRemaining<=0?setTimeout(()=>this.endGame(),1e3):setTimeout(()=>this.nextPatient(),1500)}}endGame(){clearInterval(this.timerInterval),this.isPlaying=!1,this.playFinished();const e=document.getElementById("report-modal"),i=document.getElementById("report-details");let t=`<p><strong>Ward Operated:</strong> ${this.mode.charAt(0).toUpperCase()+this.mode.slice(1)}</p>`;t+=`<p><strong>Successful Repairs:</strong> ${this.score}</p>`,t+=`<p><strong>Surgical Errors:</strong> ${this.mistakes}</p>`,this.score>10&&this.mistakes===0?t+='<p style="color:var(--eng-primary); font-weight:bold; margin-top:0.5rem;">Flawless Operation! Chief of Surgery material.</p>':this.mistakes>=5&&(t+='<p style="color:#ef4444; font-weight:bold; margin-top:0.5rem;">Too many casualties! Study your syntax.</p>'),i.innerHTML=t,e.style.display="flex",this.saveCustomProgress()}async saveCustomProgress(){if(p.isUserLoggedIn)try{const e=await c(()=>import("./auth-modal-CbJnTvdh.js").then(s=>s.f),__vite__mapDeps([0,1])),{auth:i,db:t,collection:o,addDoc:n}=e;i&&i.currentUser&&await n(o(t,"users",i.currentUser.uid,"history"),{title:`Syntax Surgeon (${this.mode})`,score:this.score,mistakes:this.mistakes,time:60,date:new Date().toISOString()})}catch(e){console.warn("Could not save progress.",e)}}}window.addEventListener("DOMContentLoaded",()=>{new b});
