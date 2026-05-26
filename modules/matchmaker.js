// ===============================
// MATCHMAKER MODULE — WITH LOGOS
// ===============================

export function loadMatchmaker() {
  const content = document.getElementById("content");

  // Cruise line data
  const cruiseLines = [
    {
      name: "Royal Caribbean",
      logo: "./assets/logos/royal_caribbean.svg",
      desc: "Adventure‑focused ships, perfect for families and thrill‑seekers."
    },
    {
      name: "Celebrity Cruises",
      logo: "./assets/logos/celebrity.svg",
      desc: "Modern luxury with elevated dining and premium experiences."
    },
    {
      name: "Virgin Voyages",
      logo: "./assets/logos/virgin_voyages.svg",
      desc: "Adults‑only, modern, bold, and nightlife‑focused."
    },
    {
      name: "Disney Cruise Line",
      logo: "./assets/logos/disney.svg",
      desc: "Family‑focused magic with unmatched entertainment."
    },
    {
      name: "Norwegian (NCL)",
      logo: "./assets/logos/ncl.svg",
      desc: "Freestyle cruising with flexible dining and entertainment."
    },
    {
      name: "MSC Cruises",
      logo: "./assets/logos/msc.svg",
      desc: "European‑style cruising with beautiful ships and great value."
    }
  ];

  // Render UI
  content.innerHTML = `
    <h2 class="module-title">Cruise Matchmaker</h2>

    <div class="card fade-in">
      <p>Select a cruise line to preview its style and personality.</p>
    </div>

    <div class="compare-grid fade-in">
      ${cruiseLines
        .map(
          line => `
        <div class="compare-card">
          <img src="${line.logo}" alt="${line.name} Logo" class="result-logo" />
          <h3>${line.name}</h3>
          <p>${line.desc}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}
