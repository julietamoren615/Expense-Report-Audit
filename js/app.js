/* TarjetasApp — main application */

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://eqenqgrqvjithlayrezv.supabase.co';
const SUPABASE_KEY  = 'TU_ANON_KEY_AQUI';
const STORAGE_KEY   = 'tarjetasapp_v1';
const BUCKET        = 'tarjetas-fotos';
const CATEGORIAS    = [
  'Combustible','Peajes','Comidas','Alojamiento',
  'Materiales','Servicios','Mantenimiento','Otros'
];

// ─── STATE ─────────────────────────────────────────────────────────────────
let state = { tarjetas: [], gastos: [], empleados: [] };
let currentUser   = null;   // { id, nombre, is_admin, tarjeta_id, ... }
let _supabase     = null;
let _channel      = null;
let _installPrompt= null;
let _pendingPin   = '';
let _selectedEmpId= null;
let _photoFile    = null;
let _photoBlob    = null;

// ─── STORAGE ───────────────────────────────────────────────────────────────
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch (_) {}
}

// ─── UTILS ─────────────────────────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function today() { return new Date().toISOString().slice(0, 10); }
function currentMonth() { return new Date().toISOString().slice(0, 7); }

function fmtPeso(n) {
  return '$' + Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(s) {
  if (!s) return '';
  const [y, m, d] = s.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
function daysUntilDay(day) {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), day);
  if (target <= now) target.setMonth(target.getMonth() + 1);
  return Math.ceil((target - now) / 86400000);
}

function gastoStatus(g) {
  if (g.aprobado === true)  return 'aprobado';
  if (g.aprobado === false) return 'rechazado';
  return 'pendiente';
}
function statusBadge(g) {
  const s = gastoStatus(g);
  const labels = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' };
  return `<span class="badge badge-${s}">${labels[s]}</span>`;
}
function tarjetaChip(tarjeta_id) {
  const t = state.tarjetas.find(x => x.id === tarjeta_id);
  if (!t) return '';
  return `<span class="chip-card">${t.nombre}</span>`;
}
function catChip(cat) {
  return `<span class="chip-cat">${cat || ''}</span>`;
}
function empNombre(emp_id) {
  const e = state.empleados.find(x => x.id === emp_id);
  return e ? e.nombre : '—';
}
function tarjetaNombre(tarjeta_id) {
  const t = state.tarjetas.find(x => x.id === tarjeta_id);
  return t ? t.nombre : '—';
}

// ─── TOAST ─────────────────────────────────────────────────────────────────
let _toastTimer = null;
function toast(msg, type = 'info') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `toast visible ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function openModal(html, onClose) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-box">${html}</div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(onClose); });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
}
function closeModal(cb) {
  const el = document.getElementById('modal-overlay');
  if (el) el.remove();
  if (typeof cb === 'function') cb();
}

// ─── LIGHTBOX ──────────────────────────────────────────────────────────────
function showLightbox(url) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<img src="${url}" alt="ticket">`;
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
}

// ─── PWA — SERVICE WORKER ──────────────────────────────────────────────────
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      sw.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          document.getElementById('update-banner').classList.remove('hidden');
        }
      });
    });
  });
}
function applyUpdate() {
  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  });
}
function renderInstallBtn() {
  if (!_installPrompt) return '';
  return `<button class="install-btn" onclick="doInstall()">Instalar app</button>`;
}
function doInstall() {
  if (!_installPrompt) return;
  _installPrompt.prompt();
  _installPrompt.userChoice.then(() => { _installPrompt = null; });
}

// ─── SUPABASE ──────────────────────────────────────────────────────────────
function initSupabase() {
  if (SUPABASE_KEY === 'TU_ANON_KEY_AQUI') return null;
  try {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _supabase;
  } catch (e) {
    console.warn('Supabase init error', e);
    return null;
  }
}

async function syncEmpleados() {
  if (!_supabase) return;
  try {
    const { data, error } = await _supabase.from('empleados_tarjetas').select('*').order('nombre');
    if (!error && data) { state.empleados = data; save(); }
  } catch (_) {}
}
async function syncTarjetas() {
  if (!_supabase) return;
  try {
    const { data, error } = await _supabase.from('tarjetas').select('*').order('nombre');
    if (!error && data) { state.tarjetas = data; save(); }
  } catch (_) {}
}
async function syncGastos() {
  if (!_supabase) return;
  try {
    const { data, error } = await _supabase.from('tarjeta_gastos').select('*').order('fecha', { ascending: false });
    if (!error && data) { state.gastos = data; save(); }
  } catch (_) {}
}
async function syncAll() {
  await Promise.all([syncEmpleados(), syncTarjetas(), syncGastos()]);
}

