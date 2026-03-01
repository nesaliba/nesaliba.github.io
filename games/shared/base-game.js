import { StateManager } from '../../js/state-manager.js';
import { auth, db, collection, addDoc } from '/js/firebase-init.js';

export class BaseGame {
    constructor(title) {
        this.gameTitle = title;
        this.audioCtx = null;
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        this.parseSettings();
    }

    parseSettings() {
        const params = new URLSearchParams(window.location.search);
        this.settings = {
            timer: params.get('timer') || 'off',
            timerVisible: params.get('timerVisible') || 'visible',
            maxMistakes: parseInt(params.get('maxMistakes')) || 10,
            mute: params.get('mute') === 'true' || StateManager.getMuteState(),
            theme: params.get('theme') || localStorage.getItem('scitriad_theme') || 'light'
        };
        if (this.settings.theme === 'dark') document.body.classList.add('dark-theme');
    }

    initAudio() {
        if (this.settings.mute) return;
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    }

    playTone(frequency, type, duration, vol = 0.1) {
        if (this.settings.mute || !this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }
    
    playHit() { this.playTone(600, 'sine', 0.15); }
    playMiss() { this.playTone(150, 'sawtooth', 0.3); }
    playVictory() {
        setTimeout(() => this.playTone(400, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(600, 'sine', 0.2), 150);
        setTimeout(() => this.playTone(800, 'sine', 0.4), 300);
    }
    playGameOver() {
        setTimeout(() => this.playTone(300, 'sawtooth', 0.2), 0);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.4), 300);
    }

    startTimer(displayElementId) {
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            const mins = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
            const secs = (this.elapsedSeconds % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById(displayElementId);
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    async saveProgress(mistakes) {
        if (StateManager.isUserLoggedIn) {
            try {
                if (auth && auth.currentUser) {
                    await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
                        title: this.gameTitle,
                        time: this.elapsedSeconds,
                        mistakes: mistakes,
                        date: new Date().toISOString()
                    });
                }
            } catch (error) {
                console.warn("Could not save progress.", error);
            }
        }
    }
}