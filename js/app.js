/* TarjetasApp — main application */

// ─── CONFIG ────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://qcmrklucngcldvydaxlk.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbXJrbHVjbmdjbGR2eWRheGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjc5NDUsImV4cCI6MjA5NDgwMzk0NX0.3rjdRhY6L-W0XqzZDvzjTZ8UPYVY-W1dZG_Y63ts2r4';
const STORAGE_KEY   = 'tarjetasapp_v1';
const BUCKET        = 'tarjetas-fotos';
const CATEGORIAS = [
  'Meals','Music & Entertainment','Parking','Fuel','Prints & Materials'
];
const LOCATIONS = [
  'Aventura','Brickell','Downtown','Coconut Grove','Doral'
];

// ─── DEMO DATA ─────────────────────────────────────────────────────────────
const DEMO_EMPLEADOS  = ['Marta','Joel','Giorgio','Daniel','Emma'];
const DEMO_LOCATIONS  = ['Aventura','Brickell','Downtown','Coconut Grove','Wynwood'];
const DEMO_CATS       = ['Meals','Music & Entertainment','Parking','Fuel','Prints & Materials'];
const DEMO_MESES      = [
  {val:'2026-01',label:'Enero 2026'},{val:'2026-02',label:'Febrero 2026'},
  {val:'2026-03',label:'Marzo 2026'},{val:'2026-04',label:'Abril 2026'},
  {val:'2026-05',label:'Mayo 2026'},{val:'2026-06',label:'Junio 2026'},
  {val:'2026-07',label:'Julio 2026'},{val:'2026-08',label:'Agosto 2026'},
  {val:'2026-09',label:'Septiembre 2026'},{val:'2026-10',label:'Octubre 2026'},
  {val:'2026-11',label:'Noviembre 2026'},{val:'2026-12',label:'Diciembre 2026'},
];
const CHART_COLORS = ['#c4956a','#7a9e87','#9e7a87','#7a9ea0','#a09e7a','#c47a7a','#7a87a0'];
const DEMO_GASTOS = [
  // Enero
  {empleado:'Marta',   location:'Aventura',      mes:'2026-01', categoria:'Meals',                 monto:120},
  {empleado:'Joel',    location:'Brickell',       mes:'2026-01', categoria:'Parking',               monto:45},
  {empleado:'Giorgio', location:'Downtown',       mes:'2026-01', categoria:'Fuel',                  monto:95},
  {empleado:'Daniel',  location:'Coconut Grove',  mes:'2026-01', categoria:'Meals',                 monto:210},
  {empleado:'Emma',    location:'Wynwood',        mes:'2026-01', categoria:'Music & Entertainment', monto:180},
  // Febrero
  {empleado:'Marta',   location:'Brickell',       mes:'2026-02', categoria:'Fuel',                  monto:88},
  {empleado:'Joel',    location:'Downtown',       mes:'2026-02', categoria:'Meals',                 monto:155},
  {empleado:'Giorgio', location:'Aventura',       mes:'2026-02', categoria:'Prints & Materials',    monto:320},
  {empleado:'Daniel',  location:'Wynwood',        mes:'2026-02', categoria:'Music & Entertainment', monto:250},
  {empleado:'Emma',    location:'Coconut Grove',  mes:'2026-02', categoria:'Parking',               monto:60},
  // Marzo
  {empleado:'Marta',   location:'Downtown',       mes:'2026-03', categoria:'Meals',                 monto:175},
  {empleado:'Joel',    location:'Coconut Grove',  mes:'2026-03', categoria:'Prints & Materials',    monto:410},
  {empleado:'Giorgio', location:'Wynwood',        mes:'2026-03', categoria:'Music & Entertainment', monto:295},
  {empleado:'Daniel',  location:'Brickell',       mes:'2026-03', categoria:'Fuel',                  monto:110},
  {empleado:'Emma',    location:'Aventura',       mes:'2026-03', categoria:'Meals',                 monto:140},
  {empleado:'Marta',   location:'Wynwood',        mes:'2026-03', categoria:'Parking',               monto:55},
  // Abril
  {empleado:'Marta',   location:'Brickell',       mes:'2026-04', categoria:'Meals',                 monto:195},
  {empleado:'Joel',    location:'Aventura',       mes:'2026-04', categoria:'Fuel',                  monto:75},
  {empleado:'Giorgio', location:'Brickell',       mes:'2026-04', categoria:'Meals',                 monto:145.50},
  {empleado:'Giorgio', location:'Downtown',       mes:'2026-04', categoria:'Parking',               monto:85},
  {empleado:'Daniel',  location:'Wynwood',        mes:'2026-04', categoria:'Prints & Materials',    monto:380},
  {empleado:'Emma',    location:'Coconut Grove',  mes:'2026-04', categoria:'Music & Entertainment', monto:220},
  {empleado:'Joel',    location:'Brickell',       mes:'2026-04', categoria:'Meals',                 monto:130},
  {empleado:'Marta',   location:'Downtown',       mes:'2026-04', categoria:'Parking',               monto:40},
  // Mayo
  {empleado:'Marta',   location:'Aventura',       mes:'2026-05', categoria:'Meals',                 monto:160},
  {empleado:'Joel',    location:'Wynwood',        mes:'2026-05', categoria:'Music & Entertainment', monto:300},
  {empleado:'Giorgio', location:'Coconut Grove',  mes:'2026-05', categoria:'Fuel',                  monto:92},
  {empleado:'Daniel',  location:'Brickell',       mes:'2026-05', categoria:'Meals',                 monto:185},
  {empleado:'Emma',    location:'Downtown',       mes:'2026-05', categoria:'Prints & Materials',    monto:445},
  {empleado:'Giorgio', location:'Aventura',       mes:'2026-05', categoria:'Parking',               monto:65},
  // Junio
  {empleado:'Marta',   location:'Coconut Grove',  mes:'2026-06', categoria:'Fuel',                  monto:105},
  {empleado:'Joel',    location:'Downtown',       mes:'2026-06', categoria:'Prints & Materials',    monto:360},
  {empleado:'Giorgio', location:'Brickell',       mes:'2026-06', categoria:'Meals',                 monto:210},
  {empleado:'Daniel',  location:'Aventura',       mes:'2026-06', categoria:'Music & Entertainment', monto:275},
  {empleado:'Emma',    location:'Wynwood',        mes:'2026-06', categoria:'Parking',               monto:50},
  // Julio
  {empleado:'Marta',   location:'Wynwood',        mes:'2026-07', categoria:'Music & Entertainment', monto:230},
  {empleado:'Joel',    location:'Aventura',       mes:'2026-07', categoria:'Meals',                 monto:145},
  {empleado:'Giorgio', location:'Downtown',       mes:'2026-07', categoria:'Prints & Materials',    monto:290},
  {empleado:'Daniel',  location:'Coconut Grove',  mes:'2026-07', categoria:'Fuel',                  monto:115},
  {empleado:'Emma',    location:'Brickell',       mes:'2026-07', categoria:'Meals',                 monto:175},
  // Agosto
  {empleado:'Marta',   location:'Downtown',       mes:'2026-08', categoria:'Parking',               monto:70},
  {empleado:'Joel',    location:'Brickell',       mes:'2026-08', categoria:'Music & Entertainment', monto:315},
  {empleado:'Giorgio', location:'Wynwood',        mes:'2026-08', categoria:'Meals',                 monto:185},
  {empleado:'Daniel',  location:'Aventura',       mes:'2026-08', categoria:'Prints & Materials',    monto:420},
  {empleado:'Emma',    location:'Coconut Grove',  mes:'2026-08', categoria:'Fuel',                  monto:98},
  // Septiembre
  {empleado:'Marta',   location:'Brickell',       mes:'2026-09', categoria:'Meals',                 monto:200},
  {empleado:'Joel',    location:'Coconut Grove',  mes:'2026-09', categoria:'Parking',               monto:55},
  {empleado:'Giorgio', location:'Aventura',       mes:'2026-09', categoria:'Music & Entertainment', monto:260},
  {empleado:'Daniel',  location:'Downtown',       mes:'2026-09', categoria:'Fuel',                  monto:100},
  {empleado:'Emma',    location:'Wynwood',        mes:'2026-09', categoria:'Meals',                 monto:165},
  // Octubre
  {empleado:'Marta',   location:'Aventura',       mes:'2026-10', categoria:'Prints & Materials',    monto:380},
  {empleado:'Joel',    location:'Wynwood',        mes:'2026-10', categoria:'Fuel',                  monto:85},
  {empleado:'Giorgio', location:'Coconut Grove',  mes:'2026-10', categoria:'Meals',                 monto:220},
  {empleado:'Daniel',  location:'Brickell',       mes:'2026-10', categoria:'Music & Entertainment', monto:290},
  {empleado:'Emma',    location:'Downtown',       mes:'2026-10', categoria:'Parking',               monto:65},
  // Noviembre
  {empleado:'Marta',   location:'Downtown',       mes:'2026-11', categoria:'Music & Entertainment', monto:240},
  {empleado:'Joel',    location:'Coconut Grove',  mes:'2026-11', categoria:'Meals',                 monto:190},
  {empleado:'Giorgio', location:'Brickell',       mes:'2026-11', categoria:'Fuel',                  monto:110},
  {empleado:'Daniel',  location:'Wynwood',        mes:'2026-11', categoria:'Prints & Materials',    monto:465},
  {empleado:'Emma',    location:'Aventura',       mes:'2026-11', categoria:'Parking',               monto:75},
  // Diciembre
  {empleado:'Marta',   location:'Wynwood',        mes:'2026-12', categoria:'Fuel',                  monto:95},
  {empleado:'Joel',    location:'Brickell',       mes:'2026-12', categoria:'Prints & Materials',    monto:395},
  {empleado:'Giorgio', location:'Downtown',       mes:'2026-12', categoria:'Meals',                 monto:255},
  {empleado:'Daniel',  location:'Aventura',       mes:'2026-12', categoria:'Music & Entertainment', monto:310},
  {empleado:'Emma',    location:'Coconut Grove',  mes:'2026-12', categoria:'Meals',                 monto:180},
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

  const empOptions = state.empleados.length
    ? state.empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')
    : '';

  app.innerHTML = `
    <div class="welcome-wrap">
      <div class="welcome-card">
        <div class="welcome-logo">${logoSVG()}</div>
        <h1 class="welcome-title">TarjetasApp</h1>
        <p class="welcome-sub">Gestión de gastos corporativos</p>

        <div class="login-form">
          <div class="field">
            <label>Tu nombre</label>
            ${state.empleados.length
              ? `<select id="login-emp"><option value="">Seleccioná...</option>${empOptions}</select>`
              : `<p class="empty-state" style="padding:12px 0;font-size:13px">Sin empleados cargados</p>`
            }
          </div>
          <div class="field">
            <label>PIN (4 dígitos)</label>
            <input type="password" id="login-pin" maxlength="4" inputmode="numeric"
              placeholder="• • • •" autocomplete="off"
              onkeydown="if(event.key==='Enter') loginSubmit()">
          </div>
          <div id="login-error" class="pin-error hidden" style="margin-bottom:8px">PIN o usuario incorrecto</div>
          <button class="btn-primary btn-full login-btn" onclick="loginSubmit()">Entrar &rarr;</button>
        </div>

        ${renderInstallBtn()}
      </div>
    </div>`;
}

