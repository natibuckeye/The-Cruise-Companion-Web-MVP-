// ===============================
// MATCHMAKER MODULE (Clean + Modern)
// ===============================

export function loadMatchmaker() {
  const content = document.getElementById("content");
  content.innerHTML = "";

  // Header
  content.innerHTML = `
    <h2 class="module-title fade-in">Cruise Matchmaker</h2>

    <div class="card fade-in">
      <p>Explore cruise lines and discover which one fits your travel style.</p>
    </div>

    <div id="matchGrid" class="compare-grid fade-in"></div>
  `;

  // Cruise line data
  const cruiseLines = [
    {
      name: "Royal Caribbean",
      desc: "Adventure‑focused ships, perfect for families and thrill‑seekers.",
      logo: "./assets/logos/royal_caribbean.svg"
    },
    {
      name: "Celebrity Cruises",
      desc: "Modern luxury with elevated dining and premium experiences.",
      logo: "./assets/logos/celebrity.svg"
    },
    {
      name: "Virgin Voyages",
      desc: "Adults‑only, modern, bold, and nightlife‑focused.",
      logo: "./assets/logos/virgin_voyages.svg"
    },
    {
      name: "Disney Cruise Line",
      desc: "Family‑focused magic with unmatched entertainment.",
      logo: "./assets/logos/disney.svg"
    },
    {
      name: "Norwegian (NCL)",
      desc: "Freestyle cruising with flexible dining and entertainment.",
      logo: "./assets/logos/ncl.svg"
    },
    {
      name: "MSC Cruises",
      desc: "European‑style cruising with beautiful ships and great value.",
      logo: "./assets/logos/msc.svg"
    }
  ];

  // Render cards
  const grid = document.getElementById("matchGrid");

  cruiseLines.forEach(line => {
    const card = document.createElement("div");
    card.className = "compare-card fade-in";

    card.innerHTML = `
      <img src="${line.logo}" alt="${line.name} Logo" class="result-logo" />
      <h3>${line.name}</h3>
      <p>${line.desc}</p>
    `;

    grid.appendChild(card);
  });
}
