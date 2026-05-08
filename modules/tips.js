import { store } from './store.js';
import { el, openModal, closeModal } from './ui.js';
export function renderTips(root){
const tips = store.list(store.keys.tips);
const categories = Array.from(new Set(tips.map(t => t.category))).sort();
let activeCategory = 'All';
let showFavsOnly = false;
const q = el('input', {placeholder:'Search tips…'});
const chips = el('div', {class:'row'});
function chip(label){
const b = el('button', {class:'btn'}, [label]);
b.addEventListener('click', () => { activeCategory = label; rerender(); });
return b;
}
chips.appendChild(chip('All'));
for(const c of categories) chips.appendChild(chip(c));
const favToggle = el('button', {class:'btn'}, ['Favorites only']);
favToggle.addEventListener('click', () => { showFavsOnly = !showFavsOnly; rerender(); });
const listWrap = el('div', {class:'list'});
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Tips']),
el('div', {class:'muted'}, ['Little things that make your trip feel effortless.'])
]),
favToggle
]));
root.appendChild(el('div', {class:'card'}, [
q,
el('div', {style:'height:10px'}),
chips
]));
root.appendChild(listWrap);
function rerender(){
Array.from(chips.querySelectorAll('button')).forEach(btn => {
btn.classList.toggle('primary', btn.textContent === activeCategory);
});
favToggle.classList.toggle('primary', showFavsOnly);
listWrap.innerHTML = '';
const query = (q.value || '').trim().toLowerCase();
let filtered = tips;
if(activeCategory !== 'All') filtered = filtered.filter(t => t.category === activeCategory);
if(showFavsOnly) filtered = filtered.filter(t => !!t.isFavorite);
if(query){
filtered = filtered.filter(t => (t.title||'').toLowerCase().includes(query) || (t.body||'').toLowerCase().includes(query));
}
if(filtered.length === 0){
listWrap.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['No matching tips.']),
el('p', {class:'muted'}, ['Try a different category or search phrase.'])
]));
return;
}
for(const t of filtered){
const heart = el('button', {class:'btn'}, [t.isFavorite ? 'Unfavorite' : 'Favorite']);
heart.addEventListener('click', () => { t.isFavorite = !t.isFavorite; store.upsert(store.keys.tips, t); rerender(); });
listWrap.appendChild(el('div', {class:'item'}, [
el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h4', {}, [t.title]),
el('div', {class:'muted'}, [t.category])
]),
heart,
el('button', {class:'btn primary', onclick: () => openTipDetail(t.id)}, ['Open'])
])
]));
}
}
function openTipDetail(tipId){
const tip = store.find(store.keys.tips, tipId);
if(!tip) return;
const ta = el('textarea', {readonly:true}, [`${tip.title}\n\n${tip.body}\n\n— The Cruise Companion™`]);
const body = el('div', {class:'list'}, [
el('h3', {}, [tip.title]),
el('div', {class:'muted'}, [tip.category]),
el('p', {}, [tip.body])
]);
const copyBtn = el('button', {class:'btn', onclick: async () => {
try{ await navigator.clipboard.writeText(ta.value); alert('Copied.'); }
catch{ alert('Copy failed.'); }
}}, ['Copy']);
const favBtn = el('button', {class:'btn primary'}, [tip.isFavorite ? 'Unfavorite' : 'Favorite']);
favBtn.addEventListener('click', () => { tip.isFavorite = !tip.isFavorite; store.upsert(store.keys.tips, tip); closeModal(); rerender(); });
const footer = el('div', {class:'row'}, [copyBtn, favBtn, el('span',{class:'spacer'}), el('button',{class:'btn', onclick: () => closeModal()},['Close'])]);
openModal({ title: 'Tip', bodyNode: body, footerNode: footer });
}
q.addEventListener('input', rerender);
rerender();
}
