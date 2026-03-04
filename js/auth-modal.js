import { authService } from './auth-service.js';
import { StateManager } from './state-manager.js';

let isLoginMode = true;

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
const authModalTitle = document.getElementById('auth-modal-title');
const authModalDesc = document.getElementById('auth-modal-desc');
const authEmailInput = document.getElementById('auth-email-input');
const authPasswordInput = document.getElementById('auth-password-input');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authCloseBtn = document.getElementById('auth-close-btn');
const authToggleLink = document.getElementById('auth-toggle-link');
const authTogglePrompt = document.getElementById('auth-toggle-prompt');
const authInputContainer = document.getElementById('auth-input-container');
const authLoadingContainer = document.getElementById('auth-loading-container');
const authLoadingText = document.getElementById('auth-loading-text');

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
    authModalTitle.innerText = isLoginMode ? "Sign In" : "Create Account";
    authModalDesc.innerText = isLoginMode ? "Enter your email and password to continue." : "Sign up with your email to track your progress.";
    authSubmitBtn.innerText = isLoginMode ? "Sign In" : "Sign Up";
    authTogglePrompt.innerText = isLoginMode ? "Don't have an account?" : "Already have an account?";
    authToggleLink.innerText = isLoginMode ? "Sign Up" : "Sign In";
}

async function handleAuth() {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    if (!email || !password) return alert("Please enter both email and password.");
    if (!isLoginMode && password.length < 6) return alert("Password should be at least 6 characters.");

    authInputContainer.style.display = 'none';
    authLoadingContainer.style.display = 'block';
    authLoadingText.innerText = isLoginMode ? "Signing in..." : "Creating account...";
    authCloseBtn.style.display = 'none';

    try {
        if (isLoginMode) await authService.login(email, password);
        else await authService.register(email, password);
    } catch (error) {
        let errorMsg = error.message;
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') errorMsg = "Incorrect email or password.";
        else if (error.code === 'auth/email-already-in-use') errorMsg = "An account with this email already exists. Try signing in instead.";
        alert(errorMsg);
        authInputContainer.style.display = 'block';
        authLoadingContainer.style.display = 'none';
        authCloseBtn.style.display = 'inline-block';
    }
}

if (authBtn) authBtn.addEventListener('click', openAuthModal);
authSubmitBtn.addEventListener('click', handleAuth);
authCloseBtn.addEventListener('click', closeAuthModal);
authToggleLink.addEventListener('click', () => { isLoginMode = !isLoginMode; updateModalUI(); });
authPasswordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAuth(); });

if(userAvatar) {
    userAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });
}

window.addEventListener('click', () => {
    if(dropdownContent && dropdownContent.classList.contains('show')) dropdownContent.classList.remove('show');
});

if (btnLogout) btnLogout.addEventListener('click', () => { dropdownContent.classList.remove('show'); authService.logout(); });

if (btnAccountSettings) {
    btnAccountSettings.addEventListener('click', () => {
        dropdownContent.classList.remove('show');
        document.getElementById('account-modal').style.display = 'flex';
        document.body.classList.add('no-scroll');
        document.getElementById('account-email-input').value = StateManager.userEmail;
        document.getElementById('account-password-input').value = '';
        document.getElementById('account-status-msg').style.display = 'none';
        document.getElementById('account-dark-mode').checked = StateManager.userSettings?.darkMode || false;
        document.getElementById('account-mute-sounds').checked = StateManager.userSettings?.muteSounds || false;
    });
}

document.getElementById('account-close-btn').addEventListener('click', () => {
    document.getElementById('account-modal').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

document.getElementById('btn-update-email').addEventListener('click', async () => {
    try {
        await authService.updateUserEmail(document.getElementById('account-email-input').value);
        showAccountStatus("Email updated successfully.");
    } catch(error) { handleAccountError(error); }
});

document.getElementById('btn-update-password').addEventListener('click', async () => {
    const newPass = document.getElementById('account-password-input').value;
    if(newPass.length < 6) return alert("Password must be at least 6 characters.");
    try {
        await authService.updateUserPassword(newPass);
        showAccountStatus("Password updated successfully.");
        document.getElementById('account-password-input').value = '';
    } catch(error) { handleAccountError(error); }
});

document.getElementById('account-dark-mode').addEventListener('change', async (e) => {
    const settings = StateManager.userSettings || {};
    settings.darkMode = e.target.checked;
    await authService.saveSettings(settings);
});

document.getElementById('account-mute-sounds').addEventListener('change', async (e) => {
    const settings = StateManager.userSettings || {};
    settings.muteSounds = e.target.checked;
    await authService.saveSettings(settings);
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
    statusEl.innerText = error.code === 'auth/requires-recent-login' ? "Security requires a recent login. Please logout and log back in." : error.message;
    statusEl.style.display = 'block';
}

window.addEventListener('userStateChanged', (e) => {
    const { loggedIn, user } = e.detail;
    if (loggedIn) {
        if (authBtn) authBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (dropdownEmail) dropdownEmail.innerText = user.email;
        if (userAvatar) userAvatar.innerText = user.email.charAt(0).toUpperCase();
        closeAuthModal();
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
});