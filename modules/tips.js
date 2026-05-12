// ===============================
// TIPS MODULE — Modern ES Version
// ===============================

import { el } from "./ui.js";

export function loadTips() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title" }, ["Cruise Tips"])
  );

  root.appendChild(
    el("div", { class: "module-card" }, [
      el("p", {}, ["Helpful cruise tips and tricks will appear here."])
    ])
  );
}
