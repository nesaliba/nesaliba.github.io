import { auth, db, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut, onAuthStateChanged, doc, setDoc } from './firebase-init.js';

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
    
    // Slight delay to ensure modal is visible before focusing
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

    // Switch to loading state
    authInputContainer.style.display = 'none';
    authLoadingContainer.style.display = 'block';
    authLoadingText.innerText = "Sending link...";
    authCloseBtn.style.display = 'none'; 

    const actionCodeSettings = {
        url: window.location.href, 
        handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        
        // Switch to "Waiting" state
        authModalTitle.innerText = "Check your email!";
        authModalDesc.innerHTML = `We sent a magic link to <strong>${email}</strong>.<br><br>Click the link in your email. You can open it in a new tab, and this window will automatically log you in!`;
        authLoadingText.innerText = "Waiting for authorization...";
        
        authCloseBtn.style.display = 'inline-block';
        authCloseBtn.innerText = "Close";
        
    } catch (error) {
        console.error("Error sending email link:", error);
        alert(`Error: ${error.message}`);
        closeAuthModal();
    }
}

// Check if the user just clicked the email link to return to the site
async function checkEmailLinkLogin() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
            email = prompt('Please provide your email for confirmation');
        }

        try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            
            // Save basic user profile securely
            await setDoc(doc(db, "users", result.user.uid), {
                email: result.user.email,
                lastLogin: new Date()
            }, { merge: true });
            
            // Clean up the messy URL Firebase generates in the browser bar
            window.history.replaceState({}, document.title, window.location.pathname);
            
        } catch (error) {
            console.error("Error signing in with link:", error);
            alert(`Login error: ${error.message}`);
        }
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

// Allow pressing Enter in the input
authEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginWithEmail();
    }
});

// Update the text dynamically based on login state
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authText) authText.innerText = `${user.email}`;
        if (authBtn) authBtn.innerText = "Logout";
        
        // Automatically close the modal if it's open (Firebase cross-tab sync magic!)
        closeAuthModal();
    } else {
        if (authText) authText.innerText = "";
        if (authBtn) authBtn.innerText = "Login";
    }
});

// Run immediately to catch returning users
checkEmailLinkLogin();