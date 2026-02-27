import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    doc, 
    setDoc 
} from './firebase-init.js';

let isLoginMode = true; // Track if user is signing in or signing up

// Inject Auth Modal HTML dynamically into the DOM
const authModalHTML = `
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
`;
document.body.insertAdjacentHTML('beforeend', authModalHTML);

// DOM Elements
const authBtn = document.getElementById('auth-btn');
const authText = document.getElementById('auth-text');

const authModal = document.getElementById('auth-modal');
const authEmailInput = document.getElementById('auth-email-input');
const authPasswordInput = document.getElementById('auth-password-input');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authCloseBtn = document.getElementById('auth-close-btn');
const authToggleLink = document.getElementById('auth-toggle-link');
const authTogglePrompt = document.getElementById('auth-toggle-prompt');
const authInputContainer = document.getElementById('auth-input-container');
const authLoadingContainer = document.getElementById('auth-loading-container');
const authLoadingText = document.getElementById('auth-loading-text');
const authModalTitle = document.getElementById('auth-modal-title');
const authModalDesc = document.getElementById('auth-modal-desc');

// Modal Control Functions
function openAuthModal() {
    isLoginMode = true;
    updateModalUI();
    
    authModal.style.display = 'flex';
    authInputContainer.style.display = 'block';
    authLoadingContainer.style.display = 'none';
    authCloseBtn.style.display = 'inline-block';
    
    authEmailInput.value = '';
    authPasswordInput.value = '';
    
    setTimeout(() => authEmailInput.focus(), 100);
}

function closeAuthModal() {
    authModal.style.display = 'none';
}

function updateModalUI() {
    if (isLoginMode) {
        authModalTitle.innerText = "Sign In";
        authModalDesc.innerText = "Enter your email and password to continue.";
        authSubmitBtn.innerText = "Sign In";
        authTogglePrompt.innerText = "Don't have an account?";
        authToggleLink.innerText = "Sign Up";
    } else {
        authModalTitle.innerText = "Create Account";
        authModalDesc.innerText = "Sign up with your email to track your progress.";
        authSubmitBtn.innerText = "Sign Up";
        authTogglePrompt.innerText = "Already have an account?";
        authToggleLink.innerText = "Sign In";
    }
}

// Handle Authentication (Login / Register)
async function handleAuth() {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (!isLoginMode && password.length < 6) {
        alert("Password should be at least 6 characters.");
        return;
    }

    // Show loading state
    authInputContainer.style.display = 'none';
    authLoadingContainer.style.display = 'block';
    authLoadingText.innerText = isLoginMode ? "Signing in..." : "Creating account...";
    authCloseBtn.style.display = 'none';

    try {
        if (isLoginMode) {
            // LOGIN
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // REGISTER
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Save basic user profile securely for new users
            await setDoc(doc(db, "users", result.user.uid), {
                email: result.user.email,
                createdAt: new Date(),
                lastLogin: new Date()
            }, { merge: true });
        }
        
        // Success! The onAuthStateChanged listener will handle closing the modal.
    } catch (error) {
        console.error("Authentication Error:", error);
        
        // Make Firebase error messages a bit more user-friendly
        let errorMsg = error.message;
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            errorMsg = "Incorrect email or password.";
        } else if (error.code === 'auth/email-already-in-use') {
            errorMsg = "An account with this email already exists. Try signing in instead.";
        }

        alert(errorMsg);
        
        // Revert UI to let them try again
        authInputContainer.style.display = 'block';
        authLoadingContainer.style.display = 'none';
        authCloseBtn.style.display = 'inline-block';
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

authSubmitBtn.addEventListener('click', handleAuth);
authCloseBtn.addEventListener('click', closeAuthModal);

authToggleLink.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    updateModalUI();
});

// Allow pressing Enter in the password input
authPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAuth();
    }
});

// Update the text dynamically based on login state
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authText) authText.innerText = `${user.email}`;
        if (authBtn) authBtn.innerText = "Logout";
        
        // Close modal automatically upon successful auth
        closeAuthModal();
    } else {
        if (authText) authText.innerText = "";
        if (authBtn) authBtn.innerText = "Login";
    }
});