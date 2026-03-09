import { GamesCatalog } from './games-catalog.js';

let gameScripts = null;
let gameData = null;

try {
    // If running via Vite, it statically replaces these with module maps.
    // If running natively in a standard browser environment, this throws a TypeError.
    gameScripts = import.meta.glob('/games/**/*.js');
    gameData = import.meta.glob('/games/**/data.js');
} catch (e) {
    // Silently fall back to native browser dynamic imports
}

async function initGame() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');
    
    if (!gameId) {
        window.location.href = '/index.html';
        return;
    }

    const gameDef = GamesCatalog.find(g => g.id === gameId);
    if (!gameDef) {
        window.location.href = '/index.html';
        return;
    }

    // Apply global subject theme and document title
    document.body.classList.add(`theme-${gameDef.subject}`);
    document.title = `${gameDef.title} | Scitriad`;

    const mount = document.getElementById('game-mount');

    try {
        if (gameDef.type === 'tile') {
            mount.innerHTML = '';
            
            // Prefer Vite bundled map, fallback to native dynamic import
            if (gameScripts && gameScripts['/games/shared/tile-game.js']) {
                await gameScripts['/games/shared/tile-game.js']();
            } else {
                await import(/* @vite-ignore */ '/games/shared/tile-game.js');
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/games/shared/tile-game.css';
            document.head.appendChild(link);

            if (gameData && gameData[gameDef.data]) {
                const module = await gameData[gameDef.data]();
                new window.ScitriadTileGame(module.gameData);
            } else if (gameDef.data) {
                const module = await import(/* @vite-ignore */ gameDef.data);
                new window.ScitriadTileGame(module.gameData);
            } else {
                throw new Error("Data configuration module not found.");
            }
        } 
        else if (gameDef.type === 'module') {
            // These games build their own DOM through their class constructor
            mount.innerHTML = '';

            if (gameDef.style) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = gameDef.style;
                document.head.appendChild(link);
            }

            if (gameScripts && gameScripts[gameDef.script]) {
                await gameScripts[gameDef.script]();
            } else if (gameDef.script) {
                await import(/* @vite-ignore */ gameDef.script);
            } else {
                throw new Error("Class script module not found.");
            }

            // Dispatch synthetic DOMContentLoaded to trigger game initializers
            window.dispatchEvent(new Event('DOMContentLoaded'));
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }
        else if (gameDef.type === 'legacy') {
            // Bridge support for games that still have static HTML defined in their index.html
            const res = await fetch(gameDef.path);
            if (!res.ok) throw new Error("Failed to fetch legacy game HTML template.");
            
            const html = await res.text();
            const parser = new DOMParser();
            // FIX: Corrected method name from parseDocumentFromString to parseFromString
            const doc = parser.parseFromString(html, 'text/html');

            // 1. Extract specific styles
            const links = doc.querySelectorAll('link[rel="stylesheet"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.includes('/css/style.css') && !href.includes('/css/arena-game.css')) {
                    const absoluteHref = new URL(href, window.location.origin + gameDef.path).href;
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = absoluteHref;
                    document.head.appendChild(newLink);
                }
            });

            // 2. Extract DOM tree
            const legacyMount = doc.getElementById('game-mount');
            if (legacyMount) {
                mount.innerHTML = legacyMount.innerHTML;
            }

            // 3. Import logic scripts 
            const scripts = doc.querySelectorAll('script[type="module"]');
            for (const script of scripts) {
                const src = script.getAttribute('src');
                if (src) {
                    if (src.includes('firebase-init.js') || src.includes('auth-modal.js') || src.includes('game-report-modal.js')) continue;
                    const absoluteSrc = new URL(src, window.location.origin + gameDef.path).pathname;
                    
                    if (gameScripts && gameScripts[absoluteSrc]) {
                        await gameScripts[absoluteSrc]();
                    } else {
                        await import(/* @vite-ignore */ absoluteSrc);
                    }
                }
            }

            window.dispatchEvent(new Event('DOMContentLoaded'));
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }
    } catch (err) {
        console.error('Failed to initialize game environment:', err);
        mount.innerHTML = `
            <div style="text-align: center; padding: 5rem; color: var(--text-dark);">
                <h2>System Error</h2>
                <p>Failed to initialize the simulation module.</p>
                <a href="/index.html" class="btn-action primary" style="margin-top: 1rem; display:inline-block; text-decoration:none;">Return to Hub</a>
            </div>
        `;
    }
}

initGame();