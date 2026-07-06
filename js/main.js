import { StateManager } from './state-manager.js';
import { GamesCatalog } from './games-catalog.js';

// Expose to window since this is now an ES Module
window.scrollToContent = function() {
    const element = document.getElementById("explore");
    if(element) element.scrollIntoView({ behavior: "smooth" });
}

window.scrollToExplore = function() {
    const element = document.getElementById("catalog-container");
    if(element) element.scrollIntoView({ behavior: "smooth", block: "start" });
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

    // Six dots — one per subject (chem, bio, phys, math, eng, soc)
    const circles =[
        { x: width * 0.2,  y: height * 0.3,  r: Math.max(80,  width * 0.08), vx: 0.5,  vy: 0.3,  color: 'rgba(30, 64, 175, 0.15)'  }, 
        { x: width * 0.75, y: height * 0.25, r: Math.max(70,  width * 0.07), vx: -0.3, vy: 0.4,  color: 'rgba(22, 101, 52, 0.15)'   }, 
        { x: width * 0.5,  y: height * 0.7,  r: Math.max(60,  width * 0.06), vx: 0.6,  vy: -0.4, color: 'rgba(88, 28, 135, 0.15)'   }, 
        { x: width * 0.8,  y: height * 0.65, r: Math.max(120, width * 0.12), vx: -0.4, vy: 0.5,  color: 'rgba(153, 27, 27, 0.12)'   }, 
        { x: width * 0.15, y: height * 0.75, r: Math.max(90,  width * 0.09), vx: 0.35, vy: -0.3, color: 'rgba(133, 77, 14, 0.13)'   }, 
        { x: width * 0.45, y: height * 0.35, r: Math.max(85,  width * 0.08), vx: -0.4, vy: 0.2,  color: 'rgba(13, 148, 136, 0.14)'  }  
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
            ctx.arc(c.x, c.y, c.r || 5, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Maintain active accordion state globally
let activeAccordionId = null;

function renderCatalog() {
    const container = document.getElementById('catalog-container');
    if (!container) return;

    const subject = container.getAttribute('data-subject');
    
    // Check if legacy games should be shown
    const showLegacy = StateManager.getLegacyState ? StateManager.getLegacyState() : (localStorage.getItem('scitriad_legacy') === 'true');
    
    // Filter games by subject AND legacy status
    const filteredGames = GamesCatalog.filter(g => {
        if (g.subject !== subject) return false;
        if (g.type === 'unity-legacy' && !showLegacy) return false;
        return true;
    });
    
    const uniqueCategories = [...new Set(filteredGames.map(g => g.category))];
    const filterContainer = document.getElementById('category-filters');

    if (filterContainer && filterContainer.children.length === 0) {
        let filterHTML = '';
        uniqueCategories.forEach((cat, idx) => {
            const safeId = `cat-check-${idx}`;
            filterHTML += `
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="${safeId}" data-category="${cat}" checked class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600">
                    <span class="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">${cat}</span>
                </label>
            `;
        });
        filterContainer.innerHTML = filterHTML;

        // Setup filter listeners
        filterContainer.querySelectorAll('input').forEach(checkbox => {
            checkbox.addEventListener('change', () => filterAndRender());
        });

        const searchInput = document.getElementById('catalog-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => filterAndRender());
        }
    }

    function filterAndRender() {
        const searchInput = document.getElementById('catalog-search');
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const activeCategories = [];
        if (filterContainer) {
            filterContainer.querySelectorAll('input').forEach(cb => {
                if (cb.checked) activeCategories.push(cb.getAttribute('data-category'));
            });
        } else {
            activeCategories.push(...uniqueCategories);
        }

        const displayGames = filteredGames.filter(g => {
            const matchesCategory = activeCategories.includes(g.category);
            const matchesSearch = g.title.toLowerCase().includes(searchText) || g.desc.toLowerCase().includes(searchText);
            return matchesCategory && matchesSearch;
        });

        const categories = {};
        displayGames.forEach(g => {
            if (!categories[g.category]) categories[g.category] = [];
            categories[g.category].push(g);
        });

        if (Object.keys(categories).length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                    No games found matching your criteria.
                </div>
            `;
            return;
        }

        let html = '';
        Object.entries(categories).forEach(([category, games], catIdx) => {
            const accordionId = `accordion-${catIdx}`;
            const isActive = activeAccordionId === accordionId || (activeAccordionId === null && catIdx === 0);
            if (activeAccordionId === null && catIdx === 0) {
                activeAccordionId = accordionId;
            }

            let gamesListHTML = '';
            games.forEach(g => {
                const targetUrl = g.type === 'unity-legacy' ? 'legacy-game.html' : 'game.html';
                
                let badgeHTML = '';
                if (g.type === 'unity-legacy') {
                    badgeHTML = '<span class="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2">Classic</span>';
                } else if (g.type === 'module') {
                    badgeHTML = '<span class="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2 animate-pulse">Interactive</span>';
                } else if (g.type === 'tile') {
                    badgeHTML = '<span class="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2">Tile Match</span>';
                }

                gamesListHTML += `
                    <div class="group/row p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
                        <div class="flex items-center justify-between p-3">
                            <a href="${targetUrl}?id=${g.id}" class="game-link flex-grow flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors" ${g.isNoModal ? 'data-no-modal="true"' : ''}>
                                <span class="material-symbols-outlined text-slate-400 group-hover/row:text-blue-500 transition-colors">play_circle</span>
                                <span class="text-sm md:text-base">${g.title}</span>
                                ${badgeHTML}
                            </a>
                            <button class="info-btn p-1 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex-shrink-0" data-game="${g.id}" title="Game Info">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            </button>
                        </div>
                    </div>
                `;
            });

            let catIcon = "science";
            if (subject === "math") catIcon = "calculate";
            else if (subject === "english") catIcon = "book";
            else if (subject === "social") catIcon = "public";
            else if (subject === "physics") catIcon = "bolt";
            else if (subject === "biology") catIcon = "genetics"; // Fixed dna icon mapping

            html += `
                <div id="${accordionId}" class="accordion-item border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 ${isActive ? 'active' : ''}">
                    <button class="w-full flex items-center justify-between p-5 text-left group" onclick="window.toggleAccordion('${accordionId}')">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <span class="material-symbols-outlined text-2xl">${catIdx % 2 === 0 ? catIcon : 'analytics'}</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-sm md:text-base">${category}</h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400">${games.length} ${games.length === 1 ? 'Module' : 'Modules'}</p>
                            </div>
                        </div>
                        <span class="material-symbols-outlined accordion-chevron transition-transform duration-300 text-slate-400">expand_more</span>
                    </button>
                    <div class="accordion-content bg-slate-50/50 dark:bg-slate-950/20" style="${isActive ? 'max-height: 1000px; opacity: 1;' : 'max-height: 0; opacity: 0; overflow: hidden;'}">
                        <div class="p-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                            ${gamesListHTML}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        setupGameSettingsModal();
        setupInfoModal();
        setupGameCounter();
    }

    filterAndRender();
}

window.toggleAccordion = function(accordionId) {
    const activeEl = document.getElementById(activeAccordionId);
    const targetEl = document.getElementById(accordionId);

    if (activeAccordionId === accordionId) {
        if (targetEl) {
            targetEl.classList.remove('active');
            const content = targetEl.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
            }
        }
        activeAccordionId = null;
    } else {
        if (activeEl) {
            activeEl.classList.remove('active');
            const activeContent = activeEl.querySelector('.accordion-content');
            if (activeContent) {
                activeContent.style.maxHeight = '0';
                activeContent.style.opacity = '0';
            }
        }
        if (targetEl) {
            targetEl.classList.add('active');
            const content = targetEl.querySelector('.accordion-content');
            if (content) {
                content.style.maxHeight = '1000px';
                content.style.opacity = '1';
            }
        }
        activeAccordionId = accordionId;
    }
};

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

    if (btnCloseInfo) {
        btnCloseInfo.replaceWith(btnCloseInfo.cloneNode(true));
        document.getElementById('btn-close-info').addEventListener('click', () => {
            infoModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        });
    }

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

    if (!document.getElementById('settingsModal')) {
        const modalHTML = `
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
                        <input type="hidden" id="setting-tile-mode" value="all">
                        <select id="tile-mode-select" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm">
                            <option value="all">Standard All Tiles</option>
                            <option value="one">One Tile At A Time</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-dark);">Mistake Buffer Limit</label>
                        <select id="mistake-limit-select" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm">
                            <option value="5">Tight Security (5 mistakes)</option>
                            <option value="10" selected>Standard Safe (10 mistakes)</option>
                            <option value="20">Casual Lab (20 mistakes)</option>
                        </select>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 1.75rem;">
                        <button id="btn-lock-settings" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-sm w-full">Apply Parameters</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    const settingsModal = document.getElementById('settingsModal');
    const timerToggle = document.getElementById('setting-timer');
    const timerVisibleToggle = document.getElementById('setting-timer-visible');
    const timerVisibleRow = document.getElementById('timer-visible-row');
    const btnLock = document.getElementById('btn-lock-settings');
    
    let pendingGameUrl = '';
    let pendingDetailsIndex = -1;

    function syncTimerVisibility() {
        const timerOn = timerToggle.checked;
        timerVisibleToggle.disabled = !timerOn;
        timerVisibleRow.style.opacity = timerOn ? '1' : '0.5';
    }
    timerToggle.addEventListener('change', syncTimerVisibility);
    syncTimerVisibility();
    
    if (btnLock) {
        btnLock.replaceWith(btnLock.cloneNode(true));
        document.getElementById('btn-lock-settings').addEventListener('click', () => {
            const settings = {
                timer: timerToggle.checked ? 'on' : 'off',
                timerVisible: timerVisibleToggle.checked ? 'visible' : 'hidden',
                tileMode: document.getElementById('tile-mode-select').value,
                maxMistakes: document.getElementById('mistake-limit-select').value,
                mute: document.getElementById('setting-mute-sounds') ? document.getElementById('setting-mute-sounds').checked : StateManager.getMuteState()
            };
            
            settingsModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
            
            const url = new URL(pendingGameUrl, window.location.href);
            url.searchParams.set('timer', settings.timer);
            url.searchParams.set('timerVisible', settings.timerVisible);
            url.searchParams.set('tileMode', settings.tileMode);
            url.searchParams.set('maxMistakes', settings.maxMistakes);
            url.searchParams.set('mute', settings.muteSounds);
            url.searchParams.set('theme', settings.darkMode ? 'dark' : 'light');
            
            document.body.classList.remove('no-scroll');
            window.location.href = url.toString();
        });
    }
    
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
                
                document.getElementById('setting-mute-sounds').checked = !StateManager.getMuteState();

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