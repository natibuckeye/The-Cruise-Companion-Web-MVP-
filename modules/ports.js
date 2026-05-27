// modules/ports.js

const STORAGE_KEY = 'cc_ports_state_v1';

const PORTS = [
  {
    id: 'nassau',
    name: 'Nassau',
    country: 'Bahamas',
    region: 'Caribbean',
    vibeTags: ['Beach', 'Shopping', 'History'],
    shortDescription: 'Classic Bahamas port with beaches, forts, and easy DIY days.',
    mustDo: [
      'Walk to Junkanoo Beach or take a short cab to Cable Beach',
      'Explore the Queen’s Staircase & Fort Fincastle',
      'Straw Market + Bay Street for quick shopping'
    ],
    foodIdeas: [
      'Conch fritters + Kalik beer at a beach bar',
      'Fish fry at Arawak Cay (if time allows)'
    ],
    rainyDayIdeas: [
      'Pirates of Nassau Museum',
      'Rum tasting or chocolate factory tour'
    ],
    safetyNotes: 'Stay in busy, touristy areas; agree taxi fares up front.',
    accessibility: 'Sidewalks can be uneven; many attractions reachable by short taxi rides.',
    imageUrl: './assets/ports/nassau.jpg',      // <- put your .jpg here
    mapUrl: 'https://maps.app.goo.gl/xxxxxxxx'  // optional deep link
  },
  {
    id: 'cozumel',
    name: 'Cozumel',
    country: 'Mexico',
    region: 'Caribbean',
    vibeTags: ['Snorkeling', 'Beach Clubs', 'Food'],
    shortDescription: 'Easy beach‑club day or quick town wander with great tacos.',
    mustDo: [
      'Pick one beach club and stay put (Mr. Sanchos, Nachi Cocom, etc.)',
      'If in town: stroll the waterfront and main square'
    ],
    foodIdeas: [
      'Tacos al pastor in San Miguel',
      'Fresh ceviche at a waterfront restaurant'
    ],
    rainyDayIdeas: [
      'Long lunch + margaritas in town',
      'Spa day at an all‑inclusive beach club'
    ],
    safetyNotes: 'Tourist areas are generally comfortable; use licensed taxis from port.',
    accessibility: 'Most beach clubs have some steps; check ahead if mobility is limited.',
    imageUrl: './assets/ports/cozumel.jpg',
    mapUrl: 'https://maps.app.goo.gl/yyyyyyyy'
  },
  {
    id: 'costa-maya',
    name: 'Costa Maya (Mahahual)',
    country: 'Mexico',
    region: 'Caribbean',
    vibeTags: ['Relaxed', 'Beach', 'Bars'],
    shortDescription: 'Laid‑back beach town with a simple “chair + drink + ocean” vibe.',
    mustDo: [
      'Taxi to Mahahual malecón and pick a beach club',
      'Slow stroll along the pedestrian waterfront'
    ],
    foodIdeas: [
      'Beachfront seafood and cold beer',
      'Fresh fruit smoothies'
    ],
    rainyDayIdeas: [
      'Massage in a beachfront hut (if weather allows)',
      'Long lunch under cover watching the waves'
    ],
    safetyNotes: 'Very chill; watch for aggressive vendors but a polite “no thanks” works.',
    accessibility: 'Flat malecón; sand access varies by beach club.',
    imageUrl: './assets/ports/costa-maya.jpg',
    mapUrl: 'https://maps.app.goo.gl/zzzzzzzz'
  }
  // Add more ports here…
];

// --- State helpers ---------------------------------------------------------

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { notesByPort: {} };
  } catch {
    return { notesByPort: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // fail silently; offline/localStorage only
  }
}

