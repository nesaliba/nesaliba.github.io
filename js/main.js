function scrollToContent() {
    const element = document.getElementById("explore");
    element.scrollIntoView({ behavior: "smooth" });
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    } else {
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
});

const navSlide = () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if(burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }
}
navSlide();

const canvas = document.getElementById('heroCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const balls =[
        { angle: 0, color: '#ff416c', radius: 15, speed: 0.02, distX: 160, distY: 100 },
        { angle: Math.PI * 2 / 3, color: '#f7b733', radius: 15, speed: 0.025, distX: 110, distY: 160 },
        { angle: Math.PI * 4 / 3, color: '#00b09b', radius: 15, speed: 0.015, distX: 130, distY: 130 }
    ];

    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'; 
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const positions =[];

        balls.forEach(ball => {
            ball.angle += ball.speed;
            const x = centerX + Math.cos(ball.angle) * ball.distX;
            const y = centerY + Math.sin(ball.angle * 1.2) * ball.distY;
            positions.push({ x, y });

            ctx.beginPath();
            ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = ball.color;
            ctx.fill();
            ctx.closePath();
        });

        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(positions[0].x, positions[0].y);
        ctx.lineTo(positions[1].x, positions[1].y);
        ctx.lineTo(positions[2].x, positions[2].y);
        ctx.lineTo(positions[0].x, positions[0].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        requestAnimationFrame(animate);
    }
    animate();
}

function setupGameSettingsModal() {
    const gameLinks = document.querySelectorAll('.game-link');
    if (gameLinks.length === 0) return;

    const modalHTML = `
        <div class="modal-overlay" id="settingsModal" style="z-index: 2000;">
            <div class="modal-content" style="max-width: 400px; width: 90%; text-align: left; background: var(--modal-bg); border: 1px solid var(--border-color);">
                <h2 style="text-align: center; margin-bottom: 1.5rem; color: var(--text-dark);">Game Settings</h2>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Timer</label>
                    <select id="setting-timer" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="off">Off</option>
                        <option value="on">On</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Timer Visibility</label>
                    <select id="setting-timer-visible" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Tile Mode</label>
                    <select id="setting-tile-mode" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="all">All Tiles Visible</option>
                        <option value="one">One Tile At A Time</option>
                    </select>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Sounds</label>
                    <select id="setting-mute-sounds" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="false">On</option>
                        <option value="true">Muted</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Max Wrong Placements: <span id="mistakes-val">10</span></label>
                    <input type="range" id="setting-mistakes" min="0" max="10" value="10" style="width: 100%;">
                </div>
                
                <div id="save-default-container" style="margin-bottom: 1.5rem; display: none; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" id="setting-save-default" style="cursor: pointer; width: 16px; height: 16px;">
                    <label for="setting-save-default" style="font-weight: 600; font-size: 0.9rem; cursor: pointer; color: var(--primary-blue);">Save as my default settings</label>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button id="btn-cancel-settings" class="btn-secondary" style="margin-top: 0; padding: 0.5rem 1rem;">Cancel</button>
                    <button id="btn-start-game" style="margin-top: 0; padding: 0.5rem 1rem; background: var(--primary-blue); color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Start Game</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const settingsModal = document.getElementById('settingsModal');
    const mistakesInput = document.getElementById('setting-mistakes');
    const mistakesVal = document.getElementById('mistakes-val');
    const btnCancel = document.getElementById('btn-cancel-settings');
    const btnStart = document.getElementById('btn-start-game');
    const timerSelect = document.getElementById('setting-timer');
    const timerVisibleSelect = document.getElementById('setting-timer-visible');
    
    let pendingGameUrl = '';

    timerSelect.addEventListener('change', (e) => {
        if(e.target.value === 'off') {
            timerVisibleSelect.disabled = true;
            timerVisibleSelect.style.opacity = '0.5';
        } else {
            timerVisibleSelect.disabled = false;
            timerVisibleSelect.style.opacity = '1';
        }
    });
    timerSelect.dispatchEvent(new Event('change')); 
    
    mistakesInput.addEventListener('input', (e) => {
        mistakesVal.textContent = e.target.value;
    });
    
    btnCancel.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    btnStart.addEventListener('click', () => {
        const settings = {
            timer: timerSelect.value,
            timerVisible: timerVisibleSelect.value,
            tileMode: document.getElementById('setting-tile-mode').value,
            maxMistakes: mistakesInput.value,
            muteSounds: document.getElementById('setting-mute-sounds').value === 'true',
            darkMode: document.body.classList.contains('dark-theme') // Keep current theme when saving defaults
        };

        if (document.getElementById('setting-save-default').checked && window.saveGameSettings) {
            window.saveGameSettings(settings);
        }
        
        const params = new URLSearchParams();
        params.set('timer', settings.timer);
        params.set('timerVisible', settings.timerVisible);
        params.set('tileMode', settings.tileMode);
        params.set('maxMistakes', settings.maxMistakes);
        params.set('mute', settings.muteSounds);
        params.set('theme', settings.darkMode ? 'dark' : 'light');
        
        window.location.href = pendingGameUrl + '?' + params.toString();
    });
    
    gameLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                pendingGameUrl = href;
                
                if (window.userSettings) {
                    timerSelect.value = window.userSettings.timer || 'off';
                    timerVisibleSelect.value = window.userSettings.timerVisible || 'visible';
                    document.getElementById('setting-tile-mode').value = window.userSettings.tileMode || 'all';
                    document.getElementById('setting-mute-sounds').value = window.userSettings.muteSounds ? 'true' : 'false';
                    mistakesInput.value = window.userSettings.maxMistakes || 10;
                    mistakesVal.textContent = mistakesInput.value;
                    timerSelect.dispatchEvent(new Event('change'));
                }
                
                if (window.isUserLoggedIn) {
                    document.getElementById('save-default-container').style.display = 'flex';
                } else {
                    document.getElementById('save-default-container').style.display = 'none';
                }

                settingsModal.style.display = 'flex';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupGameSettingsModal);