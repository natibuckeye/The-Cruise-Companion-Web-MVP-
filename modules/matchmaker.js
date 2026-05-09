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
  function show
