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

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                // Toggle Menu
                nav.classList.toggle('nav-active');

                // Animate Links
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });

                // Toggle Hamburger Animation
                hamburger.classList.toggle('toggle');
            });
        }
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