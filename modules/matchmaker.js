// ===============================
// MATCHMAKER MODULE — Modern ES Version
// ===============================

import { store } from "./store.js";
import { el } from "./ui.js";

// ===============================
// QUIZ QUESTIONS
// ===============================
const QUESTIONS = [
  {
    text: "What kind of cruise experience do you prefer?",
    options: [
      { label: "Relaxing & Quiet", score: { celebrity: 2, princess: 2 } },
      { label: "Family Fun & Activities", score: { royal: 2, carnival: 2 } },
      { label: "Luxury & Premium", score: { celebrity: 3 } },
      { label: "Party & Nightlife", score: { carnival: 3 } }
    ]
  },
  {
    text: "What’s your ideal onboard vibe?",
    options: [
      { label: "Modern & High‑Tech", score: { royal: 3 } },
      { label: "Classic Cruise Feel", score: { princess: 3 } },
      { label: "Lively & Social", score: { carnival: 3 } },
      { label: "Upscale & Stylish", score: { celebrity: 3 } }
    ]
  },
  {
    text: "What matters most to you?",
    options: [
      { label: "Entertainment & Shows", score: { royal: 2, carnival: 2 } },
      { label: "Food & Dining", score: { celebrity: 3, princess: 2 } },
      { label: "Relaxation & Spa", score: { princess: 3, celebrity: 2 } },
      { label: "Adventure & Activities", score: { royal: 3 } }
    ]
  }
];

// ===============================
// CRUISE LINE PROFILES (UPGRADED)
// ===============================
const CRUISE_LINES = {
  royal: {
    name: "Royal Caribbean",
    logo: "./assets/logos/royal.png",
    description: "Perfect for families, adventure lovers, and high‑tech ships.",
    itineraries: [
      "7‑Night Western Caribbean",
      "Perfect Day at CocoCay",
      "Bahamas Weekend Getaway"
    ],
    features: {
      vibe: "High‑Tech Adventure",
      price: "Mid‑Range",
      amenities: [
        "FlowRider Surf Simulator",
        "Zip Line",
        "Ice Skating",
        "CocoCay Access",
        "Rock Climbing Wall"
      ]
    }
  },

  carnival: {
    name: "Carnival Cruise Line",
    logo: "./assets/logos/carnival.png",
    description: "Fun, energetic, and budget‑friendly with great nightlife.",
    itineraries: [
      "5‑Night Cozumel + Costa Maya",
      "Bahamas Fun Cruise",
      "Eastern Caribbean Escape"
    ],
    features: {
      vibe: "Party & Social",
      price: "Budget‑Friendly",
      amenities: [
        "Water Slides",
        "Comedy Clubs",
        "Nightlife",
        "Guy’s Burger Joint",
        "Poolside DJ Parties"
      ]
    }
  },

  princess: {
    name: "Princess Cruises",
    logo: "./assets/logos/princess.png",
    description: "Relaxed, elegant, and perfect for couples and mature travelers.",
    itineraries: [
      "7‑Night Alaska Inside Passage",
      "Mexican Riviera",
      "Caribbean Explorer"
    ],
    features: {
      vibe: "Relaxed & Refined",
      price: "Mid‑High",
      amenities: [
        "Movies Under the Stars",
        "Sanctuary Adults‑Only Spa",
        "Discovery‑Themed Excursions",
        "Wine Tastings",
        "Traditional Afternoon Tea"
      ]
    }
  },

  celebrity: {
    name: "Celebrity Cruises",
    logo: "./assets/logos/celebrity.png",
    description: "Premium, stylish, and food‑focused with a modern luxury feel.",
    itineraries: [
      "7‑Night Southern Caribbean",
      "Bermuda Luxury Sailing",
      "Mediterranean Highlights"
    ],
    features: {
      vibe: "Modern Luxury",
      price: "Premium",
      amenities: [
        "Rooftop Garden",
        "Eden Lounge",
        "Fine Dining",
        "The Retreat Suites",
        "Michelin‑Inspired Cuisine"
      ]
    }
  }
};

// ===============================
// MAIN ENTRY
// ===============================
export function loadMatchmaker() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(el("h2", { class: "module-title" }, ["Cruise Matchmaker"]));

  root.appendChild(
    el("p", { class: "muted" }, [
      "Answer a few quick questions and we’ll match you with the perfect cruise line."
    ])
  );

  // Compare button on home screen
  root.appendChild(
    el("button", {
      class: "btn secondary-btn",
      style: "margin-top: 20px;",
      onclick: showComparison
    }, ["Compare Cruise Lines"])
  );

  startQuiz();
}

// ===============================
// QUIZ ENGINE
// ===============================
let currentIndex = 0;
let scores = { royal: 0, carnival: 0, princess: 0, celebrity: 0 };

function startQuiz() {
  currentIndex = 0;
  scores = { royal: 0, carnival: 0, princess: 0, celebrity: 0 };
  renderQuestion();
}

