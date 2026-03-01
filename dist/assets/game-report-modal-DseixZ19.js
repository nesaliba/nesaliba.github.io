class s extends HTMLElement{connectedCallback(){this.innerHTML=`
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
        `,this.querySelector("#end-btn-replay").addEventListener("click",()=>location.reload())}show(n,d,e,r){const a=this.querySelector("#endModal"),l=this.querySelector("#endModalContent"),t=this.querySelector("#end-title"),o=this.querySelector("#end-desc"),i=this.querySelector("#end-btn-menu");l.className=`modal-content ${e?"win":"lose"}`,t.innerText=n,t.style.color=e?"var(--success, #10b981)":"var(--danger, #ef4444)",o.innerHTML=d,i.href=r,a.style.display="flex"}}customElements.define("game-report-modal",s);
