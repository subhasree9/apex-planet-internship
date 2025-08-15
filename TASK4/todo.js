const LS_KEY = "reethika_todos_v1";
const listEl = document.getElementById("todoList");
const formEl = document.getElementById("todoForm");
const inputEl = document.getElementById("todoText");
const priorityEl = document.getElementById("priority");
const searchEl = document.getElementById("search");
const filterStateEl = document.getElementById("filterState");
const clearDoneBtn = document.getElementById("clearDone");
const countEl = document.getElementById("count");

let items = load();

function load(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(items)); }

function render(){
  const q = (searchEl.value || "").toLowerCase();
  const state = filterStateEl.value;

  const filtered = items.filter(it => {
    const textMatch = it.text.toLowerCase().includes(q);
    const stateMatch = state === "all" || (state === "done" ? it.done : !it.done);
    return textMatch && stateMatch;
  });

  listEl.innerHTML = "";
  filtered.forEach(it => listEl.appendChild(row(it)));
  const open = items.filter(i=>!i.done).length;
  countEl.textContent = `${open} open • ${items.length} total`;
}

function row(it){
  const li = document.createElement("li");
  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.checked = it.done;
  toggle.addEventListener("change", () => { it.done = toggle.checked; save(); render(); });

  const text = document.createElement("input");
  text.value = it.text;
  text.className = it.done ? "done" : "";
  text.addEventListener("input", () => { it.text = text.value; save(); });

  const badge = document.createElement("span");
  badge.className = "tag";
  badge.textContent = it.priority;

  const del = document.createElement("button");
  del.className = "btn btn-ghost";
  del.textContent = "Delete";
  del.addEventListener("click", () => {
    items = items.filter(x => x.id !== it.id);
    save(); render();
  });

  li.append(toggle, text, badge, del);
  return li;
}

formEl.addEventListener("submit", e => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  items.unshift({ id: crypto.randomUUID(), text, done:false, priority: priorityEl.value, ts: Date.now() });
  inputEl.value = ""; priorityEl.value = "normal";
  save(); render();
});

searchEl.addEventListener("input", render);
filterStateEl.addEventListener("change", render);
clearDoneBtn.addEventListener("click", () => {
  items = items.filter(i => !i.done);
  save(); render();
});

render();
