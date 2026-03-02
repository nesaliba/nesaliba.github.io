// Synchronously apply theme before the DOM fully parses to prevent FOUC
(function() {
    if (localStorage.getItem('scitriad_theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
})();

class SiteNavbar extends HTMLElement {
    connectedCallback() {
        const isLoggedIn = localStorage.getItem('scitriad_logged_in') === 'true';
        const userEmail = localStorage.getItem('scitriad_user_email') || 'user@example.com';
        const userInitial = userEmail.charAt(0).toUpperCase();

        this.innerHTML = `
        <nav class="navbar" id="navbar">
            <a href="index.html" class="nav-logo">
                <img src="Scitriad.png" alt="Scitriad Logo">
            </a>
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
}

customElements.define('site-navbar', SiteNavbar);