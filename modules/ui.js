// ===============================
// UI MODULE — Modern ES Version
// ===============================

// ===============================
// ELEMENT CREATOR
// ===============================
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
export function openModal(content) {
  closeModal(); // ensure only one modal exists

  const overlay = el("div", { class: "modal-overlay fade-in" });
  const modal = el("div", { class: "modal" }, [content]);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close when clicking outside modal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

export function closeModal() {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();
}

// ===============================
// SMALL UTILITY HELPERS
// ===============================
export function clear(elm) {
  while (elm.firstChild) elm.removeChild(elm.firstChild);
}

export function text(str) {
  return document.createTextNode(str);
}
