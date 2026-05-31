// ===============================
// BOOKING MODULE
// ===============================

// Creates a placeholder booking request
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

// Opens the booking form (currently just calls the request)
export function openBookingForm(cruise) {
  createBookingRequest(cruise);
}
