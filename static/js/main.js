import { TelemetryGenerator } from './telemetry.js';

document.addEventListener('DOMContentLoaded', () => {
    const telemetry = new TelemetryGenerator();

    // --- High Contrast Toggle ---
    const contrastToggle = document.getElementById('contrast-toggle');
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.setAttribute('data-theme', 'high-contrast');
        contrastToggle.setAttribute('aria-pressed', 'true');
    }

    contrastToggle.addEventListener('click', () => {
        const isHighContrast = document.body.getAttribute('data-theme') === 'high-contrast';
        if (isHighContrast) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('highContrast', 'false');
            contrastToggle.setAttribute('aria-pressed', 'false');
        } else {
            document.body.setAttribute('data-theme', 'high-contrast');
            localStorage.setItem('highContrast', 'true');
            contrastToggle.setAttribute('aria-pressed', 'true');
        }
    });

    // --- Chart.js Setup ---
    // Common Chart Options for Dark Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#f8fafc' }
            }
        }
    };

    // 1. Power Grid vs Solar Chart (Line)
    const powerCtx = document.getElementById('powerChart').getContext('2d');
    const powerChart = new Chart(powerCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Grid Load (kW)',
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    data: [],
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Solar Gen (kW)',
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    data: [],
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: { ...chartOptions, animation: { duration: 0 } }
    });

    // 2. Gate Throughput Chart (Bar)
    const throughputCtx = document.getElementById('throughputChart').getContext('2d');
    const throughputChart = new Chart(throughputCtx, {
        type: 'bar',
        data: {
            labels: ['North', 'South', 'East', 'West'],
            datasets: [{
                label: 'Entries per Minute',
                backgroundColor: '#3b82f6',
                data: [0, 0, 0, 0]
            }]
        },
        options: { ...chartOptions, animation: { duration: 500 } }
    });

    // --- Incident Reporting Form ---
    const incidentForm = document.getElementById('incident-form');
    const formFeedback = document.getElementById('form-feedback');

    incidentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-incident');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        formFeedback.className = 'feedback-msg'; 
        formFeedback.textContent = '';

        const formData = {
            title: document.getElementById('incident-title').value,
            severity: document.getElementById('incident-severity').value,
            description: document.getElementById('incident-description').value
        };

        try {
            const res = await fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer st4d1um_s3cur3_t0k3n_2026'
                },
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (res.ok) {
                formFeedback.textContent = `Success: ${json.message} (ID: ${json.incident_id})`;
                formFeedback.classList.add('show', 'feedback-success');
                incidentForm.reset();
            } else {
                formFeedback.textContent = `Error: ${json.message}`;
                formFeedback.classList.add('show', 'feedback-error');
            }
        } catch (error) {
            formFeedback.textContent = 'Network error while submitting report.';
            formFeedback.classList.add('show', 'feedback-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });

    // --- Update Loops ---
    
    // Update SVG Map Colors
    const updateMap = () => {
        const data = telemetry.getMapData();
        for (const [zone, stats] of Object.entries(data)) {
            const el = document.getElementById(`svg-${zone}`);
            if (el) {
                // Interpolate color based on density (0=Green, 50=Yellow, 100=Red)
                let color;
                if (stats.density < 40) color = 'var(--status-low)';
                else if (stats.density < 75) color = 'var(--status-medium)';
                else color = 'var(--status-high)';
                
                el.style.fill = color;
            }
        }
    };

    // Update Charts
    const updateCharts = () => {
        // Power Data
        const pData = telemetry.getPowerData();
        powerChart.data.labels.push(pData.timestamp);
        powerChart.data.datasets[0].data.push(pData.gridLoad);
        powerChart.data.datasets[1].data.push(pData.solarGen);
        
        // Keep only last 10 points for the line chart
        if (powerChart.data.labels.length > 10) {
            powerChart.data.labels.shift();
            powerChart.data.datasets[0].data.shift();
            powerChart.data.datasets[1].data.shift();
        }
        powerChart.update();

        // Throughput Data
        const tData = telemetry.getThroughputData();
        throughputChart.data.datasets[0].data = [
            tData['North Gate'],
            tData['South Gate'],
            tData['East Gate'],
            tData['West Gate']
        ];
        throughputChart.update();
    };

    // Update Terminal
    const terminalOutput = document.getElementById('terminal-output');
    const updateTerminal = () => {
        const msg = telemetry.getLogMessage();
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        // Add specific color to WARN logs
        if (msg.includes('[WARN]')) {
            line.style.color = '#ef4444';
        }
        
        line.textContent = msg;
        terminalOutput.appendChild(line);
        
        // Keep terminal from growing indefinitely (max 50 lines)
        if (terminalOutput.children.length > 50) {
            terminalOutput.removeChild(terminalOutput.firstChild);
        }
        
        // Auto-scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    // Initial triggers
    updateMap();
    updateCharts();

    // Set Intervals
    setInterval(updateMap, 2000);
    setInterval(updateCharts, 3000);
    
    // Terminal updates very fast (every 600ms) to look like a real system log
    setInterval(updateTerminal, 600);
});