async function pushGasto(gasto) {
  if (!_supabase) {
    state.gastos.unshift(gasto);
    save();
    return gasto;
  }
  try {
    const { data, error } = await _supabase.from('tarjeta_gastos').insert(gasto).select().single();
    if (error) throw error;
    state.gastos.unshift(data);
    save();
    return data;
  } catch (e) {
    toast('Error al guardar gasto', 'error');
    throw e;
  }
}

async function setAprobado(id, value) {
  if (!_supabase) {
    const g = state.gastos.find(x => x.id === id);
    if (g) g.aprobado = value;
    save();
    return;
  }
  try {
    const { error } = await _supabase.from('tarjeta_gastos').update({ aprobado: value }).eq('id', id);
    if (error) throw error;
    const g = state.gastos.find(x => x.id === id);
    if (g) g.aprobado = value;
    save();
  } catch (e) {
    toast('Error al actualizar', 'error');
    throw e;
  }
}

async function deleteGasto(id) {
  if (!_supabase) {
    state.gastos = state.gastos.filter(x => x.id !== id);
    save();
    return;
  }
  try {
    const { error } = await _supabase.from('tarjeta_gastos').delete().eq('id', id);
    if (error) throw error;
    state.gastos = state.gastos.filter(x => x.id !== id);
    save();
  } catch (e) {
    toast('Error al eliminar', 'error');
    throw e;
  }
}

function initRealtime() {
  if (!_supabase) return;
  if (_channel) { _supabase.removeChannel(_channel); _channel = null; }
  _channel = _supabase.channel('tarjetas-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tarjeta_gastos' }, () => {
      syncGastos().then(() => {
        if (currentUser) {
          const screen = document.querySelector('.app-screen');
          const activeTab = document.querySelector('.bottom-tab.active');
          if (screen && activeTab) {
            const tab = activeTab.dataset.tab;
            if (currentUser.is_admin) renderAdmin(tab);
            else renderEmpleado(tab);
          }
        }
      });
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tarjetas' }, () => {
      syncTarjetas();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'empleados_tarjetas' }, () => {
      syncEmpleados();
    })
    .subscribe();
}

