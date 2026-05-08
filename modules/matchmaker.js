export function loadMatchmaker() {
  const content = document.getElementById("content");

  // Load previous result
  const saved = JSON.parse(localStorage.getItem("matchmakerResult"));

  content.innerHTML = `
    <h2>Cruise Matchmaker</h2>
    <p>Find your perfect cruise in under 30 seconds.</p>

    <div id="quizContainer" class="quiz-container">

      <!-- Progress Bar -->
      <div class="progress-wrapper">
        <div id="progressBar" class="progress-bar"></div>
      </div>

      <div id="quizStep" class="quiz-step"></div>
    </div>

    <div id="matchResult" class="match-result hidden"></div>

    ${saved ? `
      <div class="previous-result">
        <h3>Your Last Match</h3>
        <p>${saved.line}</p>
        <img src="${saved.image}" class="result-img" />
      </div>
    ` : ""}
  `;

  // QUIZ QUESTIONS
  const questions = [
    {
      text: "What type of cruise experience fits your personality?",
      options: [
        { label: "Relaxed & beachy", value: "relax" },
        { label: "Adventure & thrills", value: "adventure" },
        { label: "Luxury & premium service", value: "luxury" },
        { label: "Family‑focused fun", value: "family" }
      ]
    },
    {
      text: "What’s your ideal cruise length?",
      options: [
        { label: "3–4 nights", value: "short" },
        { label: "5–7 nights", value: "medium" },
        { label: "8+ nights", value: "long" }
      ]
    },
    {
      text: "What matters most to you?",
      options: [
        { label: "Food & dining", value: "food" },
        { label: "Entertainment & shows", value: "entertainment" },
        { label: "Ports & destinations", value: "ports" },
        { label: "Budget‑friendly", value: "budget" }
      ]
    }
  ];

  let step = 0;
  let answers = [];

  // PROGRESS BAR FUNCTION
  function updateProgress() {
    const progress = (step / questions.length) * 100;
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = progress + "%";
  }

  // RENDER EACH STEP
  function renderStep() {
    updateProgress();

    const q = questions[step];
    const quizStep = document.getElementById("quizStep");

    quizStep.classList.add("fade-out");

    setTimeout(() => {
      quizStep.innerHTML = `
        <h3>Step ${step + 1} of ${questions.length}</h3>
        <p>${q.text}</p>
        <div class="options">
          ${q.options.map(o => `
            <button class="option-btn" data-value="${o.value}">
              ${o.label}
            </button>
          `).join("")}
        </div>
      `;

      quizStep.classList.remove("fade-out");
      quizStep.classList.add("fade-in");

      document.querySelectorAll(".option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          answers.push(btn.dataset.value);
          step++;
          if (step < questions.length) {
            renderStep();
          } else {
            showResult();
          }
        });
      });
    }, 200);
  }

  renderStep();

  // SHOW RESULT
  function showResult() {
    const [q1, q2, q3] = answers;

    let score = {
      royal: 0,
      celebrity: 0,
      virgin: 0,
      disney: 0,
      norwegian: 0,
      msc: 0
    };

    // SCORING
    if (q1 === "relax") score.celebrity += 2;
    if (q1 === "adventure") score.royal += 3;
    if (q1 === "luxury") score.celebrity += 3;
    if (q1 === "family") score.disney += 3;

    if (q2 === "short") score.virgin += 2;
    if (q2 === "medium") score.royal += 2;
    if (q2 === "long") score.msc += 2;

    if (q3 === "food") score.celebrity += 2;
    if (q3 === "entertainment") score.norwegian += 2;
    if (q3 === "ports") score.virgin += 2;
    if (q3 === "budget") score.msc += 2;

    const best = Object.keys(score).reduce((a, b) =>
      score[a] > score[b] ? a : b
    );

    const rec = {
      royal: {
        line: "Royal Caribbean",
        desc: "Perfect for adventure, entertainment, and families.",
        image: "https://i.imgur.com/1fXQZyG.jpeg",
        itineraries: [
          "Icon of the Seas — Caribbean",
          "Wonder of the Seas — Bahamas",
          "Quantum Class — Alaska"
        ]
      },
      celebrity: {
        line: "Celebrity Cruises",
        desc: "Ideal for luxury, food lovers, and longer itineraries.",
        image: "https://i.imgur.com/8dJxk2V.jpeg",
        itineraries: [
          "Celebrity Beyond — Mediterranean",
          "Celebrity Ascent — Caribbean",
          "Celebrity Edge — Europe"
        ]
      },
      virgin: {
        line: "Virgin Voyages",
        desc: "Adults‑only, modern, short‑to‑medium cruises.",
        image: "https://i.imgur.com/6p8zJ8D.jpeg",
        itineraries: [
          "Scarlet Lady — Caribbean",
          "Valiant Lady — Mexico",
          "Resilient Lady — Europe"
        ]
      },
      disney: {
        line: "Disney Cruise Line",
        desc: "Perfect for families, kids, and magical experiences.",
        image: "https://i.imgur.com/4tYxQ2E.jpeg",
        itineraries: [
          "Disney Wish — Bahamas",
          "Disney Fantasy — Caribbean",
          "Disney Wonder — Alaska"
        ]
      },
      norwegian: {
        line: "Norwegian Cruise Line",
        desc: "Great entertainment, freestyle dining, and nightlife.",
        image: "https://i.imgur.com/1y8bYpD.jpeg",
        itineraries: [
          "Norwegian Prima — Caribbean",
          "Norwegian Encore — Alaska",
          "Norwegian Viva — Europe"
        ]
      },
      msc: {
        line: "MSC Cruises",
        desc: "Affordable, international, and destination‑focused.",
        image: "https://i.imgur.com/0z8Q3mP.jpeg",
        itineraries: [
          "MSC Seascape — Caribbean",
          "MSC Euribia — Northern Europe",
          "MSC World Europa — Mediterranean"
        ]
      }
    };

    const r = rec[best];

    // Save to localStorage
    localStorage.setItem("matchmakerResult", JSON.stringify(r));

    // Fill result box
    const resultBox = document.getElementById("matchResult");
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <h3>Your Perfect Match: ${r.line}</h3>
      <p>${r.desc}</p>
      <img src="${r.image}" class="result-img" />
      <h4>Recommended Itineraries</h4>
      <ul>
        ${r.itineraries.map(i => `<li>${i}</li>`).join("")}
      </ul>
    `;

    // Set progress bar to 100%
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = "100%";
  }
}
