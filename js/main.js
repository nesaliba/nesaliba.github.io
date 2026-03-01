import { StateManager } from './state-manager.js';
import { GamesCatalog } from './games-catalog.js';

// Expose to window since this is now an ES Module
window.scrollToContent = function() {
    const element = document.getElementById("explore");
    if(element) element.scrollIntoView({ behavior: "smooth" });
}

function setupHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Five dots — one per subject (chem, bio, phys, math, eng)
    const circles =[
        { x: width * 0.2,  y: height * 0.3,  r: Math.max(80,  width * 0.08), vx: 0.5,  vy: 0.3,  color: 'rgba(30, 64, 175, 0.15)'   }, // chem – blue
        { x: width * 0.75, y: height * 0.25, r: Math.max(70,  width * 0.07), vx: -0.3, vy: 0.4,  color: 'rgba(22, 101, 52, 0.15)'    }, // bio  – green
        { x: width * 0.5,  y: height * 0.7,  r: Math.max(60,  width * 0.06), vx: 0.6,  vy: -0.4, color: 'rgba(88, 28, 135, 0.15)'    }, // phys – purple
        { x: width * 0.8,  y: height * 0.65, r: Math.max(120, width * 0.12), vx: -0.4, vy: 0.5,  color: 'rgba(153, 27, 27, 0.12)'    }, // math – red
        { x: width * 0.15, y: height * 0.75, r: Math.max(90,  width * 0.09), vx: 0.35, vy: -0.3, color: 'rgba(133, 77, 14, 0.13)'    }  // eng  – amber
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        circles.forEach(c => {
            c.x += c.vx;
            c.y += c.vy;
            
            if (c.x < -c.r) c.x = width + c.r;
            if (c.x > width + c.r) c.x = -c.r;
            if (c.y < -c.r) c.y = height + c.r;
            if (c.y > height + c.r) c.y = -c.r;
            
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

function renderCatalog() {
    const container = document.getElementById('catalog-container');
    if (!container) return;

    const subject = container.getAttribute('data-subject');
    const filteredGames = GamesCatalog.filter(g => g.subject === subject);
    
    const categories = {};
    filteredGames.forEach(g => {
        if (!categories[g.category]) categories[g.category] = [];
        categories[g.category].push(g);
    });

    let html = '';
    for (const [category, games] of Object.entries(categories)) {
        html += `<details><summary>${category}</summary><div class="details-content">`;
        games.forEach(g => {
            html += `
                <a href="${g.path}" class="game-link" ${g.isNoModal ? 'data-no-modal="true"' : ''}>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>${g.title}</span>
                        <button class="info-btn" data-game="${g.id}" title="Game Info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </button>
                    </div>
                    <span class="game-icon">➜</span>
                </a>
            `;
        });
        html += `</div></details>`;
    }
    container.innerHTML = html;
}

function setupInfoModal() {
    const modalHTML = `
        <div class="modal-overlay" id="infoModal" style="z-index: 3000;">
            <div class="modal-content" style="max-width: 500px; width: 90%; text-align: left; background: var(--modal-bg); border: 1px solid var(--border-color);">
                <h2 id="info-modal-title" style="margin-bottom: 1rem; color: var(--text-dark);">Game Title</h2>
                <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">Premise</h4>
                <p id="info-modal-desc" style="margin-bottom: 1.5rem; color: var(--text-dark); font-size: 0.95rem;"></p>
                <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">How to Play</h4>
                <p id="info-modal-play" style="margin-bottom: 2rem; color: var(--text-dark); font-size: 0.95rem;"></p>
                <div style="text-align: right;">
                    <button id="btn-close-info" class="btn-action primary" style="padding: 0.5rem 1.5rem; background: var(--primary-blue); color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Got it!</button>
                </div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('infoModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const infoModal = document.getElementById('infoModal');
    const btnCloseInfo = document.getElementById('btn-close-info');
    const titleEl = document.getElementById('info-modal-title');
    const descEl = document.getElementById('info-modal-desc');
    const playEl = document.getElementById('info-modal-play');

    btnCloseInfo.addEventListener('click', () => {
        infoModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });

    document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const gameId = btn.getAttribute('data-game');
            const info = GamesCatalog.find(g => g.id === gameId);
            
            if (info) {
                titleEl.textContent = info.title;
                descEl.textContent = info.desc;
                playEl.textContent = info.play;
                infoModal.style.display = 'flex';
                document.body.classList.add('no-scroll');
            } else {
                console.warn('No info found for game ID:', gameId);
            }
        });
    });
}

function setupGameSettingsModal() {
    const gameLinks = document.querySelectorAll('.game-link');
    if (gameLinks.length === 0) return;

    const toggleCSS = `
        <style id="toggle-switch-styles">
            .toggle-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.1rem;
            }
            .toggle-label {
                font-weight: 600;
                color: var(--text-dark);
                font-size: 0.95rem;
            }
            .toggle-switch {
                position: relative;
                width: 46px;
                height: 26px;
                flex-shrink: 0;
            }
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
            }
            .toggle-slider {
                position: absolute;
                inset: 0;
                background: #94a3b8;
                border-radius: 26px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .toggle-slider::before {
                content: '';
                position: absolute;
                width: 18px;
                height: 18px;
                left: 4px;
                top: 4px;
                background: white;
                border-radius: 50%;
                transition: transform 0.2s;
                box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            }
            .toggle-switch input:checked + .toggle-slider {
                background: #60a5fa;
            }
            .toggle-switch input:checked + .toggle-slider::before {
                transform: translateX(20px);
            }
            .toggle-switch input:disabled + .toggle-slider {
                opacity: 0.4;
                cursor: not-allowed;
            }
            .settings-divider {
                border: none;
                border-top: 1px solid var(--border-color);
                margin: 1rem 0;
            }
        </style>
    `;

    const modalHTML = `
        ${toggleCSS}
        <div class="modal-overlay" id="settingsModal" style="z-index: 2000;">
            <div class="modal-content" style="max-width: 400px; width: 90%; text-align: left; background: var(--modal-bg); border: 1px solid var(--border-color);">
                <h2 style="text-align: center; margin-bottom: 1.5rem; color: var(--text-dark);">Game Settings</h2>
                
                <div class="toggle-row">
                    <span class="toggle-label">Timer</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-timer">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="toggle-row" id="timer-visible-row">
                    <span class="toggle-label">Show Timer</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-timer-visible" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="toggle-row">
                    <span class="toggle-label">Sounds</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="setting-mute-sounds">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <hr class="settings-divider">

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Tile Mode</label>
                    <select id="setting-tile-mode" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--input-border); background: var(--card-bg); color: var(--text-dark);">
                        <option value="all">All Tiles Visible</option>
                        <option value="one">One Tile At A Time</option>
                    </select>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Max Wrong Placements: <span id="mistakes-val">10</span></label>
                    <input type="range" id="setting-mistakes" min="0" max="10" value="10" style="width: 100%; accent-color: #60a5fa;">
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
    const timerToggle = document.getElementById('setting-timer');
    const timerVisibleToggle = document.getElementById('setting-timer-visible');
    const timerVisibleRow = document.getElementById('timer-visible-row');
    
    let pendingGameUrl = '';
    let pendingDetailsIndex = -1;

    function syncTimerVisibility() {
        const timerOn = timerToggle.checked;
        timerVisibleToggle.disabled = !timerOn;
        timerVisibleRow.style.opacity = timerOn ? '1' : '0.5';
    }
    timerToggle.addEventListener('change', syncTimerVisibility);
    syncTimerVisibility();
    
    mistakesInput.addEventListener('input', (e) => {
        mistakesVal.textContent = e.target.value;
    });
    
    btnCancel.addEventListener('click', () => {
        settingsModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });
    
    btnStart.addEventListener('click', () => {
        const settings = {
            timer: timerToggle.checked ? 'on' : 'off',
            timerVisible: timerVisibleToggle.checked ? 'visible' : 'hidden',
            tileMode: document.getElementById('setting-tile-mode').value,
            maxMistakes: mistakesInput.value,
            muteSounds: !document.getElementById('setting-mute-sounds').checked,
            darkMode: document.body.classList.contains('dark-theme')
        };

        if (document.getElementById('setting-save-default').checked) {
            import('./auth-service.js').then(({ authService }) => {
                authService.saveSettings(settings);
            });
        }

        if (pendingDetailsIndex !== -1) {
            const pageName = window.location.pathname.split('/').pop() || 'index.html';
            sessionStorage.setItem('expandedDetails_' + pageName, pendingDetailsIndex);
        }
        
        const params = new URLSearchParams();
        params.set('timer', settings.timer);
        params.set('timerVisible', settings.timerVisible);
        params.set('tileMode', settings.tileMode);
        params.set('maxMistakes', settings.maxMistakes);
        params.set('mute', settings.muteSounds);
        params.set('theme', settings.darkMode ? 'dark' : 'light');
        
        document.body.classList.remove('no-scroll');
        window.location.href = pendingGameUrl + '?' + params.toString();
    });
    
    gameLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const detailsParent = link.closest('details');
            let detailsIndex = -1;
            if (detailsParent) {
                const allDetails = document.querySelectorAll('details');
                detailsIndex = Array.from(allDetails).indexOf(detailsParent);
            }

            if (link.hasAttribute('data-no-modal')) {
                if (detailsIndex !== -1) {
                    const pageName = window.location.pathname.split('/').pop() || 'index.html';
                    sessionStorage.setItem('expandedDetails_' + pageName, detailsIndex);
                }
                return;
            }

            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                pendingGameUrl = href;
                pendingDetailsIndex = detailsIndex;
                
                if (StateManager.userSettings) {
                    timerToggle.checked = (StateManager.userSettings.timer || 'off') === 'on';
                    timerVisibleToggle.checked = (StateManager.userSettings.timerVisible || 'visible') === 'visible';
                    document.getElementById('setting-tile-mode').value = StateManager.userSettings.tileMode || 'all';
                    document.getElementById('setting-mute-sounds').checked = !StateManager.userSettings.muteSounds;
                    mistakesInput.value = StateManager.userSettings.maxMistakes || 10;
                    mistakesVal.textContent = mistakesInput.value;
                    syncTimerVisibility();
                }
                
                if (StateManager.isUserLoggedIn) {
                    document.getElementById('save-default-container').style.display = 'flex';
                } else {
                    document.getElementById('save-default-container').style.display = 'none';
                }

                settingsModal.style.display = 'flex';
                document.body.classList.add('no-scroll');
            }
        });
    });
}

