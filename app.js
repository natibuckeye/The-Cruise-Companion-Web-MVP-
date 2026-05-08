import { loadTrips } from "./modules/trips.js";
import { loadMatchmaker } from "./modules/matchmaker.js";
import { loadPorts } from "./modules/ports.js";
import { loadPacking } from "./modules/packing.js";
import { loadTips } from "./modules/tips.js";

window.onload = () => {
  loadTrips();
  loadMatchmaker();
  loadPorts();
  loadPacking();
  loadTips();
};

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

  const allowedTabs = new Set(['trips','matchmaker','ports','lists','tips','concierge']);
export function tabFromHash(){
const h = (location.hash || '').replace('#','').trim();
if(allowedTabs.has(h)) return h;
return null;
}
export function setHashTab(tab){
if(!allowedTabs.has(tab)) return;
if(location.hash.replace('#','') === tab) return;
history.replaceState(null, '', '#' + tab);
}
export function onHashChange(handler){
window.addEventListener('hashchange', () => {
const t = tabFromHash();
if(t) handler(t);

  export function el(tag, attrs={}, children=[]){
const node = document.createElement(tag);
for(const [k,v] of Object.entries(attrs||{})){
if(k === 'class') node.className = v;
else if(k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
else if(v === false || v === null || v === undefined) {}
else node.setAttribute(k, String(v));
}
for(const child of (Array.isArray(children)?children:[children])){
if(child === null || child === undefined) continue;
node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
}
return node;
}
export function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); }
export function fmtDate(iso){
if(!iso) return 'Dates not set';
try{ return new Date(iso).toLocaleDateString(); }catch{ return String(iso); }
}
export function fmtDateRange(startIso, endIso){
if(!startIso || !endIso) return 'Dates not set';
return fmtDate(startIso) + ' – ' + fmtDate(endIso);
}
export function openModal({title, bodyNode, footerNode}){
const dlg = document.getElementById('modal');
document.getElementById('modalTitle').textContent = title || 'Modal';
const body = document.getElementById('modalBody');
const footer = document.getElementById('modalFooter');
clear(body);
clear(footer);
if(bodyNode) body.appendChild(bodyNode);
if(footerNode) footer.appendChild(footerNode);
dlg.showModal();
}
export function closeModal(){
const dlg = document.getElementById('modal');
if(dlg.open) dlg.close();


})();
