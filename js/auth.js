import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    doc, 
    setDoc,
    getDoc
} from '/js/firebase-init.js';

let isLoginMode = true;

window.isUserLoggedIn = false;
window.userSettings = null;

// Expose global logic to apply themes/sounds universally
window.applyThemeAndSound = function(settings) {
    if (settings?.darkMode) {
        document.documentElement.classList.add('dark-theme');
        if (document.body) document.body.classList.add('dark-theme');
        localStorage.setItem('scitriad_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark-theme');
        if (document.body) document.body.classList.remove('dark-theme');
        localStorage.setItem('scitriad_theme', 'light');
    }

    if (settings?.muteSounds !== undefined) {
        localStorage.setItem('scitriad_mute', settings.muteSounds ? 'true' : 'false');
    }
};

window.saveGameSettings = async (settings) => {
    if (!auth.currentUser) return;
    try {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            settings: settings
        }, { merge: true });
        window.userSettings = settings;
    } catch (e) {
        console.error("Error saving settings:", e);
    }
};

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

const accountModalHTML = `
<div class="auth-modal-overlay" id="account-modal">
    <div class="auth-modal-content">
        <h2 style="color: var(--text-dark); margin-bottom: 1.5rem;">Account Settings</h2>
        
        <div style="text-align: left; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            <label style="font-weight:600; font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; color: var(--text-dark);">
                Dark Mode
                <input type="checkbox" id="account-dark-mode" style="cursor: pointer; width: 16px; height: 16px;">
            </label>
            <label style="font-weight:600; font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between; color: var(--text-dark);">
                Mute Sounds
                <input type="checkbox" id="account-mute-sounds" style="cursor: pointer; width: 16px; height: 16px;">
            </label>
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
`;

document.body.insertAdjacentHTML('beforeend', authModalHTML);
document.body.insertAdjacentHTML('beforeend', accountModalHTML);

const authBtn = document.getElementById('auth-btn');
const userMenu = document.getElementById('user-menu');
const userAvatar = document.getElementById('user-avatar');
const dropdownContent = document.getElementById('dropdown-content');
const dropdownEmail = document.getElementById('dropdown-email');
const btnLogout = document.getElementById('btn-logout');
const btnAccountSettings = document.getElementById('btn-account-settings');

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

function openAuthModal() {
    isLoginMode = true;
    updateModalUI();
    
    authModal.style.display = 'flex';
    document.body.classList.add('no-scroll');
    authInputContainer.style.display = 'block';
    authLoadingContainer.style.display = 'none';
    authCloseBtn.style.display = 'inline-block';
    
    authEmailInput.value = '';
    authPasswordInput.value = '';
    
    setTimeout(() => authEmailInput.focus(), 100);
}

function closeAuthModal() {
    authModal.style.display = 'none';
    document.body.classList.remove('no-scroll');
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

    authInputContainer.style.display = 'none';
    authLoadingContainer.style.display = 'block';
    authLoadingText.innerText = isLoginMode ? "Signing in..." : "Creating account...";
    authCloseBtn.style.display = 'none';

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", result.user.uid), {
                email: result.user.email,
                createdAt: new Date(),
                lastLogin: new Date()
            }, { merge: true });
        }
    } catch (error) {
        console.error("Authentication Error:", error);
        
        let errorMsg = error.message;
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            errorMsg = "Incorrect email or password.";
        } else if (error.code === 'auth/email-already-in-use') {
            errorMsg = "An account with this email already exists. Try signing in instead.";
        }

        alert(errorMsg);
        authInputContainer.style.display = 'block';
        authLoadingContainer.style.display = 'none';
        authCloseBtn.style.display = 'inline-block';
    }
}

async function logout() {
    await signOut(auth);
    localStorage.removeItem('scitriad_logged_in');
    localStorage.removeItem('scitriad_user_email');
}

if (authBtn) {
    authBtn.addEventListener('click', openAuthModal);
}

authSubmitBtn.addEventListener('click', handleAuth);
authCloseBtn.addEventListener('click', closeAuthModal);

authToggleLink.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    updateModalUI();
});

authPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAuth();
    }
});

if(userAvatar) {
    userAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });
}

window.addEventListener('click', () => {
    if(dropdownContent && dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
    }
});

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
        logout();
    });
}

if (btnAccountSettings) {
    btnAccountSettings.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
        document.getElementById('account-modal').style.display = 'flex';
        document.body.classList.add('no-scroll');
        
        document.getElementById('account-email-input').value = auth.currentUser.email;
        document.getElementById('account-password-input').value = '';
        document.getElementById('account-status-msg').style.display = 'none';
        
        document.getElementById('account-dark-mode').checked = window.userSettings?.darkMode || false;
        document.getElementById('account-mute-sounds').checked = window.userSettings?.muteSounds || false;
    });
}

document.getElementById('account-close-btn').addEventListener('click', () => {
    document.getElementById('account-modal').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

document.getElementById('btn-update-email').addEventListener('click', async () => {
    const newEmail = document.getElementById('account-email-input').value;
    try {
        await updateEmail(auth.currentUser, newEmail);
        showAccountStatus("Email updated successfully.");
    } catch(error) {
        handleAccountError(error);
    }
});

document.getElementById('btn-update-password').addEventListener('click', async () => {
    const newPass = document.getElementById('account-password-input').value;
    if(newPass.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }
    try {
        await updatePassword(auth.currentUser, newPass);
        showAccountStatus("Password updated successfully.");
        document.getElementById('account-password-input').value = '';
    } catch(error) {
        handleAccountError(error);
    }
});

document.getElementById('account-dark-mode').addEventListener('change', async (e) => {
    if (!window.userSettings) window.userSettings = {};
    window.userSettings.darkMode = e.target.checked;
    window.applyThemeAndSound(window.userSettings);
    if (window.saveGameSettings) await window.saveGameSettings(window.userSettings);
});

document.getElementById('account-mute-sounds').addEventListener('change', async (e) => {
    if (!window.userSettings) window.userSettings = {};
    window.userSettings.muteSounds = e.target.checked;
    window.applyThemeAndSound(window.userSettings);
    if (window.saveGameSettings) await window.saveGameSettings(window.userSettings);
});

function showAccountStatus(msg) {
    const statusEl = document.getElementById('account-status-msg');
    statusEl.style.color = '#166534';
    statusEl.innerText = msg;
    statusEl.style.display = 'block';
}

function handleAccountError(error) {
    const statusEl = document.getElementById('account-status-msg');
    statusEl.style.color = '#dc2626';
    if (error.code === 'auth/requires-recent-login') {
        statusEl.innerText = "Security requires a recent login. Please logout and log back in to change this.";
    } else {
        statusEl.innerText = error.message;
    }
    statusEl.style.display = 'block';
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        window.isUserLoggedIn = true;
        localStorage.setItem('scitriad_logged_in', 'true');
        localStorage.setItem('scitriad_user_email', user.email);

        if (authBtn) authBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        if (dropdownEmail) dropdownEmail.innerText = user.email;
        if (userAvatar) userAvatar.innerText = user.email.charAt(0).toUpperCase();
        
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().settings) {
                window.userSettings = docSnap.data().settings;
                window.applyThemeAndSound(window.userSettings);
            }
        } catch (e) {
            console.error("Error fetching user settings:", e);
        }
        
        closeAuthModal();
    } else {
        window.isUserLoggedIn = false;
        window.userSettings = null;
        localStorage.removeItem('scitriad_logged_in');
        localStorage.removeItem('scitriad_user_email');

        if (authBtn) authBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
});