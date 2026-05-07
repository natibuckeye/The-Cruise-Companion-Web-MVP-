import { store } from './store.js';
import { el, openModal, closeModal } from './ui.js';
export function renderLists(root, state){
const tripId = state.ui.currentTripId;
const listsAll = store.list(store.keys.packingLists);
const lists = tripId ? listsAll.filter(l => l.tripId === tripId) : [];
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Lists']),
el('div', {class:'muted'}, ['Packing lists, minus the chaos.'])
]),
el('button', {class:'btn', onclick: () => {
if(!tripId){ alert('Pick a trip first (top right).'); return; }
openTemplatePicker({ state });
}}, ['Use a template']),
el('button', {class:'btn primary', onclick: () => {
if(!tripId){ alert('Pick a trip first (top right).'); return; }
openListEditor({ state });
}}, ['+ New list'])
]));
if(!tripId){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['Browse anytime. Create when ready.']),
el('p', {class:'muted'}, ['Pick a trip to create packing lists.'])
]));
return;
}
if(lists.length === 0){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['No lists yet.']),
el('p', {class:'muted'}, ["We recommend starting with a template—then we'll customize it."])
]));
return;
}
const list = el('div', {class:'list'});
for(const l of lists){
const pct = Math.round(completion(l) * 100);
list.appendChild(el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [l.title]),
el('div', {class:'muted'}, [`${pct}% complete`])
]),
el('button', {class:'btn', onclick: () => openListDetail({ state, listId: l.id })}, ['Open']),
el('button', {class:'btn', onclick: () => openListEditor({ state, listId: l.id })}, ['Edit']),
el('button', {class:'btn danger', onclick: () => {
if(confirm('Delete this list?')){ store.remove(store.keys.packingLists, l.id); location.reload(); }
}}, ['Delete'])
])
]));
}
root.appendChild(list);
}
function completion(list){
const all = (list.categories||[]).flatMap(c => c.items||[]);
const total = all.reduce((s,i) => s + Math.max(0, Number(i.quantity||0)), 0);
if(total <= 0) return 0;
const done = all.filter(i => !!i.isChecked).reduce((s,i) => s + Math.max(0, Number(i.quantity||0)), 0);
return done / total;
}
function openTemplatePicker({ state }){
const templates = store.list(store.keys.packingTemplates);
const body = el('div', {class:'list'}, [
el('p', {class:'muted'}, ["Pick a template. We'll copy it into a new list for this trip."]),
...(templates.length ? templates.map(t => {
return el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [t.title]),
el('div', {class:'muted'}, [t.description || ''])
]),
el('button', {class:'btn primary', onclick: () => openTemplateCustomize({ state, templateId: t.id })}, ['Customize'])
])
]);
}) : [
el('div', {class:'card'}, [
el('h3', {}, ['No templates loaded.']),
el('p', {class:'muted'}, ['Ensure data/packing_templates.json exists and first-run import ran.'])
])
])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn primary', onclick: () => closeModal()}, ['Close'])
]);
openModal({ title: 'Use a Template', bodyNode: body, footerNode: footer });
}
function draftFromTemplate(tpl){
return {
title: tpl.title,
categories: (tpl.categories||[]).map(c => ({
id: store.uid('cat'),
name: c.name,
items: (c.items||[]).map(i => ({ id: store.uid('item'), name: i.name, quantity: i.quantity || 1, isChecked: true }))
}))
};
}
function openTemplateCustomize({ state, templateId }){
const tripId = state.ui.currentTripId;
const tpl = store.list(store.keys.packingTemplates).find(t => t.id === templateId);
if(!tpl){ alert('Template not found.'); return; }
const draft = draftFromTemplate(tpl);
let nights = 7;
const trip = store.find(store.keys.trips, tripId);
if(trip?.sailDateStart && trip?.sailDateEnd){
const start = new Date(trip.sailDateStart);
const end = new Date(trip.sailDateEnd);
const days = Math.max(1, Math.round((end - start) / (1000*60*60*24)));
nights = days;
}
const titleInput = el('input', {value: draft.title});
const nightsInput = el('input', {type:'number', min:'1', max:'30', value: String(nights)});
const useRec = el('input', {type:'checkbox'});
useRec.checked = true;
const listWrap = el('div', {class:'list'});
function setAllChecked(on){
for(const c of draft.categories){ for(const it of c.items){ it.isChecked = on; } }
}
function applyRecommendedQuantities(n){
const nightsN = Math.max(1, Number(n||7));
const formal = formalNightsEstimate(nightsN);
for(const c of draft.categories){
for(const it of c.items){
const rule = ruleForItem(c.name, it.name);
it.quantity = suggestedQuantity(it.quantity||1, nightsN, formal, rule);
}
}
}
function renderDraft(){
listWrap.innerHTML = '';
draft.title = titleInput.value;
for(const cat of draft.categories){
const catBox = el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('h4', {class:'spacer'}, [cat.name]),
el('button', {class:'btn danger', onclick: () => { draft.categories = draft.categories.filter(x => x.id !== cat.id); renderDraft(); }}, ['Remove category'])
]),
el('div', {class:'list'}, cat.items.map(it => {
const chk = el('input', {type:'checkbox'});
chk.checked = !!it.isChecked;
chk.addEventListener('change', () => { it.isChecked = chk.checked; });
const name = el('input', {value: it.name});
name.addEventListener('input', () => { it.name = name.value; });
const qty = el('input', {type:'number', min:'1', max:'50', value: String(it.quantity||1)});
qty.addEventListener('change', () => { it.quantity = Math.max(1, Number(qty.value||1)); });
return el('div', {class:'row'}, [
chk,
el('div', {class:'spacer'}, [name]),
qty,
el('button', {class:'btn danger', onclick: () => { cat.items = cat.items.filter(x => x.id !== it.id); renderDraft(); }}, ['Remove'])
]);
}))
]);
listWrap.appendChild(catBox);
}
const addCatName = el('input', {placeholder:'New category name'});
const addCatBtn = el('button', {class:'btn', onclick: () => {
const n = addCatName.value.trim();
if(!n) return;
draft.categories.push({ id: store.uid('cat'), name: n, items: [] });
addCatName.value='';
renderDraft();
}}, ['Add category']);
listWrap.appendChild(el('div', {class:'row'}, [addCatName, addCatBtn]));
}
titleInput.addEventListener('input', renderDraft);
const body = el('div', {class:'list'}, [
el('div', {class:'item'}, [el('div', {class:'muted'}, ['List title']), titleInput]),
el('div', {class:'item'}, [
el('div', {class:'muted'}, ['Trip length']),
el('div', {class:'row'}, [el('span', {class:'muted'}, ['Nights']), nightsInput, el('label', {}, [useRec, ' Recommended quantities'])]),
el('div', {class:'row'}, [
el('button', {class:'btn', onclick: () => { setAllChecked(true); renderDraft(); }}, ['Select all']),
el('button', {class:'btn', onclick: () => { setAllChecked(false); renderDraft(); }}, ['Deselect all']),
el('button', {class:'btn', onclick: () => { if(useRec.checked){ applyRecommendedQuantities(nightsInput.value); renderDraft(); } }}, ['Apply recommended quantities now'])
])
]),
listWrap
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Cancel']),
el('button', {class:'btn primary', onclick: () => {
if(useRec.checked) applyRecommendedQuantities(nightsInput.value);
const newList = {
id: store.uid('list'),
tripId,
title: titleInput.value.trim() || tpl.title,
categories: draft.categories
.map(c => ({...c, items: (c.items||[]).filter(it => it.isChecked).map(it => ({...it, isChecked:false})) }))
.filter(c => (c.items||[]).length > 0)
};
store.upsert(store.keys.packingLists, newList);
const trip = store.find(store.keys.trips, tripId);
if(trip){ trip.currentPackingListId = newList.id; store.upsert(store.keys.trips, trip); }
closeModal();
location.reload();
}}, ['Create list'])
]);
renderDraft();
openModal({ title: 'Customize Template', bodyNode: body, footerNode: footer });
}
function openListEditor({ state, listId }){
const tripId = state.ui.currentTripId;
const existing = listId ? store.find(store.keys.packingLists, listId) : null;
const title = el('input', {value: existing?.title || '', placeholder:'List title'});
const body = el('div', {class:'list'}, [
el('div', {}, [el('div', {class:'muted'}, ['Title']), title]),
el('p', {class:'muted'}, ['For MVP, edit categories/items in the detail view.'])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Cancel']),
el('button', {class:'btn primary', onclick: () => {
const t = title.value.trim();
if(!t){ alert('Title is required.'); return; }
const list = existing || { id: store.uid('list'), tripId, title:'', categories: defaultBlankCategories() };
list.tripId = tripId;
list.title = t;
store.upsert(store.keys.packingLists, list);
const trip = store.find(store.keys.trips, tripId);
if(trip){ trip.currentPackingListId = list.id; store.upsert(store.keys.trips, trip); }
closeModal();
location.reload();
}}, ['Save'])
]);
openModal({ title: existing ? 'Edit List' : 'New List', bodyNode: body, footerNode: footer });
}
function defaultBlankCategories(){
return [
{ id: store.uid('cat'), name:'Clothing', items:[] },
{ id: store.uid('cat'), name:'Toiletries', items:[] },
{ id: store.uid('cat'), name:'Documents', items:[] }
];
}
function openListDetail({ state, listId }){
const tripId = state.ui.currentTripId;
const list = store.find(store.keys.packingLists, listId);
if(!list) return;
const trip = store.find(store.keys.trips, tripId);
if(trip){ trip.currentPackingListId = list.id; store.upsert(store.keys.trips, trip); }
const bodyWrap = el('div', {class:'list'});
function render(){
const latest = store.find(store.keys.packingLists, listId);
if(!latest) return;
bodyWrap.innerHTML = '';
const pct = Math.round(completion(latest) * 100);
bodyWrap.appendChild(el('div', {class:'item'}, [
el('h3', {}, [latest.title]),
el('div', {class:'muted'}, [`We think you're ${pct}% packed.`])
]));
const selectAll = el('button', {class:'btn', onclick: () => { setAll(latest, true); render(); }}, ['Select all']);
const deselectAll = el('button', {class:'btn', onclick: () => { setAll(latest, false); render(); }}, ['Deselect all']);
bodyWrap.appendChild(el('div', {class:'row'}, [selectAll, deselectAll]));
for(const cat of (latest.categories||[])) bodyWrap.appendChild(renderCategory(latest, cat, render));
bodyWrap.appendChild(el('div', {class:'row'}, [
el('button', {class:'btn', onclick: () => shareListAsText(store.find(store.keys.packingLists, listId))}, ['Export text']),
el('span', {class:'spacer'}),
el('button', {class:'btn danger', onclick: () => { if(confirm('Reset all checks?')){ setAll(latest,false); render(); } }}, ['Reset checks'])
]));
}
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn primary', onclick: () => closeModal()}, ['Close'])
]);
render();
openModal({ title: 'Packing List', bodyNode: bodyWrap, footerNode: footer });
}
function renderCategory(list, cat, rerender){
const box = el('div', {class:'item'});
box.appendChild(el('div', {class:'row'}, [
el('h4', {class:'spacer'}, [cat.name]),
el('button', {class:'btn', onclick: () => {
const name = prompt('Rename category', cat.name);
if(!name) return;
cat.name = name;
store.upsert(store.keys.packingLists, list);
rerender();
}}, ['Rename'])
]));
const itemsWrap = el('div', {class:'list'});
for(const it of (cat.items||[])){
const chk = el('input', {type:'checkbox'});
chk.checked = !!it.isChecked;
chk.addEventListener('change', () => {
it.isChecked = chk.checked;
store.upsert(store.keys.packingLists, list);
rerender();
});
const qty = el('input', {type:'number', min:'1', max:'99', value: String(it.quantity||1)});
qty.addEventListener('change', () => {
it.quantity = Math.max(1, Number(qty.value||1));
store.upsert(store.keys.packingLists, list);
rerender();
});
itemsWrap.appendChild(el('div', {class:'row'}, [
chk,
el('div', {class:'spacer'}, [it.name]),
qty,
el('button', {class:'btn danger', onclick: () => {
cat.items = (cat.items||[]).filter(x => x.id !== it.id);
store.upsert(store.keys.packingLists, list);
rerender();
}}, ['Remove'])
]));
}
const newItem = el('input', {placeholder:'Add an item…'});
const addBtn = el('button', {class:'btn', onclick: () => {
const txt = newItem.value.trim();
if(!txt) return;
cat.items = [...(cat.items||[]), { id: store.uid('item'), name: txt, quantity: 1, isChecked:false }];
newItem.value='';
store.upsert(store.keys.packingLists, list);
rerender();
}}, ['Add']);
box.appendChild(itemsWrap);
box.appendChild(el('div', {class:'row'}, [newItem, addBtn]));
return box;
}
function setAll(list, checked){
for(const c of (list.categories||[])) for(const it of (c.items||[])) it.isChecked = checked;
store.upsert(store.keys.packingLists, list);
}
function shareListAsText(list){
if(!list) return;
const lines = [];
lines.push(`Packing List: ${list.title}`);
lines.push('');
for(const c of (list.categories||[])){
lines.push(`## ${c.name}`);
for(const it of (c.items||[])){
const mark = it.isChecked ? '[x]' : '[ ]';
lines.push(`${mark} ${it.name} (x${it.quantity||1})`);
}
lines.push('');
}
openShareModal('Packing List Export', lines.join('\n'));
}
function openShareModal(title, text){
const ta = el('textarea', {readonly:true}, [text]);
const copyBtn = el('button', {class:'btn primary', onclick: async () => {
try{ await navigator.clipboard.writeText(text); alert('Copied to clipboard.'); }
catch{ alert('Copy failed.'); }
}}, ['Copy']);
const body = el('div', {class:'list'}, [
el('p', {class:'muted'}, ['Copy this into Notes, Messages, or email.']),
ta
]);
const footer = el('div', {class:'row'}, [copyBtn, el('span',{class:'spacer'}), el('button',{class:'btn', onclick: () => closeModal()},['Close'])]);
openModal({ title, bodyNode: body, footerNode: footer });
}
function formalNightsEstimate(nights){
if(nights >= 9) return 2;
if(nights >= 5) return 1;
return 0;
}
function ruleForItem(categoryName, itemName){
const c = (categoryName||'').toLowerCase();
const n = (itemName||'').toLowerCase();
const keepOne = ['passport','id','charger','adapter','battery','documents','boarding','credit card','insurance','wallet','keys','binoculars','water bottle'];
if(keepOne.some(k => n.includes(k))) return {kind:'keepOne'};
if(n.includes('formal') || n.includes('gala')) return {kind:'formalNights'};
if(n.includes('underwear') || n.includes('socks')) return {kind:'fasterPerNight', min:3, max:20};
if(c.includes('toiletr')){ return n.includes('sunscreen') ? {kind:'capAt', cap:2} : {kind:'capAt', cap:1}; }
if(c.includes('med') || c.includes('health')) return {kind:'capAt', cap:2};
if(c.includes('shoe')) return {kind:'capAt', cap:2};
if(c.includes('cloth')) return {kind:'perTwoNights', min:2, max:20};
return {kind:'perTwoNights', min:1, max:20};
}
function suggestedQuantity(base, nights, formalNights, rule){
const clamp = (value, minVal, maxVal) => Math.min(maxVal ?? value, Math.max(minVal, value));
const b = Math.max(1, Number(base||1));
switch(rule.kind){
case 'keepOne': return 1;
case 'formalNights': return Math.max(b, Math.max(1, formalNights));
case 'capAt': return Math.min(Math.max(1, b), rule.cap);
case 'perTwoNights': {
const target = Math.ceil(Number(nights)/2);
return clamp(Math.max(b, target), rule.min, rule.max);
}
case 'fasterPerNight': {
const target = Math.ceil(Number(nights) * 1.25);
return clamp(Math.max(b, target), rule.min, rule.max);
}
default: return b;
}
}