function logoSVG() {
  return `<svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="42">
    <rect x="2" y="6" width="60" height="36" rx="6" fill="#b1ab8e"/>
    <rect x="2" y="16" width="60" height="10" fill="#3d3b2e" opacity=".35"/>
    <rect x="10" y="30" width="20" height="7" rx="2" fill="#d5cfb1" opacity=".7"/>
    <circle cx="50" cy="33" r="5" fill="#c3bda0" opacity=".6"/>
    <circle cx="56" cy="33" r="5" fill="#b1ab8e" opacity=".85"/>
  </svg>`;
}

function loginSubmit() {
  const empId = document.getElementById('login-emp')?.value;
  const pin   = document.getElementById('login-pin')?.value;
  const errEl = document.getElementById('login-error');

  if (!empId) { toast('Seleccioná tu nombre', 'error'); return; }
  if (!pin)   { toast('Ingresá tu PIN', 'error'); return; }

  const emp = state.empleados.find(e => e.id === empId);
  if (!emp || String(emp.pin) !== String(pin)) {
    if (errEl) errEl.classList.remove('hidden');
    const pinEl = document.getElementById('login-pin');
    if (pinEl) { pinEl.value = ''; pinEl.focus(); }
    return;
  }

  currentUser = emp;
  if (emp.is_admin) renderAdmin('gastos');
  else renderEmpleado('nuevo');
}

