import { auth, db, onAuthStateChanged, collection, query, orderBy, getDocs } from '/js/firebase-init.js';

const authWarning = document.getElementById('auth-warning');
const dashboardContent = document.getElementById('dashboard-content');
const statTotalGames = document.getElementById('stat-total-games');
const statTotalMistakes = document.getElementById('stat-total-mistakes');
const statPerfectGames = document.getElementById('stat-perfect-games');
const historyList = document.getElementById('history-list');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

async function loadDashboardData(user) {
    try {
        const historyRef = collection(db, "users", user.uid, "history");
        const q = query(historyRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        
        let totalGames = 0;
        let totalMistakes = 0;
        let perfectGames = 0;
        let html = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalGames++;
            totalMistakes += data.mistakes;
            if (data.mistakes === 0) perfectGames++;

            // Only render the 10 most recent games in the list
            if (totalGames <= 10) {
                const dateStr = new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                
                // If they played without a timer, elapsedSeconds equals 0
                const timeStr = data.time > 0 ? `⏱️ ${formatTime(data.time)}` : `<span style="opacity: 0.5;">No Timer</span>`;
                
                html += `
                    <div class="history-item">
                        <div>
                            <div class="game-title">${data.title}</div>
                            <div class="game-meta">${dateStr}</div>
                        </div>
                        <div class="game-score">
                            <div class="time">${timeStr}</div>
                            <div class="mistakes">${data.mistakes === 0 ? '✨ Perfect' : `❌ ${data.mistakes} Mistakes`}</div>
                        </div>
                    </div>
                `;
            }
        });

        statTotalGames.innerText = totalGames;
        statTotalMistakes.innerText = totalMistakes;
        statPerfectGames.innerText = perfectGames;

        if (totalGames === 0) {
            historyList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #64748b;">No games played yet. Go play some games!</div>`;
        } else {
            historyList.innerHTML = html;
        }

    } catch (error) {
        console.error("Error loading dashboard:", error);
        historyList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #dc2626;">Error loading history. Please try again later.</div>`;
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        authWarning.style.display = 'none';
        dashboardContent.style.display = 'block';
        loadDashboardData(user);
    } else {
        authWarning.style.display = 'block';
        dashboardContent.style.display = 'none';
    }
});