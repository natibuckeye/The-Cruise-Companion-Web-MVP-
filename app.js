// ===============================
// IMPORT MODULES
// ===============================
import { loadTrips } from "./modules/trips.js";
import { loadLists } from "./modules/lists.js";
import { loadPorts } from "./modules/ports.js";
import { loadMatchmaker } from "./modules/matchmaker.js";

// ===============================
// ROUTER MAP
// ===============================
const routes = {
  trips: loadTrips,
  lists: loadLists,
  ports: loadPorts,
  matchmaker: loadMatchmaker
};

// ===============================
// INIT TABS
// ===============================
function initTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Update active tab styling
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Load module
      navigate(target);
    });
  });
}

// ===============================
// NAVIGATION
// ===============================
export function navigate(page) {
  const loader = routes[page];

  if (loader) {
    loader(); // Load the correct module
  } else {
    console.error("Unknown page:", page);
  }
}

// ===============================
// INITIALIZE APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  // Load default tab (Trips)
  const defaultTab = document.querySelector('.tab[data-tab="trips"]');
  if (defaultTab) {
    defaultTab.classList.add("active");
    navigate("trips");
  }
});
