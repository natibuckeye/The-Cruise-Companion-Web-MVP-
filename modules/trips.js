import { store } from './store.js';
import { el, fmtDateRange, openModal, closeModal } from './ui.js';
export function renderTrips(root, state){
const trips = store.list(store.keys.trips);
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Trips']),
el('div', {class:'muted'}, ["We're planning something beautiful."])
]),
el('button', {class:'btn primary', onclick: () => openTripEditor({ state })}, ['+ Create Trip'])
]));
if(trips.length === 0){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['No trips yet.']),
el('p', {class:'muted'}, ['Create a trip to unlock Matchmaker, Ports, Lists, and Concierge.'])
]));
return;
}
const list = el('div', {class:'list'});
for(const t of trips){
list.appendChild(el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [t.name]),
el('div', {class:'muted'}, [fmtDateRange(t.sailDateStart, t.sailDateEnd)]),
el('div', {class:'kbd'}, [(t.cruiseLine||'') + (t.ship ? (' – ' + t.ship) : '')].filter(Boolean))
]),
el('button', {class:'btn', onclick: () => {
state.ui.currentTripId = t.id;
store.setUI(state.ui);
renderTripHub(root, state, t.id);
}}, ['Open Hub']),
el('button', {class:'btn', onclick: () => openTripEditor({ state, tripId: t.id })}, ['Edit']),
el('button', {class:'btn danger', onclick: () => {
if(confirm('Delete this trip and its related data?')) deleteTripCascade(t.id, state);
}}, ['Delete'])
])
]));
}
root.appendChild(list);
}
function renderTripHub(root, state, tripId){
const trip = store.find(store.keys.trips, tripId);
if(!trip) return;
root.innerHTML = '';
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Trip Hub']),
el('div', {class:'muted'}, [trip.name])
]),
el('button', {class:'btn', onclick: () => {
state.ui.selectedTab='trips';
store.setUI(state.ui);
location.reload();
}}, ['Back'])
]));
const cards = el('div', {class:'list'});
cards.appendChild(el('div', {class:'card'}, [
el('h3', {}, [trip.name]),
el('div', {class:'muted'}, [fmtDateRange(trip.sailDateStart, trip.sailDateEnd)]),
el('p', {class:'muted'}, [trip.notes || "We've got you."])
]));
cards.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['Quick actions']),
el('div', {class:'row'}, [
el('button', {class:'btn primary', onclick: () => jump(state, 'matchmaker')}, ['Take Matchmaker Quiz']),
el('button', {class:'btn', onclick: () => jump(state, 'ports')}, ['Plan Ports']),
el('button', {class:'btn', onclick: () => jump(state, 'lists')}, ['Packing Lists']),
el('button', {class:'btn', onclick: () => jump(state, 'tips')}, ['Tips']),
el('button', {class:'btn', onclick: () => jump(state, 'concierge')}, ['Ask Concierge'])
])
]));
root.appendChild(cards);
}
function jump(state, tab){
state.ui.selectedTab = tab;
store.setUI(state.ui);
location.reload();
}
function deleteTripCascade(tripId, state){
store.setList(store.keys.trips, store.list(store.keys.trips).filter(t => t.id !== tripId));
store.setList(store.keys.portPlans, store.list(store.keys.portPlans).filter(p => p.tripId !== tripId));
store.setList(store.keys.packingLists, store.list(store.keys.packingLists).filter(l => l.tripId !== tripId));
store.setList(store.keys.messages, store.list(store.keys.messages).filter(m => m.tripId !== tripId));
store.setList(store.keys.matchmakerResults, store.list(store.keys.matchmakerResults).filter(r => r.tripId !== tripId));
if(state.ui.currentTripId === tripId) state.ui.currentTripId = null;
store.setUI(state.ui);
location.reload();
}
function openTripEditor({ state, tripId }){
const existing = tripId ? store.find(store.keys.trips, tripId) : null;
const name = el('input', {value: existing?.name || '', placeholder:'Trip name'});
const line = el('input', {value: existing?.cruiseLine || '', placeholder:'Cruise line (optional)'});
const ship = el('input', {value: existing?.ship || '', placeholder:'Ship (optional)'});
const start = el('input', {type:'date', value: (existing?.sailDateStart || '').slice(0,10)});
const end = el('input', {type:'date', value: (existing?.sailDateEnd || '').slice(0,10)});
const notes = el('textarea', {placeholder:'Notes'}, [existing?.notes || '']);
const body = el('div', {}, [
el('div', {class:'list'}, [
el('div', {}, [el('div', {class:'muted'}, ['Basics']), name, line, ship]),
el('div', {}, [el('div', {class:'muted'}, ['Dates']), start, end]),
el('div', {}, [el('div', {class:'muted'}, ['Notes']), notes])
])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Cancel']),
el('button', {class:'btn primary', onclick: () => {
const n = name.value.trim();
if(!n){ alert('Trip name is required.'); return; }
const trip = existing || { id: store.uid('trip'), notes:'', currentPackingListId:null };
trip.name = n;
trip.cruiseLine = line.value.trim();
trip.ship = ship.value.trim();
trip.sailDateStart = start.value ? (start.value + 'T00:00:00') : null;
trip.sailDateEnd = end.value ? (end.value + 'T00:00:00') : null;
trip.notes = notes.value;
store.upsert(store.keys.trips, trip);
state.ui.currentTripId = trip.id;
store.setUI(state.ui);
closeModal();
location.reload();
}}, ['Save'])
]);
openModal({ title: existing ? 'Edit Trip' : 'New Trip', bodyNode: body, footerNode: footer });
}
