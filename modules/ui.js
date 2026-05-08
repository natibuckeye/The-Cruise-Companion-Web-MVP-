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
}
