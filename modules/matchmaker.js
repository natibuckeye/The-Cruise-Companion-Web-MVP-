const cruiseLines = {
  "Royal Caribbean": {
    style: "Adventure + Family Fun",
    vibe: "Perfect for families, couples, and thrill‑seekers.",
    strengths: ["Private islands (CocoCay, Labadee)", "Huge ships", "Great entertainment"],
    ports: ["Nassau", "CocoCay", "Labadee", "San Juan", "St. Thomas", "Roatán", "Cozumel", "Costa Maya"]
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

function getBestCruiseLine(answers) {
  let scores = {};

  Object.keys(cruiseLines).forEach(line => {
    scores[line] = 0;

    // Match based on vibe
    if (answers.vibe && cruiseLines[line].vibe.toLowerCase().includes(answers.vibe)) {
      scores[line] += 2;
    }

    // Match based on style
    if (answers.style && cruiseLines[line].style.toLowerCase().includes(answers.style)) {
      scores[line] += 2;
    }

    // Match based on preferred ports
    if (answers.favoritePort) {
      if (cruiseLines[line].ports.some(p => p.toLowerCase().includes(answers.favoritePort.toLowerCase()))) {
        scores[line] += 3;
      }
    }

    // Match based on budget
    if (answers.budget === "budget" && ["Carnival", "MSC", "Costa"].includes(line)) {
      scores[line] += 2;
    }
    if (answers.budget === "premium" && ["Celebrity", "Princess", "Holland America"].includes(line)) {
      scores[line] += 2;
    }
    if (answers.budget === "family" && ["Royal Caribbean", "Disney"].includes(line)) {
      scores[line] += 2;
    }
  });

  // Return the highest scoring cruise line
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

