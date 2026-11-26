const KEY = "prime-tracker-v1";
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const defaults = [
  {id:"creatine",name:"Tomar creatina",frequency:"daily"},
  {id:"train",name:"Entrenamiento",frequency:"weekdays"},
  {id:"abs",name:"Abdominales",frequency:"weekdays"},
  {id:"read",name:"Leer 10 minutos",frequency:"daily"},
  {id:"water",name:"Tomar suficiente agua",frequency:"daily"}
];
let state = load();
const $ = id => document.getElementById(id);
function load(){
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if(saved && Array.isArray(saved.habits) && saved.completions) return saved;
  } catch(e){}
  return {habits:defaults,completions:{}};
}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function dateKey(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function isScheduled(h,date=new Date()){
  const day=date.getDay();
  return h.frequency==="daily" || (h.frequency==="weekdays" && day>=1 && day<=5) || (h.frequency==="weekends" && (day===0||day===6));
}
function completed(id,key=today()){return !!(state.completions[key]||[]).includes(id)}
function toggle(id){
  const key=today();state.completions[key] ||= [];
  const list=state.completions[key];
  state.completions[key]=list.includes(id)?list.filter(x=>x!==id):[...list,id];
  save();render();
}
function frequencyLabel(f){return f==="daily"?"DIARIO":f==="weekdays"?"LUNES A VIERNES":"FIN DE SEMANA"}
function render(){
  const now=new Date();
  $("date-chip").textContent=now.toLocaleDateString("es-MX",{day:"2-digit",month:"short"}).toUpperCase();
  $("day-label").textContent=now.toLocaleDateString("es-MX",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();
  const scheduled=state.habits.filter(h=>isScheduled(h,now));
  const done=scheduled.filter(h=>completed(h.id)).length;
  const total=scheduled.length, pct=total?Math.round(done/total*100):0;
  $("done-count").textContent=done;$("total-count").textContent=total;$("percent").textContent=pct+"%";
  $("progress-fill").style.width=pct+"%";
  $("progress-message").textContent=pct===100&&total?"Día completado. Buen trabajo.":pct>=50?"Vas bien. Mantén el ritmo.":"El progreso se construye con acciones pequeñas.";
  const list=$("habit-list");list.innerHTML="";
  if(!scheduled.length){list.innerHTML='<div class="empty-state">No tienes hábitos programados para hoy. Agrega uno con el botón +.</div>'}
  scheduled.forEach(h=>{
    const isDone=completed(h.id);
    const el=document.createElement("article");el.className="habit"+(isDone?" is-done":"");
    const check=document.createElement("button");check.className="check";check.setAttribute("aria-label",isDone?"Marcar pendiente":"Completar hábito");
    check.innerHTML=isDone?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12 4 4L19 6"/></svg>':"";
    check.addEventListener("click",()=>toggle(h.id));
    const main=document.createElement("div");main.className="habit-main";
    const name=document.createElement("div");name.className="habit-name";name.textContent=h.name;
    const meta=document.createElement("div");meta.className="habit-meta";meta.textContent=frequencyLabel(h.frequency);
    main.append(name,meta);
    const actions=document.createElement("div");actions.className="habit-actions";
    const del=document.createElement("button");del.className="delete-button";del.textContent="···";del.title="Eliminar hábito";
    del.addEventListener("click",()=>{if(confirm(`¿Eliminar "${h.name}" de tu tracker?`)){state.habits=state.habits.filter(x=>x.id!==h.id);save();render();showToast("Hábito eliminado")}})
    actions.append(del);el.append(check,main,actions);list.append(el);
  });
  $("streak").textContent=calculateStreak();
  $("week-rate").textContent=weeklyRate();
}
function calculateStreak(){
  let streak=0;
  for(let i=0;i<365;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const scheduled=state.habits.filter(h=>isScheduled(h,d));
    if(!scheduled.length){if(i===0)continue;else break}
    const key=dateKey(-i);
    if(scheduled.every(h=>(state.completions[key]||[]).includes(h.id)))streak++;
    else break;
  }
  return streak;
}
function weeklyRate(){
  let done=0,total=0;
  for(let i=0;i<7;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const key=dateKey(-i);
    state.habits.filter(h=>isScheduled(h,d)).forEach(h=>{total++;if((state.completions[key]||[]).includes(h.id))done++});
  }
  return total?Math.round(done/total*100):0;
}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
$("open-add").addEventListener("click",()=>$("habit-dialog").showModal());
$("close-add").addEventListener("click",()=>$("habit-dialog").close());
$("habit-form").addEventListener("submit",e=>{
  e.preventDefault();const name=$("habit-name").value.trim();if(!name)return;
  state.habits.push({id:"h"+Date.now(),name,frequency:$("habit-frequency").value});
  save();render();$("habit-dialog").close();$("habit-form").reset();showToast("Hábito agregado");
});
if("serviceWorker" in navigator && location.protocol!=="file:"){navigator.serviceWorker.register("./sw.js").catch(()=>{})}
render();
