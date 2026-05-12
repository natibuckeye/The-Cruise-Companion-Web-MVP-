// ===============================
// CONCIERGE MODULE — Modern ES Version
// ===============================

import { el } from "./ui.js";

export function loadConcierge() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title" }, ["Concierge Assistant"])
  );

  const box = el("div", { class: "concierge-box" }, [
    el("label", { for: "conciergeInput" }, ["How can I help with your cruise?"]),
    el("textarea", {
      id: "conciergeInput",
      placeholder: "Ask anything about your cruise..."
    }),
    el("button", { id: "conciergeSubmit", onclick: handleSubmit }, [
      "Ask Concierge"
    ]),
    el("div", {
      id: "conciergeResponse",
      class: "concierge-response",
      style: "display:none;"
    })
  ]);

  root.appendChild(box);
}

function handleSubmit() {
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
}
