// ===============================
// IMPORT MODULES
// ===============================
import { loadTrips } from "./modules/trips.js";
import { loadMatchmaker } from "./modules/matchmaker.js";
import { loadPorts } from "./modules/ports.js";
import { loadPacking } from "./modules/packing.js";
import { loadTips } from "./modules/tips.js";
import { loadConcierge } from "./modules/concierge.js";

// ===============================
// TAB HANDLING
// ===============================
const tabs = document.querySelectorAll(".tab");
const app = document.getElementById("app");

function clearActiveTabs() {
  tabs.forEach(tab => tab.classList.remove("active"));
}

function loadModule(moduleName) {
  clearActiveTabs();

 switch (moduleName) {
  case "trips":
    document.querySelector('[data-tab="trips"]').classList.add("active");
    loadTrips();
    break;

  case "matchmaker":
    document.querySelector('[data-tab="matchmaker"]').classList.add("active");
    loadMatchmaker();
    break;

  case "ports":
    document.querySelector('[data-tab="ports"]').classList.add("active");
    loadPorts();
    break;

  case "packing":
    document.querySelector('[data-tab="packing"]').classList.add("active");
    loadPacking();
    break;

  case "tips":
    document.querySelector('[data-tab="tips"]').classList.add("active");
    loadTips();
    break;

  case "concierge":
    document.querySelector('[data-tab="concierge"]').classList.add("active");
    loadConcierge();
    break;

  default:
    loadTrips();
}


// ===============================
// TAB CLICK EVENTS
// ===============================
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const moduleName = tab.dataset.tab;
    loadModule(moduleName);
  });
});

// ===============================
// INITIAL LOAD
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  loadModule("trips"); // default module
});
