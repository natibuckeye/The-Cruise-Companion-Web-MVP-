// ===============================
// TRIPS MODULE (Advanced Version)
// ===============================

// LocalStorage Keys
const TRIPS_KEY = "cruise_trips";
const CURRENT_TRIP_KEY = "current_trip_id";

// Utility: Load trips from localStorage
function getTrips() {
  return JSON.parse(localStorage.getItem(TRIPS_KEY)) || [];
}

// Utility: Save trips to localStorage
function saveTrips(trips) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

// Utility: Set active trip
function setCurrentTrip(id) {
  localStorage.setItem(CURRENT_TRIP_KEY, id);
}

// Utility: Get active trip
function getCurrentTrip() {
  return localStorage.getItem(CURRENT_TRIP_KEY);
}

// Utility: Create DOM element
function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "class") element.className = value;
    else if (key.startsWith("on")) element.addEventListener(key.substring(2), value);
    else element.setAttribute(key, value);
  });
  children.forEach(child => {
    if (typeof child === "string") element.appendChild(document.createTextNode(child));
    else element.appendChild(child);
  });
  return element;
}

// ===============================
// MAIN ENTRY
// ===============================
export function loadTrips() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const trips = getTrips();
  const currentTripId = getCurrentTrip();

  // HEADER
  root.appendChild(
    el("div", { class: "row fade-in" }, [
      el("div", { class: "spacer" }, [
        el("h2", {}, ["My Trips"]),
        el("div", { class: "muted" }, ["Your saved cruises and adventures."])
      ]),
      el("button", {
        class: "btn primary",
        onclick: () => openTripEditor()
      }, ["+ New Trip"])
    ])
  );

  // TRIP LIST
  const container = el("div", { class: "trip-container fade-in" });

  if (trips.length === 0) {
    container.appendChild(
      el("p", { class: "muted" }, ["No trips yet. Create one to get started."])
    );
  } else {
    trips.forEach(trip => {
      const isActive = trip.id === currentTripId;

      container.appendChild(
        el("div", {
          class: `trip-item ${isActive ? "active" : ""}`,
          onclick: () => selectTrip(trip.id)
        }, [
          el("h3", {}, [trip.destination]),
          el("p", { class: "muted" }, [`Ship: ${trip.ship}`]),
          el("p", { class: "muted" }, [`Dates: ${trip.dates}`]),

          el("div", { class: "trip-actions" }, [
            el("button", {
              class: "btn small",
              onclick: (e) => {
                e.stopPropagation();
                openTripEditor(trip);
              }
            }, ["Edit"]),

            el("button", {
              class: "btn small danger",
              onclick: (e) => {
                e.stopPropagation();
                deleteTrip(trip.id);
              }
            }, ["Delete"])
          ])
        ])
      );
    });
  }

  root.appendChild(container);
}

// ===============================
// SELECT TRIP
// ===============================
function selectTrip(id) {
  setCurrentTrip(id);
  loadTrips();
}

// ===============================
// TRIP EDITOR (CREATE + EDIT)
// ===============================
function openTripEditor(existing = null) {
  const isEdit = !!existing;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal fade-in">
      <h3>${isEdit ? "Edit Trip" : "New Trip"}</h3>

      <input id="tripDestination" placeholder="Destination" value="${existing?.destination || ""}">
      <input id="tripShip" placeholder="Ship" value="${existing?.ship || ""}">
      <input id="tripDates" placeholder="Dates (e.g., June 12–18)" value="${existing?.dates || ""}">

      <button class="primary-btn" id="saveTripBtn">
        ${isEdit ? "Save Changes" : "Create Trip"}
      </button>

      <button class="btn small" id="closeModalBtn">Cancel</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeModalBtn").onclick = () => modal.remove();
  document.getElementById("saveTripBtn").onclick = () => saveTrip(existing, modal);
}

// ===============================
// SAVE TRIP
// ===============================
function saveTrip(existing, modal) {
  const destination = document.getElementById("tripDestination").value.trim();
  const ship = document.getElementById("tripShip").value.trim();
  const dates = document.getElementById("tripDates").value.trim();

  if (!destination || !ship || !dates) return;

  const trips = getTrips();

  if (existing) {
    // Update existing trip
    const index = trips.findIndex(t => t.id === existing.id);
    trips[index] = { ...existing, destination, ship, dates };
  } else {
    // Create new trip
    trips.push({
      id: crypto.randomUUID(),
      destination,
      ship,
      dates
    });
  }

  saveTrips(trips);
  modal.remove();
  loadTrips();
}

// ===============================
// DELETE TRIP
// ===============================
function deleteTrip(id) {
  const trips = getTrips().filter(t => t.id !== id);
  saveTrips(trips);

  if (getCurrentTrip() === id) {
    localStorage.removeItem(CURRENT_TRIP_KEY);
  }

  loadTrips();
}
