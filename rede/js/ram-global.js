// ===============================
// RAM GLOBAL ENGINE + UI
// ===============================

const RAM_META=[
  {id:1,label:"Achados",file:"ram1.html"},
  {id:2,label:"Evolução",file:"ram2.html"},
  {id:3,label:"Análise",file:"ram3.html"},
  {id:4,label:"Plano",file:"ram4.html"},
  {id:5,label:"Síntese",file:"ram-sintese.html"}
];

// ===============================
// STORAGE
// ===============================

function getState(){
  return JSON.parse(localStorage.getItem("ram-state")||"{}");
}

function saveState(state){
  localStorage.setItem("ram-state",JSON.stringify(state));
}

// ===============================
// BLOQUEIO
// ===============================

function isBlocked(id){
  if(id===1) return false;
  const state=getState();
  return !(state[id-1]?.done);
}

// ===============================
// DASHBOARD
// ===============================

function renderDashboard(){
  const state=getState();
  const container=document.getElementById("ramDashboard");

  RAM_META.forEach(r=>{
    const s=state[r.id]||{};
    const blocked=isBlocked(r.id);

    const color={
      green:"success",
      yellow:"warning",
      red:"danger"
    }[s.clinical]||"secondary";

    container.innerHTML+=`
      <div class="col-md-4">
        <div class="card border-${color}" onclick="goRam(${r.id})">
          <div class="card-body">
            <h5>RAM ${r.id}</h5>
            <p>${r.label}</p>

            <span class="badge bg-${color}">
              ${blocked?"bloqueado":(s.clinical||"sem avaliação")}
            </span>

          </div>
        </div>
      </div>
    `;
  });
}

// ===============================
// TIMELINE
// ===============================

function renderTimeline(){
  const state=getState();
  const el=document.getElementById("ramTimeline");

  RAM_META.forEach(r=>{
    const s=state[r.id]||{};
    const color={
      green:"#22c55e",
      yellow:"#eab308",
      red:"#ef4444"
    }[s.clinical]||"#cbd5f5";

    el.innerHTML+=`
      <div class="timeline-item">
        <div class="timeline-dot" style="background:${color}"></div>
        <div class="timeline-text">RAM ${r.id} • ${r.label}</div>
      </div>
    `;
  });
}

// ===============================
// SUMMARY
// ===============================

function renderSummary(){
  const state=getState();
  const el=document.getElementById("ramSummary");

  RAM_META.forEach(r=>{
    const s=state[r.id]||{};
    const color={
      green:"success",
      yellow:"warning",
      red:"danger"
    }[s.clinical]||"secondary";

    el.innerHTML+=`
      <span class="badge bg-${color}">
        RAM ${r.id} • ${s.clinical||"—"}
      </span>
    `;
  });
}

// ===============================
// NAV
// ===============================

window.goRam=function(id){
  if(isBlocked(id)){
    alert("Fluxo assistencial: concluir RAM anterior.");
    return;
  }
  location.href=RAM_META.find(r=>r.id===id).file;
}

// ===============================
// INIT
// ===============================

renderDashboard();
renderTimeline();
renderSummary();
