// ===============================
// MATCHMAKER MODULE — Modern ES Version
// ===============================

import { el, openModal, closeModal } from "./ui.js";
import { store, state } from "./store.js";

// ===============================
// CRUISE LINE DATA
// ===============================
const CRUISE_LINES = [
  {
    id: "royal",
    line: "Royal Caribbean",
    logo: "assets/logos/royal.svg",
    desc: "Perfect for adventure lovers, families, and big‑ship entertainment.",
    itineraries: [
      { title: "Perfect Day Bahamas", days: "3–4 nights", ship: "Utopia of the Seas" },
      { title: "Western Caribbean", days: "7 nights", ship: "Wonder of the Seas" }
    ]
  },
  {
    id: "celebrity",
    line: "Celebrity Cruises",
    logo: "assets/logos/celebrity.svg",
    desc: "Upscale, modern, and perfect for adults or couples.",
    itineraries: [
      { title: "Southern Caribbean", days: "7 nights", ship: "Celebrity Beyond" },
      { title: "Alaska Dawes Glacier", days: "7 nights", ship: "Celebrity Edge" }
    ]
  },
  {
    id: "ncl",
    line: "Norwegian Cruise Line",
    logo: "assets/logos/ncl.svg",
    desc: "Freestyle cruising with flexible dining and entertainment.",
    itineraries: [
      { title: "Greek Isles", days: "7 nights", ship: "Norwegian Viva" },
      { title: "Caribbean Escape", days: "5 nights", ship: "Norwegian Escape" }
    ]
  }
];

// ===============================
// MAIN LOADER
// ===============================
export function loadMatchmaker() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title fade-in" }, ["Cruise Matchmaker"])
  );

  root.appendChild(
    el("p", { class: "muted fade-in" }, [
      "Answer a few quick questions and we’ll match you with the perfect cruise line."
    ])
  );

  const startBtn = el(
    "button",
    { class: "primary-btn fade-in", onclick: startQuiz },
    ["Start Matchmaker"]
  );

  root.appendChild(startBtn);
}

// ===============================
// QUIZ FLOW
// ===============================
function startQuiz() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const q = el("div", { class: "quiz-card slide-up" }, [
    el("h3", {}, ["What’s your cruise vibe?"]),
    el("button", { class: "quiz-btn", onclick: () => finishQuiz("adventure") }, [
      "Adventure & Activities"
    ]),
    el("button", { class: "quiz-btn", onclick: () => finishQuiz("relax") }, [
      "Relaxation & Luxury"
    ]),
    el("button", { class: "quiz-btn", onclick: () => finishQuiz("flexible") }, [
      "Flexible & Freestyle"
    ])
  ]);

  root.appendChild(q);
}

// ===============================
// RESULT LOGIC
// ===============================
function finishQuiz(type) {
  let match;

  if (type === "adventure") match = CRUISE_LINES[0];
  if (type === "relax") match = CRUISE_LINES[1];
  if (type === "flexible") match = CRUISE_LINES[2];

  showResult(match);
}

// ===============================
// RESULT UI
// ===============================
function showResult(r) {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const card = el("div", { class: "result-card fade-in" }, [
    el("h3", { class: "result-title" }, [`Your Perfect Match: ${r.line}`]),
    el("img", { src: r.logo, class: "result-logo" }),
    el("p", { class: "result-desc" }, [r.desc]),

    el("h4", { class: "result-subtitle" }, ["Top Itineraries"]),

    el(
      "div",
      { class: "itinerary-grid" },
      r.itineraries.map((i) =>
        el("div", { class: "itinerary-card slide-up" }, [
          el("h4", {}, [i.title]),
          el("p", {}, [`${i.days}`]),
          el("p", { class: "muted" }, [`Ship: ${i.ship}`])
        ])
      )
    ),

    el(
      "button",
      { class: "primary-btn save-btn slide-up", onclick: () => saveToTrips(r) },
      ["Save to My Trips"]
    )
  ]);

  root.appendChild(card);
}

// ===============================
// SAVE TO TRIPS
// ===============================
function saveToTrips(match) {
  const trip = {
    id: crypto.randomUUID(),
    ship: match.line,
    destination: match.itineraries[0].title,
    dates: match.itineraries[0].days
  };

  store.addTrip(trip);

  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Saved!"]),
      el("p", {}, [`${match.line} has been added to your Trips.`]),
      el("button", { class: "primary-btn", onclick: closeModal }, ["Close"])
    ])
  );
}
