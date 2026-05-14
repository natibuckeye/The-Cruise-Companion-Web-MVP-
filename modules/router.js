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

// Optional: expose route list (debugging / future use)
export function getRoutes() {
  return Object.keys(routes);
}
