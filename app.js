import { store } from './modules/store.js';
import { clear } from './modules/ui.js';
import { tabFromHash, setHashTab, onHashChange } from './modules/router.js';
import { renderTrips } from './modules/trips.js';
import { renderMatchmaker } from './modules/matchmaker.js';
import { renderPorts } from './modules/ports.js';
import { renderLists } from './modules/lists.js';
import { renderTips } from './modules/tips.js';
import { renderConcierge } from './modules/concierge.js';
const tabs = {
trips: renderTrips,
matchmaker: renderMatchmaker,
ports: renderPorts,
lists: renderLists,
tips: renderTips,
concierge: renderConcierge
};
const state = { ui: store.getUI() };
async function loadJSON(path){
const res = await fetch(path);
if(!res.ok) throw new Error('Failed to fetch ' + path);
return await res.json();
}
async function firstRunImportIfNeeded(){
const did = store.read(store.keys.didImport, false);
if(did) return;
const tips = await loadJSON('./data/tips.json');
store.setList(store.keys.tips, tips.map(t => ({...t, isFavorite:false})));
const templates = await loadJSON('./data/packing_templates.json');
store.setList(store.keys.packingTemplates, templates);
const demos = await loadJSON('./data/demo_trips.json');
importDemoTrips(demos);
store.write(store.keys.didImport, true);
}
function importDemoTrips(demos){
const trips = store.list(store.keys.trips);
const portPlans = store.list(store.keys.portPlans);
const packingLists = store.list(store.keys.packingLists);
const messages = store.list(store.keys.messages);
for(const d of demos){
const tripId = store.uid('trip');
const trip = {
id: tripId,
name: d.trip.name,
cruiseLine: d.trip.cruiseLine || '',
ship: d.trip.ship || '',
sailDateStart: d.trip.sailDateStart || null,
sailDateEnd: d.trip.sailDateEnd || null,
notes: d.trip.notes || '',
currentPackingListId: null
};
trips.push(trip);
for(const p of (d.portPlans || [])){
portPlans.push({
id: store.uid('port'),
tripId,
portName: p.portName,
arrivalTime: p.arrivalTime || null,
departureTime: p.departureTime || null,
walkTimeNotes: p.walkTimeNotes || '',
safetyNotes: p.safetyNotes || '',
items: (p.items || []).map(it => ({
id: store.uid('chk'),
text: it.text,
isDone: !!it.isDone,
timeNote: it.timeNote || ''
}))
});
}
for(const l of (d.packingLists || [])){
const listId = store.uid('list');
packingLists.push({
id: listId,
tripId,
title: l.title,
categories: (l.categories || []).map(c => ({
id: store.uid('cat'),
name: c.name,
items: (c.items || []).map(i => ({
id: store.uid('item'),
name: i.name,
quantity: i.quantity || 1,
isChecked: false
}))
}))
});
trip.currentPackingListId = listId;
}
for(const m of (d.messages || [])){
messages.push({
id: store.uid('msg'),
tripId,
subject: m.subject,
body: m.body,
createdAt: new Date().toISOString(),
status: (m.status === 'answered') ? 'answered' : 'toAskLater',
tags: m.tags || []
});
}
}
store.setList(store.keys.trips, trips);
store.setList(store.keys.portPlans, portPlans);
store.setList(store.keys.packingLists, packingLists);
store.setList(store.keys.messages, messages);
}
function bindTabs(){
document.querySelectorAll('.tab').forEach(btn => {
btn.addEventListener('click', () => {
state.ui.selectedTab = btn.dataset.tab;
store.setUI(state.ui);
setHashTab(state.ui.selectedTab);
render();
});
});
}
function bindTripSelect(){
const sel = document.getElementById('tripSelect');
sel.addEventListener('change', () => {
state.ui.currentTripId = sel.value || null;
store.setUI(state.ui);
render();
});
}
function renderTripSelect(){
const sel = document.getElementById('tripSelect');
const trips = store.list(store.keys.trips);
sel.innerHTML = '';
const optAll = document.createElement('option');
optAll.value = '';
optAll.textContent = 'No trip selected';
sel.appendChild(optAll);
for(const t of trips){
const o = document.createElement('option');
o.value = t.id;
o.textContent = t.name;
sel.appendChild(o);
}
sel.value = state.ui.currentTripId || '';
}
function renderTabsActive(){
document.querySelectorAll('.tab').forEach(btn => {
btn.classList.toggle('is-active', btn.dataset.tab === state.ui.selectedTab);
});
}
function render(){
renderTripSelect();
renderTabsActive();
const root = document.getElementById('app');
clear(root);
const tab = state.ui.selectedTab || 'trips';
const renderer = tabs[tab] || tabs.trips;
renderer(root, state);
}
(async function main(){
const t = tabFromHash();
if(t){ state.ui.selectedTab = t; store.setUI(state.ui); }
onHashChange((tab) => { state.ui.selectedTab = tab; store.setUI(state.ui); render(); });
bindTabs();
bindTripSelect();
await firstRunImportIfNeeded();
setHashTab(state.ui.selectedTab || 'trips');
render();
})();
