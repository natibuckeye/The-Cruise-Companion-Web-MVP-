// ===============================
// IMPORTS
// ===============================
import { store } from "./store.js";
import { el, openModal, closeModal } from "./ui.js";

// ===============================
// MAIN PAGE LOADER
// ===============================
export function loadLists() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const state = store.state; // unified global state

  const tripId = state.ui.currentTripId;
  const listsAll = store.list(store.keys.packingLists);
  const lists = tripId ? listsAll.filter(l => l.tripId === tripId) : [];

  // ===============================
  // HEADER
  // ===============================
  const header = el("div", { class: "row" }, [
    el("div", { class: "spacer" }, [
      el("h2", {}, ["Lists"]),
      el("div", { class: "muted" }, ["Packing lists, minus the chaos."])
    ]),
    el("button", {
      class: "btn",
      onclick: () => {
        if (!tripId) {
          alert("Pick a trip first (top right).");
          return;
        }
        openTemplatePicker({ state });
      }
    }, ["Use a template"]),
    el("button", {
      class: "btn primary",
      onclick: () => {
        if (!tripId) {
          alert("Pick a trip first (top right).");
          return;
        }
        openListEditor({ state });
      }
    }, ["+ New list"])
  ]);

  root.appendChild(header);

  // ===============================
  // LIST ITEMS
  // ===============================
  const listContainer = el("div", { class: "list-container" });

  if (lists.length === 0) {
    listContainer.appendChild(
      el("p", { class: "muted" }, ["No lists yet. Create one to get started."])
    );
  } else {
    lists.forEach(list => {
      const item = el("div", { class: "list-item" }, [
        el("h3", {}, [list.name]),
        el("button", {
          class: "btn small",
          onclick: () => openListEditor({ state, list })
        }, ["Edit"])
      ]);
      listContainer.appendChild(item);
    });
  }

  root.appendChild(listContainer);
}
