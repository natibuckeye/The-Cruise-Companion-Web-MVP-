// ===============================
// PORTS MODULE — Modern ES Version
// ===============================

import { el, openModal, closeModal } from "./ui.js";
import { store } from "./store.js";

// ===============================
// PORT DATA WITH CATEGORIES
// ===============================
const PORT_DATA = [
  {
    id: "cococay",
    name: "Perfect Day at CocoCay",
    country: "Bahamas",
    categories: ["Beaches", "Adventure"],
    description:
      "Royal Caribbean’s private island paradise featuring beaches, waterparks, cabanas, and stunning views.",
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
    categories: ["Beaches", "Food", "Adventure", "Shopping"],
    description:
      "A vibrant island known for reefs, beaches, food, and some of the best snorkeling in the Caribbean.",
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
    categories: ["Beaches", "Shopping", "Adventure"],
    description:
      "A stunning island with beaches, shopping, scenic views, and some of the Caribbean’s best snorkeling.",
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

// ===============================
// SEARCH + FILTER STATE
// ===============================
let currentSearch = "";
let currentFilter = "All";

const FILTERS = ["All", "Beaches", "Adventure", "Food", "Shopping"];

// ===============================
// MAIN ENTRY
// ===============================
export function loadPorts() {
  renderPortList();
}

// ===============================
// PORT LIST VIEW
// ===============================
function renderPortList() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  // Title
  root.appendChild(el("h2", { class: "module-title fade-in" }, ["Port Explorer"]));

  // Search Bar
  root.appendChild(
    el("input", {
      type: "text",
      placeholder: "Search ports…",
      class: "fade-in",
      value: currentSearch,
      oninput: (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderPortList();
      }
    })
  );

  // Filter Chips
  const filterRow = el("div", { class: "filter-row fade-in" });

  FILTERS.forEach((f) => {
    filterRow.appendChild(
      el(
        "button",
        {
          class: `filter-chip ${currentFilter === f ? "active" : ""}`,
          onclick: () => {
            currentFilter = f;
            renderPortList();
          }
        },
        [f]
      )
    );
  });

  root.appendChild(filterRow);

  // Filter Logic
  const filtered = PORT_DATA.filter((port) => {
    const matchesSearch =
      port.name.toLowerCase().includes(currentSearch) ||
      port.country.toLowerCase().includes(currentSearch);

    const matchesFilter =
      currentFilter === "All" ||
      port.categories.includes(currentFilter);

    return matchesSearch && matchesFilter;
  });

  // Port Grid
  const grid = el("div", { class: "port-grid fade-in" });

  filtered.forEach((port) => {
    grid.appendChild(
      el(
        "div",
        {
          class: "port-card slide-up",
          onclick: () => renderPortDetail(port.id),
          style: "cursor:pointer;"
        },
        [
          el("h3", {}, [port.name]),
          el("p", { class: "muted" }, [port.country]),
          el("p", {}, [port.description])
        ]
      )
    );
  });

  if (filtered.length === 0) {
    grid.appendChild(
      el("p", { class: "muted" }, ["No ports match your search or filters."])
    );
  }

  root.appendChild(grid);
}

// ===============================
// PORT DETAIL VIEW
// ===============================
function renderPortDetail(portId) {
  const port = PORT_DATA.find((p) => p.id === portId);
  const root = document.getElementById("content");
  root.innerHTML = "";

  // Back button
  root.appendChild(
    el(
      "button",
      { class: "secondary-btn fade-in", onclick: renderPortList },
      ["← Back to Ports"]
    )
  );

  // Header
  root.appendChild(
    el("h2", { class: "module-title fade-in", style: "margin-top: 16px;" }, [
      port.name
    ])
  );

  root.appendChild(el("p", { class: "muted fade-in" }, [port.country]));
  root.appendChild(el("p", { class: "fade-in" }, [port.description]));

  // Highlights
  root.appendChild(el("h3", { class: "fade-in", style: "margin-top:20px;" }, ["Top Highlights"]));
  root.appendChild(
    el(
      "ul",
      { class: "port-list fade-in" },
      port.highlights.map((h) => el("li", {}, [h]))
    )
  );

  // Tips
  root.appendChild(el("h3", { class: "fade-in", style: "margin-top:20px;" }, ["Local Tips"]));
  root.appendChild(
    el(
      "ul",
      { class: "port-list fade-in" },
      port.tips.map((t) => el("li", {}, [t]))
    )
  );

  // Excursions
  root.appendChild(el("h3", { class: "fade-in", style: "margin-top:20px;" }, ["Excursions"]));

  const exGrid = el("div", { class: "excursion-grid fade-in" });

  port.excursions.forEach((ex) => {
    exGrid.appendChild(
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
    );
  });

  root.appendChild(exGrid);
}

// ===============================
// SAVE EXCURSION TO TRIPS
// ===============================
function saveExcursionToTrips(port, ex) {
  const trip = {
    id: crypto.randomUUID(),
    ship: port.name,
    destination: ex.title,
    dates: ex.duration
  };

  store.addTrip(trip);

  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Excursion Saved!"]),
      el("p", {}, [`${ex.title} has been added to your Trips under ${port.name}.`]),
      el("button", { class: "primary-btn", onclick: closeModal }, ["Close"])
    ])
  );
}
