// ===============================
// PORTS MODULE (Clean + Modern)
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

  // Port data
  const ports = [
    {
      name: "Nassau, Bahamas",
      desc: "Beaches, Atlantis Resort, shopping, and excursions.",
      img: "./assets/ports/nassau.jpg"
    },
    {
      name: "Cozumel, Mexico",
      desc: "Snorkeling, Mayan ruins, beach clubs, and great food.",
      img: "./assets/ports/cozumel.jpg"
    },
    {
      name: "St. Thomas, USVI",
      desc: "Magens Bay, island tours, and duty‑free shopping.",
      img: "./assets/ports/st_thomas.jpg"
    },
    {
      name: "Perfect Day at CocoCay",
      desc: "Thrill Waterpark, beaches, pools, and private cabanas.",
      img: "./assets/ports/cococay.jpg"
    }
  ];

  // Render cards
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
