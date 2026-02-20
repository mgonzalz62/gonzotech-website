/**
 * GONZOTECH CORE LOGIC
 * Manages UI state, Timing, and Data Injection
 */

// --- 1. TAB NAVIGATION ---
function showTab(id) {
    // Hide all sections and remove active classes
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show target section
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
    
    // Highlight active button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    window.scrollTo(0, 0);
}

// --- 2. TIME & SESSION METRICS ---
let sessionSeconds = 0;

function runTimers() {
    const now = new Date();
    
    // Update Clock
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if(clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if(dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Update Session Timer
    sessionSeconds++;
    const mins = Math.floor(sessionSeconds / 60).toString().padStart(2, '0');
    const secs = (sessionSeconds % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('session-timer');
    if(timerEl) timerEl.textContent = `${mins}:${secs}`;
}

// Run timers every second
setInterval(runTimers, 1000);

// --- 3. DATA FETCHING (JSON DRIVEN) ---
async function loadGonzoData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error("Data file not found");
        const data = await response.json();

        // Inject System Logs
        const logBox = document.getElementById('log-container');
        if (logBox && data.system_logs) {
            logBox.innerHTML = ''; // Clear loader text
            data.system_logs.forEach(log => {
                logBox.innerHTML += `<div class="log-entry"><span class="log-time">[${log.time}]</span> ${log.message}</div>`;
            });
            logBox.innerHTML += `<span class="cursor"></span>`;
        }

        // Inject Projects
        const projectBox = document.getElementById('project-list');
        if (projectBox && data.projects) {
            projectBox.innerHTML = '<h2>Project Repository</h2>';
            data.projects.forEach(p => {
                projectBox.innerHTML += `
                    <div class="placeholder-card">
                        <div class="status-badge">${p.status}</div>
                        <h3>${p.name}</h3>
                        <p>${p.description}</p>
                    </div>`;
            });
        }

        // Inject Automation
        const autoBox = document.getElementById('automation-list');
        if (autoBox && data.automation) {
            autoBox.innerHTML = '<h2>Automation Systems</h2>';
            data.automation.forEach(a => {
                autoBox.innerHTML += `
                    <div class="placeholder-card">
                        <div class="status-badge">${a.status}</div>
                        <h3>${a.name}</h3>
                        <p>${a.description}</p>
                    </div>`;
            });
        }

    } catch (err) {
        console.error("GonzoTech Data Error:", err);
        document.getElementById('log-container').innerHTML = `<div class="log-entry" style="color:red">> ERROR: FAILED TO FETCH DATA.JSON</div>`;
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadGonzoData();
    runTimers();
});
