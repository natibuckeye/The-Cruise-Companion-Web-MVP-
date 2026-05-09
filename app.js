import { loadHome } from "./module/home.js";
import { loadDestinations } from "./module/destinations.js";
import { loadMatchmaker } from "./module/matchmaker.js";
import { loadDeals } from "./module/deals.js";
import { loadTips } from "./module/tips.js";


function setActive(link) {
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
  link.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  // Default page
  loadHome();

  document.getElementById("nav-home").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadHome();
  });

  document.getElementById("nav-destinations").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadDestinations();
  });

  document.getElementById("nav-matchmaker").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadMatchmaker();   // ENSURES PNG LOGOS LOAD
  });

  document.getElementById("nav-deals").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadDeals();
  });

  document.getElementById("nav-tips").addEventListener("click", (e) => {
    e.preventDefault();
    setActive(e.target);
    loadTips();
  });
});
