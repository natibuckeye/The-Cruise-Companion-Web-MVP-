// ===============================
// PORTS MODULE — Modern ES Version
// ===============================

import { el } from "./ui.js";

export function loadPorts() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  root.appendChild(
    el("h2", { class: "module-title" }, ["Port Explorer"])
  );

  root.appendChild(
    el("div", { class: "module-card" }, [
      el("p", {}, ["Explore ports, excursions, and local tips."])
    ])
  );
}
