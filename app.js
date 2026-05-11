// ===============================
// IMPORT MODULES
// ===============================
import { loadTrips } from "./modules/trips.js";
import { loadMatchmaker } from "./modules/matchmaker.js";
import { loadPorts } from "./modules/ports.js";
import { loadPacking } from "./modules/packing.js";
import { loadTips } from "./modules/tips.js";
import { loadConcierge } from "./modules/concierge.js";
import { loadLists } from "./modules/lists.js";

import { getTabFromHash, setHash, onHashChange } from "./modules/router.js";

// ===============================
// TAB HANDLING
// ===============================
const tabs = document.querySelectorAll(".tab");

function clearActiveTabs() {
  tabs.forEach(tab => tab.classList.remove("active"));
}

function activateTab(tabName) {
  const tab = document.querySelector(`[data-tab="${tabName}"]`);
  if (tab) tab.classList.add("active");
}

// ===============================
// MODULE LOADER
// ===============================
function loadModule(name) {
  clearActiveTabs();
  activateTab(name);

  switch (name) {
    case "trips":
      loadTrips();
      break;

    case "matchmaker":
      loadMatchmaker();
      break;

    case "ports":
      loadPorts();
      break;

    case "lists":
      loadLists();
      break;

    case "tips":
      loadTips();
      break;

    case "concierge":
      loadConcierge();
      break;

    default:
      loadTrips();
  }
}

// ===============================
// TAB CLICK EVENTS
// ===============================
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const moduleName = tab.dataset.tab;
    setHash(moduleName);     // update URL
    loadModule(moduleName);  // load page
  });
});

// ===============================
// HASH CHANGE (Back/Forward Support)
// ===============================
onHashChange((tab) => {
  loadModule(tab);
});

// ===============================
// INITIAL LOAD
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  const initial = getTabFromHash();
  loadModule(initial);
});
