// ===============================
// MODULE IMPORTS
// ===============================
import { loadTrips } from "./modules/trips.js";
import { loadLists } from "./modules/lists.js";
import { loadPorts } from "./modules/ports.js";
import { loadMatchmaker } from "./modules/matchmaker.js";
import { loadLogin } from "./modules/login.js";

// ===============================
// ROUTER MAP (single clean version)
// ===============================
const routes = {
  trips: loadTrips,
  lists: loadLists,
  ports: loadPorts,
  matchmaker: loadMatchmaker,
  login: loadLogin
};

// ===============================
// NAVIGATION
// ===============================
export function navigate(page) {
  const loader = routes[page];

  if (loader) {
    loader();
  } else {
    console.error(`Unknown page: ${page}`);
  }
}

// ===============================
// TAB INITIALIZATION
// ===============================
function initTabs() {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Navigate to module
      navigate(target);
    });
  });
}

// ===============================
// INITIALIZE APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  // Load default tab
  const defaultTab = document.querySelector('.tab[data-tab="trips"]');

  if (defaultTab) {
    defaultTab.classList.add("active");
    navigate("trips");
  }
});
