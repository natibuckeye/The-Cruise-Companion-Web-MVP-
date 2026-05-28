// ===============================
// PORTS MODULE (Advanced Version)
// ===============================

export function loadPorts() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  // Header + Search + Filters
  content.innerHTML = `
    <h2 class="module-title fade-in">Ports & Destinations</h2>

    <div class="card fade-in">
      <p>Explore port guides, tips, excursions, and must‑see attractions.</p>
    </div>

    <input 
      id="portSearch" 
      class="search-bar fade-in" 
      type="text" 
      placeholder="Search ports..."
    />

    <div id="categoryFilters" class="filter-row fade-in">
      <button class="filter-btn active" data-category="all">All</button>
      <button class="filter-btn" data-category="caribbean">Caribbean</button>
      <button class="filter-btn" data-category="bahamas">Bahamas</button>
      <button class="filter-btn" data-category="mexico">Mexico</button>
      <button class="filter-btn" data-category="us">U.S. Ports</button>
      <button class="filter-btn" data-category="canada">Canada</button>
      <button class="filter-btn" data-category="europe">Europe</button>
    </div>

    <div id="portGrid" class="port-grid fade-in"></div>
  `;

  // ===============================
  // PORT DATA (Synced to your GitHub filenames)
  // ===============================
  const ports = [
    // --- Bahamas ---
    { 
      name: "Nassau, Bahamas", 
      category: "bahamas",
      desc: "Atlantis, beaches, and shopping.",
      img: "./assets/ports/nassau.jpg",
      excursions: ["Atlantis Aquaventure", "Blue Lagoon Dolphin Encounter", "Nassau Food Tasting Tour"]
    },
    { 
      name: "CocoCay (Royal Caribbean)", 
      category: "bahamas",
      desc: "Perfect Day private island.",
      img: "./assets/ports/cococay.jpg",
      excursions: ["Thrill Waterpark", "Up, Up & Away Balloon", "Coco Beach Club"]
    },
    { 
      name: "Freeport, Bahamas", 
      category: "bahamas",
      desc: "Laid‑back beaches and markets.",
      img: "./assets/ports/freeport.jpg",
      excursions: ["Garden of the Groves", "Beach Break", "Snorkel Adventure"]
    },

    // --- Caribbean ---
    { 
      name: "Amber Cove, Dominican Republic", 
      category: "caribbean",
      desc: "Pools, zipline, and mountain views.",
      img: "./assets/ports/amber_cove.jpg",
      excursions: ["Damajagua Waterfalls", "Catamaran Sail", "Zipline Adventure"]
    },
    { 
      name: "Labadee, Haiti", 
      category: "caribbean",
      desc: "Private beaches and the Dragon's Breath zipline.",
      img: "./assets/ports/labadee.jpg",
      excursions: ["Dragon's Breath Zipline", "Labadee Beach Escape", "Kayak Adventure"]
    },
    { 
      name: "Ocho Rios, Jamaica", 
      category: "caribbean",
      desc: "Dunn’s River Falls and Blue Hole.",
      img: "./assets/ports/ochorios.jpg",
      excursions: ["Dunn’s River Falls", "Blue Hole Adventure", "River Tubing"]
    },
    { 
      name: "Falmouth, Jamaica", 
      category: "caribbean",
      desc: "Historic port and Montego Bay access.",
      img: "./assets/ports/falmouth.jpg",
      excursions: ["Luminous Lagoon", "Beach Resort Day Pass", "Martha Brae Rafting"]
    },
    { 
      name: "Roatán, Honduras", 
      category: "caribbean",
      desc: "Snorkeling and sloths.",
      img: "./assets/ports/roatan.jpg",
      excursions: ["Sloth & Monkey Encounter", "Snorkel Tour", "West Bay Beach"]
    },

    // --- Mexico ---
    { 
      name: "Cozumel, Mexico", 
      category: "mexico",
      desc: "Snorkeling, ruins, and beach clubs.",
      img: "./assets/ports/cozumel.jpg",
      excursions: ["Mr. Sanchos Beach Club", "Mayan Ruins", "Snorkel at Palancar Reef"]
    },
    { 
      name: "Costa Maya, Mexico", 
      category: "mexico",
      desc: "Mayan ruins and beach escapes.",
      img: "./assets/ports/costa_maya.jpg",
      excursions: ["Chacchoben Ruins", "Mahahual Beach Break", "ATV Jungle Ride"]
    },
    { 
      name: "Cabo San Lucas", 
      category: "mexico",
      desc: "The Arch and whale watching.",
      img: "./assets/ports/cabo.jpg",
      excursions: ["Land’s End Boat Tour", "Whale Watching", "Beach Resort Day Pass"]
    },
    { 
      name: "Puerto Vallarta", 
      category: "mexico",
      desc: "Beaches, Malecon, and jungle tours.",
      img: "./assets/ports/puerto_vallarta.jpg",
      excursions: ["Rhythms of the Night", "Zipline Adventure", "City & Tequila Tour"]
    },

    // --- U.S. Ports ---
    { name: "Miami, Florida", category: "us", desc: "World’s busiest cruise port.", img: "./assets/ports/miami.jpg", excursions: [] },
    { name: "Port Canaveral, Florida", category: "us", desc: "Disney, NASA, and beaches.", img: "./assets/ports/port_canaveral.jpg", excursions: [] },
    { name: "Fort Lauderdale", category: "us", desc: "Port Everglades and beaches.", img: "./assets/ports/fort_lauderdale.jpg", excursions: [] },
    { name: "Tampa, Florida", category: "us", desc: "Easy access and great views.", img: "./assets/ports/tampa.jpg", excursions: [] },
    { name: "Galveston, Texas", category: "us", desc: "Western Caribbean gateway.", img: "./assets/ports/galveston.jpg", excursions: [] },

    // --- Canada ---
    { name: "Halifax, Nova Scotia", category: "canada", desc: "Lighthouses and seafood.", img: "./assets/ports/halifax.jpg", excursions: [] },
    { name: "Bar Harbor, Maine", category: "canada", desc: "Acadia National Park.", img: "./assets/ports/bar_harbor.jpg", excursions: [] },
    { name: "Québec City, Québec", category: "canada", desc: "Old‑world charm and culture.", img: "./assets/ports/quebec_city.jpg", excursions: [] },

    // --- Europe ---
    { name: "Barcelona, Spain", category: "europe", desc: "Gaudí architecture and beaches.", img: "./assets/ports/barcelona.jpg", excursions: [] },
    { name: "Civitavecchia (Rome), Italy", category: "europe", desc: "Gateway to Rome.", img: "./assets/ports/rome.jpg", excursions: [] },
    { name: "Santorini, Greece", category: "europe", desc: "Blue domes and sunsets.", img: "./assets/ports/santorini.jpg", excursions: [] },

    // --- Puerto Rico ---
    { name: "San Juan, Puerto Rico", category: "caribbean", desc: "Old San Juan and forts.", img: "./assets/ports/sanjuan.jpg", excursions: [] },

    // --- USVI ---
    { name: "St. Thomas, USVI", category: "caribbean", desc: "Magens Bay and island tours.", img: "./assets/ports/st_thomas.jpg", excursions: [] }
  ];

  // ===============================
  // RENDER FUNCTION
  // ===============================
  const grid = document.getElementById("portGrid");

  function renderPorts(list) {
    grid.innerHTML = "";

    list.forEach(port => {
      const card = document.createElement("div");
      card.className = "port-card fade-in";

      card.innerHTML = `
        <img src="${port.img}" alt="${port.name}" class="port-image" />
        <h3>${port.name}</h3>
        <p>${port.desc}</p>
        <button class="details-btn">View Details</button>
        <div class="details hidden">
          <h4>Excursions</h4>
          <ul>
            ${port.excursions.map(ex => `<li>${ex}</li>`).join("")}
          </ul>
        </div>
      `;

      // Expand/Collapse
      card.querySelector(".details-btn").addEventListener("click", () => {
        const details = card.querySelector(".details");
        details.classList.toggle("hidden");
      });

      grid.appendChild(card);
    });
  }

  // Initial render
  renderPorts(ports);

  // ===============================
  // SEARCH FILTER
  // ===============================
  document.getElementById("portSearch").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = ports.filter(p => p.name.toLowerCase().includes(term));
    renderPorts(filtered);
  });

  // ===============================
  // CATEGORY FILTERS
  // ===============================
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;

      if (category === "all") {
        renderPorts(ports);
      } else {
        renderPorts(ports.filter(p => p.category === category));
      }
    });
  });
}
