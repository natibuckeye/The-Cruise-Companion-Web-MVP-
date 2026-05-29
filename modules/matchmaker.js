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
// SCORING WEIGHTS (easy to tune)
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

    // --- Vibe match ---
    if (answers.vibe) {
      const vibe = answers.vibe.toLowerCase();
      if (data.vibe.toLowerCase().includes(vibe)) {
        score += WEIGHTS.vibe;
      }
    }

    // --- Style match ---
    if (answers.style) {
      const style = answers.style.toLowerCase();
      if (data.style.toLowerCase().includes(style)) {
        score += WEIGHTS.style;
      }
    }

    // --- Port preference ---
    if (answers.favoritePort) {
      const port = answers.favoritePort.toLowerCase();
      if (data.ports.some(p => p.toLowerCase().includes(port))) {
        score += WEIGHTS.portMatch;
      }
    }

    // --- Budget match ---
    if (answers.budget && BUDGET_GROUPS[answers.budget]) {
      if (BUDGET_GROUPS[answers.budget].includes(line)) {
        score += WEIGHTS.budget;
      }
    }

    scores[line] = score;
  }

  // Return highest scoring line
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
