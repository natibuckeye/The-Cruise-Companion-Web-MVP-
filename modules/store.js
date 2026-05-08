const NS = 'tcc:v1:';
function read(key, fallback){
try{
const raw = localStorage.getItem(NS+key);
if(raw === null) return fallback;
return JSON.parse(raw);
}catch{ return fallback; }
}
function write(key, value){
localStorage.setItem(NS+key, JSON.stringify(value));
}
function uid(prefix='id'){
return prefix + '_' + Math.random().toString(16).slice(2) + Date.now().toString(16);
}
export const store = {
keys:{
didImport: 'didImport',
ui: 'ui',
trips:'trips',
portPlans:'portPlans',
packingLists:'packingLists',
messages:'messages',
matchmakerResults:'matchmakerResults',
tips:'tips',
packingTemplates:'packingTemplates'
},
uid,
read,
write,
getUI(){ return read(this.keys.ui, { selectedTab:'trips', currentTripId:null }); },
setUI(ui){ write(this.keys.ui, ui); },
list(entityKey){ return read(entityKey, []); },
setList(entityKey, arr){ write(entityKey, arr); },
upsert(entityKey, obj){
const arr = this.list(entityKey);
const idx = arr.findIndex(x => x.id === obj.id);
if(idx >= 0) arr[idx] = obj; else arr.push(obj);
this.setList(entityKey, arr);
return obj;
},
remove(entityKey, id){
const arr = this.list(entityKey).filter(x => x.id !== id);
this.setList(entityKey, arr);
},
find(entityKey, id){
return this.list(entityKey).find(x => x.id === id) || null;
}
};
