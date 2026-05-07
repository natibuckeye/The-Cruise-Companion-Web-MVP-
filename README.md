# The Cruise Companion™ (Web MVP)

Offline, no-login web app built with plain HTML + vanilla JS + localStorage.

## MVP Features
- Trips (Trip Hub)
- Cruise Matchmaker (quiz + blended results)
- Ports (port-day plans)
- Packing Lists (templates + customize + quick tools)
- Tips (search + filters + favorites)
- Concierge (offline message center + export packs)

## Tech
- Plain HTML (single-page app)
- Vanilla JavaScript (ES modules)
- localStorage persistence

## Run
Option A: open index.html in a browser.

Option B (recommended if JSON fetch is blocked by the browser):
python -m http.server
Then open http://localhost:8000/

## Data
Bundled JSON lives in /data:
- tips.json
- packing_templates.json
- demo_trips.json

On first launch, the app imports demo data into localStorage (one-time import flag).

## Notes
- Offline-first.
- No secrets/API keys should be committed.
