# Smart Stadium Command Center

A real-time IIoT simulation and visualization dashboard for the "Smart Stadiums & Tournament Operations" hackathon challenge. 

## Key Features

1. **Crowd & Gate Management:** Visualizes real-time entry and exit data to identify bottlenecks.
2. **Energy & Resource Monitoring:** Tracks simulated stadium lighting and HVAC power consumption, highlighting usage spikes.
3. **Incident Reporting System:** A secure portal for staff to log operational issues with strict backend input validation.
4. **Accessibility (a11y) First:** Fully WCAG compliant with semantic HTML, ARIA regions for real-time live data updates, keyboard navigation support, and a dedicated **High Contrast Mode**.

## Tech Stack & Project Footprint
To adhere to the **extremely lightweight (< 10 MB total footprint)** constraint, this project uses:
- **Backend:** Python & Flask (lightweight, highly extensible)
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no heavy build tools, no bloated `node_modules` folders)
- **Design:** Modern glassmorphism aesthetics written in pure custom CSS variables.

## How to Run Locally

### Prerequisites
- Python 3.8+

### Setup Instructions
1. Navigate to the project directory.
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the lightweight dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the application:
   ```bash
   python app.py
   ```
5. Open your browser and navigate to `http://127.0.0.1:5000/`.

## Running the Unit Tests
A full test suite is included to validate the mock data generator, the secure authentication flow, and API endpoints.

To run the tests:
```bash
python -m unittest discover tests/
```
Alternatively, using pytest:
```bash
pytest tests/
```

## Hackathon Parameters Hit List

- [x] **Lightweight Footprint:** The entire source code footprint is well under 1MB.
- [x] **Code Quality:** Modular backend (routes, auth, data generators) and clean Vanilla JS modules.
- [x] **Security:** Simulated Bearer token auth flow and strict HTML-escaping input validation on the incident form.
- [x] **Testing:** Robust `unittest` suite covering all core logic (`test_data.py`, `test_routes.py`).
- [x] **Accessibility:** High Contrast Mode, semantic tags, and `aria-live` polite/assertive announcements.
- [x] **Aesthetics:** Stunning glassmorphism UI with micro-animations and a vibrant dark mode.
