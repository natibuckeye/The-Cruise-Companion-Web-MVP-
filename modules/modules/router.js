// Optional: URL hash routing (so tabs are linkable/bookmarkable)
// This is not required for the MVP, but it improves usability.
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
});
}
