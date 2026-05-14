// ===============================
// IMPORTS
// ===============================
import { store } from "./store.js";
import { el, openModal, closeModal } from "./ui.js";

// ===============================
// MAIN ENTRY
// ===============================
export function loadLists() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const tripId = store.read("currentTripId");
  const lists = store.list(store.keys.packingLists).filter(l => l.tripId === tripId);

  // HEADER
  root.appendChild(
    el("div", { class: "row" }, [
      el("div", { class: "spacer" }, [
        el("h2", {}, ["Packing Lists"]),
        el("div", { class: "muted" }, ["Organize everything for your cruise."])
      ]),
      el("button", {
        class: "btn",
        onclick: () => openTemplatePicker(tripId)
      }, ["Use a template"]),
      el("button", {
        class: "btn primary",
        onclick: () => openListEditor(tripId)
      }, ["+ New list"])
    ])
  );

  // LISTS
  const container = el("div", { class: "list-container" });

  if (lists.length === 0) {
    container.appendChild(
      el("p", { class: "muted" }, ["No lists yet. Create one to get started."])
    );
  } else {
    lists.forEach(list => {
      container.appendChild(
        el("div", { class: "list-item" }, [
          el("h3", {}, [list.name]),
          el("button", {
            class: "btn small",
            onclick: () => openListDetail(list)
          }, ["Open"])
        ])
      );
    });
  }

  root.appendChild(container);
}

// ===============================
// LIST DETAIL VIEW
// ===============================
function openListDetail(list) {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const items = store.list(store.keys.packingItems).filter(i => i.listId === list.id);

  // HEADER
  root.appendChild(
    el("button", { class: "secondary-btn", onclick: loadLists }, ["← Back"])
  );

  root.appendChild(
    el("h2", { class: "module-title", style: "margin-top: 16px;" }, [list.name])
  );

  // ADD ITEM
  root.appendChild(
    el("button", {
      class: "btn primary",
      onclick: () => openItemEditor(list.id)
    }, ["+ Add item"])
  );

  // ITEMS
  const container = el("div", { class: "item-container" });

  if (items.length === 0) {
    container.appendChild(
      el("p", { class: "muted" }, ["No items yet. Add something!"])
    );
  } else {
    items.forEach(item => {
      container.appendChild(
        el("div", { class: "item-row" }, [
          el("input", {
            type: "checkbox",
            checked: item.checked,
            onchange: () => {
              item.checked = !item.checked;
              store.updatePackingItem(item);
              openListDetail(list);
            }
          }),
          el("span", { class: item.checked ? "checked" : "" }, [item.name]),
          el("button", {
            class: "btn small",
            onclick: () => deleteItem(item.id, list)
          }, ["Delete"])
        ])
      );
    });
  }

  root.appendChild(container);
}

// ===============================
// ITEM EDITOR
// ===============================
function openItemEditor(listId) {
  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Add Item"]),
      el("input", { id: "itemName", placeholder: "Item name" }),
      el("button", {
        class: "primary-btn",
        onclick: () => {
          const name = document.getElementById("itemName").value.trim();
          if (!name) return;

          store.addPackingItem({
            id: crypto.randomUUID(),
            listId,
            name,
            checked: false
          });

          closeModal();
          loadLists();
        }
      }, ["Save"])
    ])
  );
}

// ===============================
// DELETE ITEM
// ===============================
function deleteItem(id, list) {
  store.deletePackingItem(id);
  openListDetail(list);
}

// ===============================
// LIST EDITOR
// ===============================
function openListEditor(tripId) {
  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["New List"]),
      el("input", { id: "listName", placeholder: "List name" }),
      el("button", {
        class: "primary-btn",
        onclick: () => {
          const name = document.getElementById("listName").value.trim();
          if (!name) return;

          store.addPackingList({
            id: crypto.randomUUID(),
            tripId,
            name
          });

          closeModal();
          loadLists();
        }
      }, ["Create"])
    ])
  );
}

// ===============================
// TEMPLATE PICKER
// ===============================
function openTemplatePicker(tripId) {
  const templates = [
    {
      name: "Cruise Essentials",
      items: ["Passport", "SeaPass Lanyard", "Sunscreen", "Swimsuit", "Flip Flops"]
    },
    {
      name: "Beach Day",
      items: ["Towel Clips", "Water Shoes", "Snorkel Gear", "Beach Bag"]
    },
    {
      name: "Excursion Day",
      items: ["Cash", "Water Bottle", "Portable Fan", "GoPro"]
    },
    {
      name: "Formal Night",
      items: ["Dress Shoes", "Dress Shirt", "Belt", "Cologne"]
    }
  ];

  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Choose a Template"]),
      ...templates.map(t =>
        el("button", {
          class: "btn",
          onclick: () => applyTemplate(tripId, t)
        }, [t.name])
      )
    ])
  );
}

function applyTemplate(tripId, template) {
  const listId = crypto.randomUUID();

  store.addPackingList({
    id: listId,
    tripId,
    name: template.name
  });

  template.items.forEach(name => {
    store.addPackingItem({
      id: crypto.randomUUID(),
      listId,
      name,
      checked: false
    });
  });

  closeModal();
  loadLists();
}
