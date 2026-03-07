// Synchronously apply theme before the DOM fully parses to prevent FOUC
(function() {
    if (localStorage.getItem('scitriad_theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
})();

class SiteNavbar extends HTMLElement {
    async connectedCallback() {
        const isLoggedIn = localStorage.getItem('scitriad_logged_in') === 'true';
        const userEmail = localStorage.getItem('scitriad_user_email') || 'user@example.com';
        const userInitial = userEmail.charAt(0).toUpperCase();

        this.innerHTML = `
        <nav class="navbar" id="navbar">
            <div class="nav-overlay" id="nav-overlay"></div>
            <div class="nav-left">
                <a href="index.html" class="nav-logo">
                    <img src="Scitriad.png" alt="Scitriad Logo">
                </a>
                <div class="search-container">
                    <input type="text" id="game-search-input" class="search-input" placeholder="Search games..." autocomplete="off">
                    <div id="search-results" class="search-results"></div>
                </div>
            </div>
            <div class="nav-links">
                <a href="Chemistry.html">Chemistry</a>
                <a href="Biology.html">Biology</a>
                <a href="Physics.html">Physics</a>
                <a href="Math.html">Math</a>
                <a href="English.html">English</a>
                <a href="Social.html">Social Studies</a>

                <div class="auth-container">
                    <button id="auth-btn" class="btn-login" style="${isLoggedIn ? 'display: none;' : ''}">Login</button>
                    <div id="user-menu" class="user-menu" style="${isLoggedIn ? 'display: block;' : 'display: none;'}">
                        <div class="avatar" id="user-avatar">${userInitial}</div>
                        <div class="dropdown-content" id="dropdown-content">
                            <p id="dropdown-email">${userEmail}</p>
                            <hr>
                            <button onclick="window.location.href='profile.html'">My Dashboard</button>
                            <button id="btn-account-settings">Account Settings</button>
                            <button id="btn-logout">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Hamburger Menu -->
            <div class="hamburger">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
            </div>
        </nav>
        `;

        try {
            const { GamesCatalog } = await import('./games-catalog.js');
            this.setupSearch(GamesCatalog);
        } catch (err) {
            console.error('Error loading games catalog for search:', err);
        }

        // Hamburger Menu Logic
        const hamburger = this.querySelector('.hamburger');
        const nav = this.querySelector('.nav-links');
        const navLinks = this.querySelectorAll('.nav-links a');
        const overlay = this.querySelector('#nav-overlay');

        const closeMenu = () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                if (overlay) overlay.classList.remove('active');
                hamburger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
                
                setTimeout(() => {
                    const anyModalOpen = document.querySelector('.modal-overlay[style*="display: flex"]');
                    const authModalOpen = document.querySelector('.auth-modal-overlay[style*="display: flex"]');
                    if (!anyModalOpen && !authModalOpen) {
                        document.body.classList.remove('no-scroll');
                    }
                }, 50);
            }
        };

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    closeMenu();
                } else {
                    // Open menu
                    nav.classList.add('nav-active');
                    if (overlay) overlay.classList.add('active');
                    document.body.classList.add('no-scroll');
                    hamburger.classList.add('toggle');

                    // Animate Links
                    navLinks.forEach((link, index) => {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    });
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        const authBtn = this.querySelector('#auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', closeMenu);
        }

        const dropdownButtons = this.querySelectorAll('.dropdown-content button');
        dropdownButtons.forEach(btn => {
            btn.addEventListener('click', closeMenu);
        });
    }

    setupSearch(GamesCatalog) {
        const searchInput = this.querySelector('#game-search-input');
        const searchResults = this.querySelector('#search-results');

        if (!searchInput || !searchResults) return;

        const performSearch = (query) => {
            const q = query.toLowerCase().trim();
            if (!q) {
                searchResults.classList.remove('show');
                return;
            }

            const matches = GamesCatalog.filter(game => {
                const titleMatch = game.title.toLowerCase().includes(q);
                const descMatch = game.desc.toLowerCase().includes(q);
                const subjectMatch = game.subject.toLowerCase().includes(q);
                const keywordMatch = game.keywords && game.keywords.some(kw => kw.toLowerCase().includes(q));
                return titleMatch || descMatch || subjectMatch || keywordMatch;
            });

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(game => `
                    <a href="${game.path}" class="search-result-item">
                        <span class="search-result-title">${game.title}</span>
                        <span class="search-result-desc">${game.desc}</span>
                    </a>
                `).join('');
                searchResults.classList.add('show');
            } else {
                searchResults.innerHTML = `
                    <div class="search-result-item" style="pointer-events: none; text-align: center; color: var(--text-dark);">
                        No games found matching "${query}"
                    </div>
                `;
                searchResults.classList.add('show');
            }
        };

        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        searchInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                searchResults.classList.add('show');
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.querySelector('.search-container').contains(e.target)) {
                searchResults.classList.remove('show');
            }
        });
    }
}

customElements.define('site-navbar', SiteNavbar);