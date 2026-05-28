// ===============================
// PORTS MODULE (Auto‑Synced to GitHub Files)
// ===============================

export function loadPorts() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  content.innerHTML = `
    <h2 class="module-title fade-in">Ports & Destinations</h2>

    <div class="card fade-in">
      <p>Explore port guides, tips, and must‑see attractions for your upcoming cruise stops.</p>
    </div>

    <div id="portGrid" class="port-grid fade-in"></div>
  `;

  // ===============================
  // PORT DATA (Matches GitHub EXACTLY)
  // ===============================
  const ports = [
    // Caribbean & Bahamas
    { name: "Nassau, Bahamas", desc: "Atlantis, beaches, and shopping.", img: "./assets/ports/nassau.jpg" },
    { name: "CocoCay (Royal Caribbean)", desc: "Perfect Day private island.", img: "./assets/ports/cococay.jpg" },
    { name: "Amber Cove, Dominican Republic", desc: "Pools, zipline, and mountain views.", img: "./assets/ports/amber_cove.jpg" },
    { name: "Labadee, Haiti", desc: "Private beaches and the Dragon's Breath zipline.", img: "./assets/ports/labadee.jpg" },
    { name: "Freeport, Bahamas", desc: "Laid‑back beaches and markets.", img: "./assets/ports/freeport.jpg" },

    // Jamaica
    { name: "Ocho Rios, Jamaica", desc: "Dunn’s River Falls and Blue Hole.", img: "./assets/ports/ochorios.jpg" },
    { name: "Falmouth, Jamaica", desc: "Historic port and Montego Bay access.", img: "./assets/ports/falmouth.jpg" },

    // Mexico (Caribbean)
    { name: "Cozumel, Mexico", desc: "Snorkeling, ruins, and beach clubs.", img: "./assets/ports/cozumel.jpg" },
    { name: "Costa Maya, Mexico", desc: "Mayan ruins and beach escapes.", img: "./assets/ports/costa_maya.jpg" },

    // Mexico (Pacific)
    { name: "Cabo San Lucas", desc: "The Arch and whale watching.", img: "./assets/ports/cabo.jpg" },
    { name: "Puerto Vallarta", desc: "Beaches, Malecon, and jungle tours.", img: "./assets/ports/puerto_vallarta.jpg" },

    // US Departure Ports
    { name: "Miami, Florida", desc: "World’s busiest cruise port.", img: "./assets/ports/miami.jpg" },
    { name: "Port Canaveral, Florida", desc: "Disney, NASA, and beaches.", img: "./assets/ports/port_canaveral.jpg" },
    { name: "Fort Lauderdale", desc: "Port Everglades and beaches.", img: "./assets/ports/fort_lauderdale.jpg" },
    { name: "Tampa, Florida", desc: "Easy access and great views.", img: "./assets/ports/tampa.jpg" },
    { name: "Galveston, Texas", desc: "Western Caribbean gateway.", img: "./assets/ports/galveston.jpg" },

    // Canada & New England
    { name: "Halifax, Nova Scotia", desc: "Lighthouses and seafood.", img: "./assets/ports/halifax.jpg" },
    { name: "Bar Harbor, Maine", desc: "Acadia National Park.", img: "./assets/ports/bar_harbor.jpg" },
    { name: "Québec City, Québec", desc: "Old‑world charm and culture.", img: "./assets/ports/quebec_city.jpg" },

    // Mediterranean
    { name: "Barcelona, Spain", desc: "Gaudí architecture and beaches.", img: "./assets/ports/barcelona.jpg" },
    { name: "Civitavecchia (Rome), Italy", desc: "Gateway to Rome.", img: "./assets/ports/rome.jpg" },
    { name: "Santorini, Greece", desc: "Blue domes and sunsets.", img: "./assets/ports/santorini.jpg" },
    { name: "St. Thomas, USVI", desc: "Magens Bay and island tours.", img: "./assets/ports/st_thomas.jpg" },

    // Puerto Rico
    { name: "San Juan, Puerto Rico", desc: "Old San Juan and forts.", img: "./assets/ports/sanjuan.jpg" },

    // Honduras
    { name: "Roatán, Honduras", desc: "Snorkeling and sloths.", img: "./assets/ports/roatan.jpg" }
  ];

  // ===============================
  // RENDER CARDS
  // ===============================
  const grid = document.getElementById("portGrid");

  ports.forEach(port => {
    const card = document.createElement("div");
    card.className = "port-card fade-in";

    card.innerHTML = `
      <img src="${port.img}" alt="${port.name}" class="port-image" />
      <h3>${port.name}</h3>
      <p>${port.desc}</p>
    `;

    grid.appendChild(card);
  });
}
