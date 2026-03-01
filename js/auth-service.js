import { 
    auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    signOut, onAuthStateChanged, updateEmail, updatePassword, doc, setDoc, getDoc 
} from '/js/firebase-init.js';
import { StateManager } from './state-manager.js';

class AuthService {
    constructor() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                StateManager.setLoginState(true, user.email);
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists() && docSnap.data().settings) {
                        StateManager.setSettings(docSnap.data().settings);
                    }
                } catch (e) {
                    console.error("Error fetching user settings:", e);
                }
                window.dispatchEvent(new CustomEvent('userStateChanged', { detail: { loggedIn: true, user } }));
            } else {
                StateManager.setLoginState(false, null);
                window.dispatchEvent(new CustomEvent('userStateChanged', { detail: { loggedIn: false, user: null } }));
            }
        });
    }

    async login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async register(email, password) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", result.user.uid), {
            email: result.user.email,
            createdAt: new Date(),
            lastLogin: new Date()
        }, { merge: true });
        return result;
    }

    async logout() {
        return signOut(auth);
    }

    async updateUserEmail(newEmail) {
        return updateEmail(auth.currentUser, newEmail);
    }

    async updateUserPassword(newPass) {
        return updatePassword(auth.currentUser, newPass);
    }

    async saveSettings(settings) {
        if (!auth.currentUser) return;
        StateManager.setSettings(settings);
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), { settings }, { merge: true });
        } catch (e) {
            console.error("Error saving settings:", e);
        }
    }
}

export const authService = new AuthService();