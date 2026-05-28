// ===============================
// PORTS MODULE (Expanded + Clean)
// ===============================

export function loadPorts() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  // Header
  content.innerHTML = `
    <h2 class="module-title fade-in">Ports & Destinations</h2>

    <div class="card fade-in">
      <p>Explore port guides, tips, and must‑see attractions for your upcoming cruise stops.</p>
    </div>

    <div id="portGrid" class="port-grid fade-in"></div>
  `;

  // ===============================
  // PORT DATA (Images optional)
  // ===============================
  const ports = [
    // --- Caribbean ---
    { name: "Nassau, Bahamas", desc: "Beaches, Atlantis Resort, shopping, and excursions.", img: "./assets/ports/nassau.jpg" },
    { name: "Grand Turk, Turks & Caicos", desc: "Crystal‑clear water, Margaritaville, and a long beach pier.", img: "./assets/ports/grand_turk.jpg" },
    { name: "Ocho Rios, Jamaica", desc: "Dunn’s River Falls, Blue Hole, and rainforest adventures.", img: "./assets/ports/ocho_rios.jpg" },
    { name: "Falmouth, Jamaica", desc: "Historic port, beaches, and excursions to Montego Bay.", img: "./assets/ports/falmouth.jpg" },
    { name: "Roatán, Honduras", desc: "Snorkeling, sloths, beaches, and lush island scenery.", img: "./assets/ports/roatan.jpg" },
    { name: "Costa Maya, Mexico", desc: "Beach clubs, Mayan ruins, and a colorful port village.", img: "./assets/ports/costa_maya.jpg" },
    { name: "Amber Cove, Dominican Republic", desc: "Pools, ziplining, and beautiful mountain views.", img: "./assets/ports/amber_cove.jpg" },
    { name: "Labadee, Haiti", desc: "Private beaches, zipline, and Royal Caribbean’s private peninsula.", img: "./assets/ports/labadee.jpg" },

    // --- Bahamas ---
    { name: "Freeport, Bahamas", desc: "Laid‑back beaches, markets, and water activities.", img: "./assets/ports/freeport.jpg" },
    { name: "Half Moon Cay", desc: "Holland America’s private island with pristine beaches.", img: "./assets/ports/half_moon_cay.jpg" },
    { name: "Princess Cays", desc: "Princess Cruises’ private beach escape.", img: "./assets/ports/princess_cays.jpg" },

    // --- Mexico (West Coast) ---
    { name: "Cabo San Lucas", desc: "The Arch, beaches, and whale watching.", img: "./assets/ports/cabo.jpg" },
    { name: "Puerto Vallarta", desc: "Beaches, Malecon boardwalk, and jungle adventures.", img: "./assets/ports/puerto_vallarta.jpg" },
    { name: "Mazatlán", desc: "Historic old town, beaches, and cliff divers.", img: "./assets/ports/mazatlan.jpg" },

    // --- US Departure Ports ---
    { name: "Miami, Florida", desc: "Iconic skyline, South Beach, and the world’s busiest cruise port.", img: "./assets/ports/miami.jpg" },
    { name: "Port Canaveral, Florida", desc: "Home of Disney, Royal Caribbean, and NASA nearby.", img: "./assets/ports/port_canaveral.jpg" },
    { name: "Fort Lauderdale (Port Everglades)", desc: "Beautiful beaches and major cruise hub.", img: "./assets/ports/fort_lauderdale.jpg" },
    { name: "Tampa, Florida", desc: "Laid‑back port with easy access and great views.", img: "./assets/ports/tampa.jpg" },
    { name: "Galveston, Texas", desc: "Popular for Western Caribbean sailings.", img: "./assets/ports/galveston.jpg" },

    // --- Canada & New England ---
    { name: "Halifax, Nova Scotia", desc: "Lighthouses, seafood, and scenic waterfront.", img: "./assets/ports/halifax.jpg" },
    { name: "Bar Harbor, Maine", desc: "Gateway to Acadia National Park.", img: "./assets/ports/bar_harbor.jpg" },
    { name: "Québec City, Québec", desc: "Old‑world charm and stunning architecture.", img: "./assets/ports/quebec_city.jpg" },

    // --- Mediterranean ---
    { name: "Barcelona, Spain", desc: "Gaudí architecture, beaches, and vibrant culture.", img: "./assets/ports/barcelona.jpg" },
    { name: "Civitavecchia (Rome), Italy", desc: "Gateway to Rome’s ancient wonders.", img: "./assets/ports/civitavecchia.jpg" },
    { name: "Santorini, Greece", desc: "Blue domes, cliffs, and iconic sunsets.", img: "./assets/ports/santorini.jpg" },
    { name: "Dubrovnik, Croatia", desc: "Walled old town and Adriatic beauty.", img: "./assets/ports/dubrovnik.jpg" }
  ];

  // ===============================
  // RENDER CARDS
  // ===============================
  const grid = document.getElementById("portGrid");

  ports.forEach(port => {
    const card = document.createElement("div");
    card.className = "port-card fade-in";

    card.innerHTML = `
      <img src="${port.img}" alt="${port.name}" class="port-image" onerror="this.src='./assets/ports/placeholder.jpg'" />
      <h3>${port.name}</h3>
      <p>${port.desc}</p>
    `;

    grid.appendChild(card);
  });
}
