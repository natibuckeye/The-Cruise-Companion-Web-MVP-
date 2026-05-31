// ===============================
// CRUISE LINE DATA
// ===============================
export const cruiseLines = {
  "Royal Caribbean": {
    style: "Adventure + Family Fun",
    vibe: "Perfect for families, couples, and thrill‑seekers.",
    strengths: [
      "Private islands (CocoCay, Labadee)",
      "Huge ships",
      "Great entertainment"
    ],
    ports: [
      "Nassau",
      "CocoCay",
      "Labadee",
      "San Juan",
      "St. Thomas",
      "Roatán",
      "Cozumel",
      "Costa Maya"
    ]
  },

  "Carnival": {
    style: "Fun + Budget Friendly",
    vibe: "Laid‑back, energetic, and great for groups.",
    strengths: ["Affordable", "Party atmosphere", "Short sailings"],
    ports: ["Freeport", "Amber Cove", "Ocho Rios", "Cozumel", "Costa Maya", "Roatán"]
  },

  "Norwegian": {
    style: "Freestyle Cruising",
    vibe: "Flexible dining and entertainment.",
    strengths: ["No dress codes", "Great nightlife", "New ships"],
    ports: ["Cozumel", "Roatán", "St. Thomas", "San Juan"]
  },

  "Disney": {
    style: "Family Magic",
    vibe: "Premium family experience with Disney characters.",
    strengths: ["Castaway Cay", "Broadway shows", "Top‑tier service"],
    ports: ["Nassau", "Cozumel", "St. Thomas"]
  },

  "MSC": {
    style: "European Style + Value",
    vibe: "Modern ships with a European flair.",
    strengths: ["Great pricing", "New ships", "Private island (Ocean Cay)"],
    ports: ["Nassau", "Freeport", "Cozumel", "Costa Maya"]
  },

  "Celebrity": {
    style: "Premium Modern Luxury",
    vibe: "Upscale, quiet, and refined.",
    strengths: ["Food quality", "Service", "Adult‑friendly"],
    ports: ["St. Thomas", "San Juan", "Halifax", "Québec City", "Barcelona"]
  },

  "Princess": {
    style: "Relaxed + Destination Focused",
    vibe: "Great for couples and mature travelers.",
    strengths: ["Itineraries", "Service", "Alaska + Europe"],
    ports: ["Amber Cove", "Cabo", "Puerto Vallarta", "Halifax", "Québec City"]
  },

  "Holland America": {
    style: "Classic + Elegant",
    vibe: "Calm, traditional, and destination‑rich.",
    strengths: ["Longer itineraries", "Service", "Music Walk"],
    ports: ["Amber Cove", "Halifax", "Québec City"]
  },

  "Costa": {
    style: "European Budget",
    vibe: "Italian‑inspired cruising.",
    strengths: ["European itineraries", "Affordable"],
    ports: ["Barcelona", "Rome", "Santorini"]
  }
};

// ===============================
// SCORING WEIGHTS
// ===============================
const WEIGHTS = {
  vibe: 2,
  style: 2,
  portMatch: 3,
  budget: 2
};

// ===============================
// BUDGET GROUPS
// ===============================
const BUDGET_GROUPS = {
  budget: ["Carnival", "MSC", "Costa"],
  premium: ["Celebrity", "Princess", "Holland America"],
  family: ["Royal Caribbean", "Disney"]
};

// ===============================
// MATCHMAKER ENGINE
// ===============================
export function getBestCruiseLine(answers = {}) {
  const scores = {};

  for (const line in cruiseLines) {
    const data = cruiseLines[line];
    let score = 0;

    if (answers.vibe && data.vibe.toLowerCase().includes(answers.vibe.toLowerCase())) {
      score += WEIGHTS.vibe;
    }

    if (answers.style && data.style.toLowerCase().includes(answers.style.toLowerCase())) {
      score += WEIGHTS.style;
    }

    if (answers.favoritePort &&
      data.ports.some(p => p.toLowerCase().includes(answers.favoritePort.toLowerCase()))) {
      score += WEIGHTS.portMatch;
    }

    if (answers.budget && BUDGET_GROUPS[answers.budget]?.includes(line)) {
      score += WEIGHTS.budget;
    }

    scores[line] = score;
  }

  return Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
}