// ─── IMAGE ─────────────────────────────────────────────────────────────────
function compressImage(file, maxW = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('compress failed')), 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function uploadPhoto(blob, filename) {
  if (!_supabase) return null;
  try {
    const path = `gastos/${today()}_${filename}`;
    const { data, error } = await _supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) throw error;
    const { data: urlData } = _supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (e) {
    console.warn('Photo upload error', e);
    return null;
  }
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────
function navigate(screen, tab) {
  const app = document.getElementById('app');
  if (screen === 'welcome') { renderWelcome(); return; }
  if (screen === 'empleado') { renderEmpleado(tab || 'nuevo'); return; }
  if (screen === 'admin')    { renderAdmin(tab || 'gastos'); return; }
}

function logout() {
  currentUser = null;
  _pendingPin = '';
  _selectedEmpId = null;
  renderWelcome();
}

// ─── WELCOME SCREEN ────────────────────────────────────────────────────────
function renderWelcome() {
  _pendingPin = '';
  _selectedEmpId = null;
  const app = document.getElementById('app');

  const empList = state.empleados.length
    ? state.empleados.map(e => `
        <button class="emp-btn" onclick="selectEmp('${e.id}')">
          <span class="emp-avatar">${e.nombre.charAt(0).toUpperCase()}</span>
          <span class="emp-name">${e.nombre}</span>
          ${e.is_admin ? '<span class="badge-admin">Admin</span>' : ''}
        </button>`).join('')
    : `<p class="empty-state" style="padding:24px">Sin empleados cargados</p>`;

  app.innerHTML = `
    <div class="welcome-wrap">
      <div class="welcome-card">
        <div class="welcome-logo">${logoSVG()}</div>
        <h1 class="welcome-title">TarjetasApp</h1>
        <p class="welcome-sub">Gestión de gastos corporativos</p>
        <div class="emp-list">${empList}</div>
        ${renderInstallBtn()}
      </div>
    </div>`;
}

function logoSVG() {
  return `<svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="42">
    <rect x="2" y="6" width="60" height="36" rx="6" fill="#af9e78"/>
    <rect x="2" y="16" width="60" height="10" fill="#3a2e1e" opacity=".35"/>
    <rect x="10" y="30" width="20" height="7" rx="2" fill="#fbe8c0" opacity=".7"/>
    <circle cx="50" cy="33" r="5" fill="#e8d6ae" opacity=".6"/>
    <circle cx="56" cy="33" r="5" fill="#af9e78" opacity=".85"/>
  </svg>`;
}

function selectEmp(id) {
  _selectedEmpId = id;
  const emp = state.empleados.find(e => e.id === id);
  if (!emp) return;
  renderPinPad(emp);
}

function renderPinPad(emp) {
  _pendingPin = '';
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="welcome-wrap">
      <div class="welcome-card">
        <button class="btn-icon back-btn" onclick="backToList()" title="Volver">&#8592;</button>
        <div class="emp-avatar large">${emp.nombre.charAt(0).toUpperCase()}</div>
        <h2 class="pin-name">${emp.nombre}</h2>
        <div class="pin-dots" id="pin-dots">
          <span class="pin-dot" id="pd0"></span>
          <span class="pin-dot" id="pd1"></span>
          <span class="pin-dot" id="pd2"></span>
          <span class="pin-dot" id="pd3"></span>
        </div>
        <p class="pin-label">Ingresá tu PIN de 4 dígitos</p>
        <div id="pin-error" class="pin-error hidden">PIN incorrecto</div>
        <div class="pin-grid">
          ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k => k === ''
            ? '<span></span>'
            : `<button class="pin-key" onclick="pinPress('${k}')">${k}</button>`
          ).join('')}
        </div>
      </div>
    </div>`;
}

function backToList() {
  _pendingPin = '';
  _selectedEmpId = null;
  renderWelcome();
}

function pinPress(key) {
  if (key === '⌫') {
    _pendingPin = _pendingPin.slice(0, -1);
  } else if (_pendingPin.length < 4) {
    _pendingPin += key;
  }
  updatePinDots();
  if (_pendingPin.length === 4) {
    setTimeout(verifyPin, 150);
  }
}

function updatePinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById('pd' + i);
    if (dot) dot.classList.toggle('filled', i < _pendingPin.length);
  }
}

function verifyPin() {
  const emp = state.empleados.find(e => e.id === _selectedEmpId);
  if (!emp) return;
  if (String(emp.pin) === String(_pendingPin)) {
    currentUser = emp;
    if (emp.is_admin) renderAdmin('gastos');
    else renderEmpleado('nuevo');
  } else {
    const err = document.getElementById('pin-error');
    if (err) err.classList.remove('hidden');
    _pendingPin = '';
    updatePinDots();
    setTimeout(() => { if (err) err.classList.add('hidden'); }, 2000);
  }
}

// ─── EMPLOYEE SCREEN ───────────────────────────────────────────────────────
function renderEmpleado(tab = 'nuevo') {
  const app = document.getElementById('app');
  const tabs = [
    { id: 'nuevo',    label: 'Nuevo gasto' },
    { id: 'historial',label: 'Historial'   },
  ];
  const content = tab === 'nuevo' ? renderNuevoGastoHTML() : renderHistorialHTML();

  app.innerHTML = `
    <div class="app-screen">
      <header class="app-header">
        <span class="header-logo">${logoSVG()}</span>
        <span class="header-title">TarjetasApp</span>
        <button class="btn-icon logout-btn" onclick="logout()" title="Salir">&#9664;</button>
      </header>
      <div class="content" id="main-content">
        <div class="top-tabs">
          ${tabs.map(t => `<button class="top-tab${tab===t.id?' active':''}" onclick="renderEmpleado('${t.id}')">${t.label}</button>`).join('')}
        </div>
        ${content}
      </div>
    </div>`;

  if (tab === 'nuevo') bindNuevoGasto();
}

function renderNuevoGastoHTML() {
  const tarjeta = state.tarjetas.find(t => t.id === currentUser.tarjeta_id);
  const tarjetaInfo = tarjeta
    ? `<div class="tarjeta-card mini">
        <div class="tarjeta-color-bar" style="background:${tarjeta.color||'#af9e78'}"></div>
        <div class="tarjeta-info">
          <span class="tarjeta-nombre">${tarjeta.nombre}</span>
          <span class="tarjeta-limite">Límite: ${fmtPeso(tarjeta.limite)}</span>
        </div>
       </div>`
    : `<div class="config-warn">No tenés tarjeta asignada. Contactá al administrador.</div>`;

  const cats = CATEGORIAS.map(c =>
    `<option value="${c}">${c}</option>`
  ).join('');

  return `
    <div class="form-wrap">
      ${tarjetaInfo}
      <div class="field">
        <label>Fecha</label>
        <input type="date" id="g-fecha" value="${today()}" max="${today()}">
      </div>
      <div class="field">
        <label>Categoría</label>
        <select id="g-cat"><option value="">Seleccioná...</option>${cats}</select>
      </div>
      <div class="field">
        <label>Descripción</label>
        <input type="text" id="g-desc" placeholder="Ej: Carga de combustible YPF" maxlength="120">
      </div>
      <div class="field">
        <label>Monto</label>
        <div class="input-prefix-wrap">
          <span class="input-prefix">$</span>
          <input type="number" id="g-monto" placeholder="0.00" min="0" step="0.01">
        </div>
      </div>
      <div class="field">
        <label>Foto del ticket <span class="field-opt">(opcional)</span></label>
        <div class="photo-area" id="photo-area" onclick="document.getElementById('photo-input').click()">
          <div class="photo-placeholder" id="photo-placeholder">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="6" width="20" height="15" rx="2"/>
              <circle cx="12" cy="13" r="3.5"/>
              <path d="M8 6V5a1 1 0 011-1h6a1 1 0 011 1v1"/>
            </svg>
            <span>Tocar para agregar foto</span>
          </div>
          <img id="photo-preview" class="photo-preview hidden" alt="ticket">
        </div>
        <input type="file" id="photo-input" accept="image/*" capture="environment" style="display:none" onchange="previewPhoto(event)">
      </div>
      <button class="btn-primary btn-full" id="btn-submit" onclick="submitGasto()">Registrar gasto</button>
    </div>`;
}

function bindNuevoGasto() {
  _photoFile = null;
  _photoBlob = null;
}

function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  _photoFile = file;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById('photo-preview');
  const placeholder = document.getElementById('photo-placeholder');
  if (preview) { preview.src = url; preview.classList.remove('hidden'); }
  if (placeholder) placeholder.classList.add('hidden');
}

async function submitGasto() {
  const tarjeta = state.tarjetas.find(t => t.id === currentUser.tarjeta_id);
  if (!tarjeta) { toast('Sin tarjeta asignada', 'error'); return; }

  const fecha  = document.getElementById('g-fecha')?.value;
  const cat    = document.getElementById('g-cat')?.value;
  const desc   = document.getElementById('g-desc')?.value.trim();
  const monto  = parseFloat(document.getElementById('g-monto')?.value);

  if (!fecha)           { toast('Seleccioná la fecha', 'error'); return; }
  if (!cat)             { toast('Seleccioná una categoría', 'error'); return; }
  if (!desc)            { toast('Completá la descripción', 'error'); return; }
  if (!monto || monto <= 0) { toast('Ingresá un monto válido', 'error'); return; }

  const btn = document.getElementById('btn-submit');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  let foto_url = null;
  if (_photoFile) {
    try {
      const blob = await compressImage(_photoFile);
      _photoBlob = blob;
      foto_url = await uploadPhoto(blob, uid() + '.jpg');
    } catch (_) { toast('No se pudo subir la foto', 'error'); }
  }

  const gasto = {
    tarjeta_id:  tarjeta.id,
    empleado_id: currentUser.id,
    fecha,
    categoria:   cat,
    descripcion: desc,
    monto,
    foto_url,
    aprobado:    null,
    created_at:  new Date().toISOString(),
  };

  try {
    await pushGasto(gasto);
    toast('Gasto registrado', 'success');
    renderEmpleado('historial');
  } catch (_) {
    if (btn) { btn.disabled = false; btn.textContent = 'Registrar gasto'; }
  }
}

function renderHistorialHTML() {
  const misGastos = state.gastos.filter(g => g.empleado_id === currentUser.id);
  const mes = currentMonth();
  const estesMes = misGastos.filter(g => g.fecha && g.fecha.startsWith(mes));
  const totalMes = estesMes.reduce((s, g) => s + Number(g.monto || 0), 0);
  const pendientes = estesMes.filter(g => g.aprobado === null).length;

  const tarjeta = state.tarjetas.find(t => t.id === currentUser.tarjeta_id);
  const limite   = tarjeta ? Number(tarjeta.limite || 0) : 0;
  const pct      = limite > 0 ? Math.min(100, Math.round(totalMes * 100 / limite)) : 0;

  const gastosHTML = misGastos.length
    ? misGastos.map(g => gastoCardHTML(g)).join('')
    : `<div class="empty-state">No registraste gastos aún</div>`;

  return `
    <div class="historial-wrap">
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-val">${fmtPeso(totalMes)}</span>
          <span class="stat-lbl">Gasto mes</span>
        </div>
        <div class="stat-chip">
          <span class="stat-val">${pendientes}</span>
          <span class="stat-lbl">Pendientes</span>
        </div>
        ${limite > 0 ? `<div class="stat-chip">
          <span class="stat-val">${pct}%</span>
          <span class="stat-lbl">Del límite</span>
        </div>` : ''}
      </div>
      ${limite > 0 ? `<div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>` : ''}
      <div class="gastos-list">${gastosHTML}</div>
    </div>`;
}

function gastoCardHTML(g, showEmp = false) {
  const hasPhoto = g.foto_url;
  return `
    <div class="gasto-card">
      <div class="gasto-card-top">
        <div class="gasto-meta">
          ${catChip(g.categoria)}
          ${statusBadge(g)}
        </div>
        <span class="gasto-monto">${fmtPeso(g.monto)}</span>
      </div>
      <div class="gasto-desc">${g.descripcion || ''}</div>
      <div class="gasto-card-bottom">
        <span class="gasto-fecha">${fmtDate(g.fecha)}</span>
        ${showEmp ? `<span class="gasto-emp">${empNombre(g.empleado_id)}</span>` : ''}
        ${tarjetaChip(g.tarjeta_id)}
        ${hasPhoto ? `<button class="btn-icon photo-btn" onclick="showLightbox('${g.foto_url}')" title="Ver ticket">&#128247;</button>` : ''}
      </div>
    </div>`;
}

// ─── ADMIN SCREEN ──────────────────────────────────────────────────────────
function renderAdmin(tab = 'gastos') {
  const app = document.getElementById('app');
  const tabs = [
    { id: 'gastos',    label: 'Gastos'    },
    { id: 'tarjetas',  label: 'Tarjetas'  },
    { id: 'empleados', label: 'Empleados' },
  ];

  let content = '';
  if (tab === 'gastos')    content = renderAdminGastosHTML();
  if (tab === 'tarjetas')  content = renderAdminTarjetasHTML();
  if (tab === 'empleados') content = renderAdminEmpleadosHTML();

  app.innerHTML = `
    <div class="app-screen">
      <header class="app-header">
        <span class="header-logo">${logoSVG()}</span>
        <span class="header-title">Admin</span>
        <button class="btn-icon logout-btn" onclick="logout()" title="Salir">&#9664;</button>
      </header>
      <div class="content" id="main-content">
        <div class="top-tabs">
          ${tabs.map(t => `<button class="top-tab${tab===t.id?' active':''}" onclick="renderAdmin('${t.id}')">${t.label}</button>`).join('')}
        </div>
        ${content}
      </div>
    </div>`;
}

// ADMIN — GASTOS ─────────────────────────────────────────────────────────────
function renderAdminGastosHTML() {
  const mes = currentMonth();
  const gastosMes = state.gastos.filter(g => g.fecha && g.fecha.startsWith(mes));
  const pendientes = state.gastos.filter(g => g.aprobado === null);
  const totalMes   = gastosMes.reduce((s, g) => s + Number(g.monto || 0), 0);

  const filtros = `
    <div class="filter-bar">
      <select id="f-emp" onchange="filterGastos()">
        <option value="">Todos los empleados</option>
        ${state.empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
      </select>
      <select id="f-status" onchange="filterGastos()">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendientes</option>
        <option value="aprobado">Aprobados</option>
        <option value="rechazado">Rechazados</option>
      </select>
      <input type="month" id="f-mes" value="${mes}" onchange="filterGastos()">
    </div>`;

  return `
    <div class="admin-gastos-wrap">
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-val">${fmtPeso(totalMes)}</span>
          <span class="stat-lbl">Total mes</span>
        </div>
        <div class="stat-chip">
          <span class="stat-val">${pendientes.length}</span>
          <span class="stat-lbl">Pendientes</span>
        </div>
      </div>
      ${filtros}
      <div id="gastos-list-admin">
        ${renderGastosAdminList(state.gastos)}
      </div>
    </div>`;
}

function filterGastos() {
  const empId  = document.getElementById('f-emp')?.value;
  const status = document.getElementById('f-status')?.value;
  const mes    = document.getElementById('f-mes')?.value;

  let gastos = [...state.gastos];
  if (empId)  gastos = gastos.filter(g => g.empleado_id === empId);
  if (mes)    gastos = gastos.filter(g => g.fecha && g.fecha.startsWith(mes));
  if (status) gastos = gastos.filter(g => gastoStatus(g) === status);

  const list = document.getElementById('gastos-list-admin');
  if (list) list.innerHTML = renderGastosAdminList(gastos);
}

function renderGastosAdminList(gastos) {
  if (!gastos.length) return `<div class="empty-state">Sin gastos para mostrar</div>`;
  return gastos.map(g => `
    <div class="gasto-card admin">
      <div class="gasto-card-top">
        <div class="gasto-meta">
          ${catChip(g.categoria)}
          ${statusBadge(g)}
        </div>
        <span class="gasto-monto">${fmtPeso(g.monto)}</span>
      </div>
      <div class="gasto-desc">${g.descripcion || ''}</div>
      <div class="gasto-card-bottom">
        <span class="gasto-fecha">${fmtDate(g.fecha)}</span>
        <span class="gasto-emp">${empNombre(g.empleado_id)}</span>
        ${tarjetaChip(g.tarjeta_id)}
        ${g.foto_url ? `<button class="btn-icon photo-btn" onclick="showLightbox('${g.foto_url}')" title="Ver ticket">&#128247;</button>` : ''}
      </div>
      ${g.aprobado === null ? `
        <div class="gasto-actions">
          <button class="btn-success btn-sm" onclick="aprobarGasto('${g.id}')">Aprobar</button>
          <button class="btn-danger btn-sm" onclick="rechazarGasto('${g.id}')">Rechazar</button>
        </div>` : `
        <div class="gasto-actions">
          <button class="btn-outline btn-sm" onclick="resetGasto('${g.id}')">Pendiente</button>
          <button class="btn-danger btn-sm" onclick="confirmDeleteGasto('${g.id}')">Eliminar</button>
        </div>`}
    </div>`).join('');
}

async function aprobarGasto(id) {
  try {
    await setAprobado(id, true);
    toast('Gasto aprobado', 'success');
    renderAdmin('gastos');
  } catch (_) {}
}
async function rechazarGasto(id) {
  try {
    await setAprobado(id, false);
    toast('Gasto rechazado', 'info');
    renderAdmin('gastos');
  } catch (_) {}
}
async function resetGasto(id) {
  try {
    await setAprobado(id, null);
    toast('Vuelto a pendiente', 'info');
    renderAdmin('gastos');
  } catch (_) {}
}
function confirmDeleteGasto(id) {
  openModal(`
    <h3>¿Eliminar gasto?</h3>
    <p>Esta acción no se puede deshacer.</p>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-danger btn-full" onclick="deleteGastoConfirmed('${id}')">Eliminar</button>
    </div>`);
}
async function deleteGastoConfirmed(id) {
  closeModal();
  try {
    await deleteGasto(id);
    toast('Gasto eliminado', 'info');
    renderAdmin('gastos');
  } catch (_) {}
}

// ADMIN — TARJETAS ────────────────────────────────────────────────────────────
function renderAdminTarjetasHTML() {
  const rows = state.tarjetas.length
    ? state.tarjetas.map(t => `
        <div class="tarjeta-card">
          <div class="tarjeta-color-bar" style="background:${t.color||'#af9e78'}"></div>
          <div class="tarjeta-info">
            <span class="tarjeta-nombre">${t.nombre}</span>
            <span class="tarjeta-numero">${t.numero ? `•••• ${String(t.numero).slice(-4)}` : ''}</span>
            <span class="tarjeta-limite">Límite: ${fmtPeso(t.limite)} | Cierre: día ${t.dia_cierre || '—'}</span>
          </div>
          <div class="tarjeta-card-actions">
            <button class="btn-icon" onclick="editTarjeta('${t.id}')" title="Editar">&#9998;</button>
            <button class="btn-icon danger" onclick="confirmDeleteTarjeta('${t.id}')" title="Eliminar">&#128465;</button>
          </div>
        </div>`).join('')
    : `<div class="empty-state">Sin tarjetas cargadas</div>`;

  return `
    <div class="admin-tarjetas-wrap">
      ${rows}
      <button class="fab" onclick="newTarjeta()" title="Nueva tarjeta">+</button>
    </div>`;
}

function tarjetaFormHTML(t = {}) {
  return `
    <div class="field"><label>Nombre</label>
      <input type="text" id="tf-nombre" value="${t.nombre||''}" placeholder="Ej: Visa Banco Nación" maxlength="60">
    </div>
    <div class="field"><label>Últimos 4 dígitos</label>
      <input type="text" id="tf-numero" value="${t.numero||''}" placeholder="1234" maxlength="4" inputmode="numeric">
    </div>
    <div class="field-row">
      <div class="field"><label>Límite ($)</label>
        <input type="number" id="tf-limite" value="${t.limite||''}" min="0" step="100">
      </div>
      <div class="field"><label>Día de cierre</label>
        <input type="number" id="tf-cierre" value="${t.dia_cierre||''}" min="1" max="31">
      </div>
    </div>
    <div class="field"><label>Color</label>
      <input type="color" id="tf-color" value="${t.color||'#af9e78'}">
    </div>`;
}

function newTarjeta() {
  openModal(`
    <h3>Nueva tarjeta</h3>
    ${tarjetaFormHTML()}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-primary btn-full" onclick="saveTarjeta(null)">Guardar</button>
    </div>`);
}
function editTarjeta(id) {
  const t = state.tarjetas.find(x => x.id === id);
  if (!t) return;
  openModal(`
    <h3>Editar tarjeta</h3>
    ${tarjetaFormHTML(t)}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-primary btn-full" onclick="saveTarjeta('${id}')">Guardar</button>
    </div>`);
}
async function saveTarjeta(id) {
  const nombre  = document.getElementById('tf-nombre')?.value.trim();
  const numero  = document.getElementById('tf-numero')?.value.trim();
  const limite  = parseFloat(document.getElementById('tf-limite')?.value) || 0;
  const cierre  = parseInt(document.getElementById('tf-cierre')?.value) || null;
  const color   = document.getElementById('tf-color')?.value;

  if (!nombre) { toast('Ingresá un nombre', 'error'); return; }

  const payload = { nombre, numero, limite, dia_cierre: cierre, color };

  if (!_supabase) {
    if (id) {
      const t = state.tarjetas.find(x => x.id === id);
      if (t) Object.assign(t, payload);
    } else {
      state.tarjetas.push({ id: uid(), ...payload });
    }
    save(); closeModal(); toast('Tarjeta guardada', 'success'); renderAdmin('tarjetas'); return;
  }

  try {
    if (id) {
      const { error } = await _supabase.from('tarjetas').update(payload).eq('id', id);
      if (error) throw error;
      const t = state.tarjetas.find(x => x.id === id);
      if (t) Object.assign(t, payload);
    } else {
      const { data, error } = await _supabase.from('tarjetas').insert(payload).select().single();
      if (error) throw error;
      state.tarjetas.push(data);
    }
    save(); closeModal(); toast('Tarjeta guardada', 'success'); renderAdmin('tarjetas');
  } catch (e) { toast('Error al guardar', 'error'); }
}
function confirmDeleteTarjeta(id) {
  openModal(`
    <h3>¿Eliminar tarjeta?</h3>
    <p>Los gastos asociados no se eliminarán.</p>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-danger btn-full" onclick="deleteTarjetaConfirmed('${id}')">Eliminar</button>
    </div>`);
}
async function deleteTarjetaConfirmed(id) {
  closeModal();
  if (!_supabase) {
    state.tarjetas = state.tarjetas.filter(x => x.id !== id);
    save(); toast('Tarjeta eliminada', 'info'); renderAdmin('tarjetas'); return;
  }
  try {
    const { error } = await _supabase.from('tarjetas').delete().eq('id', id);
    if (error) throw error;
    state.tarjetas = state.tarjetas.filter(x => x.id !== id);
    save(); toast('Tarjeta eliminada', 'info'); renderAdmin('tarjetas');
  } catch (_) { toast('Error al eliminar', 'error'); }
}

// ADMIN — EMPLEADOS ───────────────────────────────────────────────────────────
function renderAdminEmpleadosHTML() {
  const rows = state.empleados.length
    ? state.empleados.map(e => `
        <div class="emp-card">
          <span class="emp-avatar">${e.nombre.charAt(0).toUpperCase()}</span>
          <div class="emp-card-info">
            <span class="emp-card-nombre">${e.nombre}</span>
            <span class="emp-card-tarjeta">${e.tarjeta_id ? tarjetaNombre(e.tarjeta_id) : 'Sin tarjeta'}</span>
            ${e.is_admin ? '<span class="badge-admin">Admin</span>' : ''}
          </div>
          <div class="emp-card-actions">
            <button class="btn-icon" onclick="editEmpleado('${e.id}')" title="Editar">&#9998;</button>
            <button class="btn-icon danger" onclick="confirmDeleteEmpleado('${e.id}')" title="Eliminar">&#128465;</button>
          </div>
        </div>`).join('')
    : `<div class="empty-state">Sin empleados cargados</div>`;

  return `
    <div class="admin-empleados-wrap">
      ${rows}
      <button class="fab" onclick="newEmpleado()" title="Nuevo empleado">+</button>
    </div>`;
}

function empleadoFormHTML(e = {}) {
  const tarjetaOpts = state.tarjetas.map(t =>
    `<option value="${t.id}" ${e.tarjeta_id === t.id ? 'selected' : ''}>${t.nombre}</option>`
  ).join('');
  return `
    <div class="field"><label>Nombre</label>
      <input type="text" id="ef-nombre" value="${e.nombre||''}" placeholder="Nombre completo" maxlength="80">
    </div>
    <div class="field"><label>PIN (4 dígitos)</label>
      <input type="password" id="ef-pin" value="${e.pin||''}" placeholder="••••" maxlength="4" inputmode="numeric">
    </div>
    <div class="field"><label>Tarjeta asignada</label>
      <select id="ef-tarjeta"><option value="">Sin tarjeta</option>${tarjetaOpts}</select>
    </div>
    <div class="field checkbox-field">
      <label><input type="checkbox" id="ef-admin" ${e.is_admin ? 'checked' : ''}> Administrador</label>
    </div>`;
}

function newEmpleado() {
  openModal(`
    <h3>Nuevo empleado</h3>
    ${empleadoFormHTML()}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-primary btn-full" onclick="saveEmpleado(null)">Guardar</button>
    </div>`);
}
function editEmpleado(id) {
  const e = state.empleados.find(x => x.id === id);
  if (!e) return;
  openModal(`
    <h3>Editar empleado</h3>
    ${empleadoFormHTML(e)}
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-primary btn-full" onclick="saveEmpleado('${id}')">Guardar</button>
    </div>`);
}
async function saveEmpleado(id) {
  const nombre    = document.getElementById('ef-nombre')?.value.trim();
  const pin       = document.getElementById('ef-pin')?.value.trim();
  const tarjeta_id= document.getElementById('ef-tarjeta')?.value || null;
  const is_admin  = document.getElementById('ef-admin')?.checked || false;

  if (!nombre) { toast('Ingresá un nombre', 'error'); return; }
  if (!id && (!pin || pin.length !== 4)) { toast('PIN debe tener 4 dígitos', 'error'); return; }

  const payload = { nombre, tarjeta_id, is_admin };
  if (pin) payload.pin = pin;

  if (!_supabase) {
    if (id) {
      const e = state.empleados.find(x => x.id === id);
      if (e) Object.assign(e, payload);
    } else {
      state.empleados.push({ id: uid(), ...payload });
    }
    save(); closeModal(); toast('Empleado guardado', 'success'); renderAdmin('empleados'); return;
  }

  try {
    if (id) {
      const { error } = await _supabase.from('empleados_tarjetas').update(payload).eq('id', id);
      if (error) throw error;
      const e = state.empleados.find(x => x.id === id);
      if (e) Object.assign(e, payload);
    } else {
      const { data, error } = await _supabase.from('empleados_tarjetas').insert(payload).select().single();
      if (error) throw error;
      state.empleados.push(data);
    }
    save(); closeModal(); toast('Empleado guardado', 'success'); renderAdmin('empleados');
  } catch (e) { toast('Error al guardar', 'error'); }
}
function confirmDeleteEmpleado(id) {
  openModal(`
    <h3>¿Eliminar empleado?</h3>
    <p>Los gastos registrados no se eliminarán.</p>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn-outline btn-full" onclick="closeModal()">Cancelar</button>
      <button class="btn-danger btn-full" onclick="deleteEmpleadoConfirmed('${id}')">Eliminar</button>
    </div>`);
}
async function deleteEmpleadoConfirmed(id) {
  closeModal();
  if (!_supabase) {
    state.empleados = state.empleados.filter(x => x.id !== id);
    save(); toast('Empleado eliminado', 'info'); renderAdmin('empleados'); return;
  }
  try {
    const { error } = await _supabase.from('empleados_tarjetas').delete().eq('id', id);
    if (error) throw error;
    state.empleados = state.empleados.filter(x => x.id !== id);
    save(); toast('Empleado eliminado', 'info'); renderAdmin('empleados');
  } catch (_) { toast('Error al eliminar', 'error'); }
}

// ─── INIT ──────────────────────────────────────────────────────────────────
async function init() {
  load();
  registerSW();

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _installPrompt = e;
  });

  initSupabase();

  renderWelcome();

  if (_supabase) {
    await syncAll();
    initRealtime();
    renderWelcome();
  }
}

document.addEventListener('DOMContentLoaded', init);
