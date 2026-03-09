import"./modulepreload-polyfill-B5Qt9EMX.js";import"./auth-service-Bw40vwXa.js";import{auth as h,db as u}from"./firebase-init-ZMan-bHY.js";import{onAuthStateChanged as f}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{collection as v,query as k,orderBy as T,limit as E,getDocs as S}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"./state-manager-DvNmcDpL.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";const l=document.getElementById("auth-warning"),m=document.getElementById("dashboard-content"),b=document.getElementById("stat-total-games"),$=document.getElementById("stat-total-mistakes"),B=document.getElementById("stat-perfect-games"),o=document.getElementById("history-list");function M(e){const a=Math.floor(e/60).toString().padStart(2,"0"),i=(e%60).toString().padStart(2,"0");return`${a}:${i}`}async function I(e){try{const a=v(u,"users",e.uid,"history"),i=k(a,T("date","desc"),E(10)),c=await S(i);let s=0,n=0,r=0,d="";c.forEach(y=>{const t=y.data();if(s++,n+=t.mistakes,t.mistakes===0&&r++,s<=10){const g=new Date(t.date).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),p=t.time>0?`⏱️ ${M(t.time)}`:'<span style="opacity: 0.5;">No Timer</span>';d+=`
                    <div class="history-item">
                        <div>
                            <div class="game-title">${t.title}</div>
                            <div class="game-meta">${g}</div>
                        </div>
                        <div class="game-score">
                            <div class="time">${p}</div>
                            <div class="mistakes">${t.mistakes===0?"✨ Perfect":`❌ ${t.mistakes} Mistakes`}</div>
                        </div>
                    </div>
                `}}),b.innerText=s,$.innerText=n,B.innerText=r,s===0?o.innerHTML='<div style="padding: 1.5rem; text-align: center; color: #64748b;">No games played yet. Go play some games!</div>':o.innerHTML=d}catch(a){console.error("Error loading dashboard:",a),o.innerHTML='<div style="padding: 1.5rem; text-align: center; color: #dc2626;">Error loading history. Please try again later.</div>'}}f(h,e=>{e?(l.style.display="none",m.style.display="block",I(e)):(l.style.display="block",m.style.display="none")});
