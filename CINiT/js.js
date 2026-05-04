let projects = [];
let nextId = 1;
let editingId = null;
let deletingId = null;





function render() {
  let grid = document.getElementById("grid");

  if (projects.length === 0) {
    grid.innerHTML = '<div class="empty"><span class="empty-icon">🗂️</span><h3>No projects yet</h3><p>Click "New Project" to add one.</p></div>';
    return;
  }

  grid.innerHTML = projects.map(function(p, i) {

    return '<div class="card" style="animation-delay:' + (i * 0.05) + 's">' +
      '<div class="card-top">' +
        '<div class="card-title">' + escHtml(p.name) + '</div>' +

        '<div class="card-actions">' +
          '<button class="icon-btn" title="Edit" onclick="openEdit(' + p.id + ')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
          '</button>' +
          '<button class="icon-btn del" title="Delete" onclick="openDelete(' + p.id + ')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<p class="card-desc">' + escHtml(p.desc || "No description provided.") + '</p>' +
    '</div>';
  }).join("");
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}


function openAdd() {
  editingId = null;
  document.getElementById("modal-title").textContent = "New Project";
  document.getElementById("f-name").value = "";
  document.getElementById("f-desc").value = "";
  document.getElementById("modal-overlay").classList.add("show");
  document.getElementById("f-name").focus();
}

function openEdit(id) {
  let p = projects.find(function(x){ return x.id === id; });
  if (!p) return;
  editingId = id;
  document.getElementById("modal-title").textContent = "Edit Project";
  document.getElementById("f-name").value = p.name;
  document.getElementById("f-desc").value = p.desc;
  document.getElementById("modal-overlay").classList.add("show");
  document.getElementById("f-name").focus();
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
}

function overlayClick(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModal();
}

function saveProject() {
  let name = document.getElementById("f-name").value.trim();
  if (!name) { toast("Project name is required.", "error"); 
    document.getElementById("f-name").focus(); return; }

  if (editingId) {
    projects = projects.map(function(p) {
      if (p.id !== editingId) return p;
      return {
        id: p.id,
        name: name,
        desc: document.getElementById("f-desc").value.trim(),
      };
    });
 
  } else {
    projects.push({
      id: nextId++,
      name: name,
      desc: document.getElementById("f-desc").value.trim(),
    });

  }

  closeModal();
  render();
}


function openDelete(id) {
  deletingId = id;
  document.getElementById("del-overlay").classList.add("show");
}

function closeDelModal() {
  document.getElementById("del-overlay").classList.remove("show");
  deletingId = null;
}

function delOverlayClick(e) {
  if (e.target === document.getElementById("del-overlay")) closeDelModal();
}

function confirmDelete() {
  projects = projects.filter(function(p){ return p.id !== deletingId; });
  closeDelModal();
  render();
  toast("Project deleted", "error");
}


let toastTimer = null;
function toast(msg, type) {
    console.log(type + ": " + msg);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ el.classList.remove("show"); }, 2800);
}


document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") { closeModal(); closeDelModal(); }
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); openAdd(); }
});


render();