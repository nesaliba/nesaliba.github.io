const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/auth-service-Bw40vwXa.js","assets/firebase-init-ZMan-bHY.js","assets/state-manager-DvNmcDpL.js","assets/auth-service-Dm7oQsb7.css"])))=>i.map(i=>d[i]);
import{_ as k}from"./preload-helper-BXl3LOEh.js";import{S as u}from"./state-manager-DvNmcDpL.js";import{G as x}from"./games-catalog-DN0TyCd-.js";window.scrollToContent=function(){const n=document.getElementById("explore");n&&n.scrollIntoView({behavior:"smooth"})};function E(){const n=document.getElementById("heroCanvas");if(!n)return;const i=n.getContext("2d");let o,t;function l(){o=n.width=n.parentElement.offsetWidth,t=n.height=n.parentElement.offsetHeight}window.addEventListener("resize",l),l();const a=[{x:o*.2,y:t*.3,r:Math.max(80,o*.08),vx:.5,vy:.3,color:"rgba(30, 64, 175, 0.15)"},{x:o*.75,y:t*.25,r:Math.max(70,o*.07),vx:-.3,vy:.4,color:"rgba(22, 101, 52, 0.15)"},{x:o*.5,y:t*.7,r:Math.max(60,o*.06),vx:.6,vy:-.4,color:"rgba(88, 28, 135, 0.15)"},{x:o*.8,y:t*.65,r:Math.max(120,o*.12),vx:-.4,vy:.5,color:"rgba(153, 27, 27, 0.12)"},{x:o*.15,y:t*.75,r:Math.max(90,o*.09),vx:.35,vy:-.3,color:"rgba(133, 77, 14, 0.13)"},{x:o*.45,y:t*.35,r:Math.max(85,o*.08),vx:-.4,vy:.2,color:"rgba(13, 148, 136, 0.14)"}];function r(){i.clearRect(0,0,o,t),a.forEach(e=>{e.x+=e.vx,e.y+=e.vy,e.x<-e.r&&(e.x=o+e.r),e.x>o+e.r&&(e.x=-e.r),e.y<-e.r&&(e.y=t+e.r),e.y>t+e.r&&(e.y=-e.r),i.beginPath(),i.arc(e.x,e.y,e.r,0,Math.PI*2),i.fillStyle=e.color,i.fill()}),requestAnimationFrame(r)}r()}function w(){const n=document.getElementById("catalog-container");if(!n)return;const i=n.getAttribute("data-subject"),o=x.filter(a=>a.subject===i),t={};o.forEach(a=>{t[a.category]||(t[a.category]=[]),t[a.category].push(a)});let l="";for(const[a,r]of Object.entries(t))l+=`<details><summary>${a}</summary><div class="details-content">`,r.forEach(e=>{l+=`
                <a href="game.html?id=${e.id}" class="game-link" ${e.isNoModal?'data-no-modal="true"':""}>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>${e.title}</span>
                        <button class="info-btn" data-game="${e.id}" title="Game Info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </button>
                    </div>
                    <span class="game-icon">➜</span>
                </a>
            `}),l+="</div></details>";n.innerHTML=l}function I(){document.getElementById("infoModal")||document.body.insertAdjacentHTML("beforeend",`
        <div class="modal-overlay" id="infoModal" style="z-index: 3000;">
            <div class="modal-content" style="max-width: 500px; width: 90%; text-align: left; background: var(--modal-bg); border: 1px solid var(--border-color);">
                <h2 id="info-modal-title" style="margin-bottom: 1rem; color: var(--text-dark);">Game Title</h2>
                <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Premise</h4>
                <p id="info-modal-desc" style="margin-bottom: 1.5rem; color: var(--text-dark); font-size: 0.95rem;"></p>
                <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">How to Play</h4>
                <p id="info-modal-play" style="margin-bottom: 2rem; color: var(--text-dark); font-size: 0.95rem;"></p>
                <div style="text-align: right;">
                    <button id="btn-close-info" class="btn-action primary" style="padding: 0.5rem 1.5rem; background: var(--primary-blue); color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Got it!</button>
                </div>
            </div>
        </div>
    `);const i=document.getElementById("infoModal"),o=document.getElementById("btn-close-info"),t=document.getElementById("info-modal-title"),l=document.getElementById("info-modal-desc"),a=document.getElementById("info-modal-play");o.addEventListener("click",()=>{i.style.display="none",document.body.classList.remove("no-scroll")}),document.querySelectorAll(".info-btn").forEach(r=>{r.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();const d=r.getAttribute("data-game"),c=x.find(y=>y.id===d);c?(t.textContent=c.title,l.textContent=c.desc,a.textContent=c.play,i.style.display="flex",document.body.classList.add("no-scroll")):console.warn("No info found for game ID:",d)})})}function M(){const n=document.querySelectorAll(".game-link");if(n.length===0)return;document.body.insertAdjacentHTML("beforeend",`
        <div class="modal-overlay" id="settingsModal" style="z-index: 2000;">
            <div class="modal-content" style="max-width: 400px; width: 90%; text-align: left; background: var(--modal-bg); border: 1px solid var(--border-color);">
                <h2 style="text-align: center; margin-bottom: 1.5rem; color: var(--text-dark);">Game Settings</h2>
                
                <div class="toggle-row">
                    <span class="toggle-label">Timer</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-timer">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="toggle-row" id="timer-visible-row">
                    <span class="toggle-label">Show Timer</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-timer-visible" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="toggle-row">
                    <span class="toggle-label">Sounds</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-mute-sounds">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <hr class="settings-divider">

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Tile Mode</label>
                    <select id="setting-tile-mode" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="all">All Tiles Visible</option>
                        <option value="one">One Tile At A Time</option>
                    </select>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Max Wrong Placements: <span id="mistakes-val">10</span></label>
                    <input type="range" id="setting-mistakes" min="0" max="10" value="10" style="width: 100%; accent-color: #60a5fa;">
                </div>
                
                <div id="save-default-container" style="margin-bottom: 1.5rem; display: none; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="setting-save-default" style="cursor: pointer; width: 16px; height: 16px;">
                    <label for="setting-save-default" style="font-weight: 600; font-size: 0.9rem; cursor: pointer; color: var(--primary-blue);">Save as my default settings</label>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button id="btn-cancel-settings" class="btn-secondary" style="margin-top: 0; padding: 0.5rem 1rem;">Cancel</button>
                    <button id="btn-start-game" style="margin-top: 0; padding: 0.5rem 1rem; background: var(--primary-blue); color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Start Game</button>
                </div>
            </div>
        </div>
    `);const o=document.getElementById("settingsModal"),t=document.getElementById("setting-mistakes"),l=document.getElementById("mistakes-val"),a=document.getElementById("btn-cancel-settings"),r=document.getElementById("btn-start-game"),e=document.getElementById("setting-timer"),d=document.getElementById("setting-timer-visible"),c=document.getElementById("timer-visible-row");let y="",p=-1;function v(){const s=e.checked;d.disabled=!s,c.style.opacity=s?"1":"0.5"}e.addEventListener("change",v),v(),t.addEventListener("input",s=>{l.textContent=s.target.value}),a.addEventListener("click",()=>{o.style.display="none",document.body.classList.remove("no-scroll")}),r.addEventListener("click",()=>{const s={timer:e.checked?"on":"off",timerVisible:d.checked?"visible":"hidden",tileMode:document.getElementById("setting-tile-mode").value,maxMistakes:t.value,muteSounds:!document.getElementById("setting-mute-sounds").checked,darkMode:document.body.classList.contains("dark-theme")};if(document.getElementById("setting-save-default").checked&&k(async()=>{const{authService:g}=await import("./auth-service-Bw40vwXa.js");return{authService:g}},__vite__mapDeps([0,1,2,3])).then(({authService:g})=>{g.saveSettings(s)}),p!==-1){const g=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+g,p)}const m=new URL(y,window.location.href);m.searchParams.set("timer",s.timer),m.searchParams.set("timerVisible",s.timerVisible),m.searchParams.set("tileMode",s.tileMode),m.searchParams.set("maxMistakes",s.maxMistakes),m.searchParams.set("mute",s.muteSounds),m.searchParams.set("theme",s.darkMode?"dark":"light"),document.body.classList.remove("no-scroll"),window.location.href=m.toString()}),n.forEach(s=>{s.addEventListener("click",m=>{const g=s.closest("details");let b=-1;if(g){const h=document.querySelectorAll("details");b=Array.from(h).indexOf(g)}if(s.hasAttribute("data-no-modal")){if(b!==-1){const h=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+h,b)}return}const f=s.getAttribute("href");f&&f!=="#"&&(m.preventDefault(),y=f,p=b,document.getElementById("setting-mute-sounds").checked=!u.getMuteState(),u.userSettings&&(e.checked=(u.userSettings.timer||"off")==="on",d.checked=(u.userSettings.timerVisible||"visible")==="visible",document.getElementById("setting-tile-mode").value=u.userSettings.tileMode||"all",document.getElementById("setting-mute-sounds").checked=!u.userSettings.muteSounds,t.value=u.userSettings.maxMistakes||10,l.textContent=t.value,v()),u.isUserLoggedIn?document.getElementById("save-default-container").style.display="flex":document.getElementById("save-default-container").style.display="none",o.style.display="flex",document.body.classList.add("no-scroll"))})})}function S(){const n=window.location.pathname.split("/").pop()||"index.html",i=sessionStorage.getItem("expandedDetails_"+n);if(i!==null){const o=parseInt(i,10),t=document.querySelectorAll("details");t[o]&&(t[o].setAttribute("open","true"),setTimeout(()=>{t[o].scrollIntoView({behavior:"smooth",block:"center"})},100)),sessionStorage.removeItem("expandedDetails_"+n)}}function B(){const n=document.getElementById("explore");if(!n)return;const i=n.querySelectorAll("details");if(i.length===0)return;const o=n.querySelectorAll("a.game-link").length,t=document.createElement("div");t.className="game-counter-container";const l=document.createElement("span");l.className="game-counter-text",l.textContent=`Total Games Available: ${o}`;const a=document.createElement("div");a.className="info-icon-container",a.tabIndex=0;const r=document.createElement("div");r.className="game-counter-icon",r.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const e=document.createElement("div");e.className="game-counter-tooltip";let d='<div class="tooltip-header">Games per section:</div>';i.forEach(c=>{const y=c.querySelector("summary"),p=y?y.textContent.trim():"Section",v=c.querySelectorAll("a.game-link").length;d+=`<div class="tooltip-row"><span>${p}</span> <span class="tooltip-count">${v}</span></div>`}),e.innerHTML=d,a.appendChild(r),a.appendChild(e),t.appendChild(l),t.appendChild(a),n.insertBefore(t,n.firstChild)}document.addEventListener("DOMContentLoaded",()=>{E(),w(),M(),I(),B(),S();const n=document.querySelector(".scroll-indicator");n&&n.addEventListener("click",()=>{const i=document.getElementById("explore");i&&i.scrollIntoView({behavior:"smooth"})})});
