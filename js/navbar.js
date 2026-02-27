class SiteNavbar extends HTMLElement {
    connectedCallback() {
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
                    <button id="auth-btn" class="btn-login">Login</button>
                    <div id="user-menu" class="user-menu" style="display: none;">
                        <div class="avatar" id="user-avatar">U</div>
                        <div class="dropdown-content" id="dropdown-content">
                            <p id="dropdown-email">user@example.com</p>
                            <hr>
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
    }
}

customElements.define('site-navbar', SiteNavbar);