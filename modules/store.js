// ===============================
// STORE MODULE — Modern ES Version
// ===============================

// Namespace for localStorage keys
const NS = "tcc:v1:";

// ===============================
// LOCAL STORAGE HELPERS
// ===============================
function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(NS + key, JSON.stringify(value));
}

// ===============================
// STORE API
// ===============================
export const store = {
  // Key map for consistency
  keys: {
    trips: "trips",
    packingLists: "packingLists",
    packingItems: "packingItems",
    currentTripId: "currentTripId"
  },

  // Generic read/write
  read(key, fallback = null) {
    return read(key, fallback);
  },

  save(key, value) {
    write(key, value);
  },

  // Generic getter
  list(key) {
    return read(key, []);
  },

  // Generic setter
  set(key, value) {
    write(key, value);
  },

  // ===============================
  // TRIPS
  // ===============================
  addTrip(trip) {
    const trips = this.list(this.keys.trips);
    trips.push(trip);
    this.save(this.keys.trips, trips);
  },

  updateTrip(id, updates) {
    const trips = this.list(this.keys.trips).map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.save(this.keys.trips, trips);
  },

  // ===============================
  // PACKING LISTS
  // ===============================
  addPackingList(list) {
    const lists = this.list(this.keys.packingLists);
    lists.push(list);
    this.save(this.keys.packingLists, lists);
  },

  updatePackingList(id, updates) {
    const lists = this.list(this.keys.packingLists).map(l =>
      l.id === id ? { ...l, ...updates } : l
    );
    this.save(this.keys.packingLists, lists);
  },

  // ===============================
  // PACKING ITEMS
  // ===============================
  addPackingItem(item) {
    const items = this.list(this.keys.packingItems);
    items.push(item);
    this.save(this.keys.packingItems, items);
  },

  updatePackingItem(updated) {
    const items = this.list(this.keys.packingItems).map(i =>
      i.id === updated.id ? updated : i
    );
    this.save(this.keys.packingItems, items);
  },

  deletePackingItem(id) {
    const items = this.list(this.keys.packingItems).filter(i => i.id !== id);
    this.save(this.keys.packingItems, items);
  }
};
