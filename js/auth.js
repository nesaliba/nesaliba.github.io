import { auth, db, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut, onAuthStateChanged, doc, setDoc } from './firebase-init.js';

// Send the login link
async function loginWithEmail() {
    const email = prompt("Enter your email to receive a login link:");
    if (!email) return;

    const actionCodeSettings = {
        // window.location.href dynamically handles localhost and GitHub Pages
        url: window.location.href, 
        handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        alert(`Check your email! A login link has been sent to ${email}`);
    } catch (error) {
        console.error("Error sending email link:", error);
        alert(`Error: ${error.message}`); // This will tell what went wrong
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
        }
    }
}

async function logout() {
    await signOut(auth);
}

// Reliable UI updating and Button logic
const authBtn = document.getElementById('auth-btn');
const authText = document.getElementById('auth-text');

// Attach the click event directly
if (authBtn) {
    authBtn.addEventListener('click', () => {
        if (authBtn.innerText === "Login") {
            loginWithEmail();
        } else {
            logout();
        }
    });
}

// Update the text dynamically based on login state
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (authText) authText.innerText = `${user.email}`;
        if (authBtn) authBtn.innerText = "Logout";
    } else {
        if (authText) authText.innerText = "";
        if (authBtn) authBtn.innerText = "Login";
    }
});

// Run immediately to catch returning users
checkEmailLinkLogin();