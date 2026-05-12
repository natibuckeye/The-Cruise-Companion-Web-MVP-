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
      "Up, Up & Away Balloon",
      "Oasis Lagoon Swim‑Up Bar",
      "Chill Island Beach"
    ],
    tips: [
      "Arrive early for the best beach chairs.",
      "Thrill Waterpark sells out — book ahead.",
      "The island is cashless — SeaPass only."
    ],
    excursions: [
      {
        title: "Thrill Waterpark Pass",
        duration: "All Day",
        price: "$89–$149",
        desc: "Access to all slides, wave pool, and the tallest waterslide in North America."
      },
      {
        title: "Up, Up & Away Balloon Ride",
        duration: "10 minutes",
        price: "$39–$79",
        desc: "Soar 450 feet above the island for panoramic views of CocoCay."
      },
      {
        title: "Chill Island Cabana",
        duration: "All Day",
        price: "$499–$899",
        desc: "Private cabana with shade, loungers, and dedicated service."
      }
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
      "Taxi prices are fixed — check the rate board.",
      "Bring water shoes for rocky beach entries.",
      "Vendors expect polite bargaining."
    ],
    excursions: [
      {
        title: "Mr. Sanchos All‑Inclusive Day Pass",
        duration: "6 hours",
        price: "$68–$75",
        desc: "Unlimited food, drinks, beach access, and pools."
      },
      {
        title: "Cozumel Reef Snorkel",
        duration: "2.5 hours",
        price: "$45–$65",
        desc: "Guided snorkel tour of Cozumel’s famous coral reefs."
      },
      {
        title: "Chankanaab Park Experience",
        duration: "4 hours",
        price: "$25–$35",
        desc: "Beach, snorkeling, botanical gardens, and sea lion show."
      }
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
      "Magens Bay gets crowded — go early.",
      "Paradise Point is best at sunset.",
      "USVI uses USD — no exchange needed."
    ],
    excursions: [
      {
        title: "Magens Bay Beach Transfer",
        duration: "3 hours",
        price: "$29–$39",
        desc: "Round‑trip transport to one of the world’s most beautiful beaches."
      },
      {
        title: "Skyride to Paradise Point",
        duration: "1 hour",
        price: "$24–$32",
        desc: "Ride 700 feet above sea level for incredible harbor views."
      },
      {
        title: "Coki Beach Snorkel",
        duration: "2 hours",
        price: "$45–$60",
        desc: "Crystal‑clear water and vibrant marine life — perfect for beginners."
      }
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
      "Browse ports, excursions, beaches, and insider tips."
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
      ),

      el("h4", { style: "margin-top: 16px;" }, ["Excursions"]),
      el(
  "div",
  { class: "excursion-grid" },
  port.excursions.map((ex) =>
    el("div", { class: "excursion-card slide-up" }, [
      el("h4", {}, [ex.title]),
      el("p", { class: "muted" }, [`Duration: ${ex.duration}`]),
      el("p", { class: "muted" }, [`Price: ${ex.price}`]),
      el("p", {}, [ex.desc]),

      el(
        "button",
        {
          class: "primary-btn",
          style: "margin-top: 10px; width: 100%;",
          onclick: () => saveExcursionToTrips(port, ex)
        },
        ["Add to My Trips"]
      )
    ])
  )
)

  root.appendChild(grid);
}
