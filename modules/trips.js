// ===============================
// TRIPS MODULE — Supabase Version
// ===============================

import { supabase } from "./supabase.js";
import { getUser } from "./auth.js";

// ===============================
// SUPABASE HELPERS
// ===============================
async function fetchTrips(userId) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("created_by", userId)
    .order("sail_date", { ascending: true });

  if (error) console.error(error);
  return data || [];
}

async function createTrip(trip) {
  const { data, error } = await supabase
    .from("trips")
    .insert(trip)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

async function updateTrip(id, updates) {
  const { data, error } = await supabase
    .from("trips")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

async function removeTrip(id) {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) console.error(error);
}

// ===============================
// DOM UTILITY
// ===============================
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
export async function loadTrips() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const user = await getUser();
  if (!user) {
    root.innerHTML = `<p>Please log in to view your trips.</p>`;
    return;
  }

  const trips = await fetchTrips(user.id);

  // HEADER
  root.appendChild(
    el("div", { class: "row fade-in" }, [
      el("div", { class: "spacer" }, [
        el("h2", {}, ["My Trips"]),
        el("div", { class: "muted" }, ["Your saved cruises and adventures."])
      ]),
      el(
        "button",
        {
          class: "primary-btn",
          onclick: () => openTripEditor()
        },
        ["+ New Trip"]
      )
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
      container.appendChild(
        el(
          "div",
          { class: "trip-item" },
          [
            el("h3", {}, [trip.title || trip.destination]),
            el("p", { class: "muted" }, [`Ship: ${trip.ship || "—"}`]),
            el("p", { class: "muted" }, [`Dates: ${trip.sail_date} → ${trip.return_date}`]),

            el("div", { class: "trip-actions" }, [
              el(
                "button",
                {
                  class: "btn small",
                  onclick: e => {
                    e.stopPropagation();
                    openTripEditor(trip);
                  }
                },
                ["Edit"]
              ),
              el(
                "button",
                {
                  class: "btn small danger",
                  onclick: e => {
                    e.stopPropagation();
                    confirmDeleteTrip(trip.id);
                  }
                },
                ["Delete"]
              )
            ])
          ]
        )
      );
    });
  }

  root.appendChild(container);
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

      <input id="tripTitle" placeholder="Trip Title" value="${existing?.title || ""}">
      <input id="tripShip" placeholder="Ship" value="${existing?.ship || ""}">
      <input id="tripSail" type="date" value="${existing?.sail_date || ""}">
      <input id="tripReturn" type="date" value="${existing?.return_date || ""}">

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
async function saveTrip(existing, modal) {
  const title = document.getElementById("tripTitle").value.trim();
  const ship = document.getElementById("tripShip").value.trim();
  const sail_date = document.getElementById("tripSail").value;
  const return_date = document.getElementById("tripReturn").value;

  if (!title || !sail_date || !return_date) return;

  const user = await getUser();

  if (existing) {
    await updateTrip(existing.id, { title, ship, sail_date, return_date });
  } else {
    await createTrip({
      id: crypto.randomUUID(),
      title,
      ship,
      sail_date,
      return_date,
      created_by: user.id
    });
  }

  modal.remove();
  loadTrips();
}

// ===============================
// DELETE TRIP
// ===============================
function confirmDeleteTrip(id) {
  if (!confirm("Delete this trip?")) return;
  removeTrip(id).then(() => loadTrips());
}