function renderQuestion() {
  const root = document.getElementById("content");

  const q = QUESTIONS[currentIndex];

  root.appendChild(
    el("h3", { class: "slide-up", style: "margin-top: 20px;" }, [q.text])
  );

  q.options.forEach(opt => {
    root.appendChild(
      el("button", {
        class: "quiz-btn fade-in",
        onclick: () => {
          for (const line in opt.score) {
            scores[line] += opt.score[line];
          }

          currentIndex++;
          if (currentIndex < QUESTIONS.length) {
            loadMatchmaker();
            renderQuestion();
          } else {
            showResults();
          }
        }
      }, [opt.label])
    );
  });
}

// ===============================
// RESULTS
// ===============================
function showResults() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const winnerKey = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const winner = CRUISE_LINES[winnerKey];

  root.appendChild(el("h2", { class: "module-title" }, ["Your Perfect Match"]));

  root.appendChild(
    el("img", {
      src: winner.logo,
      class: "result-logo fade-in"
    })
  );

  root.appendChild(
    el("button", {
      class: "btn secondary-btn",
      style: "margin-top: 20px;",
      onclick: showComparison
    }, ["Compare Cruise Lines"])
  );

  root.appendChild(el("h3", {}, [winner.name]));
  root.appendChild(el("p", { class: "muted" }, [winner.description]));

  root.appendChild(
    el("h3", { style: "margin-top: 20px;" }, ["Recommended Itineraries"])
  );

  const grid = el("div", { class: "itinerary-grid" });

  winner.itineraries.forEach(it => {
    grid.appendChild(
      el("div", { class: "itinerary-card" }, [
        el("h4", {}, [it]),
        el("button", {
          class: "btn small",
          onclick: () => addItineraryToTrips(winner, it)
        }, ["Add to My Trips"])
      ])
    );
  });

  root.appendChild(grid);

  root.appendChild(
    el("button", {
      class: "btn secondary-btn",
      style: "margin-top: 20px;",
      onclick: loadMatchmaker
    }, ["Restart Quiz"])
  );
}

// ===============================
// ADD ITINERARY TO TRIPS
// ===============================
function addItineraryToTrips(line, itinerary) {
  const trip = {
    id: crypto.randomUUID(),
    destination: itinerary,
    ship: line.name,
    dates: "TBD"
  };

  store.addTrip(trip);
  alert(`Added "${itinerary}" to your trips!`);
}

// ===============================
// COMPARE CRUISE LINES SCREEN
// ===============================
function showComparison() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("button", { class: "secondary-btn", onclick: loadMatchmaker }, ["← Back"])
  );

  root.appendChild(
    el("h2", { class: "module-title", style: "margin-top: 16px;" }, [
      "Compare Cruise Lines"
    ])
  );

  // Cruise Line Cards
  const grid = el("div", { class: "compare-grid" });

  Object.values(CRUISE_LINES).forEach(line => {
    grid.appendChild(
      el("div", { class: "compare-card" }, [
        el("img", {
          src: line.logo,
          class: "result-logo",
          style: "width: 100px; height: 100px;"
        }),
        el("h3", {}, [line.name]),
        el("p", { class: "muted" }, [line.description]),
        el("h4", { style: "margin-top: 12px;" }, ["Top Itineraries"]),
        el("ul", {}, line.itineraries.map(it => el("li", {}, [it]))),
        el("button", {
          class: "btn small",
          onclick: () => addComparisonTrip(line)
        }, ["Add Sample Trip"])
      ])
    );
  });

  root.appendChild(grid);

  // ===============================
  // FEATURE COMPARISON TABLE
  // ===============================
  root.appendChild(
    el("h2", { class: "module-title", style: "margin-top: 40px;" }, [
      "Feature Comparison"
    ])
  );

  const table = el("table", { class: "compare-table" });

  table.appendChild(
    el("tr", {}, [
      el("th", {}, ["Cruise Line"]),
      el("th", {}, ["Vibe"]),
      el("th", {}, ["Price Level"]),
      el("th", {}, ["Key Amenities"])
    ])
  );

  Object.values(CRUISE_LINES).forEach(line => {
    table.appendChild(
      el("tr", {}, [
        el("td", {}, [line.name]),
        el("td", {}, [line.features.vibe]),
        el("td", {}, [line.features.price]),
        el("td", {}, [line.features.amenities.join(", ")])
      ])
    );
  });

  root.appendChild(table);
}

// ===============================
// ADD SAMPLE TRIP FROM COMPARISON
// ===============================
function addComparisonTrip(line) {
  const trip = {
    id: crypto.randomUUID(),
    destination: `${line.name} Sample Itinerary`,
    ship: line.name,
    dates: "TBD"
  };

  store.addTrip(trip);
  alert(`Added a sample ${line.name} trip to your Trips`);
}
