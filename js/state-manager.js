export const StateManager = {
    isUserLoggedIn: localStorage.getItem('scitriad_logged_in') === 'true',
    userEmail: localStorage.getItem('scitriad_user_email') || null,
    userSettings: null,

    setLoginState(isLoggedIn, email) {
        this.isUserLoggedIn = isLoggedIn;
        this.userEmail = email;
        if (isLoggedIn) {
            localStorage.setItem('scitriad_logged_in', 'true');
            localStorage.setItem('scitriad_user_email', email);
        } else {
            localStorage.removeItem('scitriad_logged_in');
            localStorage.removeItem('scitriad_user_email');
            this.userSettings = null;
        }
    },

    setSettings(settings) {
        this.userSettings = settings;
        this.applyThemeAndSound();
    },

    applyThemeAndSound() {
        const isDark = this.userSettings?.darkMode || localStorage.getItem('scitriad_theme') === 'dark';
        if (isDark) {
            document.documentElement.classList.add('dark-theme');
            if (document.body) document.body.classList.add('dark-theme');
            localStorage.setItem('scitriad_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            if (document.body) document.body.classList.remove('dark-theme');
            localStorage.setItem('scitriad_theme', 'light');
        }

        if (this.userSettings?.muteSounds !== undefined) {
            localStorage.setItem('scitriad_mute', this.userSettings.muteSounds ? 'true' : 'false');
        }
    },
    
    getMuteState() {
        return this.userSettings?.muteSounds || localStorage.getItem('scitriad_mute') === 'true';
    }
};