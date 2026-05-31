// ===============================
// BOOKING MODULE
// ===============================

// Placeholder booking request creator
export function createBookingRequest(cruise) {
  console.log("Booking request created:", cruise);

  alert(
    `Booking request created!\n\n` +
    `Cruise Line: ${cruise.line}\n` +
    `Ship: ${cruise.ship}\n` +
    `Itinerary: ${cruise.itinerary}\n\n` +
    `Full booking flow coming soon.`
  );
}

// Opens the booking form (or placeholder)
export function openBookingForm(cruise) {
  createBookingRequest(cruise);
}
