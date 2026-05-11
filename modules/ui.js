// ===============================
// UI MODULE — Modern ES Version
// ===============================

// Create an element with attributes + children
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  // Apply attributes
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") {
      node.className = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2), value);
    } else if (value !== false && value !== null && value !== undefined) {
      node.setAttribute(key, String(value));
    }
  }

  // Append children
  for (const child of [].concat(children)) {
    if (child instanceof Node) {
      node.appendChild(child);
    } else if (child !== null && child !== undefined) {
      node.appendChild(document.createTextNode(String(child)));
    }
  }

  return node;
}

// ===============================
// MODAL SYSTEM
// ===============================

// Opens a modal with provided content
export function openModal(content) {
  closeModal(); // ensure only one modal exists

  const overlay = el("div", { class: "modal-overlay" });
  const modal = el("div", { class: "modal" }, [content]);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

// Close any open modal
export function closeModal() {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();
}

// ===============================
// SMALL UTILITY HELPERS
// ===============================

// Clear a DOM element
export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// Create a simple text node
export function text(str) {
  return document.createTextNode(str);
}
