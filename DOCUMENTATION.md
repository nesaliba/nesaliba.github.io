# Scitriad Games - Developer Documentation

Welcome to the Scitriad Games codebase! This document is designed for future maintainers, developers, and educators who want to understand, update, or expand this platform. 

## 📖 Project Overview
Scitriad Games is a web-based educational platform featuring interactive games for high school students (aligned with the Alberta curriculum). It includes Science, Math, English, and Social Studies modules ranging from drag-and-drop matching games to complex canvas-based physics simulations.

## 🛠 Tech Stack
To keep the project accessible and easy to maintain without requiring knowledge of heavy frontend frameworks (like React or Vue), the project is built using modern **Vanilla Web Technologies**.

*   **Frontend:** HTML5, CSS3 (CSS Variables for theming), Vanilla JavaScript (ES6 Modules).
*   **Backend / Database:** Firebase v10 (Authentication & Firestore).
*   **Build Tool:** Vite (Fast bundling and local development server).
*   **Math Rendering:** MathJax and MathLive (used heavily in the Math/Chemistry modules).
*   **Hosting:** GitHub Pages.

---

## 📂 File & Folder Structure

```text
├── .gitignore
├── package.json             # NPM dependencies (Vite)
├── vite.config.js           # Vite build configuration
├── index.html               # Main landing page
├── [Subject].html           # Subject hub pages (e.g., Biology.html, Math.html)
├── game.html                # The universal shell page for playing modern games
├── legacy-game.html         # The shell page for embedding old Unity WebGL games
│
├── css/                     # Global styles, UI components, and themes
│   ├── variables.css        # CSS custom properties (colors, themes)
│   └── ... 
│
├── js/                      # Core platform logic
│   ├── games-catalog.js     # Central database/router of ALL games
│   ├── game-loader.js       # Script that loads the correct game into game.html
│   ├── firebase-init.js     # Firebase configuration and initialization
│   ├── auth-service.js      # Handles login, registration, and user settings
│   ├── state-manager.js     # Manages local state (Dark mode, mute, legacy toggle)
│   └── navbar.js            # Custom <site-navbar> Web Component
│
├── games/                   # The source code for all modern games
│   ├── shared/              # Shared game logic (BaseGame class, Tile game engine)
│   ├── biology/             # Organized by Subject -> Level -> Game Name
│   ├── chemistry/           
│   └── ...
│
└── legacy-games/            # (Ignored by Vite) Contains exported Unity WebGL builds
```

---

## 🏗 Core Architecture

Understanding how games are loaded is crucial to maintaining this project.

### 1. The Central Catalog (`js/games-catalog.js`)
Every game on the site is registered as an object in the `GamesCatalog` array. The hub pages (`Chemistry.html`, etc.) read this file to automatically generate the clickable game cards. 

### 2. The Universal Game Shell (`game.html` & `js/game-loader.js`)
When a user clicks a game, they are sent to `game.html?id=game-id`. 
The `game-loader.js` script reads the URL parameter, looks up the game in the `GamesCatalog`, and dynamically injects the necessary HTML, CSS, and JS into the `<div id="game-mount">` container.

### 3. Game Types
There are three types of games defined in the catalog:
*   **`type: 'tile'`**: A standard drag/click-and-drop categorization game. You don't need to write logic for these. You just provide a `data.js` file, and `games/shared/tile-game.js` handles the rest.
*   **`type: 'module'`**: A custom-coded JavaScript game. These extend the `BaseGame` class and build their own DOM/Canvas inside the mount point.
*   **`type: 'unity-legacy'`**: Old Unity builds. These are routed to `legacy-game.html` which embeds them safely inside an `<iframe>`.

### 4. The `BaseGame` Class (`games/shared/base-game.js`)
All custom JS games extend this class. It provides out-of-the-box functionality for:
*   Parsing URL settings (Timer, Mute, Max Mistakes, Theme).
*   Playing standard audio tones (Hit, Miss, Victory, Game Over).
*   Running the top-bar timer.
*   Automatically saving the user's score/mistakes to Firebase Firestore when the game ends.

---

