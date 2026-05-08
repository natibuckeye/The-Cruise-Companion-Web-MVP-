import { store } from './store.js';
import { el, openModal, closeModal } from './ui.js';
export function renderPorts(root, state){
const tripId = state.ui.currentTripId;
const plansAll = store.list(store.keys.portPlans);
const plans = tripId ? plansAll.filter(p => p.tripId === tripId) : [];
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Ports']),
el('div', {class:'muted'}, ["We'll help you cruise like it's curated."])
]),
el('button', {class:'btn primary', onclick: () => {
if(!tripId){ alert('Pick a trip first (top right).'); return; }
openEditor({ state });
}}, ['+ Add Port Day'])
]));
if(!tripId){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['Pick a trip to create port plans.']),
el('p', {class:'muted'}, ['Select a trip in the header to begin.'])
]));
return;
}
if(plans.length === 0){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['No port plans yet.']),
el('p', {class:'muted'}, ["Let's give Future You a gift."])
]));
return;
}
const list = el('div', {class:'list'});
for(const p of plans){
list.appendChild(el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [p.portName]),
el('div', {class:'muted'}, [timeText(p)])
]),
el('button', {class:'btn', onclick: () => openDetail(p)}, ['Open']),
el('button', {class:'btn', onclick: () => openEditor({ state, planId: p.id })}, ['Edit']),
el('button', {class:'btn danger', onclick: () => {
if(confirm('Delete this port plan?')){ store.remove(store.keys.portPlans, p.id); location.reload(); }
}}, ['Delete'])
])
]));
}
root.appendChild(list);
}
function timeText(p){
const a = p.arrivalTime ? new Date(p.arrivalTime).toLocaleString() : null;
const d = p.departureTime ? new Date(p.departureTime).toLocaleString() : null;
if(a && d) return `${a} – ${d}`;
if(a) return `Arrive: ${a}`;
return 'Times not set';
}
function openDetail(plan){
const body = el('div', {class:'list'}, [
el('h3', {}, [plan.portName]),
el('div', {class:'muted'}, [timeText(plan)]),
el('hr'),
el('div', {class:'muted'}, ['Plan checklist']),
el('div', {class:'list'}, (plan.items||[]).map(it => {
return el('div', {class:'row item'}, [
el('button', {class:'btn', onclick: () => {
it.isDone = !it.isDone;
store.upsert(store.keys.portPlans, plan);
openDetail(plan);
}}, [it.isDone ? 'Done' : 'Todo']),
el('div', {class:'spacer'}, [
el('div', {}, [it.text]),
(it.timeNote ? el('div', {class:'muted'}, [it.timeNote]) : el('div'))
]),
el('button', {class:'btn danger', onclick: () => {
plan.items = (plan.items||[]).filter(x => x.id !== it.id);
store.upsert(store.keys.portPlans, plan);
openDetail(plan);
}}, ['Remove'])
]);
}))
]);
const newText = el('input', {placeholder:'Add a checklist item (e.g., Sunscreen)'});
const footer = el('div', {class:'row'}, [
newText,
el('button', {class:'btn', onclick: () => {
const txt = newText.value.trim();
if(!txt) return;
plan.items = [...(plan.items||[]), { id: store.uid('chk'), text: txt, isDone:false, timeNote:'' }];
store.upsert(store.keys.portPlans, plan);
openDetail(plan);
}}, ['Add']),
el('span', {class:'spacer'}),
el('button', {class:'btn primary', onclick: () => closeModal()}, ['Close'])
]);
openModal({ title: 'Port Day', bodyNode: body, footerNode: footer });
}
function openEditor({ state, planId }){
const tripId = state.ui.currentTripId;
const existing = planId ? store.find(store.keys.portPlans, planId) : null;
const portName = el('input', {value: existing?.portName || '', placeholder:'Port name'});
const hasTimes = el('input', {type:'checkbox'});
hasTimes.checked = !!(existing?.arrivalTime || existing?.departureTime);
const arrival = el('input', {type:'datetime-local', value: toLocal(existing?.arrivalTime)});
const depart = el('input', {type:'datetime-local', value: toLocal(existing?.departureTime)});
const walk = el('textarea', {}, [existing?.walkTimeNotes || '']);
const safety = el('textarea', {}, [existing?.safetyNotes || '']);
const timesWrap = el('div', {class:'list'});
function syncTimesUI(){
timesWrap.innerHTML = '';
if(hasTimes.checked){
timesWrap.appendChild(el('div', {}, [el('div',{class:'muted'},['Arrival']), arrival]));
timesWrap.appendChild(el('div', {}, [el('div',{class:'muted'},['Departure']), depart]));
} else {
timesWrap.appendChild(el('div', {class:'muted'}, ['Times are optional for MVP.']));
}
}
hasTimes.addEventListener('change', syncTimesUI);
syncTimesUI();
const body = el('div', {class:'list'}, [
el('div', {}, [el('div',{class:'muted'},['Port']), portName]),
el('label', {}, [hasTimes, ' Set arrival/departure times']),
timesWrap,
el('div', {}, [el('div',{class:'muted'},['Walking / timing notes']), walk]),
el('div', {}, [el('div',{class:'muted'},['Safety notes']), safety])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Cancel']),
el('button', {class:'btn primary', onclick: () => {
const pn = portName.value.trim();
if(!pn){ alert('Port name is required.'); return; }
const plan = existing || { id: store.uid('port'), tripId, items:[] };
plan.tripId = tripId;
plan.portName = pn;
plan.arrivalTime = (hasTimes.checked && arrival.value) ? fromLocal(arrival.value) : null;
plan.departureTime = (hasTimes.checked && depart.value) ? fromLocal(depart.value) : null;
plan.walkTimeNotes = walk.value;
plan.safetyNotes = safety.value;
plan.items = plan.items || [];
store.upsert(store.keys.portPlans, plan);
closeModal();
location.reload();
}}, ['Save'])
]);
openModal({ title: existing ? 'Edit Port Day' : 'New Port Day', bodyNode: body, footerNode: footer });
}
function toLocal(iso){
if(!iso) return '';
const d = new Date(iso);
const pad = (n)=> String(n).padStart(2,'0');
return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes());
}
function fromLocal(local){
return new Date(local).toISOString();
}
