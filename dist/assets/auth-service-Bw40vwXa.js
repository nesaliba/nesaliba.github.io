import{auth as l,db as g}from"./firebase-init-ZMan-bHY.js";import{S as o}from"./state-manager-DvNmcDpL.js";import{onAuthStateChanged as P,signInWithEmailAndPassword as C,createUserWithEmailAndPassword as U,signOut as D,updateEmail as H,updatePassword as z}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import{doc as p,getDoc as j,setDoc as E}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";class q{constructor(){P(l,async t=>{if(t){o.setLoginState(!0,t.email);try{const n=p(g,"users",t.uid),a=await j(n);a.exists()&&a.data().settings&&o.setSettings(a.data().settings)}catch(n){console.error("Error fetching user settings:",n)}window.dispatchEvent(new CustomEvent("userStateChanged",{detail:{loggedIn:!0,user:t}}))}else o.setLoginState(!1,null),window.dispatchEvent(new CustomEvent("userStateChanged",{detail:{loggedIn:!1,user:null}}))})}async login(t,n){return C(l,t,n)}async register(t,n){const a=await U(l,t,n);return await E(p(g,"users",a.user.uid),{email:a.user.email,createdAt:new Date,lastLogin:new Date},{merge:!0}),a}async logout(){return D(l)}async updateUserEmail(t){return H(l.currentUser,t)}async updateUserPassword(t){return z(l.currentUser,t)}async saveSettings(t){if(l.currentUser){o.setSettings(t);try{await E(p(g,"users",l.currentUser.uid),{settings:t},{merge:!0})}catch(n){console.error("Error saving settings:",n)}}}}const d=new q;let s=!0;const N=`
<div class="auth-modal-overlay" id="auth-modal">
    <div class="auth-modal-content">
        <h2 id="auth-modal-title">Sign In</h2>
        <p id="auth-modal-desc">Enter your email and password to continue.</p>
        <div id="auth-input-container">
            <input type="email" id="auth-email-input" class="auth-input" placeholder="student@example.com" />
            <input type="password" id="auth-password-input" class="auth-input" placeholder="Password" />
            <button id="auth-submit-btn" class="auth-btn-primary">Sign In</button>
            <p class="auth-toggle-text">
                <span id="auth-toggle-prompt">Don't have an account?</span> 
                <span id="auth-toggle-link" class="auth-toggle-link">Sign Up</span>
            </p>
        </div>
        <div id="auth-loading-container" style="display: none;">
            <div class="auth-spinner"></div>
            <p id="auth-loading-text" style="margin-top: 1rem; font-weight: 600; color: var(--primary-blue);">Authenticating...</p>
        </div>
        <button id="auth-close-btn" class="auth-close">Cancel</button>
    </div>
</div>
`,W=`
<div class="auth-modal-overlay" id="account-modal">
    <div class="auth-modal-content">
        <h2 style="color: var(--text-dark); margin-bottom: 1.5rem;">Account Settings</h2>
        <div style="text-align: left; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <div class="toggle-row">
                <span class="toggle-label">Dark Mode</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="account-dark-mode">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-row" style="margin-bottom: 0;">
                <span class="toggle-label">Mute Sounds</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="account-mute-sounds">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <div style="text-align: left; margin-bottom: 1rem;">
            <label style="font-weight:600; font-size: 0.9rem; display: block; margin-bottom: 0.5rem; color: var(--text-dark);">Change Email</label>
            <input type="email" id="account-email-input" class="auth-input" placeholder="New Email" />
            <button id="btn-update-email" class="auth-btn-primary" style="margin-bottom: 1.5rem;">Update Email</button>
            <label style="font-weight:600; font-size: 0.9rem; display: block; margin-bottom: 0.5rem; color: var(--text-dark);">Change Password</label>
            <input type="password" id="account-password-input" class="auth-input" placeholder="New Password" />
            <button id="btn-update-password" class="auth-btn-primary">Update Password</button>
        </div>
        <p id="account-status-msg" style="font-size: 0.85rem; color: #166534; display:none; margin-bottom: 1rem;"></p>
        <button id="account-close-btn" class="auth-close" style="width: 100%;">Close</button>
    </div>
