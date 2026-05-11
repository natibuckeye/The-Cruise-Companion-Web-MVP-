// ===============================
// ROUTER — Modern ES Module
// ===============================

// Allowed tabs in your app
const allowedTabs = new Set([
  "trips",
  "matchmaker",
  "ports",
  "lists",
  "tips",
  "concierge"
]);

// ===============================
// Get current tab from URL hash
// ===============================
export function getTabFromHash() {
  const hash = location.hash.replace("#", "").trim();
  return allowedTabs.has(hash) ? hash : "trips";
}

// ===============================
// Update URL hash when user clicks a tab
// ===============================
export function setHash(tab) {
  if (allowedTabs.has(tab)) {
    location.hash = tab;
  }
}

// ===============================
// Listen for browser back/forward navigation
// ===============================
export function onHashChange(callback) {
  window.addEventListener("hashchange", () => {
    const tab = getTabFromHash();
    callback(tab);
  });
}
