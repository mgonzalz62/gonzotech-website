/**
 * GONZOTECH CORE LOGIC v2
 * Tab navigation · Timers · Data injection
 */

// --- 1. TAB NAVIGATION ---
function showTab(id, btn) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Use passed button, or fall back to event target
    const activeBtn = btn || (event && event.currentTarget);
    if (activeBtn) activeBtn.classList.add('active');

    window.scrollTo(0, 0);
}

// --- 2. TIME & SESSION METRICS ---
let sessionSeconds = 0;

function runTimers() {
    const now = new Date();

    const clockEl = document.getElementById('clock');
    const dateEl  = document.getElementById('date');
    if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    if (dateEl)  dateEl.textContent  = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    sessionSeconds++;
    const mins = Math.floor(sessionSeconds / 60).toString().padStart(2, '0');
    const secs = (sessionSeconds % 60).toString().padStart(2, '0');
    const timerEl = document.getElementById('session-timer');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
}

setInterval(runTimers, 1000);

// --- 3. STATUS BADGE HELPER ---
function badgeHTML(status) {
    const map = {
        complete: { cls: '',        label: '● Complete' },
        active:   { cls: '',        label: '● Active'   },
        wip:      { cls: ' wip',    label: '◐ In Progress' },
        planned:  { cls: ' planned',label: '○ Planned'  },
        offline:  { cls: ' offline',label: '✕ Offline'  },
    };
    const key = (status || '').toLowerCase().replace(/\s+/g, '');
    const entry = map[key] || { cls: '', label: status };
    return `<span class="status-badge${entry.cls}">${entry.label}</span>`;
}

// --- 4. DATA FETCHING ---
async function loadGonzoData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Data file not found');
        const data = await response.json();

        // --- System Logs ---
        const logBox = document.getElementById('log-container');
        if (logBox && data.system_logs) {
            logBox.innerHTML = '';
            data.system_logs.forEach(log => {
                logBox.innerHTML += `<div class="log-entry"><span class="log-time">[${log.time}]</span> ${log.message}</div>`;
            });
            logBox.innerHTML += `<span class="cursor"></span>`;
        }

        // --- Projects ---
        const projectBox = document.getElementById('project-list');
        if (projectBox && data.projects) {
            projectBox.innerHTML = '';
            data.projects.forEach(p => {
                const accentMap = { complete: '', active: '', wip: ' amber', planned: ' blue', offline: ' red' };
                const key = (p.status || '').toLowerCase().replace(/\s+/g, '');
                const accent = accentMap[key] !== undefined ? accentMap[key] : '';
                projectBox.innerHTML += `
                <div class="card${accent}" style="margin-bottom:16px">
                    <div class="card-title">
                        ${p.name}
                        ${badgeHTML(p.status)}
                    </div>
                    <div class="card-body">${p.description}</div>
                </div>`;
            });
        }

        // --- Automation ---
        const autoBox = document.getElementById('automation-list');
        if (autoBox && data.automation) {
            autoBox.innerHTML = '';
            data.automation.forEach(a => {
                const accentMap = { complete: '', active: '', wip: ' amber', planned: ' blue', offline: ' red' };
                const key = (a.status || '').toLowerCase().replace(/\s+/g, '');
                const accent = accentMap[key] !== undefined ? accentMap[key] : '';
                autoBox.innerHTML += `
                <div class="card${accent}" style="margin-bottom:16px">
                    <div class="card-title">
                        ${a.name}
                        ${badgeHTML(a.status)}
                    </div>
                    <div class="card-body">${a.description}</div>
                </div>`;
            });
        }

    } catch (err) {
        console.error('GonzoTech Data Error:', err);
        const logBox = document.getElementById('log-container');
        if (logBox) logBox.innerHTML = `<div class="log-entry" style="color:var(--red)">> ERROR: FAILED TO FETCH DATA.JSON</div>`;
    }
}

// --- 5. CONTACT FORM ---
document.addEventListener('DOMContentLoaded', () => {
    loadGonzoData();
    runTimers();

    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.btn-transmit');
            if (btn) {
                btn.textContent = '✓ TRANSMISSION RECEIVED';
                btn.style.color = 'var(--green)';
                setTimeout(() => {
                    btn.textContent = '⟶ TRANSMIT DATA';
                    btn.style.color = '';
                    form.reset();
                }, 3000);
            }
        });
    }
});
