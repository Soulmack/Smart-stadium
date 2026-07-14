document.addEventListener('DOMContentLoaded', () => {
    // --- High Contrast Toggle ---
    const contrastToggle = document.getElementById('contrast-toggle');
    
    // Check saved preference
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


    // --- Data Fetching & DOM Updates ---
    
    const fetchCrowdData = async () => {
        try {
            const res = await fetch('/api/data/crowd');
            const json = await res.json();
            if (json.status === 'success') {
                renderCrowdData(json.data);
            }
        } catch (error) {
            console.error('Error fetching crowd data:', error);
            document.getElementById('crowd-data-container').innerHTML = '<p>Error loading crowd data.</p>';
        }
    };

    const fetchEnergyData = async () => {
        try {
            const res = await fetch('/api/data/energy');
            const json = await res.json();
            if (json.status === 'success') {
                renderEnergyData(json.data);
            }
        } catch (error) {
            console.error('Error fetching energy data:', error);
            document.getElementById('energy-data-container').innerHTML = '<p>Error loading energy data.</p>';
        }
    };

    const renderCrowdData = (data) => {
        const container = document.getElementById('crowd-data-container');
        container.innerHTML = ''; // Clear loading

        data.forEach(item => {
            let statusClass = 'status-low';
            if (item.bottleneck_status === 'Medium') statusClass = 'status-medium';
            if (item.bottleneck_status === 'High') statusClass = 'status-high';

            const div = document.createElement('div');
            div.className = 'metric-item';
            div.innerHTML = `
                <div class="metric-info">
                    <h3>${item.gate}</h3>
                    <p>Entries: ${item.entries_per_min}/min | Exits: ${item.exits_per_min}/min</p>
                </div>
                <div class="metric-value">
                    <span class="status-badge ${statusClass}">${item.bottleneck_status}</span>
                </div>
            `;
            container.appendChild(div);
        });
    };

    const renderEnergyData = (data) => {
        const container = document.getElementById('energy-data-container');
        container.innerHTML = ''; 

        data.forEach(item => {
            // Highlight spikes
            const isSpike = item.hvac_kwh > 500;
            const borderStyle = isSpike ? 'border-left-color: var(--status-high);' : '';

            const div = document.createElement('div');
            div.className = 'metric-item';
            div.style = borderStyle;
            div.innerHTML = `
                <div class="metric-info">
                    <h3>${item.sector}</h3>
                    <p>HVAC: ${item.hvac_kwh} kW/h | Light: ${item.lighting_kwh} kW/h</p>
                </div>
                <div class="metric-value">
                    ${item.total_kwh} <span style="font-size: 0.7em;">kW/h</span>
                </div>
            `;
            container.appendChild(div);
        });
    };


    // --- Form Submission (Incident Reporting) ---
    
    const incidentForm = document.getElementById('incident-form');
    const formFeedback = document.getElementById('form-feedback');

    incidentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-incident');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        formFeedback.className = 'feedback-msg'; // Reset
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
                    // Simulated secure auth token
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
            formFeedback.textContent = 'A network error occurred while submitting the report.';
            formFeedback.classList.add('show', 'feedback-error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });

    // --- Initial Fetch and Polling ---
    
    fetchCrowdData();
    fetchEnergyData();

    // Poll every 5 seconds for real-time updates
    setInterval(() => {
        fetchCrowdData();
        fetchEnergyData();
    }, 5000);
});
