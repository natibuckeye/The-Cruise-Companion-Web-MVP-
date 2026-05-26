// ===============================
// TRIPS MODULE
// ===============================

export function loadTrips() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2 class="module-title">Trips</h2>

    <div class="card fade-in">
      <p>Start planning your cruise adventures. Add upcoming trips, track dates, and stay organized.</p>
    </div>

    <div class="trip-item fade-in">
      <h3>Sample Trip</h3>
      <p>Miami → Bahamas (3 Nights)</p>
    </div>
  `;
}


// ===============================
// MAIN ENTRY
// ===============================
export function loadTrips() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const trips = store.list(store.keys.trips);
  const currentTripId = store.read(store.keys.currentTripId);

  // HEADER
  root.appendChild(
    el("div", { class: "row" }, [
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
  const container = el("div", { class: "trip-container" });

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
          el("button", {
            class: "btn small",
            onclick: (e) => {
              e.stopPropagation();
              openTripEditor(trip);
            }
          }, ["Edit"])
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
  store.save(store.keys.currentTripId, id);
  loadTrips();
}

// ===============================
// TRIP EDITOR (CREATE + EDIT)
// ===============================
function openTripEditor(existing = null) {
  const isEdit = !!existing;

  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, [isEdit ? "Edit Trip" : "New Trip"]),

      el("input", {
        id: "tripDestination",
        placeholder: "Destination",
        value: existing?.destination || ""
      }),

      el("input", {
        id: "tripShip",
        placeholder: "Ship",
        value: existing?.ship || ""
      }),

      el("input", {
        id: "tripDates",
        placeholder: "Dates (e.g., June 12–18)",
        value: existing?.dates || ""
      }),

      el("button", {
        class: "primary-btn",
        onclick: () => saveTrip(existing)
      }, [isEdit ? "Save Changes" : "Create Trip"])
    ])
  );
}

// ===============================
// SAVE TRIP
// ===============================
function saveTrip(existing) {
  const destination = document.getElementById("tripDestination").value.trim();
  const ship = document.getElementById("tripShip").value.trim();
  const dates = document.getElementById("tripDates").value.trim();

  if (!destination || !ship || !dates) return;

  if (existing) {
    store.updateTrip(existing.id, { destination, ship, dates });
  } else {
    store.addTrip({
      id: crypto.randomUUID(),
      destination,
      ship,
      dates
    });
  }

  closeModal();
  loadTrips();
}