// kept for compatibility — not used in new flow
function selectEmp(id) {}
function backToList() {}

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

  if (tab === 'nuevo')    bindNuevoGasto();
  if (tab === 'historial') filterHistorial();
}

function renderNuevoGastoHTML() {
  const cats = CATEGORIAS.map(c => `<option value="${c}">${c}</option>`).join('');
  const locs = LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join('');
  const fechaHoy = today();
  const fechaHoyDisplay = fmtDate(fechaHoy);

  return `
    <div class="form-wrap">
      <div class="field">
        <label>Fecha de reporte</label>
        <input type="text" value="${fechaHoyDisplay}" disabled class="input-readonly">
      </div>
      <div class="field">
        <label>Fecha del comprobante</label>
        <input type="date" id="g-fecha" value="${fechaHoy}" max="${fechaHoy}">
      </div>
      <div class="field">
        <label>Location</label>
        <select id="g-location"><option value="">Seleccioná...</option>${locs}</select>
      </div>
      <div class="field">
        <label>Categoría</label>
        <select id="g-cat"><option value="">Seleccioná...</option>${cats}</select>
      </div>
      <div class="field">
        <label>Descripción <span class="field-opt">(opcional, máx. 100 caracteres)</span></label>
        <input type="text" id="g-desc" placeholder="Descripción del gasto" maxlength="100">
      </div>
      <div class="field">
        <label>Monto</label>
        <div class="input-prefix-wrap">
          <span class="input-prefix">$</span>
          <input type="number" id="g-monto" placeholder="0" min="1" step="1">
        </div>
      </div>
      <div class="field">
        <label>Foto del comprobante</label>
        <div class="photo-area" id="photo-area" onclick="document.getElementById('photo-input').click()">
          <div class="photo-placeholder" id="photo-placeholder">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="6" width="20" height="15" rx="2"/>
              <circle cx="12" cy="13" r="3.5"/>
              <path d="M8 6V5a1 1 0 011-1h6a1 1 0 011 1v1"/>
            </svg>
            <span>Tocar para agregar foto</span>
          </div>
          <img id="photo-preview" class="photo-preview hidden" alt="comprobante">
        </div>
        <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="previewPhoto(event)">
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
  const fecha_comprobante = document.getElementById('g-fecha')?.value;
  const location          = document.getElementById('g-location')?.value;
  const cat               = document.getElementById('g-cat')?.value;
  const desc              = document.getElementById('g-desc')?.value.trim();
  const montoRaw          = document.getElementById('g-monto')?.value;
  const monto             = montoRaw ? parseInt(montoRaw, 10) : 0;

  if (!fecha_comprobante)        { toast('Seleccioná la fecha del comprobante', 'error'); return; }
  if (!location)                 { toast('Seleccioná la location', 'error'); return; }
  if (!cat)                      { toast('Seleccioná una categoría', 'error'); return; }
  if (!monto || monto <= 0)      { toast('Ingresá un monto válido (entero positivo)', 'error'); return; }
  if (!_photoFile)               { toast('El comprobante es obligatorio', 'error'); return; }

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

  const tarjeta = state.tarjetas.find(t => t.id === currentUser.tarjeta_id);

  const gasto = {
    tarjeta_id:       tarjeta?.id || null,
    empleado_id:      currentUser.id,
    fecha:            fecha_comprobante,
    fecha_reporte:    today(),
    location,
    categoria:        cat,
    descripcion:      desc || null,
    monto,
    foto_url,
    aprobado:         null,
    created_at:       new Date().toISOString(),
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

  // build month options from actual gastos
  const mesesSet = [...new Set(misGastos.map(g => g.fecha?.slice(0,7)).filter(Boolean))].sort().reverse();
  const mesesOpts = mesesSet.map(m => {
    const [y,mo] = m.split('-');
    const names = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `<option value="${m}">${names[parseInt(mo)]} ${y}</option>`;
  }).join('');

  const catOpts = CATEGORIAS.map(c => `<option value="${c}">${c}</option>`).join('');

  return `
    <div class="historial-wrap">
      <div class="stats-row">
        <div class="stat-chip"><span class="stat-val">${fmtPeso(totalMes)}</span><span class="stat-lbl">Gasto mes</span></div>
        <div class="stat-chip"><span class="stat-val">${pendientes}</span><span class="stat-lbl">Pendientes</span></div>
      </div>
      <div class="filter-bar">
        <select id="h-cat" onchange="filterHistorial()">
          <option value="">Todas las categorías</option>${catOpts}
        </select>
        <select id="h-mes" onchange="filterHistorial()">
          <option value="">Todos los meses</option>${mesesOpts}
        </select>
      </div>
      <div id="historial-list" class="gastos-list"></div>
    </div>`;
}

function filterHistorial() {
  const fCat = document.getElementById('h-cat')?.value || '';
  const fMes = document.getElementById('h-mes')?.value || '';
  let gastos = state.gastos.filter(g => g.empleado_id === currentUser.id);
  if (fCat) gastos = gastos.filter(g => g.categoria === fCat);
  if (fMes) gastos = gastos.filter(g => g.fecha?.startsWith(fMes));
  const list = document.getElementById('historial-list');
  if (list) list.innerHTML = gastos.length
    ? gastos.map(g => gastoCardHTML(g)).join('')
    : `<div class="empty-state">Sin gastos para los filtros seleccionados</div>`;
}

function gastoCardHTML(g, showEmp = false) {
  return `
    <div class="gasto-card" onclick="openGastoDetail('${g.id}')" style="cursor:pointer">
      <div class="gasto-card-top">
        <div class="gasto-meta">
          ${catChip(g.categoria)}
          ${statusBadge(g)}
        </div>
        <span class="gasto-monto">${fmtPeso(g.monto)}</span>
      </div>
      ${g.descripcion ? `<div class="gasto-desc">${g.descripcion}</div>` : ''}
      <div class="gasto-card-bottom">
        <span class="gasto-fecha">${fmtDate(g.fecha)}</span>
        ${showEmp ? `<span class="gasto-emp">${empNombre(g.empleado_id)}</span>` : ''}
        ${g.location ? `<span class="chip-cat">${g.location}</span>` : ''}
      </div>
    </div>`;
}

function openGastoDetail(id) {
  const g = state.gastos.find(x => x.id === id);
  if (!g) return;
  openModal(`
    <h3 style="margin-bottom:16px">Detalle del gasto</h3>
    <div class="detail-grid">
      <div class="detail-row"><span class="detail-lbl">Estado</span>${statusBadge(g)}</div>
      <div class="detail-row"><span class="detail-lbl">Fecha de reporte</span><span>${fmtDate(g.fecha_reporte || g.created_at?.slice(0,10))}</span></div>
      <div class="detail-row"><span class="detail-lbl">Fecha comprobante</span><span>${fmtDate(g.fecha)}</span></div>
      <div class="detail-row"><span class="detail-lbl">Location</span><span>${g.location || '—'}</span></div>
      <div class="detail-row"><span class="detail-lbl">Categoría</span>${catChip(g.categoria)}</div>
      ${g.descripcion ? `<div class="detail-row"><span class="detail-lbl">Descripción</span><span>${g.descripcion}</span></div>` : ''}
      <div class="detail-row"><span class="detail-lbl">Monto</span><span class="detail-monto">${fmtPeso(g.monto)}</span></div>
    </div>
    ${g.foto_url ? `<img src="${g.foto_url}" onclick="showLightbox('${g.foto_url}')" class="detail-photo" alt="comprobante">` : ''}
    <button class="btn-outline btn-full" style="margin-top:16px" onclick="closeModal()">Cerrar</button>
  `);
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
function renderDashboard() {
  const fEmp  = document.getElementById('d-emp')?.value  || '';
  const fLoc  = document.getElementById('d-loc')?.value  || '';
  const fMes  = document.getElementById('d-mes')?.value  || '';
  const fCat  = document.getElementById('d-cat')?.value  || '';
  const fGroup= document.getElementById('d-group')?.value|| 'empleado';

  let data = DEMO_GASTOS;
  if (fEmp) data = data.filter(g => g.empleado  === fEmp);
  if (fLoc) data = data.filter(g => g.location  === fLoc);
  if (fMes) data = data.filter(g => g.mes       === fMes);
  if (fCat) data = data.filter(g => g.categoria === fCat);

  const total = data.reduce((s, g) => s + g.monto, 0);
  const count = data.length;
  const avg   = count ? total / count : 0;

  // group for chart
  const groupMap = {};
  data.forEach(g => {
    const key = fGroup === 'empleado'  ? g.empleado
              : fGroup === 'location'  ? g.location
              : fGroup === 'categoria' ? g.categoria
              : (DEMO_MESES.find(m => m.val === g.mes)?.label || g.mes);
    groupMap[key] = (groupMap[key] || 0) + g.monto;
  });
  const segments = Object.entries(groupMap)
    .sort((a,b) => b[1]-a[1])
    .map(([ label, value ], i) => ({ label, value, color: CHART_COLORS[i % CHART_COLORS.length] }));

  const content = document.getElementById('dashboard-content');
  if (!content) return;

  content.innerHTML = `
    <div class="dash-stats">
      <div class="stat-chip"><span class="stat-val">${fmtPeso(total)}</span><span class="stat-lbl">Total</span></div>
      <div class="stat-chip"><span class="stat-val">${count}</span><span class="stat-lbl">Registros</span></div>
      <div class="stat-chip"><span class="stat-val">${fmtPeso(avg)}</span><span class="stat-lbl">Promedio</span></div>
    </div>
    ${segments.length ? `
    <div class="dash-chart-wrap">
      <canvas id="pie-canvas" width="220" height="220"></canvas>
      <div class="dash-legend">
        ${segments.map(s => `
          <div class="dash-legend-item">
            <span class="dash-legend-dot" style="background:${s.color}"></span>
            <span class="dash-legend-label">${s.label}</span>
            <span class="dash-legend-val">${fmtPeso(s.value)}</span>
          </div>`).join('')}
      </div>
    </div>` : `<div class="empty-state" style="padding:40px">Sin datos para los filtros seleccionados</div>`}
    ${data.length ? `
    <div class="dash-table-wrap">
      <table class="dash-table">
        <thead><tr><th>Empleado</th><th>Location</th><th>Mes</th><th>Categoría</th><th>Monto</th></tr></thead>
        <tbody>
          ${data.map(g => `<tr>
            <td>${g.empleado}</td>
            <td>${g.location}</td>
            <td>${DEMO_MESES.find(m=>m.val===g.mes)?.label||g.mes}</td>
            <td>${g.categoria}</td>
            <td class="dash-td-monto">${fmtPeso(g.monto)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''}`;

  if (segments.length) {
    requestAnimationFrame(() => drawPieChart('pie-canvas', segments));
  }
}

function drawPieChart(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const r  = Math.min(cx, cy) - 8;
  const ri = r * 0.48; // donut hole

  ctx.clearRect(0, 0, W, H);
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!total) return;

  let angle = -Math.PI / 2;
  segments.forEach(seg => {
    const slice = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = '#d5cfb1';
    ctx.lineWidth = 2;
    ctx.stroke();
    angle += slice;
  });

  // donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, ri, 0, Math.PI * 2);
  ctx.fillStyle = '#d5cfb1';
  ctx.fill();

  // center label
  ctx.fillStyle = '#3d3b2e';
  ctx.font = 'bold 13px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(fmtPeso(total).replace('$','$'), cx, cy);
}

function renderDashboardShell() {
  return `
    <div class="dash-wrap">
      <div class="dash-filters">
        <select id="d-emp"   onchange="renderDashboard()">
          <option value="">Todos los empleados</option>
          ${DEMO_EMPLEADOS.map(e=>`<option>${e}</option>`).join('')}
        </select>
        <select id="d-loc"   onchange="renderDashboard()">
          <option value="">Todas las locations</option>
          ${DEMO_LOCATIONS.map(l=>`<option>${l}</option>`).join('')}
        </select>
        <select id="d-mes"   onchange="renderDashboard()">
          <option value="">Todos los meses</option>
          ${DEMO_MESES.map(m=>`<option value="${m.val}">${m.label}</option>`).join('')}
        </select>
        <select id="d-cat"   onchange="renderDashboard()">
          <option value="">Todas las categorías</option>
          ${DEMO_CATS.map(c=>`<option>${c}</option>`).join('')}
        </select>
        <select id="d-group" onchange="renderDashboard()">
          <option value="empleado">Agrupar por empleado</option>
          <option value="location">Agrupar por location</option>
          <option value="categoria">Agrupar por categoría</option>
          <option value="mes">Agrupar por mes</option>
        </select>
      </div>
      <div id="dashboard-content"></div>
    </div>`;
}

// ─── ADMIN SCREEN ──────────────────────────────────────────────────────────
function renderAdmin(tab = 'dashboard') {
  const app = document.getElementById('app');
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'gastos',    label: 'Gastos'    },
    { id: 'tarjetas',  label: 'Tarjetas'  },
    { id: 'empleados', label: 'Empleados' },
  ];

  let content = '';
  if (tab === 'dashboard') content = renderDashboardShell();
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

  if (tab === 'dashboard') renderDashboard();
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

// Simulated compliance data (ordered worst → best)
const DEMO_SCORES = [
  { nombre:'Daniel', score:42, total:12, onTime:5,  late:7, avgDays:5.8 },
  { nombre:'Joel',   score:58, total:12, onTime:7,  late:5, avgDays:4.2 },
  { nombre:'Giorgio',score:67, total:12, onTime:8,  late:4, avgDays:3.5 },
  { nombre:'Emma',   score:83, total:12, onTime:10, late:2, avgDays:1.8 },
  { nombre:'Marta',  score:92, total:12, onTime:11, late:1, avgDays:0.9 },
];

function calcEmployeeScore(empId) {
  const gastos = state.gastos.filter(g => g.empleado_id === empId);
  if (!gastos.length) return null;
  let onTime = 0, late = 0, totalDays = 0;
  gastos.forEach(g => {
    const reporte = g.fecha_reporte || g.created_at?.slice(0,10);
    if (!g.fecha || !reporte) { onTime++; return; }
    const days = Math.floor((new Date(reporte) - new Date(g.fecha)) / 86400000);
    totalDays += Math.max(0, days);
    if (days <= 3) onTime++; else late++;
  });
  const total = gastos.length;
  return {
    nombre: '',
    score: Math.round((onTime / total) * 100),
    total, onTime, late,
    avgDays: (totalDays / total).toFixed(1),
  };
}

function scoreCardHTML(s) {
  const isRed   = s.score < 80;
  const color   = isRed ? 'var(--score-red)' : 'var(--score-green)';
  const bgColor = isRed ? 'var(--score-red-bg)' : 'var(--score-green-bg)';
  return `
    <div class="score-card" style="border-left:4px solid ${color}">
      <div class="score-card-top">
        <div class="score-avatar" style="background:${bgColor};color:${color}">
          ${s.nombre.charAt(0).toUpperCase()}
        </div>
        <div class="score-info">
          <span class="score-nombre">${s.nombre}</span>
          <div class="score-stats">
            <span>${s.total} gastos</span>
            <span class="score-ok">&#10003; ${s.onTime} a tiempo</span>
            <span class="score-late">&#10005; ${s.late} tarde</span>
          </div>
        </div>
        <div class="score-pct" style="color:${color}">${s.score}%</div>
      </div>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width:${s.score}%;background:${color}"></div>
      </div>
      <div class="score-avg">Promedio de demora: <strong>${s.avgDays} días</strong></div>
    </div>`;
}

function renderAdminEmpleadosHTML() {
  // Real scores from DB (non-admin employees with gastos)
  const realScores = state.empleados
    .filter(e => !e.is_admin)
    .map(e => {
      const s = calcEmployeeScore(e.id);
      return s ? { ...s, nombre: e.nombre } : null;
    })
    .filter(Boolean)
    .sort((a,b) => a.score - b.score);

  const showDemo  = realScores.length === 0;
  const scores    = showDemo ? DEMO_SCORES : realScores;
  const demoLabel = showDemo
    ? `<div class="demo-badge">&#9432; Datos de simulación</div>`
    : '';

  const scoreRows = scores.map(scoreCardHTML).join('');

  const empRows = state.empleados.length
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
      <div class="score-section">
        <div class="score-section-title">Score de cumplimiento ${demoLabel}</div>
        ${scoreRows}
      </div>
      <div class="score-section-title" style="padding:0 16px 8px">Gestión de empleados</div>
      ${empRows}
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