// ===============================
// OPTIONAL: EXPORT SCORES FOR UI
// ===============================
export function getAllScores(answers = {}) {
  const scores = {};

  for (const line in cruiseLines) {
    const data = cruiseLines[line];
    let score = 0;

    if (answers.vibe && data.vibe.toLowerCase().includes(answers.vibe.toLowerCase())) {
      score += WEIGHTS.vibe;
    }

    if (answers.style && data.style.toLowerCase().includes(answers.style.toLowerCase())) {
      score += WEIGHTS.style;
    }

    if (answers.favoritePort &&
      data.ports.some(p => p.toLowerCase().includes(answers.favoritePort.toLowerCase()))) {
      score += WEIGHTS.portMatch;
    }

    if (answers.budget && BUDGET_GROUPS[answers.budget]?.includes(line)) {
      score += WEIGHTS.budget;
    }

    scores[line] = score;
  }

  return scores;
}

// ===============================
// RESULT RENDERING UI
// ===============================
export function renderMatchmakerResult(bestLine, answers) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  const card = document.createElement("div");
  card.className = "result-card fade-in";

  const bookingUrl = new URL("https://www.foratravel.com/advisor/ray-davis-jr");
  bookingUrl.searchParams.set("line", bestLine);
  bookingUrl.searchParams.set("vibe", answers.vibe || "");
  bookingUrl.searchParams.set("port", answers.favoritePort || "");
  bookingUrl.searchParams.set("budget", answers.budget || "");

  card.innerHTML = `
    <h2>Your Perfect Cruise Match</h2>

    <div class="result-line">${bestLine}</div>

    <p class="muted">
      Based on your preferences, this cruise line best fits your style, vibe, and favorite destinations.
    </p>

    <h3>Why This Match?</h3>
    <ul class="result-list">
      <li><strong>Vibe:</strong> ${answers.vibe || "—"}</li>
      <li><strong>Style:</strong> ${answers.style || "—"}</li>
      <li><strong>Favorite Port:</strong> ${answers.favoritePort || "—"}</li>
      <li><strong>Budget:</strong> ${answers.budget || "—"}</li>
    </ul>

    <a 
      href="${bookingUrl.toString()}"
      target="_blank"
      class="primary-btn"
      style="margin-top: 20px; display: block; text-align: center;"
    >
      Book This Cruise With Ray
    </a>

    <button 
      class="secondary-btn"
      style="margin-top: 12px;"
      onclick="openBookingForm('${bestLine}', ${JSON.stringify(answers)})"
    >
      Talk to Ray (Concierge Service)
    </button>
  `;

  content.appendChild(card);
}

// ===============================
// CONCIERGE BOOKING FORM
// ===============================
import { openModal, closeModal } from "./ui.js";
import { createBookingRequest } from "./booking.js";
import { getUser } from "./auth.js";

export function openBookingForm(bestLine, answers) {
  openModal(`
    <div class="modal-content fade-in">
      <h3>Book With Ray</h3>

      <p>You’re requesting help booking a <strong>${bestLine}</strong> cruise.</p>

      <input id="bookName" placeholder="Your Name" />
      <input id="bookEmail" placeholder="Your Email" />
      <textarea id="bookNotes" placeholder="Notes (optional)"></textarea>

      <button class="primary-btn" id="submitBookingBtn">Submit Request</button>
      <button class="btn small" onclick="closeModal()">Cancel</button>
    </div>
  `);

  document.getElementById("submitBookingBtn").onclick = async () => {
    const name = document.getElementById("bookName").value.trim();
    const email = document.getElementById("bookEmail").value.trim();
    const notes = document.getElementById("bookNotes").value.trim();

    if (!name || !email) return;

    const user = await getUser();

    await createBookingRequest({
      id: crypto.randomUUID(),
      user_id: user?.id || null,
      cruise_line: bestLine,
      vibe: answers.vibe,
      port: answers.favoritePort,
      budget: answers.budget,
      name,
      email,
      notes,
      created_at: new Date().toISOString()
    });

    closeModal();
    alert("Your request has been sent! Ray will contact you shortly.");
  };
}

// ===============================
// PAGE LOADER (THIS WAS MISSING)
// ===============================
export function loadMatchmaker() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="matchmaker-container fade-in">
      <h2>Cruise Matchmaker</h2>

      <p class="muted">Answer a few quick questions and find your perfect cruise line.</p>

      <div id="matchmakerForm"></div>
    </div>
  `;

  // Load your form builder or quiz UI here
  // (You can expand this later)
}
