import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                   */import"./game-report-modal-DseixZ19.js";import{B as y}from"./base-game-Dy3wBghj.js";import"./state-manager-BIvrU4Io.js";import"./firebase-init-ZMan-bHY.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";class w extends y{constructor(){super("Ion Exchange"),this.wave=1,this.maxWaves=10,this.mistakes=0,this.maxMistakes=this.settings.maxMistakes||10,this.initDOM(),this.settings.timer==="on"&&this.startTimer("game-timer"),this.nextWave()}initDOM(){const e=document.getElementById("game-mount");let i=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";e.innerHTML=`
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Ion Exchange</h1>
                <div class="game-stats">
                    ${i}
                    <div class="stat-box" id="health-box">System Stability: ${this.maxMistakes-this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Mission: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="cell-panel">
                    <div class="cell-header">🔋 Electrochemical Cell Array</div>
                    <div class="cell-layout">
                        <div class="cell-wrapper" id="cell-visual">
                            <!-- Cell will be injected here -->
                        </div>
                    </div>
                    <div class="reference-box">
                        <strong>Standard Reduction Potentials (E&deg;):</strong>
                        Ag⁺ + e⁻ &rightarrow; Ag(s) : +0.80 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Cu²⁺ + 2e⁻ &rightarrow; Cu(s) : +0.34 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Pb²⁺ + 2e⁻ &rightarrow; Pb(s) : -0.13 V <br>
                        Ni²⁺ + 2e⁻ &rightarrow; Ni(s) : -0.26 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Zn²⁺ + 2e⁻ &rightarrow; Zn(s) : -0.76 V &nbsp;&nbsp;|&nbsp;&nbsp; 
                        Mg²⁺ + 2e⁻ &rightarrow; Mg(s) : -2.37 V
                    </div>
                    <div class="cell-text" id="question-text">Loading mission parameters...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `}generateQuestion(){const e={Ag:{ion:"Ag⁺",e:.8,color:"#cbd5e1",textColor:"#0f172a"},Cu:{ion:"Cu²⁺",e:.34,color:"#b45309",textColor:"#ffffff"},Pb:{ion:"Pb²⁺",e:-.13,color:"#64748b",textColor:"#ffffff"},Ni:{ion:"Ni²⁺",e:-.26,color:"#10b981",textColor:"#ffffff"},Zn:{ion:"Zn²⁺",e:-.76,color:"#94a3b8",textColor:"#0f172a"},Mg:{ion:"Mg²⁺",e:-2.37,color:"#f8fafc",textColor:"#0f172a"}},i=Object.keys(e);let s=i[Math.floor(Math.random()*i.length)],t=i[Math.floor(Math.random()*i.length)];for(;s===t;)t=i[Math.floor(Math.random()*i.length)];if(e[s].e<e[t].e){let a=s;s=t,t=a}const o=Math.random()>.5,l=o?s:t,u=o?t:s,x=`
            <div class="beaker">
                <div class="electrode" style="background: ${e[l].color}; color: ${e[l].textColor}; border: 1px solid #334155;">${l}</div>
                <div class="ion">${e[l].ion}</div>
            </div>
            <div class="circuit-wire">
                <div class="meter">V</div>
            </div>
            <div class="beaker">
                <div class="electrode" style="background: ${e[u].color}; color: ${e[u].textColor}; border: 1px solid #334155;">${u}</div>
                <div class="ion">${e[u].ion}</div>
            </div>
        `,d=e[s].e-e[t].e,g=e[s].e+e[t].e,h=a=>(a>0?"+":"")+a.toFixed(2)+" V",f=a=>{const v=a==="Ag"?"e⁻":"2e⁻";return`${a}(s) &rightarrow; ${e[a].ion} + ${v}`},p=a=>{const v=a==="Ag"?"e⁻":"2e⁻";return`${e[a].ion} + ${v} &rightarrow; ${a}(s)`},b=["galvanic_voltage","identify_anode","identify_cathode","electron_flow","electrolytic_voltage","half_reaction"],m=b[Math.floor(Math.random()*b.length)];let c="",r="",n=[];const $=a=>a.sort(()=>Math.random()-.5);for(m==="galvanic_voltage"?(c="Assume this is a Galvanic (Voltaic) cell. Calculate the standard cell potential (E&deg;<sub>cell</sub>).",r=h(d),n=[h(d),h(-d),h(g),h(-g)]):m==="identify_anode"?(c="For this cell to operate spontaneously (Galvanic), which electrode must be the Anode?",r=`${t}(s)`,n=[r,`${s}(s)`,`${e[t].ion}(aq)`,`${e[s].ion}(aq)`]):m==="identify_cathode"?(c="For this cell to operate spontaneously (Galvanic), which species undergoes reduction at the Cathode?",r=`${e[s].ion}(aq)`,n=[r,`${s}(s)`,`${t}(s)`,`${e[t].ion}(aq)`]):m==="electron_flow"?(c="In a spontaneous setup, in which direction do electrons flow through the external wire?",r=`From ${t} to ${s}`,n=[r,`From ${s} to ${t}`,`From ${e[t].ion} to ${e[s].ion}`,`From ${e[s].ion} to ${e[t].ion}`]):m==="electrolytic_voltage"?(c=`Suppose we want to drive the non-spontaneous reaction (Electrolysis) where ${t} is reduced and ${s} is oxidized. What is the minimum external voltage required?`,r=`> +${d.toFixed(2)} V`,n=[r,`< +${d.toFixed(2)} V`,`> -${d.toFixed(2)} V`,"Exactly 0.00 V"]):m==="half_reaction"&&(c="Which half-reaction occurs at the Anode in a spontaneous Galvanic cell?",r=f(t),n=[r,f(s),p(t),p(s)]),n=[...new Set(n)];n.length<4;)n.push(h(Math.random()*3)),n=[...new Set(n)];return{visual:x,question:c,options:$(n.slice(0,4)),answer:r}}nextWave(){document.getElementById("wave-box").innerText=`Mission: ${this.wave}/${this.maxWaves}`;const e=this.generateQuestion();document.getElementById("cell-visual").innerHTML=e.visual,document.getElementById("question-text").innerHTML=e.question;const i=document.getElementById("options-container");i.innerHTML="",e.options.forEach(s=>{const t=document.createElement("button");t.className="option-btn",t.innerHTML=s,t.onclick=()=>{this.initAudio();const o=s===e.answer;this.handleAnswer(t,o,e.answer)},i.appendChild(t)})}handleAnswer(e,i,s){const t=document.querySelectorAll(".option-btn");if(t.forEach(o=>o.disabled=!0),i){e.classList.add("correct");const o=document.querySelector(".meter");o&&(o.style.background="var(--success)",o.style.color="white"),this.playHit(),setTimeout(()=>{this.wave++,this.wave>this.maxWaves?this.endGame(!0):this.nextWave()},1e3)}else{e.classList.add("wrong");const o=document.querySelector(".meter");o&&(o.style.background="var(--danger)",o.style.color="white",o.classList.add("shake")),this.playMiss(),t.forEach(l=>{l.innerHTML===s&&l.classList.add("correct")}),this.mistakes++,document.getElementById("health-box").innerText=`System Stability: ${Math.max(0,this.maxMistakes-this.mistakes)}/${this.maxMistakes}`,setTimeout(()=>{this.mistakes>=this.maxMistakes?this.endGame(!1):(this.wave++,this.wave>this.maxWaves?this.endGame(!0):this.nextWave())},2e3)}}endGame(e){this.stopTimer();const i=document.querySelector("game-report-modal");let s=this.settings.timer==="on"?`<br><br><strong>Time:</strong> ${Math.floor(this.elapsedSeconds/60)}m ${this.elapsedSeconds%60}s`:"";const t=e?`Excellent work, Engineer. You successfully managed the electrochemical cells with ${this.mistakes} mistakes.${s}`:"System failure. Your incorrect cell configurations caused a meltdown.";i.show(e?"Cells Operational!":"System Failure!",t,e,"/Chemistry.html"),e?(this.playVictory(),this.saveProgress(this.mistakes)):this.playGameOver()}}window.addEventListener("DOMContentLoaded",()=>new w);
