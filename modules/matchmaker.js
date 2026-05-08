export function loadMatchmaker() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Cruise Matchmaker</h2>
    <p>Answer a few quick questions and we’ll match you with the perfect cruise.</p>

    <form id="matchForm" class="match-form">

      <label>What type of cruise experience do you prefer?</label>
      <select id="q1">
        <option value="relax">Relaxation & beaches</option>
        <option value="adventure">Adventure & activities</option>
        <option value="luxury">Luxury & premium service</option>
        <option value="family">Family‑friendly fun</option>
      </select>

      <label>What is your ideal cruise length?</label>
      <select id="q2">
        <option value="short">3–4 nights</option>
        <option value="medium">5–7 nights</option>
        <option value="long">8+ nights</option>
      </select>

      <label>What matters most to you?</label>
      <select id="q3">
        <option value="food">Food & dining</option>
        <option value="entertainment">Entertainment & shows</option>
        <option value="ports">Ports & destinations</option>
        <option value="budget">Budget‑friendly options</option>
      </select>

      <button type="submit" class="primary-btn">Find My Cruise</button>
    </form>

    <div id="matchResult" class="match-result"></div>
  `;

  document.getElementById("matchForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const q1 = document.getElementById("q1").value;
    const q2 = document.getElementById("q2").value;
    const q3 = document.getElementById("q3").value;

    const resultBox = document.getElementById("matchResult");

    // --- SCORING LOGIC ---
    let score = {
      royal: 0,
      celebrity: 0,
      virgin: 0,
      disney: 0
    };

    // Q1 — Cruise style
    if (q1 === "relax") score.celebrity += 2;
    if (q1 === "adventure") score.royal += 2;
    if (q1 === "luxury") score.celebrity += 3;
    if (q1 === "family") score.disney += 3;

    // Q2 — Length
    if (q2 === "short") score.virgin += 2;
    if (q2 === "medium") score.royal += 2;
    if (q2 === "long") score.celebrity += 2;

    // Q3 — Priority
    if (q3 === "food") score.celebrity += 2;
    if (q3 === "entertainment") score.royal += 2;
    if (q3 === "ports") score.virgin += 2;
    if (q3 === "budget") score.royal += 1;

    // --- DETERMINE WINNER ---
    const bestLine = Object.keys(score).reduce((a, b) =>
      score[a] > score[b] ? a : b
    );

    let recommendation = "";

    if (bestLine === "royal") {
      recommendation = `
        <h3>Recommended: Royal Caribbean</h3>
        <p>Perfect for adventure, entertainment, and family fun.</p>
        <ul>
          <li>Icon of the Seas — Caribbean</li>
          <li>Wonder of the Seas — Bahamas</li>
          <li>Quantum Class — Alaska</li>
        </ul>
      `;
    }

    if (bestLine === "celebrity") {
      recommendation = `
        <h3>Recommended: Celebrity Cruises</h3>
        <p>Ideal for luxury, food lovers, and longer itineraries.</p>
        <ul>
          <li>Celebrity Beyond — Mediterranean</li>
          <li>Celebrity Ascent — Caribbean</li>
          <li>Celebrity Edge — Europe</li>
        </ul>
      `;
    }

    if (bestLine === "virgin") {
      recommendation = `
        <h3>Recommended: Virgin Voyages</h3>
        <p>Adults‑only, modern, short‑to‑medium cruises.</p>
        <ul>
          <li>Scarlet Lady — Caribbean</li>
          <li>Valiant Lady — Mexico</li>
          <li>Resilient Lady — Europe</li>
        </ul>
      `;
    }

    if (bestLine === "disney") {
      recommendation = `
        <h3>Recommended: Disney Cruise Line</h3>
        <p>Perfect for families, kids, and magical experiences.</p>
        <ul>
          <li>Disney Wish — Bahamas</li>
          <li>Disney Fantasy — Caribbean</li>
          <li>Disney Wonder — Alaska</li>
        </ul>
      `;
    }

    resultBox.innerHTML = recommendation;
  });
}