function restoreExpandedDetails() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const savedState = sessionStorage.getItem('expandedDetails_' + pageName);
    
    if (savedState !== null) {
        const index = parseInt(savedState, 10);
        const allDetails = document.querySelectorAll('details');
        if (allDetails[index]) {
            allDetails[index].setAttribute('open', 'true');
            setTimeout(() => {
                allDetails[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
        sessionStorage.removeItem('expandedDetails_' + pageName);
    }
}

function setupGameCounter() {
    const mainExplore = document.getElementById('explore');
    if (!mainExplore) return;

    const detailsElements = mainExplore.querySelectorAll('details');
    if (detailsElements.length === 0) return;

    const totalGames = mainExplore.querySelectorAll('a.game-link').length;
    
    const counterContainer = document.createElement('div');
    counterContainer.className = 'game-counter-container';
    
    const counterText = document.createElement('span');
    counterText.className = 'game-counter-text';
    counterText.textContent = `Total Games Available: ${totalGames}`;

    const infoIconContainer = document.createElement('div');
    infoIconContainer.className = 'info-icon-container';
    infoIconContainer.tabIndex = 0; 
    
    const infoIcon = document.createElement('div');
    infoIcon.className = 'game-counter-icon';
    infoIcon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    const tooltip = document.createElement('div');
    tooltip.className = 'game-counter-tooltip';
    
    let tooltipContent = `<div class="tooltip-header">Games per section:</div>`;
    
    detailsElements.forEach(detail => {
        const summary = detail.querySelector('summary');
        const sectionName = summary ? summary.textContent.trim() : 'Section';
        const sectionGames = detail.querySelectorAll('a.game-link').length;
        tooltipContent += `<div class="tooltip-row"><span>${sectionName}</span> <span class="tooltip-count">${sectionGames}</span></div>`;
    });

    tooltip.innerHTML = tooltipContent;

    infoIconContainer.appendChild(infoIcon);
    infoIconContainer.appendChild(tooltip);

    counterContainer.appendChild(counterText);
    counterContainer.appendChild(infoIconContainer);

    mainExplore.insertBefore(counterContainer, mainExplore.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    setupHeroCanvas();         
    renderCatalog();           
    setupGameSettingsModal();  
    setupInfoModal();          
    setupGameCounter();        
    restoreExpandedDetails();
    
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) {
        scrollInd.addEventListener('click', () => {
            const element = document.getElementById("explore");
            if(element) element.scrollIntoView({ behavior: "smooth" });
        });
    }
});