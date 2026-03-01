import"./modulepreload-polyfill-B5Qt9EMX.js";import{B as m}from"./base-game-DyghC6o1.js";import"./preload-helper-BXl3LOEh.js";import"./state-manager-BIvrU4Io.js";class c extends HTMLElement{connectedCallback(){this.innerHTML=`
            <div class="modal-overlay" id="endModal" style="display: none; z-index: 1000;">
                <div class="modal-content" id="endModalContent">
                    <h2 id="end-title"></h2>
                    <div id="end-desc" style="margin: 1.5rem 0; font-size: 1.1rem; text-align: left; background: var(--details-bg, #f1f5f9); padding: 1rem; border-radius: 8px; color: var(--text-dark, #334155);"></div>
                    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;">
                        <button id="end-btn-replay" class="btn-action primary modal-btn" style="padding: 0.75rem 1.5rem; font-size: 1rem; border-radius: 6px; margin: 0;">Play Again</button>
                        <a id="end-btn-menu" href="#" class="btn-secondary modal-btn" style="display: flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; text-decoration: none; font-size: 1rem; border-radius: 6px; margin: 0;">Return to Menu</a>
                    </div>
                </div>
            </div>
        `,this.querySelector("#end-btn-replay").addEventListener("click",()=>location.reload())}show(e,s,i,t){const a=this.querySelector("#endModal"),r=this.querySelector("#endModalContent"),n=this.querySelector("#end-title"),d=this.querySelector("#end-desc"),l=this.querySelector("#end-btn-menu");r.className=`modal-content ${i?"win":"lose"}`,n.innerText=e,n.style.color=i?"var(--success, #10b981)":"var(--danger, #ef4444)",d.innerHTML=s,l.href=t,a.style.display="flex"}}customElements.define("game-report-modal",c);class h extends m{constructor(){super("Acid Alliance"),this.wave=1,this.maxWaves=10,this.mistakes=0,this.maxMistakes=this.settings.maxMistakes||10,this.initDOM(),this.settings.timer==="on"&&this.startTimer("game-timer"),this.nextWave()}initDOM(){const e=document.getElementById("game-mount");let s=this.settings.timer==="on"?`<div class="stat-box" id="game-timer" style="${this.settings.timerVisible==="hidden"?"visibility:hidden;":""}">00:00</div>`:"";e.innerHTML=`
            <header class="game-header">
                <a href="/Chemistry.html" class="back-btn">← Back to Menu</a>
                <h1>Acid Alliance</h1>
                <div class="game-stats">
                    ${s}
                    <div class="stat-box" id="health-box">Integrity: ${this.maxMistakes-this.mistakes}/${this.maxMistakes}</div>
                    <div class="stat-box" id="wave-box">Crisis: ${this.wave}/${this.maxWaves}</div>
                </div>
            </header>
            <main class="game-container">
                <div class="crisis-panel">
                    <div class="crisis-header">⚠️ Incoming Crisis Protocol</div>
                    <div class="crisis-text" id="question-text">Loading system metrics...</div>
                    <div class="options-grid" id="options-container"></div>
                </div>
            </main>
        `}generateQuestion(){}nextWave(){document.getElementById("wave-box").innerText=`Crisis: ${this.wave}/${this.maxWaves}`;const e=this.generateQuestion();document.getElementById("question-text").innerHTML=e.question;const s=document.getElementById("options-container");s.innerHTML="",e.options.forEach(i=>{const t=document.createElement("button");t.className="option-btn",t.innerHTML=i,t.onclick=()=>{this.initAudio();const a=i===e.answer;this.handleAnswer(t,a,e.answer)},s.appendChild(t)})}handleAnswer(e,s,i){const t=document.querySelectorAll(".option-btn");t.forEach(a=>a.disabled=!0),s?(e.classList.add("correct"),this.playHit(),setTimeout(()=>{this.wave++,this.wave>this.maxWaves?this.endGame(!0):this.nextWave()},1e3)):(e.classList.add("wrong"),this.playMiss(),t.forEach(a=>{a.innerHTML===i&&a.classList.add("correct")}),this.mistakes++,document.getElementById("health-box").innerText=`Integrity: ${Math.max(0,this.maxMistakes-this.mistakes)}/${this.maxMistakes}`,setTimeout(()=>{this.mistakes>=this.maxMistakes?this.endGame(!1):(this.wave++,this.wave>this.maxWaves?this.endGame(!0):this.nextWave())},2e3))}endGame(e){this.stopTimer();const s=document.querySelector("game-report-modal");let i=this.settings.timer==="on"?`<br>Time: ${Math.floor(this.elapsedSeconds/60)}m ${this.elapsedSeconds%60}s`:"";const t=e?`Excellent work, Commander. You neutralized the threats with ${this.mistakes} mistakes.${i}`:"System integrity compromised. You made too many miscalculations.";s.show(e?"System Stabilized!":"System Failure!",t,e,"/Chemistry.html"),e?(this.playVictory(),this.saveProgress(this.mistakes)):this.playGameOver()}}window.addEventListener("DOMContentLoaded",()=>new h);