// --- Rendering -------------------------------------------------------------

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function renderPortList(ports, selectedId, onSelect) {
  const container = createEl('div', 'ports__list');

  const searchInput = createEl('input', 'ports__search');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search ports, country, or vibe…';

  const listEl = createEl('div', 'ports__list-items');

  function applyFilter() {
    const q = searchInput.value.trim().toLowerCase();
    listEl.innerHTML = '';

    ports
      .filter(p => {
        if (!q) return true;
        const haystack = [
          p.name,
          p.country,
          p.region,
          ...(p.vibeTags || [])
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .forEach(port => {
        const item = createEl(
          'button',
          'ports__list-item' + (port.id === selectedId ? ' ports__list-item--active' : '')
        );
        item.type = 'button';

        const title = createEl('div', 'ports__list-title', port.name);
        const subtitle = createEl(
          'div',
          'ports__list-sub',
          `${port.country} • ${port.region}`
        );
        const tags = createEl(
          'div',
          'ports__list-tags',
          (port.vibeTags || []).join(' · ')
        );

        item.appendChild(title);
        item.appendChild(subtitle);
        item.appendChild(tags);

        item.addEventListener('click', () => onSelect(port.id));
        listEl.appendChild(item);
      });
  }

  searchInput.addEventListener('input', applyFilter);
  applyFilter();

  container.appendChild(searchInput);
  container.appendChild(listEl);
  return container;
}

function renderPortDetail(port, state, onStateChange) {
  const container = createEl('div', 'ports__detail');

  if (!port) {
    container.appendChild(
      createEl('div', 'ports__empty', 'Pick a port to see a simple day plan.')
    );
    return container;
  }

  // Hero
  const hero = createEl('div', 'ports__hero');
  if (port.imageUrl) {
    const img = createEl('img', 'ports__hero-img');
    img.src = port.imageUrl;
    img.alt = port.name;
    hero.appendChild(img);
  }
  const heroText = createEl('div', 'ports__hero-text');
  heroText.appendChild(createEl('h2', 'ports__title', port.name));
  heroText.appendChild(
    createEl(
      'div',
      'ports__meta',
      `${port.country} • ${port.region} • ${(port.vibeTags || []).join(' · ')}`
    )
  );
  heroText.appendChild(
    createEl('p', 'ports__desc', port.shortDescription || '')
  );
  hero.appendChild(heroText);
  container.appendChild(hero);

  // Suggested plan
  const plan = createEl('div', 'ports__plan');
  plan.appendChild(createEl('h3', 'ports__section-title', 'Suggested day'));

  const columns = createEl('div', 'ports__plan-columns');

  const colLeft = createEl('div', 'ports__plan-col');
  const colRight = createEl('div', 'ports__plan-col');

  function addListBlock(parent, title, items) {
    if (!items || !items.length) return;
    const block = createEl('div', 'ports__block');
    block.appendChild(createEl('h4', 'ports__block-title', title));
    const ul = createEl('ul', 'ports__block-list');
    items.forEach(i => {
      const li = createEl('li', 'ports__block-item', i);
      ul.appendChild(li);
    });
    block.appendChild(ul);
    parent.appendChild(block);
  }

  addListBlock(colLeft, 'Must‑do', port.mustDo);
  addListBlock(colLeft, 'Food ideas', port.foodIdeas);
  addListBlock(colRight, 'Rainy‑day backup', port.rainyDayIdeas);

  if (port.safetyNotes) {
    const safety = createEl('div', 'ports__block ports__block--note');
    safety.appendChild(createEl('h4', 'ports__block-title', 'Safety & comfort'));
    safety.appendChild(createEl('p', 'ports__block-text', port.safetyNotes));
    colRight.appendChild(safety);
  }

  if (port.accessibility) {
    const access = createEl('div', 'ports__block ports__block--note');
    access.appendChild(createEl('h4', 'ports__block-title', 'Accessibility'));
    access.appendChild(createEl('p', 'ports__block-text', port.accessibility));
    colRight.appendChild(access);
  }

  columns.appendChild(colLeft);
  columns.appendChild(colRight);
  plan.appendChild(columns);
  container.appendChild(plan);

  // Notes
  const notesSection = createEl('div', 'ports__notes');
  notesSection.appendChild(
    createEl('h3', 'ports__section-title', 'Your tweaks & notes')
  );

  const textarea = createEl('textarea', 'ports__notes-input');
  textarea.rows = 6;
  textarea.placeholder =
    'Add your own plan tweaks here: exact beach club, meeting point, backup ideas…';

  const existingNotes = state.notesByPort?.[port.id] || '';
  textarea.value = existingNotes;

  textarea.addEventListener('input', () => {
    const nextState = {
      ...state,
      notesByPort: {
        ...(state.notesByPort || {}),
        [port.id]: textarea.value
      }
    };
    onStateChange(nextState);
  });

  notesSection.appendChild(textarea);

  if (port.mapUrl) {
    const mapLink = createEl('a', 'ports__map-link', 'Open in Maps');
    mapLink.href = port.mapUrl;
    mapLink.target = '_blank';
    mapLink.rel = 'noreferrer noopener';
    notesSection.appendChild(mapLink);
  }

  container.appendChild(notesSection);

  return container;
}

// --- Public API ------------------------------------------------------------

export function renderPorts(rootEl) {
  const state = loadState();
  let selectedId = PORTS[0]?.id || null;
  let currentState = state;

  function updateState(next) {
    currentState = next;
    saveState(currentState);
  }

  function rerender() {
    rootEl.innerHTML = '';

    const layout = createEl('div', 'ports');
    const list = renderPortList(PORTS, selectedId, id => {
      selectedId = id;
      rerender();
    });
    const detail = renderPortDetail(
      PORTS.find(p => p.id === selectedId),
      currentState,
      updateState
    );

    layout.appendChild(list);
    layout.appendChild(detail);
    rootEl.appendChild(layout);
  }

  rerender();
}
