import { BaseGame } from '/games/shared/base-game.js';
import { generateFieldMissions } from './levels.js';
import { StateManager } from '/js/state-manager.js';

class FieldCommander extends BaseGame {
    constructor() {
        super("Field Commander");
        this.canvas = document.getElementById('field-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.missions = generateFieldMissions ? generateFieldMissions(10) :[];
        this.currentMissionIndex = 0;
        this.mistakes = 0;
        
        this.simulating = false;
        this.animationFrame = null;
        
        this.particle = { x: 0, y: 0, vx: 0, vy: 0, q: 1, m: 1 };
        this.trail =[];
        this.Ey = 0; 
        this.Bz = 0;
        
        this._crashResetPending = false;
        
        this.initUI();
        this.loadMission(this.currentMissionIndex);
        this.draw();
    }

    playLaunch() { this.playTone(300, 'sine', 0.2); }
    playCrash() { this.playTone(150, 'sawtooth', 0.3); }
    playFinished() { this.playVictory(); }

    initUI() {
        document.body.addEventListener('pointerdown', () => this.initAudio(), { once: true });

        this.sliderE = document.getElementById('slider-e');
        this.sliderB = document.getElementById('slider-b');
        this.valE = document.getElementById('val-e');
        this.valB = document.getElementById('val-b');
        this.containerE = document.getElementById('container-e');
        this.containerB = document.getElementById('container-b');

        this.sliderE.addEventListener('input', (e) => {
            this.initAudio();
            this.Ey = parseFloat(e.target.value);
            this.valE.innerText = this.Ey;
            if (!this.simulating) this.draw();
        });

        this.sliderB.addEventListener('input', (e) => {
            this.initAudio();
            this.Bz = parseFloat(e.target.value);
            this.valB.innerText = this.Bz;
            if (!this.simulating) this.draw();
        });

        const launchOnEnter = (e) => {
            if (e.key === 'Enter' && !this.simulating && !this._crashResetPending) {
                this.initAudio();
                this.resetAndLaunch();
            }
        };
        this.sliderE.addEventListener('keydown', launchOnEnter);
        this.sliderB.addEventListener('keydown', launchOnEnter);

        const btnLaunch = document.getElementById('btn-launch');
        btnLaunch.addEventListener('click', () => {
            this.initAudio();
            if (!this.simulating && !this._crashResetPending) this.resetAndLaunch();
        });

        document.getElementById('btn-reset').addEventListener('click', () => {
            this.initAudio();
            this._crashResetPending = false;
            this.resetSimulation();
        });

        document.getElementById('toggle-vectors').addEventListener('change', () => {
            if (!this.simulating) this.draw();
        });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.initAudio();
            document.getElementById('report-modal').style.display = 'none';
            if (generateFieldMissions) this.missions = generateFieldMissions(10);
            this.currentMissionIndex = 0;
            this.mistakes = 0;
            document.getElementById('mistakes-display').innerText = `Mistakes: 0`;
            this.loadMission(0);
        });
    }

    resetAndLaunch() {
        this.resetSimulation();
        requestAnimationFrame(() => this.launch());
    }

    loadMission(index) {
        if (index >= this.missions.length) {
            this.gameOver();
            return;
        }

        const m = this.missions[index];
        document.getElementById('mission-display').innerText = `Mission: ${index + 1} / ${this.missions.length}`;
        document.getElementById('mission-briefing').innerHTML = `<strong>${m.title}</strong><br><br>${m.briefing}`;
        document.getElementById('feedback-message').innerText = '';
        document.getElementById('feedback-message').className = 'feedback-msg';
        
        if (m.lockedE !== null) {
            this.sliderE.value = m.lockedE;
            this.sliderE.disabled = true;
            this.Ey = m.lockedE;
            this.containerE.style.opacity = '0.5';
        } else {
            this.sliderE.value = 0;
            this.sliderE.disabled = false;
            this.Ey = 0;
            this.containerE.style.opacity = '1';
        }

        if (m.lockedB !== null) {
            this.sliderB.value = m.lockedB;
            this.sliderB.disabled = true;
            this.Bz = m.lockedB;
            this.containerB.style.opacity = '0.5';
        } else {
            this.sliderB.value = 0;
            this.sliderB.disabled = false;
            this.Bz = 0;
            this.containerB.style.opacity = '1';
        }
        
        this.valE.innerText = this.Ey;
        this.valB.innerText = this.Bz;

        this._crashResetPending = false;
        this.resetSimulation();
        
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([document.getElementById('mission-briefing')]).catch(err => console.log(err));
        }
    }

    resetSimulation() {
        cancelAnimationFrame(this.animationFrame);
        this.simulating = false;
        const m = this.missions[this.currentMissionIndex];
        this.particle = { 
            x: m.start.x, 
            y: m.start.y, 
            vx: m.start.vx, 
            vy: m.start.vy, 
            q: m.charge, 
            m: 1 
        };
        this.trail =[{ x: m.start.x, y: m.start.y }];
        document.getElementById('btn-launch').disabled = false;
        document.getElementById('btn-launch').textContent = 'Launch Particle';
        document.getElementById('feedback-message').innerText = '';
        this.draw();
    }

    launch() {
        this.playLaunch();
        this.simulating = true;
        document.getElementById('btn-launch').disabled = true;
        document.getElementById('btn-launch').textContent = 'Simulating…';
        
        const loop = () => {
            if (!this.simulating) return;
            const dt = 0.02;
            
            this.updatePhysics(dt);
            this.draw();
            
            if (this.checkCollisions()) {
                this.simulating = false;
                return;
            }
            
            this.animationFrame = requestAnimationFrame(loop);
        };
        this.animationFrame = requestAnimationFrame(loop);
    }

    updatePhysics(dt) {
        const ax = (this.particle.q * this.particle.vy * this.Bz) / this.particle.m;
        const ay = ((this.particle.q * this.Ey) - (this.particle.q * this.particle.vx * this.Bz)) / this.particle.m;

        this.particle.vx += ax * dt;
        this.particle.vy += ay * dt;
        
        this.particle.x += this.particle.vx * dt;
        this.particle.y += this.particle.vy * dt;

        const lastT = this.trail[this.trail.length - 1];
        if (Math.hypot(this.particle.x - lastT.x, this.particle.y - lastT.y) > 2) {
            this.trail.push({ x: this.particle.x, y: this.particle.y });
        }
    }

    checkCollisions() {
        const m = this.missions[this.currentMissionIndex];
        const p = this.particle;
        const pr = 8; 

        if (Math.hypot(p.x - m.target.x, p.y - m.target.y) < (pr + m.target.r)) {
            this.handleWin();
            return true;
        }

        if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
            this.handleCrash("Particle lost in space.");
            return true;
        }

        for (let obs of m.obstacles) {
            if (p.x + pr > obs.x && p.x - pr < obs.x + obs.w &&
                p.y + pr > obs.y && p.y - pr < obs.y + obs.h) {
                this.handleCrash("Particle collided with containment barrier.");
                return true;
            }
        }
        return false;
    }

    handleWin() {
        this.playHit();
        const fb = document.getElementById('feedback-message');
        fb.innerText = "Target Hit! Mission Accomplished.";
        fb.className = "feedback-msg feedback-success";
        
        setTimeout(() => {
            this.currentMissionIndex++;
            this.loadMission(this.currentMissionIndex);
        }, 1500);
    }

    handleCrash(msg) {
        this.playCrash();
        this.mistakes++;
        document.getElementById('mistakes-display').innerText = `Mistakes: ${this.mistakes}`;
        
        const fb = document.getElementById('feedback-message');
        fb.innerText = msg + " Adjust fields and try again!";
        fb.className = "feedback-msg feedback-error";
        
        this.canvas.style.transform = "translateX(-5px)";
        setTimeout(() => this.canvas.style.transform = "translateX(5px)", 50);
        setTimeout(() => this.canvas.style.transform = "translateX(0)", 100);

        this._crashResetPending = true;
        setTimeout(() => {
            this._crashResetPending = false;
            this.resetSimulation();
        }, 800);
    }

    draw() {
        const toCy = (y) => this.height - y;
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const m = this.missions[this.currentMissionIndex];
        if (!m) return;

        if (document.getElementById('toggle-vectors').checked) {
            this.ctx.lineWidth = 1;
            if (Math.abs(this.Ey) > 0) {
                this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                this.ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
                for (let x = 50; x < this.width; x += 100) {
                    for (let y = 50; y < this.height; y += 100) {
                        const cy = toCy(y);
                        this.ctx.beginPath();
                        this.ctx.moveTo(x, cy);
                        const arrowEnd = this.Ey > 0 ? cy - 40 : cy + 40; 
                        this.ctx.lineTo(x, arrowEnd);
                        this.ctx.stroke();
                        this.ctx.beginPath();
                        this.ctx.arc(x, arrowEnd, 3, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
            if (Math.abs(this.Bz) > 0) {
                this.ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
                this.ctx.lineWidth = 2;
                for (let x = 25; x < this.width; x += 50) {
                    for (let y = 25; y < this.height; y += 50) {
                        const cy = toCy(y);
                        if (this.Bz > 0) {
                            this.ctx.beginPath();
                            this.ctx.arc(x, cy, 3, 0, Math.PI * 2);
                            this.ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
                            this.ctx.fill();
                            this.ctx.beginPath();
                            this.ctx.arc(x, cy, 6, 0, Math.PI * 2);
                            this.ctx.stroke();
                        } else {
                            this.ctx.beginPath();
                            this.ctx.moveTo(x - 4, cy - 4); this.ctx.lineTo(x + 4, cy + 4);
                            this.ctx.moveTo(x + 4, cy - 4); this.ctx.lineTo(x - 4, cy + 4);
                            this.ctx.stroke();
                        }
                    }
                }
            }
        }

        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 2;
        for (let obs of m.obstacles) {
            const cy = toCy(obs.y + obs.h); 
            this.ctx.fillRect(obs.x, cy, obs.w, obs.h);
            this.ctx.strokeRect(obs.x, cy, obs.w, obs.h);
        }

        this.ctx.beginPath();
        this.ctx.arc(m.target.x, toCy(m.target.y), m.target.r, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#22c55e';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        if (this.trail.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.trail[0].x, toCy(this.trail[0].y));
            for (let i = 1; i < this.trail.length; i++) {
                this.ctx.lineTo(this.trail[i].x, toCy(this.trail[i].y));
            }
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        this.ctx.beginPath();
        this.ctx.arc(m.start.x, toCy(m.start.y), 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        const p = this.particle;
        const gradient = this.ctx.createRadialGradient(p.x, toCy(p.y), 0, p.x, toCy(p.y), 12);
        if (m.charge > 0) {
            gradient.addColorStop(0, '#fca5a5');
            gradient.addColorStop(0.5, '#ef4444');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else {
            gradient.addColorStop(0, '#93c5fd');
            gradient.addColorStop(0.5, '#3b82f6');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }
        this.ctx.beginPath();
        this.ctx.arc(p.x, toCy(p.y), 8, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(m.charge > 0 ? '+' : '\u2212', p.x, toCy(p.y));

        if (this.simulating) {
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 0) {
                const arrowLen = 25;
                const nx = p.vx / speed;
                const ny = -p.vy / speed; 
                const arrowTipX = p.x + nx * arrowLen;
                const arrowTipY = toCy(p.y) + ny * arrowLen;
                this.ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, toCy(p.y));
                this.ctx.lineTo(arrowTipX, arrowTipY);
                this.ctx.stroke();
                const headLen = 8;
                const angle = Math.atan2(arrowTipY - toCy(p.y), arrowTipX - p.x);
                this.ctx.beginPath();
                this.ctx.moveTo(arrowTipX, arrowTipY);
                this.ctx.lineTo(arrowTipX - headLen * Math.cos(angle - Math.PI / 6), arrowTipY - headLen * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(arrowTipX, arrowTipY);
                this.ctx.lineTo(arrowTipX - headLen * Math.cos(angle + Math.PI / 6), arrowTipY - headLen * Math.sin(angle + Math.PI / 6));
                this.ctx.stroke();
            }
        }

        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.fillText(`E_y = ${this.Ey} N/C`, 10, 10);
        this.ctx.fillText(`B_z = ${this.Bz} T`, 10, 28);

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#22c55e';
        this.ctx.font = 'bold 12px Inter, sans-serif';
        this.ctx.fillText('TARGET', m.target.x, toCy(m.target.y));
    }

    gameOver() {
        this.playFinished();
        const total = this.missions.length;
        const stars = this.mistakes === 0 ? '⭐⭐⭐' : this.mistakes <= 3 ? '⭐⭐' : '⭐';
        
        document.getElementById('report-details').innerHTML = `
            <p><strong>Missions Completed:</strong> ${total} / ${total}</p>
            <p><strong>Total Mistakes:</strong> ${this.mistakes}</p>
            <p><strong>Rating:</strong> ${stars}</p>
            <p style="margin-top:1rem; font-size:0.95rem; color:#64748b;">
                ${this.mistakes === 0
                    ? 'Perfect campaign! You have mastered electromagnetic field control.'
                    : this.mistakes <= 3
                    ? 'Excellent work, Commander! Only a few miscalculations along the way.'
                    : 'Mission complete, but review your Lorentz force equations for next time.'}
            </p>
        `;

        document.getElementById('report-modal').style.display = 'flex';
        document.getElementById('report-modal').style.alignItems = 'center';
        document.getElementById('report-modal').style.justifyContent = 'center';

        this.saveProgress(this.mistakes);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FieldCommander();
});