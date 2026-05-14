// ===============================
// APP CONTROLLER — Modern ES Version
// ===============================

// ROUTER IMPORT
import { navigate } from "./router.js";

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

      // Route to module
      navigate(target);
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
