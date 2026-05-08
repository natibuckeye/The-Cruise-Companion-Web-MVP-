export function loadConcierge() {
  document.getElementById("app").innerHTML = `
    <h2 class="module-title">Concierge Assistant</h2>

    <div class="concierge-box">
      <label for="conciergeInput">How can I help with your cruise?</label>
      <textarea id="conciergeInput" placeholder="Ask anything about your cruise..."></textarea>

      <button id="conciergeSubmit">Ask Concierge</button>

      <div id="conciergeResponse" class="concierge-response" style="display:none;">
      </div>
    </div>
  `;

  // Simple placeholder response logic
  document.getElementById("conciergeSubmit").addEventListener("click", () => {
    const input = document.getElementById("conciergeInput").value.trim();
    const responseBox = document.getElementById("conciergeResponse");

    if (!input) {
      responseBox.style.display = "block";
      responseBox.innerHTML = "Please enter a question so I can help.";
      return;
    }

    responseBox.style.display = "block";
    responseBox.innerHTML = `
      <strong>Concierge Response:</strong><br>
      Thanks for your question! A more advanced concierge system will be added soon.
    `;
  });
}