## ➕ How to Add a New Game

### Scenario A: Adding a new "Tile/Matching" Game
1. Create a folder in the appropriate subject directory (e.g., `games/biology/intro/my-new-game/`).
2. Create a `data.js` file inside it exporting a `gameData` object (Look at `games/chemistry/intro/metal-non-metal-properties-intro/data.js` for formatting).
3. Open `js/games-catalog.js` and add a new entry:
   ```javascript
   { 
       id: 'my-new-game', 
       title: 'My Tile Game', 
       subject: 'biology', 
       category: 'Introductory Biology', 
       desc: 'Description here', 
       play: 'How to play text', 
       type: 'tile', 
       data: '/games/biology/intro/my-new-game/data.js', 
       isNoModal: false, 
       keywords: ['cells', 'biology'] 
   }
   ```

### Scenario B: Adding a Custom JavaScript Game (`module`)
1. Create a folder (e.g., `games/math/algebra/my-game/`).
2. Create `style.css` and `game.js`.
3. In `game.js`, extend the base class:
   ```javascript
   import { BaseGame } from '/games/shared/base-game.js';

   class MyCustomGame extends BaseGame {
       constructor() {
           super("My Custom Game"); // Sets the title for Firebase saving
           this.initDOM();
           // Your logic here
       }
       initDOM() {
           document.getElementById('game-mount').innerHTML = `...your HTML...`;
       }
       endGame(won) {
           this.saveProgress(this.mistakes); // Provided by BaseGame
           // Show your win/loss screen
       }
   }
   window.addEventListener('DOMContentLoaded', () => new MyCustomGame());
   ```
4. Register it in `js/games-catalog.js` with `type: 'module'`, providing the `script` and `style` paths.

---

## 🔥 Firebase Configuration (Auth & Database)

The platform uses Firebase for user accounts and saving game history.
*   **Initialization:** `js/firebase-init.js` contains the API keys. *(Note: Firebase API keys for web are safe to be public, but the database is secured via Firestore Security Rules on the Firebase console).*
*   **Auth:** Handled by `js/auth-service.js` and the custom `<auth-modal>` component.
*   **Database Structure:** Progress is saved to Firestore under the path: `users/{user_uid}/history/{document_id}`.
*   **Profile Page:** `profile.html` queries this collection to display the user's dashboard.

---

## 💻 Local Development & Deployment

### Prerequisites
You need [Node.js](https://nodejs.org/) installed on your computer.

### Running Locally
1. Clone or download the repository.
2. Open a terminal in the project root.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open the provided `localhost` link in your browser.

### Building for Production
To bundle the site for deployment:
```bash
npm run build
```
This generates a `dist/` folder containing the optimized, minified website.

### Deployment (GitHub Pages)
The site is currently hosted on GitHub pages. To update the live site:
1. Commit and push your code to the `main` branch.
2. If a GitHub Action is set up, it will automatically build and deploy.
3. If doing it manually, you can push the contents of the `dist/` folder to your `gh-pages` branch.

---

## 💡 Key Design Decisions & Gotchas

*   **Custom Web Components:** Things like `<site-navbar>` and `<game-report-modal>` are registered as custom HTML elements. This prevents having to copy-paste the navbar HTML into every single page.
*   **Vite Configuration (`vite.config.js`):** Vite has been specifically configured to **ignore** the `legacy-games/` folder. Unity WebGL builds contain massive, strangely formatted files that cause modern bundlers to crash. If you add new Unity games, keep them in that folder.
*   **DOM Initialization in Games:** Because games are loaded dynamically via JS imports (`game-loader.js`), games should attach their initialization logic to the `DOMContentLoaded` event, which the loader artificially triggers once the script is loaded.
*   **Math Rendering:** For games requiring mathematical notation (Calculus, Algebra), `MathJax` is loaded globally in `game.html`. To trigger a re-render of math equations injected dynamically by JS, use `MathJax.typesetPromise()`.
*   **Audio Context:** Browsers block audio from playing until the user interacts with the page. The `BaseGame` class handles this by attaching a `pointerdown` listener to initialize the `AudioContext`.