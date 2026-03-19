const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/auth-modal-CbJnTvdh.js","assets/auth-modal-B9R-_un4.css"])))=>i.map(i=>d[i]);
import{_ as k}from"./preload-helper-BXl3LOEh.js";import{S as m}from"./auth-modal-CbJnTvdh.js";import{G as x}from"./games-catalog-D2QIa6_X.js";window.scrollToContent=function(){const t=document.getElementById("explore");t&&t.scrollIntoView({behavior:"smooth"})};function E(){const t=document.getElementById("heroCanvas");if(!t)return;const i=t.getContext("2d");let n,o;function l(){n=t.width=t.parentElement.offsetWidth,o=t.height=t.parentElement.offsetHeight}window.addEventListener("resize",l),l();const r=[{x:n*.2,y:o*.3,r:Math.max(80,n*.08),vx:.5,vy:.3,color:"rgba(30, 64, 175, 0.15)"},{x:n*.75,y:o*.25,r:Math.max(70,n*.07),vx:-.3,vy:.4,color:"rgba(22, 101, 52, 0.15)"},{x:n*.5,y:o*.7,r:Math.max(60,n*.06),vx:.6,vy:-.4,color:"rgba(88, 28, 135, 0.15)"},{x:n*.8,y:o*.65,r:Math.max(120,n*.12),vx:-.4,vy:.5,color:"rgba(153, 27, 27, 0.12)"},{x:n*.15,y:o*.75,r:Math.max(90,n*.09),vx:.35,vy:-.3,color:"rgba(133, 77, 14, 0.13)"},{x:n*.45,y:o*.35,r:Math.max(85,n*.08),vx:-.4,vy:.2,color:"rgba(13, 148, 136, 0.14)"}];function a(){i.clearRect(0,0,n,o),r.forEach(e=>{e.x+=e.vx,e.y+=e.vy,e.x<-e.r&&(e.x=n+e.r),e.x>n+e.r&&(e.x=-e.r),e.y<-e.r&&(e.y=o+e.r),e.y>o+e.r&&(e.y=-e.r),i.beginPath(),i.arc(e.x,e.y,e.r,0,Math.PI*2),i.fillStyle=e.color,i.fill()}),requestAnimationFrame(a)}a()}function w(){const t=document.getElementById("catalog-container");if(!t)return;const i=t.getAttribute("data-subject"),n=m.getLegacyState?m.getLegacyState():localStorage.getItem("scitriad_legacy")==="true",o=x.filter(a=>!(a.subject!==i||a.type==="unity-legacy"&&!n)),l={};o.forEach(a=>{l[a.category]||(l[a.category]=[]),l[a.category].push(a)});let r="";for(const[a,e]of Object.entries(l))r+=`<details><summary>${a}</summary><div class="details-content">`,e.forEach(d=>{const c=d.type==="unity-legacy"?"legacy-game.html":"game.html";r+=`
                <a href="${c}?id=${d.id}" class="game-link" ${d.isNoModal?'data-no-modal="true"':""}>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>${d.title}</span>
                        ${d.type==="unity-legacy"?'<span style="font-size: 0.7rem; background: #f59e0b; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px;">CLASSIC</span>':""}
                        <button class="info-btn" data-game="${d.id}" title="Game Info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </button>
                    </div>
                    <span class="game-icon">➜</span>
                </a>
            `}),r+="</div></details>";t.innerHTML=r}function I(){document.getElementById("infoModal")||document.body.insertAdjacentHTML("beforeend",`
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
    `);const i=document.getElementById("infoModal"),n=document.getElementById("btn-close-info"),o=document.getElementById("info-modal-title"),l=document.getElementById("info-modal-desc"),r=document.getElementById("info-modal-play");n.addEventListener("click",()=>{i.style.display="none",document.body.classList.remove("no-scroll")}),document.querySelectorAll(".info-btn").forEach(a=>{a.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();const d=a.getAttribute("data-game"),c=x.find(y=>y.id===d);c?(o.textContent=c.title,l.textContent=c.desc,r.textContent=c.play,i.style.display="flex",document.body.classList.add("no-scroll")):console.warn("No info found for game ID:",d)})})}function S(){const t=document.querySelectorAll(".game-link");if(t.length===0)return;document.body.insertAdjacentHTML("beforeend",`
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
    `);const n=document.getElementById("settingsModal"),o=document.getElementById("setting-mistakes"),l=document.getElementById("mistakes-val"),r=document.getElementById("btn-cancel-settings"),a=document.getElementById("btn-start-game"),e=document.getElementById("setting-timer"),d=document.getElementById("setting-timer-visible"),c=document.getElementById("timer-visible-row");let y="",f=-1;function v(){const s=e.checked;d.disabled=!s,c.style.opacity=s?"1":"0.5"}e.addEventListener("change",v),v(),o.addEventListener("input",s=>{l.textContent=s.target.value}),r.addEventListener("click",()=>{n.style.display="none",document.body.classList.remove("no-scroll")}),a.addEventListener("click",()=>{const s={timer:e.checked?"on":"off",timerVisible:d.checked?"visible":"hidden",tileMode:document.getElementById("setting-tile-mode").value,maxMistakes:o.value,muteSounds:!document.getElementById("setting-mute-sounds").checked,darkMode:document.body.classList.contains("dark-theme")};if(document.getElementById("setting-save-default").checked&&k(async()=>{const{authService:u}=await import("./auth-modal-CbJnTvdh.js").then(p=>p.b);return{authService:u}},__vite__mapDeps([0,1])).then(({authService:u})=>{u.saveSettings(s)}),f!==-1){const u=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+u,f)}const g=new URL(y,window.location.href);g.searchParams.set("timer",s.timer),g.searchParams.set("timerVisible",s.timerVisible),g.searchParams.set("tileMode",s.tileMode),g.searchParams.set("maxMistakes",s.maxMistakes),g.searchParams.set("mute",s.muteSounds),g.searchParams.set("theme",s.darkMode?"dark":"light"),document.body.classList.remove("no-scroll"),window.location.href=g.toString()}),t.forEach(s=>{s.addEventListener("click",g=>{const u=s.closest("details");let p=-1;if(u){const h=document.querySelectorAll("details");p=Array.from(h).indexOf(u)}if(s.hasAttribute("data-no-modal")){if(p!==-1){const h=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+h,p)}return}const b=s.getAttribute("href");b&&b!=="#"&&(g.preventDefault(),y=b,f=p,document.getElementById("setting-mute-sounds").checked=!m.getMuteState(),m.userSettings&&(e.checked=(m.userSettings.timer||"off")==="on",d.checked=(m.userSettings.timerVisible||"visible")==="visible",document.getElementById("setting-tile-mode").value=m.userSettings.tileMode||"all",document.getElementById("setting-mute-sounds").checked=!m.userSettings.muteSounds,o.value=m.userSettings.maxMistakes||10,l.textContent=o.value,v()),m.isUserLoggedIn?document.getElementById("save-default-container").style.display="flex":document.getElementById("save-default-container").style.display="none",n.style.display="flex",document.body.classList.add("no-scroll"))})})}function M(){const t=window.location.pathname.split("/").pop()||"index.html",i=sessionStorage.getItem("expandedDetails_"+t);if(i!==null){const n=parseInt(i,10),o=document.querySelectorAll("details");o[n]&&(o[n].setAttribute("open","true"),setTimeout(()=>{o[n].scrollIntoView({behavior:"smooth",block:"center"})},100)),sessionStorage.removeItem("expandedDetails_"+t)}}function L(){const t=document.getElementById("explore");if(!t)return;const i=t.querySelectorAll("details");if(i.length===0)return;const n=t.querySelectorAll("a.game-link").length,o=document.createElement("div");o.className="game-counter-container";const l=document.createElement("span");l.className="game-counter-text",l.textContent=`Total Games Available: ${n}`;const r=document.createElement("div");r.className="info-icon-container",r.tabIndex=0;const a=document.createElement("div");a.className="game-counter-icon",a.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const e=document.createElement("div");e.className="game-counter-tooltip";let d='<div class="tooltip-header">Games per section:</div>';i.forEach(c=>{const y=c.querySelector("summary"),f=y?y.textContent.trim():"Section",v=c.querySelectorAll("a.game-link").length;d+=`<div class="tooltip-row"><span>${f}</span> <span class="tooltip-count">${v}</span></div>`}),e.innerHTML=d,r.appendChild(a),r.appendChild(e),o.appendChild(l),o.appendChild(r),t.insertBefore(o,t.firstChild)}document.addEventListener("DOMContentLoaded",()=>{E(),w(),S(),I(),L(),M();const t=document.querySelector(".scroll-indicator");t&&t.addEventListener("click",()=>{const i=document.getElementById("explore");i&&i.scrollIntoView({behavior:"smooth"})})});
