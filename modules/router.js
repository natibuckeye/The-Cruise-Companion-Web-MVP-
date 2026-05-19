// ===============================
// ROUTER — Modern ES Version
// ===============================

import { loadTrips } from "./modules/trips.js";
import { loadLists } from "./modules/lists.js";
import { loadPorts } from "./modules/ports.js";
import { loadMatchmaker } from "./modules/matchmaker.js";

// Route → Module mapping
const routes = {
  trips: loadTrips,
  lists: loadLists,
  ports: loadPorts,
  matchmaker: loadMatchmaker
};

// Main router function
export function navigate(routeName) {
  const loader = routes[routeName];

  if (loader) {
    loader();
  } else {
    console.warn(`Router: No module found for route "${routeName}"`);
  }
}

// Initialize router (optional hash support)
export function initRouter() {
  // If you want hash routing later, add it here.
  // For now, this just exists so app.js doesn't break.
  console.log("Router initialized");
}

// Optional: expose route list
export function getRoutes() {
  return Object.keys(routes);
}
