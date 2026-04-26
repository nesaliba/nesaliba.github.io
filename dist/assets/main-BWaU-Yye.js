const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/auth-modal-BCGjUoIH.js","assets/auth-modal-B9R-_un4.css"])))=>i.map(i=>d[i]);
import{_ as w}from"./preload-helper-BXl3LOEh.js";import{S as g}from"./auth-modal-BCGjUoIH.js";import{G as x}from"./games-catalog-8iVkt4PV.js";window.scrollToContent=function(){const t=document.getElementById("explore");t&&t.scrollIntoView({behavior:"smooth"})};function k(){const t=document.getElementById("heroCanvas");if(!t)return;const i=t.getContext("2d");let n,o;function r(){n=t.width=t.parentElement.offsetWidth,o=t.height=t.parentElement.offsetHeight}window.addEventListener("resize",r),r();const d=[{x:n*.2,y:o*.3,r:Math.max(80,n*.08),vx:.5,vy:.3,color:"rgba(30, 64, 175, 0.15)"},{x:n*.75,y:o*.25,r:Math.max(70,n*.07),vx:-.3,vy:.4,color:"rgba(22, 101, 52, 0.15)"},{x:n*.5,y:o*.7,r:Math.max(60,n*.06),vx:.6,vy:-.4,color:"rgba(88, 28, 135, 0.15)"},{x:n*.8,y:o*.65,r:Math.max(120,n*.12),vx:-.4,vy:.5,color:"rgba(153, 27, 27, 0.12)"},{x:n*.15,y:o*.75,r:Math.max(90,n*.09),vx:.35,vy:-.3,color:"rgba(133, 77, 14, 0.13)"},{x:n*.45,y:o*.35,r:Math.max(85,n*.08),vx:-.4,vy:.2,color:"rgba(13, 148, 136, 0.14)"}];function a(){i.clearRect(0,0,n,o),d.forEach(e=>{e.x+=e.vx,e.y+=e.vy,e.x<-e.r&&(e.x=n+e.r),e.x>n+e.r&&(e.x=-e.r),e.y<-e.r&&(e.y=o+e.r),e.y>o+e.r&&(e.y=-e.r),i.beginPath(),i.arc(e.x,e.y,e.r,0,Math.PI*2),i.fillStyle=e.color,i.fill()}),requestAnimationFrame(a)}a()}function E(){const t=document.getElementById("catalog-container");if(!t)return;const i=t.getAttribute("data-subject"),n=g.getLegacyState?g.getLegacyState():localStorage.getItem("scitriad_legacy")==="true",o=x.filter(a=>!(a.subject!==i||a.type==="unity-legacy"&&!n)),r={};o.forEach(a=>{r[a.category]||(r[a.category]=[]),r[a.category].push(a)});let d="";for(const[a,e]of Object.entries(r))d+=`<details><summary>${a}</summary><div class="details-content">`,e.forEach(s=>{const m=s.type==="unity-legacy"?"legacy-game.html":"game.html";let c="";s.type==="unity-legacy"?c='<span style="font-size: 0.65rem; background: #f59e0b; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px; white-space: nowrap;">CLASSIC</span>':s.type==="module"?c='<span style="font-size: 0.65rem; background: var(--primary-blue); color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px; white-space: nowrap;">INTERACTIVE</span>':s.type==="tile"&&(c='<span style="font-size: 0.65rem; background: #94a3b8; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px; white-space: nowrap;">TILE MATCH</span>'),d+=`
                <a href="${m}?id=${s.id}" class="game-link" ${s.isNoModal?'data-no-modal="true"':""}>
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span>${s.title}</span>
                        ${c}
                        <button class="info-btn" data-game="${s.id}" title="Game Info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </button>
                    </div>
                    <span class="game-icon">➜</span>
                </a>
            `}),d+="</div></details>";t.innerHTML=d}function I(){document.getElementById("infoModal")||document.body.insertAdjacentHTML("beforeend",`
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
    `);const i=document.getElementById("infoModal"),n=document.getElementById("btn-close-info"),o=document.getElementById("info-modal-title"),r=document.getElementById("info-modal-desc"),d=document.getElementById("info-modal-play");n.addEventListener("click",()=>{i.style.display="none",document.body.classList.remove("no-scroll")}),document.querySelectorAll(".info-btn").forEach(a=>{a.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation();const s=a.getAttribute("data-game"),m=x.find(c=>c.id===s);m?(o.textContent=m.title,r.textContent=m.desc,d.textContent=m.play,i.style.display="flex",document.body.classList.add("no-scroll")):console.warn("No info found for game ID:",s)})})}function M(){const t=document.querySelectorAll(".game-link");if(t.length===0)return;document.body.insertAdjacentHTML("beforeend",`
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
    `);const n=document.getElementById("settingsModal"),o=document.getElementById("setting-mistakes"),r=document.getElementById("mistakes-val"),d=document.getElementById("btn-cancel-settings"),a=document.getElementById("btn-start-game"),e=document.getElementById("setting-timer"),s=document.getElementById("setting-timer-visible"),m=document.getElementById("timer-visible-row");let c="",f=-1;function b(){const l=e.checked;s.disabled=!l,m.style.opacity=l?"1":"0.5"}e.addEventListener("change",b),b(),o.addEventListener("input",l=>{r.textContent=l.target.value}),d.addEventListener("click",()=>{n.style.display="none",document.body.classList.remove("no-scroll")}),a.addEventListener("click",()=>{const l={timer:e.checked?"on":"off",timerVisible:s.checked?"visible":"hidden",tileMode:document.getElementById("setting-tile-mode").value,maxMistakes:o.value,muteSounds:!document.getElementById("setting-mute-sounds").checked,darkMode:document.body.classList.contains("dark-theme")};if(document.getElementById("setting-save-default").checked&&w(async()=>{const{authService:p}=await import("./auth-modal-BCGjUoIH.js").then(y=>y.b);return{authService:p}},__vite__mapDeps([0,1])).then(({authService:p})=>{p.saveSettings(l)}),f!==-1){const p=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+p,f)}const u=new URL(c,window.location.href);u.searchParams.set("timer",l.timer),u.searchParams.set("timerVisible",l.timerVisible),u.searchParams.set("tileMode",l.tileMode),u.searchParams.set("maxMistakes",l.maxMistakes),u.searchParams.set("mute",l.muteSounds),u.searchParams.set("theme",l.darkMode?"dark":"light"),document.body.classList.remove("no-scroll"),window.location.href=u.toString()}),t.forEach(l=>{l.addEventListener("click",u=>{const p=l.closest("details");let y=-1;if(p){const h=document.querySelectorAll("details");y=Array.from(h).indexOf(p)}if(l.hasAttribute("data-no-modal")){if(y!==-1){const h=window.location.pathname.split("/").pop()||"index.html";sessionStorage.setItem("expandedDetails_"+h,y)}return}const v=l.getAttribute("href");v&&v!=="#"&&(u.preventDefault(),c=v,f=y,document.getElementById("setting-mute-sounds").checked=!g.getMuteState(),g.userSettings&&(e.checked=(g.userSettings.timer||"off")==="on",s.checked=(g.userSettings.timerVisible||"visible")==="visible",document.getElementById("setting-tile-mode").value=g.userSettings.tileMode||"all",document.getElementById("setting-mute-sounds").checked=!g.userSettings.muteSounds,o.value=g.userSettings.maxMistakes||10,r.textContent=o.value,b()),g.isUserLoggedIn?document.getElementById("save-default-container").style.display="flex":document.getElementById("save-default-container").style.display="none",n.style.display="flex",document.body.classList.add("no-scroll"))})})}function S(){const t=window.location.pathname.split("/").pop()||"index.html",i=sessionStorage.getItem("expandedDetails_"+t);if(i!==null){const n=parseInt(i,10),o=document.querySelectorAll("details");o[n]&&(o[n].setAttribute("open","true"),setTimeout(()=>{o[n].scrollIntoView({behavior:"smooth",block:"center"})},100)),sessionStorage.removeItem("expandedDetails_"+t)}}function L(){const t=document.getElementById("explore");if(!t)return;const i=t.querySelectorAll("details");if(i.length===0)return;const n=t.querySelectorAll("a.game-link").length,o=document.createElement("div");o.className="game-counter-container";const r=document.createElement("span");r.className="game-counter-text",r.textContent=`Total Games Available: ${n}`;const d=document.createElement("div");d.className="info-icon-container",d.tabIndex=0;const a=document.createElement("div");a.className="game-counter-icon",a.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const e=document.createElement("div");e.className="game-counter-tooltip";let s='<div class="tooltip-header">Games per section:</div>';i.forEach(m=>{const c=m.querySelector("summary"),f=c?c.textContent.trim():"Section",b=m.querySelectorAll("a.game-link").length;s+=`<div class="tooltip-row"><span>${f}</span> <span class="tooltip-count">${b}</span></div>`}),e.innerHTML=s,d.appendChild(a),d.appendChild(e),o.appendChild(r),o.appendChild(d),t.insertBefore(o,t.firstChild)}document.addEventListener("DOMContentLoaded",()=>{k(),E(),M(),I(),L(),S();const t=document.querySelector(".scroll-indicator");t&&t.addEventListener("click",()=>{const i=document.getElementById("explore");i&&i.scrollIntoView({behavior:"smooth"})})});
