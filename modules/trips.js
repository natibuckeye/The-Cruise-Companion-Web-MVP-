// ===============================
// TRIPS MODULE — Modern ES Version
// ===============================

import { store, state } from "./store.js";
import { el, openModal, closeModal } from "./ui.js";

export function loadTrips() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const trips = state.trips;

  // Header
  root.appendChild(
    el("div", { class: "row" }, [
      el("h2", {}, ["Your Trips"]),
      el("button", { class: "primary-btn", onclick: openAddTripModal }, [
        "+ Add Trip"
      ])
    ])
  );

  // Trip cards
  const container = el("div", { class: "trip-cards" });

  if (trips.length === 0) {
    container.appendChild(el("p", { class: "empty" }, ["No trips added yet."]));
  } else {
    trips.forEach((trip) => {
      container.appendChild(
        el("div", { class: "trip-card" }, [
          el("h3", {}, [trip.ship]),
          el("p", {}, [`Destination: ${trip.destination}`]),
          el("p", {}, [`Dates: ${trip.dates}`]),
          el(
            "button",
            {
              class: "deleteTripBtn",
              onclick: () => deleteTrip(trip.id)
            },
            ["Delete"]
          )
        ])
      );
    });
  }

  root.appendChild(container);
}

// ===============================
// HELPERS
// ===============================

function openAddTripModal() {
  const modalContent = el("div", { class: "modal-content" }, [
    el("h3", {}, ["Add a Trip"]),

    el("label", {}, ["Ship Name"]),
    el("input", { id: "tripShip", type: "text", placeholder: "Icon of the Seas" }),

    el("label", {}, ["Destination"]),
    el("input", { id: "tripDestination", type: "text", placeholder: "Caribbean" }),

    el("label", {}, ["Dates"]),
    el("input", { id: "tripDates", type: "text", placeholder: "June 12–19, 2026" }),

    el(
      "button",
      { class: "primary-btn", onclick: saveTrip },
      ["Save Trip"]
    ),
    el(
      "button",
      { class: "secondary-btn", onclick: closeModal },
      ["Cancel"]
    )
  ]);

  openModal(modalContent);
}

function saveTrip() {
  const ship = document.getElementById("tripShip").value.trim();
  const destination = document.getElementById("tripDestination").value.trim();
  const dates = document.getElementById("tripDates").value.trim();

  if (!ship || !destination || !dates) {
    alert("Please fill out all fields.");
    return;
  }

  store.addTrip({
    id: crypto.randomUUID(),
    ship,
    destination,
    dates
  });

  closeModal();
  loadTrips();
}

function deleteTrip(id) {
  store.updateTrip(id, { deleted: true });
  state.trips = state.trips.filter((t) => !t.deleted);
  store.save();
  loadTrips();
}
