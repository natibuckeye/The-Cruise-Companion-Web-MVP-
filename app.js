// ===============================
// APP CONTROLLER — Modern ES Version
// ===============================

// MODULE IMPORTS
import { loadTrips } from "./modules/trips.js";
import { loadLists } from "./modules/lists.js";
import { loadPorts } from "./modules/ports.js";
import { loadMatchmaker } from "./modules/matchmaker.js";

// ===============================
// ROUTER
// ===============================
const routes = {
  trips: loadTrips,
  lists: loadLists,
  ports: loadPorts,
  matchmaker: loadMatchmaker
};

export function loadModule(name) {
  const loader = routes[name];
  if (loader) loader();
  else console.warn(`No module found for: ${name}`);
}

// ===============================
// TAB NAVIGATION
// ===============================
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Load module
      loadModule(target);
    });
  });
}

// ===============================
// INITIALIZE APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();

  // Default tab on first load
  const defaultTab = document.querySelector('.tab[data-tab="trips"]');
  if (defaultTab) defaultTab.click();
});
