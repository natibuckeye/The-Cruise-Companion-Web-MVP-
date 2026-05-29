// ===============================
// PACKING LISTS MODULE — Supabase Version
// ===============================

import { supabase } from "./supabase.js";
import { getUser } from "./auth.js";
import { el, openModal, closeModal } from "./ui.js";

// ===============================
// SUPABASE HELPERS
// ===============================
async function fetchLists(tripId) {
  const { data, error } = await supabase
    .from("packing_lists")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (error) console.error(error);
  return data || [];
}

async function fetchItems(listId) {
  const { data, error } = await supabase
    .from("packing_items")
    .select("*")
    .eq("list_id", listId)
    .order("created_at", { ascending: true });

  if (error) console.error(error);
  return data || [];
}

async function createList(list) {
  const { data, error } = await supabase
    .from("packing_lists")
    .insert(list)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

async function createItem(item) {
  const { data, error } = await supabase
    .from("packing_items")
    .insert(item)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

async function updateItem(id, updates) {
  const { data, error } = await supabase
    .from("packing_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) console.error(error);
  return data;
}

async function deleteItem(id) {
  const { error } = await supabase.from("packing_items").delete().eq("id", id);
  if (error) console.error(error);
}

async function deleteList(id) {
  await supabase.from("packing_items").delete().eq("list_id", id);
  await supabase.from("packing_lists").delete().eq("id", id);
}

// ===============================
// MAIN ENTRY
// ===============================
export async function loadLists() {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const user = await getUser();
  if (!user) {
    root.innerHTML = `<p>Please log in to view your packing lists.</p>`;
    return;
  }

  const tripId = localStorage.getItem("current_trip_id");
  if (!tripId) {
    root.innerHTML = `<p>Please select a trip first.</p>`;
    return;
  }

  const lists = await fetchLists(tripId);

  // HEADER
  root.appendChild(
    el("div", { class: "row fade-in" }, [
      el("div", { class: "spacer" }, [
        el("h2", {}, ["Packing Lists"]),
        el("div", { class: "muted" }, ["Organize everything for your cruise."])
      ]),
      el(
        "button",
        { class: "btn", onclick: () => openTemplatePicker(tripId) },
        ["Use a template"]
      ),
      el(
        "button",
        { class: "primary-btn", onclick: () => openListEditor(tripId) },
        ["+ New list"]
      )
    ])
  );

  // LISTS
  const container = el("div", { class: "list-container fade-in" });

  if (lists.length === 0) {
    container.appendChild(
      el("p", { class: "muted" }, ["No lists yet. Create one to get started."])
    );
  } else {
    lists.forEach(list => {
      container.appendChild(
        el("div", { class: "list-item" }, [
          el("h3", {}, [list.name]),
          el("div", { class: "list-actions" }, [
            el(
              "button",
              { class: "btn small", onclick: () => openListDetail(list) },
              ["Open"]
            ),
            el(
              "button",
              {
                class: "btn small danger",
                onclick: () => confirmDeleteList(list.id)
              },
              ["Delete"]
            )
          ])
        ])
      );
    });
  }

  root.appendChild(container);
}

// ===============================
// LIST DETAIL VIEW
// ===============================
async function openListDetail(list) {
  const root = document.getElementById("content");
  root.innerHTML = "";

  const items = await fetchItems(list.id);

  // BACK BUTTON
  root.appendChild(
    el("button", { class: "secondary-btn", onclick: loadLists }, ["← Back"])
  );

  // TITLE
  root.appendChild(
    el("h2", { class: "module-title", style: "margin-top: 16px;" }, [list.name])
  );

  // ADD ITEM BUTTON
  root.appendChild(
    el(
      "button",
      { class: "primary-btn", onclick: () => openItemEditor(list.id) },
      ["+ Add item"]
    )
  );

  // ITEMS
  const container = el("div", { class: "item-container fade-in" });

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
            onchange: async () => {
              await updateItem(item.id, { checked: !item.checked });
              openListDetail(list);
            }
          }),
          el("span", { class: item.checked ? "checked" : "" }, [item.name]),
          el(
            "button",
            {
              class: "btn small danger",
              onclick: () => confirmDeleteItem(item.id, list)
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
// ITEM EDITOR
// ===============================
function openItemEditor(listId) {
  openModal(
    el("div", { class: "modal-content" }, [
      el("h3", {}, ["Add Item"]),
      el("input", { id: "itemName", placeholder: "Item name" }),
      el(
        "button",
        {
          class: "primary-btn",
          onclick: async () => {
            const name = document.getElementById("itemName").value.trim();
            if (!name) return;

            await createItem({
              id: crypto.randomUUID(),
              list_id: listId,
              name,
              checked: false
            });

            closeModal();
            loadLists();
          }
        },
        ["Save"]
      )
    ])
  );
}

// ===============================
// DELETE ITEM
// ===============================
function confirmDeleteItem(id, list) {
  if (!confirm("Delete this item?")) return;
  deleteItem(id).then(() => openListDetail(list));
}

// ===============================
// DELETE LIST
// ===============================
function confirmDeleteList(id) {
  if (!confirm("Delete this list?")) return;
  deleteList(id).then(() => loadLists());
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
        el(
          "button",
          {
            class: "btn",
            onclick: () => applyTemplate(tripId, t)
          },
          [t.name]
        )
      )
    ])
  );
}

async function applyTemplate(tripId, template) {
  const listId = crypto.randomUUID();

  await createList({
    id: listId,
    trip_id: tripId,
    name: template.name
  });

  for (const name of template.items) {
    await createItem({
      id: crypto.randomUUID(),
      list_id: listId,
      name,
      checked: false
    });
  }

  closeModal();
  loadLists();
}
