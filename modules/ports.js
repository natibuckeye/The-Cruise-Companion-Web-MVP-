// ===============================
// PORTS MODULE — Modern ES Version
// ===============================

import { el } from "./ui.js";

export function loadPorts() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title" }, ["Port Explorer"])
  );

  root.appendChild(
    el("div", { class: "module-card" }, [
      el("p", {}, ["Explore ports, excursions, and local tips."])
    ])
  );
}
// ===============================
// PORTS MODULE — Modern ES Version
// ===============================

import { el } from "./ui.js";

const PORT_DATA = [
  {
    id: "cococay",
    name: "Perfect Day at CocoCay",
    country: "Bahamas",
    highlights: [
      "Thrill Waterpark",
      "Up, Up & Away Helium Balloon",
      "Oasis Lagoon Swim‑Up Bar",
      "Chill Island Beach"
    ],
    tips: [
      "Arrive early if you want a beach chair near the water.",
      "Thrill Waterpark sells out — book ahead if possible.",
      "The island is cashless — your SeaPass covers everything."
    ]
  },
  {
    id: "cozumel",
    name: "Cozumel",
    country: "Mexico",
    highlights: [
      "Chankanaab Park",
      "Mr. Sanchos All‑Inclusive",
      "Cozumel Reefs Snorkeling",
      "Downtown Shopping"
    ],
    tips: [
      "Taxi prices are fixed — check the posted rate board.",
      "Bring water shoes for rocky beach entries.",
      "Local vendors expect polite bargaining."
    ]
  },
  {
    id: "stthomas",
    name: "St. Thomas",
    country: "U.S. Virgin Islands",
    highlights: [
      "Magens Bay Beach",
      "Skyride to Paradise Point",
      "Coki Beach Snorkeling",
      "Charlotte Amalie Shopping"
    ],
    tips: [
      "Magens Bay gets crowded — go early or late.",
      "Paradise Point is best at sunset.",
      "USVI uses USD — no currency exchange needed."
    ]
  }
];

export function loadPorts() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title fade-in" }, ["Port Explorer"])
  );

  root.appendChild(
    el("p", { class: "muted fade-in" }, [
      "Browse popular cruise ports and discover excursions, beaches, food, and insider tips."
    ])
  );

  const grid = el("div", { class: "port-grid fade-in" });

  PORT_DATA.forEach((port) => {
    const card = el("div", { class: "port-card slide-up" }, [
      el("h3", {}, [port.name]),
      el("p", { class: "muted" }, [port.country]),

      el("h4", {}, ["Top Highlights"]),
      el(
        "ul",
        { class: "port-list" },
        port.highlights.map((h) => el("li", {}, [h]))
      ),

      el("h4", {}, ["Local Tips"]),
      el(
        "ul",
        { class: "port-list" },
        port.tips.map((t) => el("li", {}, [t]))
      )
    ]);

    grid.appendChild(card);
  });

  root.appendChild(grid);
}
