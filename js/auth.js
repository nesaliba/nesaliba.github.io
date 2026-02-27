import { auth, sendSignInLinkToEmail, signOut, onAuthStateChanged } from './firebase-init.js';

// Inject Auth Modal HTML dynamically into the DOM
const authModalHTML = `
<div class="auth-modal-overlay" id="auth-modal">
    <div class="auth-modal-content">
        <h2 id="auth-modal-title">Sign In</h2>
        <p id="auth-modal-desc">Enter your email to receive a secure login link.</p>
        
        <div id="auth-input-container">
            <input type="email" id="auth-email-input" class="auth-input" placeholder="student@example.com" />
            <button id="auth-submit-btn" class="auth-btn-primary">Send Login Link</button>
        </div>
        
        <div id="auth-loading-container" style="display: none;">
            <div class="auth-spinner"></div>
            <p id="auth-loading-text" style="margin-top: 1rem; font-weight: 600; color: var(--primary-blue);">Sending link...</p>
        </div>

        <button id="auth-close-btn" class="auth-close">Cancel</button>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', authModalHTML);

// DOM Elements
const authBtn = document.getElementById('auth-btn');
const authText = document.getElementById('auth-text');

const authModal = document.getElementById('auth-modal');
const authEmailInput = document.getElementById('auth-email-input');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authCloseBtn = document.getElementById('auth-close-btn');
const authInputContainer = document.getElementById('auth-input-container');
const authLoadingContainer = document.getElementById('auth-loading-container');
const authLoadingText = document.getElementById('auth-loading-text');
const authModalTitle = document.getElementById('auth-modal-title');
const authModalDesc = document.getElementById('auth-modal-desc');

// Modal Control Functions
function openAuthModal() {
    authModal.style.display = 'flex';
    authInputContainer.style.display = 'block';
    authLoadingContainer.style.display = 'none';
    authCloseBtn.style.display = 'inline-block';
    authCloseBtn.innerText = "Cancel";
    
    authModalTitle.innerText = "Sign In";
    authModalDesc.innerText = "Enter your email to receive a secure login link.";
    authEmailInput.value = window.localStorage.getItem('emailForSignIn') || '';
    
    setTimeout(() => authEmailInput.focus(), 100);
}

function closeAuthModal() {
    authModal.style.display = 'none';
}

// Handle sending the link
async function loginWithEmail() {
    const email = authEmailInput.value.trim();
    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    authInputContainer.style.display = 'none';
    authLoadingContainer.style.display = 'block';
    authLoadingText.innerText = "Sending link...";
    authCloseBtn.style.display = 'none'; 

    // Dynamically build the URL for the new verification page
    // This securely handles GitHub Pages subdirectories and local development
    let verifyUrl = window.location.origin + '/auth-verify.html'; 
    const scriptTag = document.querySelector('script[src$="auth.js"]');
    if (scriptTag) {
        const authJsUrl = new URL(scriptTag.src, window.location.href);
        const basePath = authJsUrl.pathname.replace('/js/auth.js', '');
        verifyUrl = authJsUrl.origin + basePath + '/auth-verify.html';
    }

    const actionCodeSettings = {
        url: verifyUrl, 
        handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        
        authModalTitle.innerText = "Check your email!";
        authModalDesc.innerHTML = `We sent a magic link to <strong>${email}</strong>.<br><br>Click the link in your email. A new tab will open to verify, and this window will automatically log you in!`;
        authLoadingText.innerText = "Waiting for authorization...";
        
        authCloseBtn.style.display = 'inline-block';
        authCloseBtn.innerText = "Close";
        
    } catch (error) {
        console.error("Error sending email link:", error);
        alert(`Error: ${error.message}`);
        closeAuthModal();
    }
}

async function logout() {
    await signOut(auth);
}

// Event Listeners
if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (authBtn.innerText === "Login") {
            openAuthModal();
        } else {
            logout();
        }
    });
}

authSubmitBtn.addEventListener('click', loginWithEmail);
authCloseBtn.addEventListener('click', closeAuthModal);

authEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginWithEmail();
    }
});

// Update the text dynamically based on login state
// Because Firebase syncs via IndexedDB, this will trigger the moment the user authenticates in the other tab
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authText) authText.innerText = `${user.email}`;
        if (authBtn) authBtn.innerText = "Logout";
        
        closeAuthModal();
    } else {
        if (authText) authText.innerText = "";
        if (authBtn) authBtn.innerText = "Login";
    }
});