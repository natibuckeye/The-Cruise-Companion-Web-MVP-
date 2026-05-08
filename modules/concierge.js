import { store } from './store.js';
import { el, openModal, closeModal } from './ui.js';
const exportBuckets = [
{ title:'Dining', keywords:['dining','food','restaurant','specialty'] },
{ title:'Ports', keywords:['port','ports','nassau','falmouth','shore','timing'] },
{ title:'Excursions', keywords:['excursion','excursions','tour','activity'] },
{ title:'Money', keywords:['money','budget','gratuity','tip','cost'] }
];
function bucketTitleFor(message){
const tags = (message.tags||[]).map(t => String(t).toLowerCase());
for(const b of exportBuckets){
const hit = tags.some(t => b.keywords.some(k => t.includes(k)));
if(hit) return b.title;
}
return 'Other';
}
function groupMessagesForExport(messages){
const grouped = {};
for(const m of messages){
const title = bucketTitleFor(m);
grouped[title] = grouped[title] || [];
grouped[title].push(m);
}
return grouped;
}
function orderedBucketTitles(){
return [...exportBuckets.map(b => b.title), 'Other'];
}
function makeQuestionsPackText(trip, messages){
const relevant = messages
.filter(m => m.status === 'toAskLater')
.filter(m => !trip ? true : (m.tripId === trip.id))
.sort((a,b) => (a.createdAt||'').localeCompare(b.createdAt||''));
const grouped = groupMessagesForExport(relevant);
const lines = [];
lines.push('The Cruise Companion™ — Questions Pack');
if(trip){
lines.push(`Trip: ${trip.name}`);
if(trip.sailDateStart) lines.push(`Start: ${new Date(trip.sailDateStart).toLocaleDateString()}`);
}
lines.push('');
for(const title of orderedBucketTitles()){
const msgs = grouped[title] || [];
if(!msgs.length) continue;
lines.push(`## ${title}`);
msgs.forEach((m, idx) => {
lines.push(`${idx+1}. ${m.subject}`);
const body = (m.body||'').trim().replace(/\n+/g,' ');
if(body) lines.push(` - ${body}`);
});
lines.push('');
}
if(relevant.length === 0) lines.push("No saved questions yet. We're ready when you are.");
lines.push('—');
lines.push('Generated offline on your device');
return lines.join('\n');
}
function makeGuestServicesQuestionsText(trip, messages){
const relevant = messages
.filter(m => m.status === 'toAskLater')
.filter(m => !trip ? true : (m.tripId === trip.id))
.sort((a,b) => (a.createdAt||'').localeCompare(b.createdAt||''));
const grouped = groupMessagesForExport(relevant);
const lines = [];
lines.push('The Cruise Companion™ — Guest Services Questions');
lines.push('Hi! We have a few quick questions—thank you.');
if(trip){
lines.push(`Trip: ${trip.name}`);
if(trip.sailDateStart) lines.push(`Start: ${new Date(trip.sailDateStart).toLocaleDateString()}`);
}
lines.push('');
for(const title of orderedBucketTitles()){
const msgs = grouped[title] || [];
if(!msgs.length) continue;
lines.push(`## Questions for Guest Services — ${title}`);
msgs.forEach((m, idx) => {
lines.push(`${idx+1}. ${m.subject}`);
const body = (m.body||'').trim().replace(/\n+/g,' ');
if(body) lines.push(` - ${body}`);
});
lines.push('');
}
if(relevant.length === 0) lines.push("No saved questions yet. We're ready when you are.");
lines.push('—');
lines.push('Generated offline on your device');
return lines.join('\n');
}
export function renderConcierge(root, state){
const tripId = state.ui.currentTripId;
const trip = tripId ? store.find(store.keys.trips, tripId) : null;
let status = 'toAskLater';
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Concierge']),
el('div', {class:'muted'}, ["Drop your questions here. We'll keep them ready for the right moment."])
]),
el('button', {class:'btn', onclick: () => exportPack(trip)}, ['Export Questions Pack']),
el('button', {class:'btn primary', onclick: () => openMessageEditor({ state })}, ['+ New message'])
]));
const seg = el('div', {class:'row'}, [
el('button', {class:'btn primary', onclick: () => { status='toAskLater'; rerender(); }}, ['To Ask Later']),
el('button', {class:'btn', onclick: () => { status='answered'; rerender(); }}, ['Answered'])
]);
const listWrap = el('div', {class:'list'});
root.appendChild(seg);
root.appendChild(listWrap);
function rerender(){
seg.children[0].classList.toggle('primary', status==='toAskLater');
seg.children[1].classList.toggle('primary', status==='answered');
listWrap.innerHTML = '';
const all = store.list(store.keys.messages);
const filtered = all
.filter(m => m.status === status)
.filter(m => tripId ? (m.tripId === tripId) : true)
.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
if(filtered.length === 0){
listWrap.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['No messages yet.']),
el('p', {class:'muted'}, ["We're ready when you are."])
]));
return;
}
for(const m of filtered){
const tags = (m.tags||[]).length ? (m.tags||[]).join(', ') : '';
listWrap.appendChild(el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [m.subject]),
tags ? el('div', {class:'muted'}, [tags]) : el('div', {class:'muted'}, [new Date(m.createdAt).toLocaleString()])
]),
el('button', {class:'btn', onclick: () => openMessageDetail({ state, messageId: m.id })}, ['Open'])
])
]));
}
}
rerender();
}
function openMessageEditor({ state, messageId }){
const tripId = state.ui.currentTripId;
const existing = messageId ? store.find(store.keys.messages, messageId) : null;
const subject = el('input', {value: existing?.subject || '', placeholder:'What do we need to ask?'});
const body = el('textarea', {}, [existing?.body || '']);
const tagsText = el('input', {value: (existing?.tags||[]).join(', '), placeholder:'dining, ports, budget?'});
const bodyNode = el('div', {class:'list'}, [
el('div', {}, [el('div',{class:'muted'},['Subject']), subject]),
el('div', {}, [el('div',{class:'muted'},['Details']), body]),
el('div', {}, [el('div',{class:'muted'},['Tags (optional)']), tagsText]),
el('div', {class:'muted'}, [tripId ? 'Saved to current trip.' : 'No trip selected: this will be global.'])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Cancel']),
el('button', {class:'btn primary', onclick: () => {
const s = subject.value.trim();
if(!s){ alert('Subject is required.'); return; }
const msg = existing || { id: store.uid('msg'), createdAt: new Date().toISOString(), status:'toAskLater' };
msg.tripId = tripId || null;
msg.subject = s;
msg.body = body.value;
msg.tags = tagsText.value.split(',').map(x => x.trim()).filter(Boolean);
store.upsert(store.keys.messages, msg);
closeModal();
location.reload();
}}, ['Save'])
]);
openModal({ title: existing ? 'Edit Message' : 'New Message', bodyNode, footerNode: footer });
}
function openMessageDetail({ state, messageId }){
const m = store.find(store.keys.messages, messageId);
if(!m) return;
const text = `${m.subject}\n\n${m.body||''}\n\n— The Cruise Companion™`;
const body = el('div', {class:'list'}, [
el('h3', {}, [m.subject]),
(m.body ? el('p', {}, [m.body]) : el('p', {class:'muted'}, ['No details yet.'])),
((m.tags||[]).length ? el('div', {class:'muted'}, ['Tags: ' + (m.tags||[]).join(', ')]) : el('div'))
]);
const copyBtn = el('button', {class:'btn', onclick: async () => {
try{ await navigator.clipboard.writeText(text); alert('Copied.'); }
catch{ alert('Copy failed.'); }
}}, ['Copy']);
const toggleBtn = el('button', {class:'btn'}, [m.status === 'answered' ? 'Move back to To Ask Later' : 'Mark as Answered']);
toggleBtn.addEventListener('click', () => {
m.status = (m.status === 'answered') ? 'toAskLater' : 'answered';
store.upsert(store.keys.messages, m);
closeModal();
location.reload();
});
const editBtn = el('button', {class:'btn'}, ['Edit']);
editBtn.addEventListener('click', () => { closeModal(); openMessageEditor({ state, messageId }); });
const delBtn = el('button', {class:'btn danger'}, ['Delete']);
delBtn.addEventListener('click', () => {
if(confirm('Delete this message?')){ store.remove(store.keys.messages, messageId); closeModal(); location.reload(); }
});
const footer = el('div', {class:'row'}, [
copyBtn, toggleBtn, editBtn, delBtn,
el('span',{class:'spacer'}),
el('button',{class:'btn primary', onclick: () => closeModal()},['Close'])
]);
openModal({ title: 'Message', bodyNode: body, footerNode: footer });
}
function exportPack(trip){
const all = store.list(store.keys.messages);
const text1 = makeQuestionsPackText(trip, all);
const text2 = makeGuestServicesQuestionsText(trip, all);
const body = el('div', {class:'list'}, [
el('p', {class:'muted'}, ['Two formats — copy whichever fits the moment.']),
el('div', {class:'item'}, [
el('h4', {}, ['Questions Pack']),
el('button', {class:'btn primary', onclick: () => copy(text1)}, ['Copy Questions Pack'])
]),
el('div', {class:'item'}, [
el('h4', {}, ['Guest Services Questions']),
el('button', {class:'btn primary', onclick: () => copy(text2)}, ['Copy Guest Services format'])
])
]);
const footer = el('div', {class:'row'}, [
el('span',{class:'spacer'}),
el('button',{class:'btn primary', onclick: () => closeModal()},['Close'])
]);
openModal({ title: 'Export', bodyNode: body, footerNode: footer });
}
async function copy(text){
try{ await navigator.clipboard.writeText(text); alert('Copied.'); }
catch{ alert('Copy failed.'); }
}
