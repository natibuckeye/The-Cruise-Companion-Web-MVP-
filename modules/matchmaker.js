import { store } from './store.js';
import { el, openModal, closeModal } from './ui.js';
const Dimensions = {
chill:'chill', party:'party', foodie:'foodie', adventure:'adventure', culture:'culture', family:'family',
budget:'budget', splurge:'splurge', smallShip:'smallShip', largeShip:'largeShip'
};
function addScore(total, delta){
const out = {...total};
for(const [k,v] of Object.entries(delta||{})) out[k] = (out[k]||0) + v;
return out;
}
function questions(){
return [
{ id:'q1', text:'Your ideal first hour onboard is…', answers:[
{ text:'Find a quiet spot and do a full vacation exhale.', points:{[Dimensions.chill]:3}},
{ text:'Explore every deck like it’s a scavenger hunt.', points:{[Dimensions.adventure]:3,[Dimensions.largeShip]:1}},
{ text:'Locate the best snack immediately—priorities.', points:{[Dimensions.foodie]:3}},
{ text:'Cheers at the nearest bar because we’re on vacation.', points:{[Dimensions.party]:3}}
]},
{ id:'q2', text:'Pick your must-have vibe:', answers:[
{ text:'Spa robe + ocean view + no notifications.', points:{[Dimensions.chill]:3,[Dimensions.splurge]:1}},
{ text:'Live music + themed parties + late nights.', points:{[Dimensions.party]:3}},
{ text:'A list of restaurants I’m determined to conquer.', points:{[Dimensions.foodie]:3}},
{ text:'Ports that make me say “I can’t believe we’re doing this!”', points:{[Dimensions.adventure]:3}}
]},
{ id:'q3', text:'Port day energy check:', answers:[
{ text:'Beach chair, book, and a drink with an umbrella.', points:{[Dimensions.chill]:3}},
{ text:'Walking tour + museum + local market.', points:{[Dimensions.culture]:3}},
{ text:'Snorkel/zipline/ATV—let’s go.', points:{[Dimensions.adventure]:3}},
{ text:'Stay onboard for pools and shorter lines.', points:{[Dimensions.chill]:2,[Dimensions.budget]:1}}
]},
{ id:'q4', text:'Dinner is…', answers:[
{ text:'A culinary event. I’m trying everything.', points:{[Dimensions.foodie]:3,[Dimensions.splurge]:1}},
{ text:'Fuel, because I have places to be.', points:{[Dimensions.adventure]:2}},
{ text:'A social hour—bring on the people and laughs.', points:{[Dimensions.party]:2,[Dimensions.family]:1}},
{ text:'Something easy so I can get back to relaxing.', points:{[Dimensions.chill]:2,[Dimensions.budget]:1}}
]},
{ id:'q5', text:'How do you feel about crowds?', answers:[
{ text:'No thanks—give me cozy and calm.', points:{[Dimensions.smallShip]:3,[Dimensions.chill]:1}},
{ text:'I’m fine if it means more to do.', points:{[Dimensions.largeShip]:3}},
{ text:'I’ll tolerate crowds for the right food/experience.', points:{[Dimensions.foodie]:2,[Dimensions.culture]:1}},
{ text:'Crowds are part of the party.', points:{[Dimensions.party]:2,[Dimensions.largeShip]:1}}
]},
{ id:'q6', text:'When something goes off-plan, you…', answers:[
{ text:'Shrug and pivot—still on vacation.', points:{[Dimensions.chill]:2}},
{ text:'Find the next best option and keep it moving.', points:{[Dimensions.adventure]:2}},
{ text:'Ask around and turn it into a story.', points:{[Dimensions.party]:1,[Dimensions.culture]:1}},
{ text:'Need a backup plan ready (especially with kids).', points:{[Dimensions.family]:2}}
]}
];
}
function compute(score){
const core = [
{dim:Dimensions.chill, label:'Chill Cruiser'},
{dim:Dimensions.party, label:'Party Deck Pro'},
{dim:Dimensions.foodie, label:'Foodie Sailor'},
{dim:Dimensions.adventure, label:'Adventure Chaser'},
{dim:Dimensions.culture, label:'Culture Curator'},
{dim:Dimensions.family, label:'Family Fun Captain'}
];
const ranked = core.map(x => ({...x, score: score[x.dim]||0})).sort((a,b) => b.score - a.score);
const primary = ranked[0]?.label || 'Balanced Voyager';
const primaryScore = ranked[0]?.score || 0;
const secondary = (ranked[1] && primaryScore > 0 && ranked[1].score > 0 && (primaryScore - ranked[1].score) <= 1) ? ranked[1].label : null;
const shipSizePreference = (score[Dimensions.smallShip]||0) > (score[Dimensions.largeShip]||0) + 1
? 'We’re leaning smaller ships.'
: (score[Dimensions.largeShip]||0) > (score[Dimensions.smallShip]||0) + 1
? 'We’re leaning bigger ships.'
: 'We’re good with either ship size.';
const budgetStyle = (score[Dimensions.budget]||0) > (score[Dimensions.splurge]||0) + 1
? 'Value-forward'
: (score[Dimensions.splurge]||0) > (score[Dimensions.budget]||0) + 1
? 'Treat-yourself'
: 'Balanced budget';
const headline = secondary ? `${primary} + ${secondary}` : primary;
const subhead = secondary
? 'Two strong vibes showed up—so we’re giving you the best of both.'
: ({
'Chill Cruiser':'Calm views, low-pressure days, and main-character rest.',
'Party Deck Pro':'Music, themed nights, and at least one “one more song” moment.',
'Foodie Sailor':'You plan meals like a sport—and we respect it.',
'Adventure Chaser':'Brag-worthy ports and active days.',
'Culture Curator':'Stories, history, and local flavor.',
'Family Fun Captain':'Smooth logistics and happy humans.',
'Balanced Voyager':'A little bit of everything—without extremes.'
}[primary] || 'A little bit of everything—without extremes.');
const recsFor = (label) => ({
'Chill Cruiser':['Prioritize sea days and quiet spaces','Consider a balcony','Schedule one spa/relaxation block'],
'Party Deck Pro':['Plan nightlife-friendly evenings','Choose ships with strong entertainment','Set a fun (and safe) drink plan'],
'Foodie Sailor':['Book one specialty dining night','Try tastings when available','Add a port-day food moment'],
'Adventure Chaser':['Itinerary-first planning','Early port starts','Pack comfortable shoes as non-negotiable'],
'Culture Curator':['Walkable ports and guided tours','Build a short must-see list','Add etiquette notes in Port Planner'],
'Family Fun Captain':['Create an everyone’s must-do list','Pick clear regroup points','Snack strategy for port days'],
'Balanced Voyager':['Pick a balanced itinerary','Mix ports + rest','Use daily tips to stay flexible']
}[label] || []);
const recommendations = secondary
? Array.from(new Set([...recsFor(primary).slice(0,3), ...recsFor(secondary).slice(0,3)])).slice(0,6)
: recsFor(primary);
return { personalityLabel: headline, subhead, shipSizePreference, budgetStyle, recommendations, scoreByDimension: score };
}
export function renderMatchmaker(root, state){
const tripId = state.ui.currentTripId;
root.appendChild(el('div', {class:'row'}, [
el('div', {class:'spacer'}, [
el('h2', {}, ['Matchmaker']),
el('div', {class:'muted'}, ["Let’s find your cruise vibe."])
]),
el('button', {class:'btn primary', onclick: () => startQuiz(state)}, ['Start the quiz'])
]));
if(!tripId){
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['Pick a trip to save your result.']),
el('p', {class:'muted'}, ['You can still take the quiz, but saving is tied to a trip.'])
]));
}
const results = store.list(store.keys.matchmakerResults)
.filter(r => tripId ? r.tripId === tripId : true)
.sort((a,b) => (b.createdAt||'').localeCompare(a.createdAt||''));
if(results.length){
const r = results[0];
root.appendChild(el('div', {class:'card'}, [
el('h3', {}, ['Your latest match']),
el('p', {}, [`We’re pairing you with ${r.personality} energy.`]),
el('p', {class:'muted'}, [r.subhead]),
el('p', {class:'muted'}, [`${r.shipSizePreference} Budget style: ${r.budgetStyle}`]),
el('div', {}, [
el('div', {class:'muted'}, ['We recommend:']),
el('ul', {}, (r.recommendations||[]).slice(0,3).map(x => el('li', {}, [x])))
])
]));
}
}
function startQuiz(state){
const qs = questions();
let idx = 0;
const selections = {};
function renderStep(){
const q = qs[idx];
const body = el('div', {class:'list'}, [
el('div', {class:'muted'}, [`Question ${idx+1} of ${qs.length}`]),
el('h3', {}, [q.text]),
el('div', {class:'list'}, q.answers.map((a,i) => {
const picked = selections[q.id] === i;
return el('button', {class:'btn' + (picked ? ' primary' : ''), onclick: () => { selections[q.id]=i; renderStep(); }}, [a.text]);
}))
]);
const footer = el('div', {class:'row'}, [
el('button', {class:'btn', onclick: () => { if(idx>0){ idx--; renderStep(); } }}, ['Back']),
el('span', {class:'spacer'}),
el('button', {class:'btn primary', onclick: () => {
if(selections[q.id] === undefined){ alert('Pick an answer to continue.'); return; }
if(idx === qs.length - 1) finish(); else { idx++; renderStep(); }
}}, [idx === qs.length - 1 ? 'Finish' : 'Next'])
]);
openModal({ title: 'Matchmaker Quiz', bodyNode: body, footerNode: footer });
}
function finish(){
let score = {};
for(const q of qs){
const pick = selections[q.id];
if(pick === undefined) continue;
score = addScore(score, q.answers[pick].points);
}
showResult(state, compute(score));
}
renderStep();
}
function showResult(state, computed){
const tripId = state.ui.currentTripId;
const body = el('div', {class:'list'}, [
el('h3', {}, [`We’re pairing you with ${computed.personalityLabel} energy.`]),
el('p', {class:'muted'}, [computed.subhead]),
el('p', {class:'muted'}, [computed.shipSizePreference]),
el('p', {class:'muted'}, [`Budget style: ${computed.budgetStyle}`]),
el('div', {}, [
el('div', {class:'muted'}, ['We recommend:']),
el('ul', {}, computed.recommendations.map(r => el('li', {}, [r])))
])
]);
const footer = el('div', {class:'row'}, [
el('span', {class:'spacer'}),
el('button', {class:'btn', onclick: () => closeModal()}, ['Done']),
el('button', {class:'btn primary', onclick: () => {
if(!tripId){ alert('Pick a trip first (top right).'); return; }
store.upsert(store.keys.matchmakerResults, {
id: store.uid('mm'),
tripId,
createdAt: new Date().toISOString(),
personality: computed.personalityLabel,
subhead: computed.subhead,
shipSizePreference: computed.shipSizePreference,
budgetStyle: computed.budgetStyle,
recommendations: computed.recommendations,
scoreByDimension: computed.scoreByDimension
});
closeModal();
location.reload();
}}, ['Save result to this trip'])
]);
openModal({ title: 'Your Match', bodyNode: body, footerNode: footer });
}
