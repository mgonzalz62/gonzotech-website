// --- TAB MANAGEMENT ---
function showTab(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (event) event.currentTarget.classList.add('active');
    window.scrollTo(0, 0);
}

// --- LIVE CLOCK ---
function tick() {
    const now = new Date();
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    if(clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if(dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(tick, 1000);
tick();

// --- SYSTEM VITALS SIMULATOR ---
function updateVitals() {
    const cpuVal = Math.floor(Math.random() * (12 - 4 + 1)) + 4;
    const cpuLoad = document.getElementById('cpu-load');
    const cpuBar = document.getElementById('cpu-bar');
    if(cpuLoad) cpuLoad.textContent = cpuVal + "%";
    if(cpuBar) cpuBar.style.width = cpuVal + "%";
}
setInterval(updateVitals, 3000);

// --- DATA LOADER (The Pro Tip) ---
// This function pulls data from data.json and builds the HTML
async function loadGonzoData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();

        // Load Logs
        const logContainer = document.getElementById('log-container');
        logContainer.innerHTML = ''; // Clear existing
        data.system_logs.forEach(log => {
            logContainer.innerHTML += `<div class="log-entry"><span class="log-time">[${log.time}]</span> ${log.message}</div>`;
        });
        logContainer.innerHTML += `<span class="cursor"></span>`;

        // Load Projects
        const projectContainer = document.getElementById('project-list');
        projectContainer.innerHTML = '<h2>Project Repository</h2>';
        data.projects.forEach(proj => {
            projectContainer.innerHTML += `
                <div class="placeholder-card">
                    <div class="status-badge">${proj.status}</div>
                    <h3>${proj.name}</h3>
                    <p>${proj.description}</p>
                </div>`;
        });

        // Load Automation
        const autoContainer = document.getElementById('automation-list');
        autoContainer.innerHTML = '<h2>Automation Systems</h2>';
        data.automation.forEach(item => {
            autoContainer.innerHTML += `
                <div class="placeholder-card">
                    <div class="status-badge">${item.status}</div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>`;
        });

    } catch (error) {
        console.error("Error loading GonzoData:", error);
    }
}

// Initialize data on load
window.onload = loadGonzoData;
