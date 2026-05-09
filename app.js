import { loadTrips } from "./modules/trips.js";
import { loadMatchmaker } from "./modules/matchmaker.js";
import { loadPorts } from "./modules/ports.js";
import { loadPacking } from "./modules/packing.js";
import { loadTips } from "./modules/tips.js";
import { loadConcierge } from "./modules/concierge.js";

function setActive(link) {
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
  link.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {

  // Default page
  loadTrips();

  document.getElementById("nav-trips").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadTrips();
  });

  document.getElementById("nav-matchmaker").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadMatchmaker();
  });

  document.getElementById("nav-ports").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadPorts();
  });

  document.getElementById("nav-packing").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadPacking();
  });

  document.getElementById("nav-tips").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadTips();
  });

  document.getElementById("nav-concierge").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadConcierge();
  });

});
