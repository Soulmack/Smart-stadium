import random
import time

def generate_crowd_data():
    """Simulates real-time entry/exit data and gate bottlenecks."""
    gates = ['North Gate', 'South Gate', 'East Gate', 'West Gate']
    data = []
    
    for gate in gates:
        entries = random.randint(10, 150)
        exits = random.randint(5, 100)
        bottleneck = 'High' if entries > 120 else ('Medium' if entries > 80 else 'Low')
        
        data.append({
            'gate': gate,
            'entries_per_min': entries,
            'exits_per_min': exits,
            'bottleneck_status': bottleneck,
            'timestamp': int(time.time())
        })
    return data

def generate_energy_data():
    """Simulates stadium lighting and HVAC power consumption."""
    sectors = ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Main Pitch']
    data = []
    
    for sector in sectors:
        # HVAC usually uses more power, sometimes there are spikes
        hvac_kwh = round(random.uniform(200.0, 500.0), 2)
        lighting_kwh = round(random.uniform(50.0, 150.0), 2)
        
        # Simulate a random spike
        if random.random() > 0.9:
            hvac_kwh += random.uniform(200.0, 400.0)
            
        data.append({
            'sector': sector,
            'hvac_kwh': hvac_kwh,
            'lighting_kwh': lighting_kwh,
            'total_kwh': round(hvac_kwh + lighting_kwh, 2),
            'timestamp': int(time.time())
        })
    return data
