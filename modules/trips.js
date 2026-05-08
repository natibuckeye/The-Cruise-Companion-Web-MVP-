export function loadTrips() {
  const content = document.getElementById("content");

  // Load saved trips from localStorage
  const savedTrips = JSON.parse(localStorage.getItem("trips")) || [];

  content.innerHTML = `
    <h2>Your Trips</h2>

    <button id="addTripBtn" class="primary-btn">+ Add Trip</button>

    <div id="tripsContainer" class="trip-cards">
      ${savedTrips.length === 0 ? `
        <p class="empty">No trips added yet.</p>
      ` : savedTrips.map((trip, index) => `
        <div class="trip-card">
          <h3>${trip.ship}</h3>
          <p><strong>Destination:</strong> ${trip.destination}</p>
          <p><strong>Dates:</strong> ${trip.dates}</p>
          <button class="deleteTripBtn" data-index="${index}">Delete</button>
        </div>
      `).join("")}
    </div>

    <div id="tripModal" class="modal hidden">
      <div class="modal-content">
        <h3>Add a Trip</h3>

        <label>Ship Name</label>
        <input id="tripShip" type="text" placeholder="Icon of the Seas">

        <label>Destination</label>
        <input id="tripDestination" type="text" placeholder="Caribbean">

        <label>Dates</label>
        <input id="tripDates" type="text" placeholder="June 12–19, 2026">

        <button id="saveTripBtn" class="primary-btn">Save Trip</button>
        <button id="closeTripModal" class="secondary-btn">Cancel</button>
      </div>
    </div>
  `;

  // Add Trip button
  document.getElementById("addTripBtn").addEventListener("click", () => {
    document.getElementById("tripModal").classList.remove("hidden");
  });

  // Close modal
  document.getElementById("closeTripModal").addEventListener("click", () => {
    document.getElementById("tripModal").classList.add("hidden");
  });

  // Save trip
  document.getElementById("saveTripBtn").addEventListener("click", () => {
    const ship = document.getElementById("tripShip").value.trim();
    const destination = document.getElementById("tripDestination").value.trim();
    const dates = document.getElementById("tripDates").value.trim();

    if (!ship || !destination || !dates) {
      alert("Please fill out all fields.");
      return;
    }

    const newTrip = { ship, destination, dates };
    savedTrips.push(newTrip);

    localStorage.setItem("trips", JSON.stringify(savedTrips));

    loadTrips(); // reload UI
  });

  // Delete trip
  document.querySelectorAll(".deleteTripBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      savedTrips.splice(index, 1);
      localStorage.setItem("trips", JSON.stringify(savedTrips));
      loadTrips();
    });
  });
}
