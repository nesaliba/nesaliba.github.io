import { auth, db, isSignInWithEmailLink, signInWithEmailLink, doc, setDoc } from './firebase-init.js';

const verifyTitle = document.getElementById('verify-title');
const verifyDesc = document.getElementById('verify-desc');
const verifySpinner = document.getElementById('verify-spinner');
const verifyEmailForm = document.getElementById('verify-email-form');
const manualEmailInput = document.getElementById('manual-email');
const submitManualEmailBtn = document.getElementById('submit-manual-email');

async function handleVerification(email) {
    verifyEmailForm.style.display = 'none';
    verifySpinner.style.display = 'inline-block';
    verifyTitle.innerText = "Authenticating...";
    verifyDesc.innerText = "Please wait.";

    try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        
        // Save basic user profile securely
        await setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            lastLogin: new Date()
        }, { merge: true });

        // Success UI
        verifySpinner.style.display = 'none';
        verifyTitle.innerText = "Login Successful!";
        verifyTitle.style.color = "#166534"; // green success color
        verifyDesc.innerHTML = "<strong>You are securely authenticated.</strong><br><br>You can safely close this window and return to your original tab.";
        
    } catch (error) {
        console.error("Error signing in with link:", error);
        verifySpinner.style.display = 'none';
        verifyTitle.innerText = "Login Failed";
        verifyTitle.style.color = "#991b1b"; // red error color
        verifyDesc.innerText = `Error: ${error.message}. Please try requesting a new link from the main website.`;
    }
}

// Execution checks
if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
        // If the user opened the link in incognito or on a different device, we must ask for their email to verify
        verifySpinner.style.display = 'none';
        verifyTitle.innerText = "Confirm your email";
        verifyDesc.innerText = "Because you opened this link in a new browser or device, we need to verify your email address to ensure security.";
        verifyEmailForm.style.display = 'block';
        
        submitManualEmailBtn.addEventListener('click', () => {
            const manualEmail = manualEmailInput.value.trim();
            if (manualEmail) {
                handleVerification(manualEmail);
            }
        });
    } else {
        // Normal flow: verify immediately using the stored email
        handleVerification(email);
    }
} else {
    // If someone visits auth-verify.html directly without a proper link
    verifySpinner.style.display = 'none';
    verifyTitle.innerText = "Invalid Link";
    verifyTitle.style.color = "#991b1b"; // red error color
    verifyDesc.innerText = "This link is not valid or has expired. Please request a new login link from the website.";
}