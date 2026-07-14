/**
 * telemetry.js
 * Procedurally generates real-time JSON mock data for the dashboard.
 */

export class TelemetryGenerator {
    constructor() {
        this.zones = ['VIP', 'North', 'South', 'East', 'West', 'Field'];
    }

    // Generate random data for the interactive SVG Map
    getMapData() {
        const data = {};
        this.zones.forEach(zone => {
            data[zone] = {
                density: Math.floor(Math.random() * 100), // 0-100%
                heat: Math.floor(Math.random() * 100)
            };
        });
        return data;
    }

    // Generate Chart.js data (Power Grid Load vs Solar Generation)
    getPowerData() {
        return {
            timestamp: new Date().toLocaleTimeString(),
            gridLoad: 300 + Math.random() * 200,
            solarGen: 100 + Math.random() * 150
        };
    }

    // Generate Chart.js data (Gate Entry Throughput)
    getThroughputData() {
        return {
            'North Gate': Math.floor(Math.random() * 150),
            'South Gate': Math.floor(Math.random() * 120),
            'East Gate': Math.floor(Math.random() * 100),
            'West Gate': Math.floor(Math.random() * 80)
        };
    }

    // Generate a random sys-admin log message for the Terminal UI
    getLogMessage() {
        const systems = ['edge-turnstile-04', 'hvac-controller-vip', 'parking-sensor-B2', 'sec-camera-12', 'main-db'];
        const events = ['Ping... OK', 'Latency spike detected (120ms)', 'Dropped packet', 'Rebooting service...', 'Auth success'];
        const system = systems[Math.floor(Math.random() * systems.length)];
        const event = events[Math.floor(Math.random() * events.length)];
        
        let level = 'INFO';
        if (event.includes('spike') || event.includes('Dropped')) {
            level = 'WARN';
        }
        
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
        return `[${timestamp}] [${level}] ${system}: ${event}`;
    }
}