</div>
`;document.body.insertAdjacentHTML("beforeend",N);document.body.insertAdjacentHTML("beforeend",W);const i=document.getElementById("auth-btn"),r=document.getElementById("user-menu"),u=document.getElementById("user-avatar"),c=document.getElementById("dropdown-content"),v=document.getElementById("dropdown-email"),f=document.getElementById("btn-logout"),I=document.getElementById("btn-account-settings"),k=document.getElementById("auth-modal"),O=document.getElementById("auth-modal-title"),R=document.getElementById("auth-modal-desc"),y=document.getElementById("auth-email-input"),w=document.getElementById("auth-password-input"),B=document.getElementById("auth-submit-btn"),m=document.getElementById("auth-close-btn"),S=document.getElementById("auth-toggle-link"),F=document.getElementById("auth-toggle-prompt"),h=document.getElementById("auth-input-container"),b=document.getElementById("auth-loading-container"),G=document.getElementById("auth-loading-text");function J(){s=!0,x(),k.style.display="flex",document.body.classList.add("no-scroll"),h.style.display="block",b.style.display="none",m.style.display="inline-block",y.value="",w.value="",setTimeout(()=>y.focus(),100)}function L(){k.style.display="none",document.body.classList.remove("no-scroll")}function x(){O.innerText=s?"Sign In":"Create Account",R.innerText=s?"Enter your email and password to continue.":"Sign up with your email to track your progress.",B.innerText=s?"Sign In":"Sign Up",F.innerText=s?"Don't have an account?":"Already have an account?",S.innerText=s?"Sign Up":"Sign In"}async function A(){const e=y.value.trim(),t=w.value;if(!e||!t)return alert("Please enter both email and password.");if(!s&&t.length<6)return alert("Password should be at least 6 characters.");h.style.display="none",b.style.display="block",G.innerText=s?"Signing in...":"Creating account...",m.style.display="none";try{s?await d.login(e,t):await d.register(e,t)}catch(n){let a=n.message;n.code==="auth/invalid-credential"||n.code==="auth/wrong-password"?a="Incorrect email or password.":n.code==="auth/email-already-in-use"&&(a="An account with this email already exists. Try signing in instead."),alert(a),h.style.display="block",b.style.display="none",m.style.display="inline-block"}}i&&i.addEventListener("click",J);B.addEventListener("click",A);m.addEventListener("click",L);S.addEventListener("click",()=>{s=!s,x()});w.addEventListener("keypress",e=>{e.key==="Enter"&&A()});u&&u.addEventListener("click",e=>{e.stopPropagation(),c.classList.toggle("show")});window.addEventListener("click",()=>{c&&c.classList.contains("show")&&c.classList.remove("show")});f&&f.addEventListener("click",()=>{c.classList.remove("show"),d.logout()});I&&I.addEventListener("click",()=>{c.classList.remove("show"),document.getElementById("account-modal").style.display="flex",document.body.classList.add("no-scroll"),document.getElementById("account-email-input").value=o.userEmail,document.getElementById("account-password-input").value="",document.getElementById("account-status-msg").style.display="none",document.getElementById("account-dark-mode").checked=o.userSettings?.darkMode||!1,document.getElementById("account-mute-sounds").checked=o.userSettings?.muteSounds||!1});document.getElementById("account-close-btn").addEventListener("click",()=>{document.getElementById("account-modal").style.display="none",document.body.classList.remove("no-scroll")});document.getElementById("btn-update-email").addEventListener("click",async()=>{try{await d.updateUserEmail(document.getElementById("account-email-input").value),M("Email updated successfully.")}catch(e){T(e)}});document.getElementById("btn-update-password").addEventListener("click",async()=>{const e=document.getElementById("account-password-input").value;if(e.length<6)return alert("Password must be at least 6 characters.");try{await d.updateUserPassword(e),M("Password updated successfully."),document.getElementById("account-password-input").value=""}catch(t){T(t)}});document.getElementById("account-dark-mode").addEventListener("change",async e=>{const t=o.userSettings||{};t.darkMode=e.target.checked,await d.saveSettings(t)});document.getElementById("account-mute-sounds").addEventListener("change",async e=>{const t=o.userSettings||{};t.muteSounds=e.target.checked,await d.saveSettings(t)});function M(e){const t=document.getElementById("account-status-msg");t.style.color="#166534",t.innerText=e,t.style.display="block"}function T(e){const t=document.getElementById("account-status-msg");t.style.color="#dc2626",t.innerText=e.code==="auth/requires-recent-login"?"Security requires a recent login. Please logout and log back in.":e.message,t.style.display="block"}window.addEventListener("userStateChanged",e=>{const{loggedIn:t,user:n}=e.detail;t?(i&&(i.style.display="none"),r&&(r.style.display="block"),v&&(v.innerText=n.email),u&&(u.innerText=n.email.charAt(0).toUpperCase()),L()):(i&&(i.style.display="block"),r&&(r.style.display="none"))});export{d as authService};
