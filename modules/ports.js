// ===============================
// PORTS MODULE
// ===============================

export function loadPorts() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2 class="module-title">Ports & Destinations</h2>

    <div class="card fade-in">
      <p>Explore port guides, tips, and must‑see attractions for your upcoming cruise stops.</p>
    </div>

    <div class="card fade-in">
      <h3>Nassau, Bahamas</h3>
      <p>Beaches, Atlantis Resort, shopping, and excursions.</p>
    </div>
  `;
}

// ===============================
// PORT DATA (static for MVP)
// ===============================
const PORTS = [
  {
    id: "nassau",
    name: "Nassau, Bahamas",
    description: "A lively Caribbean port known for beaches, Atlantis Resort, and vibrant markets.",
    categories: ["Beaches", "Shopping", "Excursions", "Food"],
    cruiseLines: ["Royal Caribbean", "Carnival", "Disney", "MSC"],
    highlights: [
      "Atlantis Aquaventure",
      "Blue Lagoon",
      "Queen’s Staircase",
      "Straw Market"
    ],
    suggestedItems: [
      "Water Shoes",
      "Sunscreen",
      "Beach Bag",
      "Cash for Vendors"
    ]
  },
  {
    id: "cozumel",
    name: "Cozumel, Mexico",
    description: "A top destination for snorkeling, Mayan ruins, and authentic Mexican cuisine.",
    categories: ["Beaches", "Culture", "Adventure"],
    cruiseLines: ["Royal Caribbean", "Carnival", "Norwegian", "Celebrity"],
    highlights: [
      "Chankanaab Park",
      "San Gervasio Ruins",
      "Mr. Sanchos Beach Club"
    ],
    suggestedItems: [
      "Snorkel Gear",
      "Bug Spray",
      "Waterproof Phone Case"
    ]
  },
  {
    id: "labadee",
    name: "Labadee, Haiti",
    description: "Royal Caribbean’s private destination featuring beaches, zip lines, and water activities.",
    categories: ["Private Island", "Adventure", "Relaxation"],
    cruiseLines: ["Royal Caribbean"],
    highlights: [
      "Dragon’s Breath Zip Line",
      "Adrenaline Beach",
      "Arawak Aqua Park"
    ],
    suggestedItems: [
      "Water Shoes",
      "Towel Clips",
      "GoPro"
    ]
  }
];

// ===============================
// MAIN ENTRY
// ===============================
export function loadPorts() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title" }, ["Ports"])
  );

  const grid = el("div", { class: "port-grid" });

  PORTS.forEach(port => {
    grid.appendChild(
      el("div", { class: "port-card" }, [
        el("h3", {}, [port.name]),
        el("p", { class: "muted" }, [port.description]),
        el("button", {
          class: "btn small",
          onclick: () => openPortDetail(port)
        }, ["View Details"])
      ])
    );
  });

  root.appendChild(grid);
}

// ===============================
// PORT DETAIL VIEW
// ===============================
function openPortDetail(port) {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("button", { class: "secondary-btn", onclick: loadPorts }, ["← Back"])
  );

  root.appendChild(
    el("h2", { class: "module-title", style: "margin-top: 16px;" }, [port.name])
  );

  root.appendChild(
    el("p", { class: "muted" }, [port.description])
  );

  // Categories
  root.appendChild(
    el("h3", {}, ["Categories"])
  );
  root.appendChild(
    el("div", { class: "port-list" },
      port.categories.map(c => el("div", { class: "pill" }, [c]))
    )
  );

  // Highlights
  root.appendChild(
    el("h3", { style: "margin-top: 20px;" }, ["Highlights"])
  );
  root.appendChild(
    el("ul", {},
      port.highlights.map(h => el("li", {}, [h]))
    )
  );

  // Cruise Lines
  root.appendChild(
    el("h3", { style: "margin-top: 20px;" }, ["Cruise Lines Visiting"])
  );
  root.appendChild(
    el("div", { class: "port-list" },
      port.cruiseLines.map(c => el("div", { class: "pill" }, [c]))
    )
  );

  // Suggested Items
  root.appendChild(
    el("h3", { style: "margin-top: 20px;" }, ["Suggested Items"])
  );
  root.appendChild(
    el("ul", {},
      port.suggestedItems.map(i => el("li", {}, [i]))
    )
  );

  // Add to Packing List
  root.appendChild(
    el("button", {
      class: "btn primary",
      style: "margin-top: 20px;",
      onclick: () => openAddToListModal(port)
    }, ["Add Items to Packing List"])
  );
}

// ===============================
// ADD TO PACKING LIST MODAL
// ===============================
function openAddToListModal(port) {
  const tripId = store.read(store.keys.currentTripId);
  if (!tripId) {
    alert("Pick a trip first (top right).");
    return;
  }

  const lists = store
    .list(store.keys.packingLists)
    .filter(l => l.tripId === tripId);

  if (lists.length === 0) {
    alert("You need a packing list first.");
    return;
  }

  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Add to Packing List"]),

      ...lists.map(list =>
        el("button", {
          class: "btn",
          onclick: () => {
            port.suggestedItems.forEach(name => {
              store.addPackingItem({
                id: crypto.randomUUID(),
                listId: list.id,
                name,
                checked: false
              });
            });

            closeModal();
            alert(`Added ${port.suggestedItems.length} items to "${list.name}"`);
          }
        }, [list.name])
      )
    ])
  );
}
