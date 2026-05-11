// ===============================
// STORE MODULE — Modern ES Version
// ===============================

// Namespace for localStorage keys
const NS = "tcc:v1:";

// Global application state
export const state = {
  ui: {
    currentTripId: null
  },
  trips: [],
  packingLists: []
};

// ===============================
// LOCAL STORAGE HELPERS
// ===============================
function read(key, fallback) {
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
    packingLists: "packingLists"
  },

  // Load all persisted data into memory
  init() {
    state.trips = read(this.keys.trips, []);
    state.packingLists = read(this.keys.packingLists, []);
  },

  // Save all state back to localStorage
  save() {
    write(this.keys.trips, state.trips);
    write(this.keys.packingLists, state.packingLists);
  },

  // Generic getter
  list(key) {
    return read(key, []);
  },

  // Generic setter
  set(key, value) {
    write(key, value);
  },

  // Trip helpers
  addTrip(trip) {
    state.trips.push(trip);
    this.save();
  },

  updateTrip(id, updates) {
    const t = state.trips.find(t => t.id === id);
    if (t) Object.assign(t, updates);
    this.save();
  },

  // Packing list helpers
  addPackingList(list) {
    state.packingLists.push(list);
    this.save();
  },

  updatePackingList(id, updates) {
    const l = state.packingLists.find(l => l.id === id);
    if (l) Object.assign(l, updates);
    this.save();
  }
};

// Initialize store on module load
store.init();
