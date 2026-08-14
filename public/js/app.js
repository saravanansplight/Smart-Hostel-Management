const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const state = {
  user: null,
  view: 'overview',
  data: {},
  filters: {},
  loginRole: 'warden',
  busy: false
};

const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5M9 20v-6h6v6"/>',
  bed: '<path d="M3 5v15M21 20v-8a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v3h16"/><path d="M8 9V6h5a3 3 0 0 1 3 3M3 15h18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v11H5a3 3 0 0 1-3-3V6"/><path d="M16 13h2"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5-5l2.1 2.1-2.4 2.4-2.1-2.1a4 4 0 0 0 5 5l6.8 6.8a2.1 2.1 0 0 0 3-3z"/><path d="m5 13-3.4 3.4a2 2 0 0 0 2.8 2.8L8 15.7"/>',
  visitor: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M18 8v6M15 11h6"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h2M8 17h8M14 13h2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.2l-.06-.06L7.04 4.3l.06.06A1.65 1.65 0 0 0 8.9 4a1.65 1.65 0 0 0 1-1.51V2h4v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.6.64 1.02 1.25 1.02H21v4h-.09c-.61 0-1.13.42-1.51.98z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="m18 6-12 12M6 6l12 12"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.1-.9"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m11.5 11.5 8-8M15 8l2 2M18 5l2 2"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  rupee: '<path d="M6 4h12M6 8h12M8 4c5 0 5 7 0 7H6l8 9"/>',
  building: '<path d="M3 21h18M6 21V5l6-3 6 3v16M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/>',
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  arrowup: '<path d="m18 15-6-6-6 6"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  map: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  tag: '<path d="M20.6 13.6 11 4H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8z"/><circle cx="7.5" cy="7.5" r=".5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  receipt: '<path d="M6 2v20l3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
  sparkles: '<path d="m12 3-1.2 3.2L8 7.5l2.8 1.3L12 12l1.2-3.2L16 7.5l-2.8-1.3zM5 14l-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8zM19 13l-.7 1.8-1.8.7 1.8.7L19 18l.7-1.8 1.8-.7-1.8-.7z"/>',
  menu2: '<path d="M4 6h16M4 12h10M4 18h16"/>'
};

function icon(name, size = 19, className = '') {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
}

function hydrateIcons(scope = document) {
  $$('[data-icon]', scope).forEach((node) => {
    if (!node.dataset.hydrated) {
      node.innerHTML = icon(node.dataset.icon, Number(node.dataset.size) || 19);
      node.dataset.hydrated = 'true';
    }
  });
}

const NAV = {
  warden: [
    ['overview', 'home', 'Overview'], ['rooms', 'bed', 'Rooms'], ['students', 'users', 'Students'],
    ['leaves', 'calendar', 'Leave requests'], ['fees', 'wallet', 'Fees'], ['complaints', 'wrench', 'Complaints'],
    ['visitors', 'visitor', 'Visitors'], ['reports', 'report', 'Reports'], ['profile', 'settings', 'Profile & security']
  ],
  student: [
    ['overview', 'home', 'My dashboard'], ['room', 'bed', 'My room'], ['leaves', 'calendar', 'Leave requests'],
    ['fees', 'wallet', 'My fees'], ['complaints', 'wrench', 'Complaints'], ['visitors', 'visitor', 'Visitor passes'],
    ['profile', 'settings', 'Profile & security']
  ]
};

const TITLES = {
  overview: 'Overview', rooms: 'Room management', room: 'My room', students: 'Student directory', leaves: 'Leave requests',
  fees: 'Fees & payments', complaints: 'Complaints', visitors: 'Visitor records', reports: 'Reports & exports', profile: 'Profile & security'
};

async function api(url, options = {}) {
  const config = { credentials: 'same-origin', ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } };
  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && state.user) showLogin();
    throw new Error(payload?.message || 'The request could not be completed.');
  }
  return payload;
}

const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase() || 'ST';
const formatDate = (value, short = false) => value ? new Intl.DateTimeFormat('en-IN', short ? { day: '2-digit', month: 'short' } : { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
const formatDateTime = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '—';
const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
const relative = (value) => {
  if (!value) return 'Recently';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 8 ? `${days}d ago` : formatDate(value, true);
};

function statusBadge(status) {
  const key = String(status || '').toLowerCase();
  let styles = 'bg-slate-100 text-slate-600';
  if (['approved', 'paid', 'resolved', 'available', 'active', 'checked out'].includes(key)) styles = 'bg-emerald-50 text-emerald-700';
  if (['pending', 'in progress', 'maintenance'].includes(key)) styles = 'bg-amber-50 text-amber-700';
  if (['rejected', 'overdue', 'inactive'].includes(key)) styles = 'bg-red-50 text-red-700';
  if (['checked in', 'occupied'].includes(key)) styles = 'bg-sky-50 text-sky-700';
  return `<span class="badge ${styles}"><span class="status-dot"></span>${esc(status)}</span>`;
}

function priorityBadge(priority) {
  const styles = priority === 'High' ? 'bg-red-50 text-red-700' : priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600';
  return `<span class="badge ${styles}">${esc(priority)}</span>`;
}

function toast(message, type = 'success') {
  const colors = type === 'error' ? 'bg-red-50 text-red-600' : type === 'info' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600';
  const name = type === 'error' ? 'alert' : type === 'info' ? 'info' : 'check';
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = `<div class="toast-icon ${colors}">${icon(name, 18)}</div><div class="min-w-0 flex-1"><p class="text-sm font-extrabold text-navy-900">${type === 'error' ? 'Action needed' : type === 'info' ? 'Good to know' : 'Success'}</p><p class="mt-0.5 text-xs leading-5 text-slate-500">${esc(message)}</p></div><button class="text-slate-400 hover:text-slate-700" aria-label="Dismiss">${icon('x', 17)}</button>`;
  $('#toastRoot').append(node);
  const dismiss = () => { node.classList.add('out'); setTimeout(() => node.remove(), 220); };
  $('button', node).onclick = dismiss;
  setTimeout(dismiss, 5000);
}

function confirmAction({ title, message, confirmText = 'Confirm', danger = false }) {
  return new Promise((resolve) => {
    $('#confirmRoot').innerHTML = `<div class="modal-backdrop"><div class="modal-panel modal-sm"><div class="modal-body p-6 text-center"><div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${danger ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'}">${icon(danger ? 'alert' : 'check', 25)}</div><h3 class="text-xl font-black text-navy-950">${esc(title)}</h3><p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">${esc(message)}</p><div class="mt-6 flex gap-3"><button class="btn-secondary flex-1" data-confirm="false">Cancel</button><button class="${danger ? 'btn-danger' : 'btn-brand'} flex-1" data-confirm="true">${esc(confirmText)}</button></div></div></div></div>`;
    $$('[data-confirm]', $('#confirmRoot')).forEach((button) => button.onclick = () => { const result = button.dataset.confirm === 'true'; $('#confirmRoot').innerHTML = ''; resolve(result); });
  });
}

function modal({ title, subtitle = '', body, footer = '', size = '' }) {
  $('#modalRoot').innerHTML = `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal-panel ${size}"><div class="modal-header"><div><h3 class="text-lg font-black tracking-tight text-navy-950">${esc(title)}</h3>${subtitle ? `<p class="mt-0.5 text-xs text-slate-500">${esc(subtitle)}</p>` : ''}</div><button type="button" class="action-btn" data-action="close-modal" aria-label="Close">${icon('x')}</button></div><div class="modal-body">${body}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</div></div>`;
  hydrateIcons($('#modalRoot'));
  setTimeout(() => $('input:not([type="hidden"]),select,textarea', $('#modalRoot'))?.focus(), 60);
}

function closeModal() { $('#modalRoot').innerHTML = ''; }
function todayInput(offset = 0) { const date = new Date(Date.now() + offset * 86400000); return date.toISOString().slice(0, 10); }
function field(label, name, options = {}) {
  const { type = 'text', value = '', placeholder = '', required = true, min = '', max = '', readonly = false } = options;
  return `<div><label class="label" for="f-${name}">${esc(label)}${required ? ' *' : ''}</label><input id="f-${name}" class="input" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${required ? 'required' : ''} ${min !== '' ? `min="${esc(min)}"` : ''} ${max !== '' ? `max="${esc(max)}"` : ''} ${readonly ? 'readonly' : ''}></div>`;
}
function selectField(label, name, values, selected = '', required = true) {
  return `<div><label class="label" for="f-${name}">${esc(label)}${required ? ' *' : ''}</label><select id="f-${name}" class="input" name="${name}" ${required ? 'required' : ''}>${!required ? '<option value="">Select</option>' : ''}${values.map((value) => { const pair = Array.isArray(value) ? value : [value, value]; return `<option value="${esc(pair[0])}" ${String(pair[0]) === String(selected) ? 'selected' : ''}>${esc(pair[1])}</option>`; }).join('')}</select></div>`;
}
function textArea(label, name, value = '', placeholder = '', required = true) {
  return `<div><label class="label" for="f-${name}">${esc(label)}${required ? ' *' : ''}</label><textarea id="f-${name}" class="input min-h-24 resize-y" name="${name}" placeholder="${esc(placeholder)}" ${required ? 'required' : ''}>${esc(value)}</textarea></div>`;
}
function formPayload(form) { return Object.fromEntries(new FormData(form).entries()); }
function modalButtons(label, danger = false) { return `<button type="button" class="btn-secondary" data-action="close-modal">Cancel</button><button type="submit" class="${danger ? 'btn-danger' : 'btn-brand'}" data-submit-button>${esc(label)}</button>`; }

function skeletonPage() {
  $('#appContent').innerHTML = `<div class="mb-7 flex items-end justify-between"><div><div class="skeleton h-3 w-24"></div><div class="skeleton mt-3 h-7 w-64"></div></div><div class="skeleton h-10 w-28"></div></div><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${Array(4).fill('<div class="card p-5"><div class="skeleton h-10 w-10"></div><div class="skeleton mt-6 h-8 w-28"></div><div class="skeleton mt-3 h-3 w-40"></div></div>').join('')}</div><div class="mt-6 grid gap-5 xl:grid-cols-3"><div class="card p-5 xl:col-span-2"><div class="skeleton h-5 w-40"></div><div class="skeleton mt-6 h-64 w-full"></div></div><div class="card p-5"><div class="skeleton h-5 w-32"></div><div class="space-y-5 pt-6">${Array(4).fill('<div class="flex gap-3"><div class="skeleton h-10 w-10"></div><div class="flex-1"><div class="skeleton h-3 w-full"></div><div class="skeleton mt-3 h-3 w-2/3"></div></div></div>').join('')}</div></div></div>`;
}

function emptyState(iconName, title, message, action = '') {
  return `<div class="empty-state"><div class="empty-icon">${icon(iconName, 25)}</div><h3 class="text-sm font-extrabold text-navy-900">${esc(title)}</h3><p class="mt-1 max-w-sm text-xs leading-5 text-slate-500">${esc(message)}</p>${action}</div>`;
}

function pageHeader(kicker, title, description, actions = '') {
  return `<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="mb-1 text-[10px] font-extrabold uppercase tracking-[.18em] text-brand-700">${esc(kicker)}</p><h2 class="text-2xl font-black tracking-[-.035em] text-navy-950">${esc(title)}</h2><p class="mt-1 text-sm text-slate-500">${esc(description)}</p></div>${actions ? `<div class="flex flex-wrap gap-2">${actions}</div>` : ''}</div>`;
}

function metric(iconName, value, label, trend, colors = ['#0b7c6c', '#ecfdf9']) {
  return `<div class="card metric-card" style="--metric-color:${colors[0]};--metric-bg:${colors[1]}"><div class="metric-icon">${icon(iconName, 20)}</div><div class="metric-value">${value}</div><div class="metric-label">${esc(label)}</div><div class="metric-trend">${icon('arrowup', 12)} ${esc(trend)}</div></div>`;
}

function renderNav() {
  const nav = NAV[state.user.role];
  $('#mainNav').innerHTML = nav.map(([view, iconName, label]) => `<button class="nav-link ${state.view === view ? 'active' : ''}" data-view="${view}">${icon(iconName, 18)}<span>${esc(label)}</span>${['leaves', 'complaints'].includes(view) && state.data.badges?.[view] ? `<span class="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black text-navy-950">${state.data.badges[view]}</span>` : ''}</button>`).join('');
}

function renderDbStatus(connected) {
  const topStatus = $('#dbStatus');
  const sidebarStatus = $('#sidebarDbStatus');
  if (topStatus) {
    topStatus.className = `hidden items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold md:flex ${connected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`;
    topStatus.innerHTML = `<span class="h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}"></span><span>${connected ? 'MongoDB connected' : 'Demo mode'}</span>`;
  }
  if (sidebarStatus) {
    sidebarStatus.className = `mb-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-bold ${connected ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`;
    sidebarStatus.innerHTML = `<span class="h-2 w-2 shrink-0 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}"></span><span>${connected ? 'MongoDB connected' : 'Demo data mode'}</span>`;
  }
}

function renderLoginDbStatus(connected, temporary = false) {
  const node = $('#loginDbStatus');
  if (!node) return;
  if (!connected) {
    node.className = 'mb-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700';
    node.innerHTML = '<span class="h-2 w-2 shrink-0 rounded-full bg-amber-500"></span><span>MongoDB disconnected — demo mode active</span>';
    return;
  }
  node.className = 'mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700';
  node.innerHTML = '<span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span><span>MongoDB connected</span>';
  if (temporary) {
    clearTimeout(node._hideTimer);
    node._hideTimer = setTimeout(() => {
      node.classList.add('hidden');
      node.innerHTML = '';
    }, 2000);
  }
}

async function refreshDbStatus() {
  try {
    const health = await api('/api/health');
    const connected = Boolean(health.connected ?? /mongo/i.test(String(health.database || '')));
    renderDbStatus(connected);
    if (document.getElementById('loginScreen') && !document.getElementById('loginScreen').classList.contains('hidden')) {
      renderLoginDbStatus(connected, connected);
    }
  } catch (_error) {
    renderDbStatus(false);
    if (document.getElementById('loginScreen') && !document.getElementById('loginScreen').classList.contains('hidden')) {
      renderLoginDbStatus(false, false);
    }
  }
}

function setupApp() {
  const user = state.user;
  const initialsText = initials(user.name);
  $('#sideAvatar').textContent = initialsText;
  $('#topAvatar').textContent = initialsText;
  $('#sideName').textContent = user.name;
  $('#sideMeta').textContent = user.role === 'student' ? user.studentId : 'Chief Warden';
  $('#topName').textContent = user.name;
  $('#topRole').textContent = user.role;
  $('#portalLabel').textContent = user.role === 'warden' ? 'Warden portal' : 'Student portal';
  renderNav();
}

async function navigate(view) {
  state.view = view;
  state.filters = {};
  $('#pageTitle').textContent = TITLES[view] || 'SmartStay';
  $('#breadcrumb').textContent = `SmartStay / ${state.user.role === 'warden' ? 'Warden' : 'Student'} portal`;
  renderNav();
  closeSidebar();
  skeletonPage();
  try {
    if (view === 'overview') await renderOverview();
    else if (view === 'rooms') await renderRooms();
    else if (view === 'room') await renderMyRoom();
    else if (view === 'students') await renderStudents();
    else if (view === 'leaves') await renderLeaves();
    else if (view === 'fees') await renderFees();
    else if (view === 'complaints') await renderComplaints();
    else if (view === 'visitors') await renderVisitors();
    else if (view === 'reports') renderReports();
    else if (view === 'profile') renderProfile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    $('#appContent').innerHTML = emptyState('alert', 'Unable to load this page', error.message, `<button class="btn-secondary mt-4" data-view="${view}">Try again</button>`);
    toast(error.message, 'error');
  }
}

async function renderOverview() {
  const data = await api('/api/dashboard');
  state.data.dashboard = data;
  if (state.user.role === 'warden') renderWardenOverview(data); else renderStudentOverview(data);
}

function renderWardenOverview(data) {
  const s = data.stats;
  const occupancy = s.totalBeds ? Math.round((s.occupiedBeds / s.totalBeds) * 100) : 0;
  state.data.badges = { leaves: s.pendingLeaves, complaints: s.openComplaints };
  renderNav();
  $('#appContent').innerHTML = `${pageHeader('Operations at a glance', `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${state.user.name.split(' ')[0]}`, 'Here’s what is happening across the hostel today.', `<button class="btn-secondary" data-action="download-report" data-type="students">${icon('download', 17)} Export students</button><button class="btn-brand" data-action="add-student">${icon('plus', 17)} Add student</button>`)}
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    ${metric('users', s.students, 'Active students', 'All resident profiles', ['#2563eb','#eff6ff'])}
    ${metric('bed', `${s.occupiedBeds}/${s.totalBeds}`, 'Beds occupied', `${occupancy}% current occupancy`, ['#0b7c6c','#ecfdf9'])}
    ${metric('calendar', s.pendingLeaves, 'Pending leave requests', 'Awaiting your review', ['#d97706','#fffbeb'])}
    ${metric('rupee', money(s.collected), 'Fees collected', `${money(s.pendingAmount)} outstanding`, ['#7c3aed','#f5f3ff'])}
  </div>
  <div class="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
    <div class="card p-5 sm:p-6">
      <div class="flex items-center justify-between"><div><h3 class="section-title">Room occupancy</h3><p class="mt-1 text-xs text-slate-500">Bed utilization by hostel block</p></div><button class="filter-pill" data-view="rooms">View rooms ${icon('chevron-right', 14)}</button></div>
      <div class="mt-6 grid items-center gap-7 md:grid-cols-[170px_1fr]">
        <div class="mx-auto"><div class="donut" style="--value:${occupancy};--color:#14b89a"><div class="donut-label"><b class="text-2xl font-black text-navy-950">${occupancy}%</b><span class="text-[10px] font-bold text-slate-400">OCCUPIED</span></div></div></div>
        <div class="space-y-4">${blockRows(data.roomOccupancy)}</div>
      </div>
    </div>
    <div class="card p-5 sm:p-6">
      <div class="flex items-center justify-between"><div><h3 class="section-title">Today’s attention</h3><p class="mt-1 text-xs text-slate-500">Items requiring action</p></div>${icon('activity', 19, 'text-brand-700')}</div>
      <div class="mt-5 grid grid-cols-2 gap-3">
        <button class="rounded-2xl bg-amber-50 p-4 text-left transition hover:bg-amber-100" data-view="leaves"><span class="text-2xl font-black text-amber-700">${s.pendingLeaves}</span><span class="mt-1 block text-[11px] font-bold text-amber-800">Leave requests</span></button>
        <button class="rounded-2xl bg-red-50 p-4 text-left transition hover:bg-red-100" data-view="complaints"><span class="text-2xl font-black text-red-700">${s.openComplaints}</span><span class="mt-1 block text-[11px] font-bold text-red-800">Open complaints</span></button>
        <button class="rounded-2xl bg-sky-50 p-4 text-left transition hover:bg-sky-100" data-view="visitors"><span class="text-2xl font-black text-sky-700">${s.visitorsToday}</span><span class="mt-1 block text-[11px] font-bold text-sky-800">Visitors today</span></button>
        <button class="rounded-2xl bg-violet-50 p-4 text-left transition hover:bg-violet-100" data-view="fees"><span class="text-lg font-black text-violet-700">${money(s.pendingAmount)}</span><span class="mt-1 block text-[11px] font-bold text-violet-800">Pending fees</span></button>
      </div>
    </div>
  </div>
  <div class="card mt-5 p-5 sm:p-6"><div class="flex items-center justify-between"><div><h3 class="section-title">Recent activity</h3><p class="mt-1 text-xs text-slate-500">Latest events across all modules</p></div><span class="text-xs font-bold text-slate-400">Live feed</span></div><div class="mt-5 grid gap-x-8 md:grid-cols-2">${data.recent.length ? data.recent.map(activityRow).join('') : emptyState('activity','No recent activity','New updates will appear here.')}</div></div>`;
}

function blockRows(rooms) {
  const grouped = {};
  rooms.forEach((room) => { grouped[room.block] ||= { used: 0, total: 0 }; grouped[room.block].used += room.occupiedBeds; grouped[room.block].total += room.capacity; });
  return Object.entries(grouped).map(([block, item]) => { const pct = item.total ? Math.round(item.used / item.total * 100) : 0; return `<div><div class="mb-2 flex justify-between text-xs"><span class="font-bold text-navy-900">${esc(block)}</span><span class="text-slate-500">${item.used} of ${item.total} beds</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>`; }).join('');
}

function activityRow(item) {
  const info = item.type === 'leave' ? ['calendar','bg-amber-50 text-amber-700'] : item.type === 'complaint' ? ['wrench','bg-red-50 text-red-600'] : ['visitor','bg-sky-50 text-sky-600'];
  return `<div class="activity-row relative flex gap-3 py-3"><div class="relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-xl ${info[1]}">${icon(info[0], 16)}</div><span class="timeline-line"></span><div class="min-w-0 flex-1"><p class="truncate text-xs font-bold text-navy-900">${esc(item.title)}</p><div class="mt-1 flex items-center gap-2"><span class="text-[10px] text-slate-400">${relative(item.at)}</span>${statusBadge(item.status)}</div></div></div>`;
}

function renderStudentOverview(data) {
  const s = data.stats;
  $('#appContent').innerHTML = `${pageHeader('My hostel', `Welcome back, ${state.user.name.split(' ')[0]}`, 'Your room, requests and payments — all in one place.', `<button class="btn-secondary" data-action="request-visitor">${icon('visitor',17)} Visitor pass</button><button class="btn-brand" data-action="request-leave">${icon('plus',17)} Request leave</button>`)}
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    ${metric('rupee', money(s.pendingFees), 'Fees due', s.pendingFees ? 'Review payment details' : 'You are all caught up', ['#7c3aed','#f5f3ff'])}
    ${metric('calendar', s.pendingLeaves, 'Leave awaiting approval', 'Track warden decisions', ['#d97706','#fffbeb'])}
    ${metric('wrench', s.openComplaints, 'Open complaints', 'Maintenance requests', ['#dc2626','#fef2f2'])}
    ${metric('visitor', s.approvedVisitors, 'Active visitor passes', 'Approved or checked in', ['#0284c7','#f0f9ff'])}
  </div>
  <div class="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
    ${studentRoomCard(data.room)}
    <div class="card overflow-hidden"><div class="bg-navy-950 p-5 text-white"><div class="flex items-start justify-between"><div><p class="text-[10px] font-extrabold uppercase tracking-[.16em] text-brand-500">Digital hostel ID</p><h3 class="mt-2 text-lg font-black">${esc(state.user.name)}</h3><p class="mt-1 text-xs text-slate-400">${esc(state.user.studentId)}</p></div><div class="logo-mark"><span class="logo-building"></span></div></div></div><div class="grid grid-cols-2 gap-4 p-5 text-xs"><div><span class="text-slate-400">Course</span><b class="mt-1 block text-navy-900">${esc(state.user.course || '—')}</b></div><div><span class="text-slate-400">Year</span><b class="mt-1 block text-navy-900">${esc(state.user.year || '—')}</b></div><div><span class="text-slate-400">Room</span><b class="mt-1 block text-navy-900">${esc(data.room?.number || 'Not allocated')}</b></div><div><span class="text-slate-400">Status</span><div class="mt-1">${statusBadge('Active')}</div></div></div></div>
  </div>
  <div class="mt-5 grid gap-5 xl:grid-cols-2">
    <div class="card p-5 sm:p-6"><div class="flex items-center justify-between"><div><h3 class="section-title">Recent fees</h3><p class="mt-1 text-xs text-slate-500">Your latest charges and payments</p></div><button class="filter-pill" data-view="fees">View all ${icon('chevron-right',14)}</button></div><div class="mt-4">${data.recentFees.length ? data.recentFees.map((f) => `<div class="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">${icon('receipt',18)}</div><div class="min-w-0 flex-1"><p class="truncate text-xs font-bold text-navy-900">${esc(f.title)}</p><p class="mt-1 text-[10px] text-slate-400">Due ${formatDate(f.dueDate)}</p></div><div class="text-right"><b class="text-xs text-navy-900">${money(f.amount)}</b><div class="mt-1">${statusBadge(f.status)}</div></div></div>`).join('') : emptyState('wallet','No fees yet','Your charges will appear here.')}</div></div>
    <div class="card p-5 sm:p-6"><div class="flex items-center justify-between"><div><h3 class="section-title">Complaint updates</h3><p class="mt-1 text-xs text-slate-500">Status of your recent service requests</p></div><button class="filter-pill" data-view="complaints">View all ${icon('chevron-right',14)}</button></div><div class="mt-4">${data.recentComplaints.length ? data.recentComplaints.map((c) => `<div class="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">${icon('wrench',18)}</div><div class="min-w-0 flex-1"><p class="truncate text-xs font-bold text-navy-900">${esc(c.subject)}</p><p class="mt-1 text-[10px] text-slate-400">${esc(c.category)} · ${relative(c.createdAt)}</p></div>${statusBadge(c.status)}</div>`).join('') : emptyState('wrench','No complaints','Everything looks good.')}</div></div>
  </div>`;
}

function studentRoomCard(room) {
  if (!room) return `<div class="card p-6">${emptyState('bed','Room not yet allocated','Your warden will assign a room. You can still use all other portal services.')}</div>`;
  return `<div class="card overflow-hidden"><div class="flex flex-col gap-5 p-5 sm:flex-row sm:p-6"><div class="flex h-28 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 text-brand-700 sm:w-36">${icon('building',58)}</div><div class="min-w-0 flex-1"><div class="flex items-start justify-between"><div><span class="badge bg-brand-50 text-brand-700">${esc(room.block)}</span><h3 class="mt-3 text-3xl font-black tracking-tight text-navy-950">Room ${esc(room.number)}</h3><p class="mt-1 text-sm text-slate-500">Floor ${room.floor} · ${esc(room.type)}</p></div>${statusBadge(room.status)}</div><div class="mt-4 flex flex-wrap gap-2">${(room.amenities || []).map((a) => `<span class="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">${esc(a)}</span>`).join('')}</div></div></div><div class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 sm:px-6"><p class="text-xs text-slate-500"><b class="text-navy-900">${room.occupiedBeds}</b> of ${room.capacity} beds occupied</p><button class="text-xs font-extrabold text-brand-700" data-view="room">View room details →</button></div></div>`;
}

async function renderRooms(skipFetch = false) {
  if (!skipFetch) {
    const [roomData, studentData] = await Promise.all([api('/api/rooms'), api('/api/students')]);
    state.data.rooms = roomData.rooms; state.data.students = studentData.students;
  }
  const search = (state.filters.search || '').toLowerCase();
  const status = state.filters.status || 'All';
  const rooms = state.data.rooms.filter((r) => (!search || `${r.number} ${r.block} ${r.type}`.toLowerCase().includes(search)) && (status === 'All' || r.status === status));
  const all = state.data.rooms;
  const totalBeds = all.reduce((s, r) => s + r.capacity, 0); const occupied = all.reduce((s, r) => s + r.occupiedBeds, 0);
  $('#appContent').innerHTML = `${pageHeader('Hostel inventory','Rooms & occupancy','Create rooms, monitor vacancies and assign residents.', `<button class="btn-secondary" data-action="download-report" data-type="rooms">${icon('download',17)} Export</button><button class="btn-brand" data-action="add-room">${icon('plus',17)} Add room</button>`)}
  <div class="mb-5 grid gap-3 sm:grid-cols-3"><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rooms</p><p class="mt-1 text-2xl font-black text-navy-950">${all.length}</p></div><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Occupancy</p><p class="mt-1 text-2xl font-black text-navy-950">${totalBeds ? Math.round(occupied/totalBeds*100) : 0}%</p></div><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vacant beds</p><p class="mt-1 text-2xl font-black text-brand-700">${Math.max(0,totalBeds-occupied)}</p></div></div>
  <div class="card mb-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center"><div class="input-wrap flex-1"><span>${icon('search',17)}</span><input id="tableSearch" class="input pl-10" placeholder="Search room, block or type…" value="${esc(state.filters.search || '')}"></div><div class="flex flex-wrap gap-2">${['All','Available','Occupied','Maintenance'].map((x) => `<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x}</button>`).join('')}</div></div>
  ${rooms.length ? `<div class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">${rooms.map(roomCard).join('')}</div>` : `<div class="card">${emptyState('bed','No rooms found','Try changing your search or filter.',`<button class="btn-brand mt-4" data-action="add-room">${icon('plus',16)} Add room</button>`)}</div>`}`;
  $('#tableSearch')?.addEventListener('input', (e) => { state.filters.search = e.target.value; renderRooms(true); const input=$('#tableSearch'); input.focus(); input.setSelectionRange(input.value.length,input.value.length); });
}

function roomCard(room) {
  const pct = Math.min(100, Math.round(room.occupiedBeds / room.capacity * 100));
  return `<div class="card room-card"><div class="flex items-start justify-between"><div><span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">${esc(room.block)} · Floor ${room.floor}</span><h3 class="mt-1 text-2xl font-black text-navy-950">${esc(room.number)}</h3><p class="text-xs text-slate-500">${esc(room.type)} room</p></div>${statusBadge(room.status)}</div><div class="mt-5"><div class="mb-2 flex justify-between text-[11px]"><span class="font-bold text-slate-600">${room.occupiedBeds}/${room.capacity} beds occupied</span><span class="font-extrabold ${room.vacantBeds?'text-brand-700':'text-slate-400'}">${room.vacantBeds} vacant</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div><div class="mt-4 flex min-h-8 items-center justify-between"><div class="occupant-stack">${room.occupants.length ? room.occupants.slice(0,4).map((o)=>`<div class="mini-avatar" title="${esc(o.name)}">${initials(o.name)}</div>`).join('') : '<span class="text-[11px] text-slate-400">No occupants</span>'}</div><div class="flex"><button class="action-btn" data-action="room-details" data-id="${room._id}" title="View">${icon('eye',17)}</button><button class="action-btn" data-action="allocate-room" data-id="${room._id}" title="Allocate">${icon('users',17)}</button><button class="action-btn" data-action="edit-room" data-id="${room._id}" title="Edit">${icon('edit',17)}</button><button class="action-btn danger" data-action="delete-room" data-id="${room._id}" title="Delete">${icon('trash',17)}</button></div></div></div>`;
}

async function renderMyRoom() {
  const { rooms } = await api('/api/rooms');
  const room = rooms.find((r) => String(r._id) === String(state.user.roomId));
  if (!room) { $('#appContent').innerHTML = pageHeader('Accommodation','My room','Room and roommate information.') + `<div class="card">${emptyState('bed','No room allocated','Please contact your warden if you believe this is a mistake.')}</div>`; return; }
  $('#appContent').innerHTML = `${pageHeader('Accommodation','My room','Room amenities, roommates and guardian contact.', `<button class="btn-brand" data-action="raise-complaint">${icon('wrench',17)} Report an issue</button>`)}
  <div class="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><div class="card overflow-hidden"><div class="relative bg-gradient-to-br from-navy-950 to-navy-800 p-7 text-white"><div class="absolute -right-8 -top-12 text-white/[.05]">${icon('building',190)}</div><span class="badge bg-white/10 text-brand-500">${esc(room.block)}</span><h3 class="mt-4 text-4xl font-black">${esc(room.number)}</h3><p class="mt-2 text-sm text-slate-300">Floor ${room.floor} · ${esc(room.type)} · ${room.capacity} beds</p></div><div class="p-6"><h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">Room amenities</h4><div class="mt-4 grid gap-3 sm:grid-cols-2">${room.amenities.map((a)=>`<div class="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700"><span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">${icon('check',15)}</span>${esc(a)}</div>`).join('')}</div></div></div>
  <div class="space-y-5"><div class="card p-5"><h3 class="section-title">Roommates</h3><p class="mt-1 text-xs text-slate-500">${room.occupiedBeds} resident${room.occupiedBeds===1?'':'s'} in this room</p><div class="mt-4 space-y-3">${room.occupants.map((o)=>`<div class="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div class="avatar avatar-sm">${initials(o.name)}</div><div class="min-w-0"><p class="truncate text-xs font-bold text-navy-900">${esc(o.name)} ${String(o._id)===String(state.user._id)?'<span class="text-brand-700">(You)</span>':''}</p><p class="mt-0.5 text-[10px] text-slate-400">${esc(o.course||'Student')} · ${esc(o.studentId||'')}</p></div></div>`).join('')}</div></div><div class="card p-5"><h3 class="section-title">Need help?</h3><p class="mt-2 text-xs leading-5 text-slate-500">Raise a complaint for electrical, plumbing, internet, furniture or housekeeping issues.</p><button class="btn-secondary mt-4 w-full" data-action="raise-complaint">${icon('wrench',16)} Raise complaint</button></div></div></div>`;
}

async function renderStudents(skipFetch = false) {
  if (!skipFetch) state.data.students = (await api('/api/students')).students;
  const search = (state.filters.search || '').toLowerCase(); const status = state.filters.status || 'All';
  const students = state.data.students.filter((s) => (!search || `${s.name} ${s.email} ${s.studentId} ${s.course}`.toLowerCase().includes(search)) && (status==='All'||(status==='Active'?s.active:!s.active)));
  $('#appContent').innerHTML = `${pageHeader('Residents','Student directory','Manage profiles, guardians, account access and room allocation.', `<button class="btn-secondary" data-action="download-report" data-type="students">${icon('download',17)} Excel</button><button class="btn-brand" data-action="add-student">${icon('plus',17)} Add student</button>`)}
  <div class="card mb-5 flex flex-col gap-3 p-3 sm:flex-row"><div class="input-wrap flex-1"><span>${icon('search',17)}</span><input id="tableSearch" class="input pl-10" value="${esc(state.filters.search||'')}" placeholder="Search name, ID, email or course…"></div><div class="flex gap-2">${['All','Active','Inactive'].map(x=>`<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x}${x==='All'?` (${state.data.students.length})`:''}</button>`).join('')}</div></div>
  <div class="card overflow-hidden">${students.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th class="table-cell">Student</th><th class="table-cell">Course</th><th class="table-cell">Room</th><th class="table-cell">Contact</th><th class="table-cell">Status</th><th class="table-cell text-right">Actions</th></tr></thead><tbody>${students.map(studentRow).join('')}</tbody></table></div>`:emptyState('users','No students found','Try changing your search or add a new student.')}</div>`;
  $('#tableSearch')?.addEventListener('input',(e)=>{state.filters.search=e.target.value;renderStudents(true);const input=$('#tableSearch');input.focus();input.setSelectionRange(input.value.length,input.value.length);});
}

function studentRow(s) {
  return `<tr><td class="table-cell"><div class="flex items-center gap-3"><div class="avatar avatar-sm">${initials(s.name)}</div><div><p class="font-bold text-navy-900">${esc(s.name)}</p><p class="mt-0.5 text-[10px] text-slate-400">${esc(s.studentId)} · ${esc(s.email)}</p></div></div></td><td class="table-cell"><p class="font-semibold text-slate-700">${esc(s.course||'—')}</p><p class="text-[10px] text-slate-400">${esc(s.year||'')}</p></td><td class="table-cell">${s.room?`<span class="font-bold text-navy-900">${esc(s.room.number)}</span><p class="text-[10px] text-slate-400">${esc(s.room.block)}</p>`:'<span class="text-xs text-amber-600">Not allocated</span>'}</td><td class="table-cell"><p class="text-xs">${esc(s.phone||'—')}</p><p class="mt-0.5 text-[10px] text-slate-400">Guardian: ${esc(s.guardianName||'—')}</p></td><td class="table-cell">${statusBadge(s.active?'Active':'Inactive')}</td><td class="table-cell"><div class="flex justify-end"><button class="action-btn" data-action="view-student" data-id="${s._id}" title="View">${icon('eye',17)}</button><button class="action-btn" data-action="edit-student" data-id="${s._id}" title="Edit">${icon('edit',17)}</button><button class="action-btn ${s.active?'danger':''}" data-action="toggle-student" data-id="${s._id}" title="${s.active?'Deactivate':'Activate'}">${icon(s.active?'lock':'check',17)}</button></div></td></tr>`;
}

async function renderLeaves(skipFetch = false) {
  if (!skipFetch) state.data.leaves = (await api('/api/leaves')).leaves;
  const status = state.filters.status || 'All';
  const items = state.data.leaves.filter((x)=>status==='All'||x.status===status);
  const actions = state.user.role==='student'?`<button class="btn-brand" data-action="request-leave">${icon('plus',17)} New request</button>`:`<button class="btn-secondary" data-action="download-report" data-type="leaves">${icon('download',17)} Export Excel</button>`;
  $('#appContent').innerHTML = `${pageHeader('Attendance','Leave requests',state.user.role==='warden'?'Review and decide student leave applications.':'Plan time away and track your approvals.',actions)}
  <div class="mb-5 flex flex-wrap gap-2">${['All','Pending','Approved','Rejected'].map((x)=>`<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x} <span class="rounded-full bg-white/80 px-1.5">${state.data.leaves.filter(i=>x==='All'||i.status===x).length}</span></button>`).join('')}</div>
  <div class="space-y-3">${items.length?items.map(leaveCard).join(''):`<div class="card">${emptyState('calendar','No leave requests',state.user.role==='student'?'Submit a request whenever you need to travel away from campus.':'There are no requests in this category.',state.user.role==='student'?`<button class="btn-brand mt-4" data-action="request-leave">${icon('plus',16)} Request leave</button>`:'')}</div>`}</div>`;
}

function leaveCard(l) {
  const student = l.student || state.user;
  const days = Math.max(1, Math.round((new Date(l.toDate)-new Date(l.fromDate))/86400000)+1);
  return `<div class="card p-4 sm:p-5"><div class="flex flex-col gap-4 sm:flex-row sm:items-center"><div class="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-2xl bg-slate-100"><span class="text-[9px] font-black uppercase text-slate-400">${new Date(l.fromDate).toLocaleString('en',{month:'short'})}</span><b class="text-xl font-black text-navy-950">${new Date(l.fromDate).getDate()}</b></div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h3 class="text-sm font-extrabold text-navy-900">${state.user.role==='warden'?esc(student.name):esc(l.reason)}</h3>${statusBadge(l.status)}</div><p class="mt-1 text-xs text-slate-500">${formatDate(l.fromDate)} → ${formatDate(l.toDate)} · ${days} day${days===1?'':'s'} · ${esc(l.destination)}</p><p class="mt-2 text-xs text-slate-600">${state.user.role==='warden'?esc(l.reason):`Emergency contact: ${esc(l.emergencyContact)}`}</p>${l.wardenNote?`<div class="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500"><b class="text-slate-700">Warden note:</b> ${esc(l.wardenNote)}</div>`:''}</div><div class="flex flex-none gap-2">${state.user.role==='warden'&&l.status==='Pending'?`<button class="btn-secondary" data-action="decide-leave" data-decision="Rejected" data-id="${l._id}">${icon('x',15)} Reject</button><button class="btn-brand" data-action="decide-leave" data-decision="Approved" data-id="${l._id}">${icon('check',15)} Approve</button>`:''}${state.user.role==='student'&&l.status==='Pending'?`<button class="btn-danger" data-action="cancel-leave" data-id="${l._id}">Cancel</button>`:''}</div></div></div>`;
}

async function renderFees(skipFetch = false) {
  if (!skipFetch) {
    state.data.fees = (await api('/api/fees')).fees;
    if (state.user.role==='warden'&&!state.data.students) state.data.students=(await api('/api/students')).students;
  }
  const status=state.filters.status||'All'; const items=state.data.fees.filter((x)=>status==='All'||x.status===status);
  const paid=state.data.fees.filter(x=>x.status==='Paid').reduce((s,x)=>s+Number(x.amount),0); const pending=state.data.fees.filter(x=>x.status!=='Paid').reduce((s,x)=>s+Number(x.amount),0);
  const actions=state.user.role==='warden'?`<button class="btn-secondary" data-action="download-report" data-type="fees">${icon('download',17)} Excel</button><button class="btn-brand" data-action="assign-fee">${icon('plus',17)} Assign fee</button>`:'';
  $('#appContent').innerHTML=`${pageHeader('Finance','Fees & payments',state.user.role==='warden'?'Track collections and assign hostel charges.':'Review charges, due dates and payment receipts.',actions)}
  <div class="mb-5 grid gap-3 sm:grid-cols-3"><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${state.user.role==='warden'?'Total collected':'Amount paid'}</p><p class="mt-1 text-2xl font-black text-emerald-700">${money(paid)}</p></div><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outstanding</p><p class="mt-1 text-2xl font-black text-amber-700">${money(pending)}</p></div><div class="card p-4"><p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transactions</p><p class="mt-1 text-2xl font-black text-navy-950">${state.data.fees.length}</p></div></div>
  <div class="mb-5 flex flex-wrap gap-2">${['All','Pending','Paid','Overdue'].map(x=>`<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x} (${state.data.fees.filter(i=>x==='All'||i.status===x).length})</button>`).join('')}</div>
  <div class="card overflow-hidden">${items.length?`<div class="table-wrap"><table class="data-table"><thead><tr>${state.user.role==='warden'?'<th class="table-cell">Student</th>':''}<th class="table-cell">Description</th><th class="table-cell">Due date</th><th class="table-cell">Amount</th><th class="table-cell">Status</th><th class="table-cell text-right">Action</th></tr></thead><tbody>${items.map(feeRow).join('')}</tbody></table></div>`:emptyState('wallet','No fee records','No transactions match this filter.')}</div>`;
}

function feeRow(f) {
  return `<tr>${state.user.role==='warden'?`<td class="table-cell"><div class="flex items-center gap-2"><div class="avatar avatar-sm">${initials(f.student?.name)}</div><div><p class="font-bold text-navy-900">${esc(f.student?.name||'Unknown')}</p><p class="text-[10px] text-slate-400">${esc(f.student?.studentId||'')}</p></div></div></td>`:''}<td class="table-cell"><p class="font-bold text-navy-900">${esc(f.title)}</p>${f.transactionId?`<p class="mt-0.5 text-[10px] text-slate-400">Txn: ${esc(f.transactionId)}</p>`:''}</td><td class="table-cell"><p class="text-xs ${f.status==='Overdue'?'font-bold text-red-600':''}">${formatDate(f.dueDate)}</p>${f.paidAt?`<p class="text-[10px] text-slate-400">Paid ${formatDate(f.paidAt)}</p>`:''}</td><td class="table-cell"><b class="text-sm text-navy-950">${money(f.amount)}</b></td><td class="table-cell">${statusBadge(f.status)}</td><td class="table-cell text-right">${state.user.role==='student'&&f.status!=='Paid'?`<button class="btn-brand py-1.5" data-action="pay-fee" data-id="${f._id}">${icon('wallet',15)} Pay now</button>`:state.user.role==='student'?`<button class="btn-secondary py-1.5" data-action="view-receipt" data-id="${f._id}">${icon('receipt',15)} Receipt</button>`:`<button class="action-btn ml-auto" data-action="update-fee" data-id="${f._id}">${icon('edit',17)}</button>`}</td></tr>`;
}

async function renderComplaints(skipFetch = false) {
  if (!skipFetch) state.data.complaints=(await api('/api/complaints')).complaints;
  const status=state.filters.status||'All'; const items=state.data.complaints.filter(x=>status==='All'||x.status===status);
  const action=state.user.role==='student'?`<button class="btn-brand" data-action="raise-complaint">${icon('plus',17)} Raise complaint</button>`:`<button class="btn-secondary" data-action="download-report" data-type="complaints">${icon('download',17)} Export Excel</button>`;
  $('#appContent').innerHTML=`${pageHeader('Service desk','Complaints',state.user.role==='warden'?'Resolve resident issues and keep service levels visible.':'Report maintenance issues and follow their progress.',action)}<div class="mb-5 flex flex-wrap gap-2">${['All','Open','In Progress','Resolved'].map(x=>`<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x} (${state.data.complaints.filter(i=>x==='All'||i.status===x).length})</button>`).join('')}</div><div class="grid gap-4 ${state.user.role==='warden'?'xl:grid-cols-2':''}">${items.length?items.map(complaintCard).join(''):`<div class="card ${state.user.role==='warden'?'xl:col-span-2':''}">${emptyState('wrench','No complaints found','No service requests match this status.',state.user.role==='student'?`<button class="btn-brand mt-4" data-action="raise-complaint">Raise complaint</button>`:'')}</div>`}</div>`;
}

function complaintCard(c) {
  return `<div class="card p-5"><div class="flex items-start gap-4"><div class="flex h-11 w-11 flex-none items-center justify-center rounded-xl ${c.priority==='High'?'bg-red-50 text-red-600':c.priority==='Medium'?'bg-amber-50 text-amber-600':'bg-slate-100 text-slate-500'}">${icon('wrench',19)}</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">${esc(c.category)}</span>${priorityBadge(c.priority)}</div><h3 class="mt-1 text-sm font-extrabold text-navy-950">${esc(c.subject)}</h3><p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">${esc(c.description)}</p><div class="mt-3 flex flex-wrap items-center gap-2">${statusBadge(c.status)}<span class="text-[10px] text-slate-400">${relative(c.createdAt)}</span>${state.user.role==='warden'?`<span class="text-[10px] text-slate-400">· ${esc(c.student?.name||'Unknown')} ${c.student?.room?`(${esc(c.student.room.number)})`:''}</span>`:''}</div>${c.resolution?`<div class="mt-3 rounded-xl bg-emerald-50 p-3 text-[11px] leading-5 text-emerald-800"><b>Update:</b> ${esc(c.resolution)}</div>`:''}</div>${state.user.role==='warden'?`<button class="action-btn" data-action="update-complaint" data-id="${c._id}">${icon('edit',17)}</button>`:''}</div></div>`;
}

async function renderVisitors(skipFetch = false) {
  if (!skipFetch) {
    state.data.visitors=(await api('/api/visitors')).visitors;
    if(state.user.role==='warden'&&!state.data.students)state.data.students=(await api('/api/students')).students;
  }
  const status=state.filters.status||'All'; const items=state.data.visitors.filter(x=>status==='All'||x.status===status);
  const action=`${state.user.role==='warden'?`<button class="btn-secondary" data-action="download-report" data-type="visitors">${icon('download',17)} Excel</button>`:''}<button class="btn-brand" data-action="request-visitor">${icon('plus',17)} ${state.user.role==='warden'?'Add visitor':'Request pass'}</button>`;
  $('#appContent').innerHTML=`${pageHeader('Gate register','Visitor records',state.user.role==='warden'?'Approve visits and manage live check-ins.':'Request entry for a guardian, relative or guest.',action)}<div class="mb-5 flex flex-wrap gap-2">${['All','Pending','Approved','Checked In','Checked Out','Rejected'].map(x=>`<button class="filter-pill ${status===x?'active':''}" data-filter-status="${x}">${x}</button>`).join('')}</div><div class="card overflow-hidden">${items.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th class="table-cell">Visitor</th>${state.user.role==='warden'?'<th class="table-cell">Visiting</th>':''}<th class="table-cell">Schedule</th><th class="table-cell">Purpose</th><th class="table-cell">Status</th>${state.user.role==='warden'?'<th class="table-cell text-right">Gate action</th>':''}</tr></thead><tbody>${items.map(visitorRow).join('')}</tbody></table></div>`:emptyState('visitor','No visitors found','Visitor passes will appear here.')}</div>`;
}

function visitorRow(v) {
  let action='';
  if(state.user.role==='warden'){
    if(v.status==='Pending') action=`<button class="btn-secondary py-1.5" data-action="visitor-status" data-id="${v._id}" data-status="Rejected">Reject</button><button class="btn-brand py-1.5" data-action="visitor-status" data-id="${v._id}" data-status="Approved">Approve</button>`;
    else if(v.status==='Approved') action=`<button class="btn-brand py-1.5" data-action="visitor-status" data-id="${v._id}" data-status="Checked In">Check in</button>`;
    else if(v.status==='Checked In') action=`<button class="btn-secondary py-1.5" data-action="visitor-status" data-id="${v._id}" data-status="Checked Out">Check out</button>`;
  }
  return `<tr><td class="table-cell"><div class="flex items-center gap-3"><div class="avatar avatar-sm">${initials(v.visitorName)}</div><div><p class="font-bold text-navy-900">${esc(v.visitorName)}</p><p class="text-[10px] text-slate-400">${esc(v.relation)} · ${esc(v.phone)}</p></div></div></td>${state.user.role==='warden'?`<td class="table-cell"><p class="font-semibold text-slate-700">${esc(v.student?.name||'Unknown')}</p><p class="text-[10px] text-slate-400">${esc(v.student?.studentId||'')}</p></td>`:''}<td class="table-cell"><p class="text-xs font-semibold text-slate-700">${formatDate(v.visitDate)}</p><p class="text-[10px] text-slate-400">${esc(v.visitTime||'—')}</p></td><td class="table-cell"><p class="max-w-52 truncate text-xs">${esc(v.purpose)}</p></td><td class="table-cell">${statusBadge(v.status)}</td>${state.user.role==='warden'?`<td class="table-cell"><div class="flex justify-end gap-2">${action||'<span class="text-[10px] text-slate-400">No action</span>'}</div></td>`:''}</tr>`;
}

function renderReports() {
  const reports=[['students','users','Student register','Profiles, room, course and guardian details'],['rooms','bed','Room occupancy','Capacity, availability and bed utilization'],['fees','wallet','Fee collection','Amounts, status, due dates and transactions'],['leaves','calendar','Leave register','Travel dates, reasons and decisions'],['complaints','wrench','Complaint log','Categories, priorities, status and resolutions'],['visitors','visitor','Visitor register','Guest identity, schedule and gate status']];
  $('#appContent').innerHTML=`${pageHeader('Warden only','Reports & exports','Download formatted Excel workbooks for records and submission.')}<div class="mb-5 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-brand-800"><div class="mt-0.5">${icon('shield',20)}</div><div><p class="text-xs font-extrabold">Protected administrative feature</p><p class="mt-1 text-[11px] leading-5">All reports are generated securely on demand. Student accounts cannot access these endpoints.</p></div></div><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">${reports.map(r=>`<div class="card report-card p-5"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">${icon(r[1],21)}</div><h3 class="mt-5 text-base font-black text-navy-950">${r[2]}</h3><p class="mt-1 min-h-10 text-xs leading-5 text-slate-500">${r[3]}</p><div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Excel .xlsx</span><button class="btn-secondary py-1.5" data-action="download-report" data-type="${r[0]}">${icon('download',15)} Download</button></div></div>`).join('')}</div>`;
}

function renderProfile() {
  const u=state.user;
  $('#appContent').innerHTML=`${pageHeader('Account','Profile & security','Keep your contact information and credentials up to date.')}<div class="grid gap-5 xl:grid-cols-[1fr_360px]"><div class="card"><div class="border-b border-slate-100 p-5 sm:p-6"><h3 class="section-title">Personal information</h3><p class="mt-1 text-xs text-slate-500">Fields you can update from this portal.</p></div><form data-form="profile" class="p-5 sm:p-6"><div class="grid gap-4 sm:grid-cols-2">${field('Full name','name',{value:u.name})}${field('Email address','email',{type:'email',value:u.email,readonly:true})}${field('Phone number','phone',{value:u.phone||'',placeholder:'+91 98765 43210'})}${u.role==='student'?`${field('Student ID','studentId',{value:u.studentId||'',readonly:true})}${field('Course','course',{value:u.course||'',readonly:true})}${field('Year','year',{value:u.year||'',readonly:true})}${field('Guardian name','guardianName',{value:u.guardianName||''})}${field('Guardian phone','guardianPhone',{value:u.guardianPhone||''})}<div class="sm:col-span-2">${textArea('Home address','address',u.address||'','Full postal address',false)}</div>`:''}</div><div class="mt-6 flex justify-end"><button class="btn-brand" type="submit" data-submit-button>${icon('check',16)} Save changes</button></div></form></div><div class="space-y-5"><div class="card p-5"><div class="flex items-center gap-4"><div class="avatar h-16 w-16 rounded-2xl text-lg">${initials(u.name)}</div><div><h3 class="text-base font-black text-navy-950">${esc(u.name)}</h3><p class="mt-1 text-xs text-slate-500">${u.role==='warden'?'Chief Warden':esc(u.studentId)}</p><div class="mt-2">${statusBadge('Active')}</div></div></div></div><div class="card p-5"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">${icon('lock',19)}</div><h3 class="mt-4 text-sm font-black text-navy-950">Password & security</h3><p class="mt-1 text-xs leading-5 text-slate-500">Use at least 8 characters and never share your password.</p><button class="btn-secondary mt-4 w-full" data-action="change-password">Change password</button></div><div class="card border-emerald-100 bg-emerald-50 p-5"><div class="flex items-center gap-2 text-emerald-700">${icon('shield',18)}<b class="text-xs">Secure session active</b></div><p class="mt-2 text-[11px] leading-5 text-emerald-700/80">Your session is protected with an HttpOnly authentication cookie and automatically expires.</p></div></div></div>`;
}

function renderFilter() {
  if(state.view==='rooms')renderRooms(true); else if(state.view==='students')renderStudents(true); else if(state.view==='leaves')renderLeaves(true); else if(state.view==='fees')renderFees(true); else if(state.view==='complaints')renderComplaints(true); else if(state.view==='visitors')renderVisitors(true);
}

function openRoomForm(room=null) {
  modal({title:room?'Edit room':'Add a new room',subtitle:room?'Update inventory and maintenance status.':'Create a room in the hostel inventory.',body:`<form data-form="room" data-id="${room?room._id:''}"><div class="grid gap-4 sm:grid-cols-2">${field('Room number','number',{value:room?.number||'',placeholder:'A-101'})}${field('Block','block',{value:room?.block||'',placeholder:'A Block'})}${field('Floor','floor',{type:'number',value:room?.floor||1,min:0,max:20})}${selectField('Room type','type',['Single','Double','Triple','Four Sharing'],room?.type||'Double')}${field('Bed capacity','capacity',{type:'number',value:room?.capacity||2,min:1,max:8})}${selectField('Status','status',['Available','Occupied','Maintenance'],room?.status||'Available')}</div><div class="mt-4">${field('Amenities (comma separated)','amenities',{value:(room?.amenities||[]).join(', '),placeholder:'Wi-Fi, Study table, Attached bath',required:false})}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons(room?'Save changes':'Create room')}</div></form>`});
}

function openRoomDetails(room) {
  modal({title:`Room ${room.number}`,subtitle:`${room.block} · Floor ${room.floor} · ${room.type}`,size:'modal-lg',body:`<div class="grid gap-5 sm:grid-cols-[200px_1fr]"><div class="flex min-h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 text-brand-700">${icon('building',72)}</div><div><div class="flex flex-wrap gap-2">${statusBadge(room.status)}<span class="badge bg-slate-100 text-slate-600">${room.occupiedBeds}/${room.capacity} beds</span></div><h4 class="mt-5 text-xs font-extrabold uppercase tracking-wider text-slate-400">Amenities</h4><div class="mt-2 flex flex-wrap gap-2">${room.amenities.map(a=>`<span class="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold">${esc(a)}</span>`).join('')||'—'}</div></div></div><div class="mt-6"><div class="flex items-center justify-between"><h4 class="text-sm font-black text-navy-950">Current occupants</h4><button class="btn-secondary py-1.5" data-action="allocate-room" data-id="${room._id}">${icon('plus',15)} Allocate</button></div><div class="mt-3 space-y-2">${room.occupants.length?room.occupants.map(o=>`<div class="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div class="avatar avatar-sm">${initials(o.name)}</div><div class="min-w-0 flex-1"><p class="text-xs font-bold text-navy-900">${esc(o.name)}</p><p class="text-[10px] text-slate-400">${esc(o.studentId)} · ${esc(o.course||'')}</p></div><button class="btn-danger py-1.5" data-action="remove-allocation" data-room="${room._id}" data-id="${o._id}">Remove</button></div>`).join(''):`<div class="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No occupants assigned</div>`}</div></div>`});
}

function openAllocation(room) {
  const students=state.data.students||[];
  const options=students.filter(s=>s.active&&String(s.roomId||'')!==String(room._id)).map(s=>[s._id,`${s.name} · ${s.studentId}${s.room?` (currently ${s.room.number})`:' (unallocated)'}`]);
  modal({title:`Allocate room ${room.number}`,subtitle:`${room.vacantBeds} vacant bed${room.vacantBeds===1?'':'s'} available.`,body:options.length?`<form data-form="allocation" data-id="${room._id}">${selectField('Select student','studentId',options)}<div class="mt-4 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-800">If the selected student already has a room, they will be moved to ${esc(room.number)}.</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Allocate room')}</div></form>`:emptyState('users','No eligible students','All active students are already assigned to this room.')});
}

function openStudentForm(student=null) {
  modal({title:student?'Edit student':'Register a student',subtitle:student?'Update resident and guardian details.':'A student account will be created automatically.',size:'modal-lg',body:`<form data-form="student" data-id="${student?student._id:''}"><div class="grid gap-4 sm:grid-cols-2">${field('Full name','name',{value:student?.name||''})}${field('Student ID','studentId',{value:student?.studentId||'',placeholder:'SH2026009'})}${field('Email','email',{type:'email',value:student?.email||'',placeholder:'student@smartstay.edu'})}${field('Phone','phone',{value:student?.phone||''})}${field('Course','course',{value:student?.course||''})}${selectField('Year','year',['1st Year','2nd Year','3rd Year','4th Year','5th Year'],student?.year||'1st Year')}${field('Guardian name','guardianName',{value:student?.guardianName||'',required:false})}${field('Guardian phone','guardianPhone',{value:student?.guardianPhone||'',required:false})}${!student?field('Temporary password','password',{value:'Student@123',min:8}):''}<div class="sm:col-span-2">${textArea('Address','address',student?.address||'','Home address',false)}</div></div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons(student?'Save changes':'Create student account')}</div></form>`});
}

function openStudentDetails(s) {
  modal({title:s.name,subtitle:`${s.studentId} · ${s.year}`,body:`<div class="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><div class="avatar h-14 w-14 rounded-2xl text-base">${initials(s.name)}</div><div><p class="text-sm font-black text-navy-950">${esc(s.course||'—')}</p><div class="mt-1">${statusBadge(s.active?'Active':'Inactive')}</div></div></div><div class="mt-5 grid grid-cols-2 gap-4 text-xs"><div><span class="text-slate-400">Email</span><b class="mt-1 block break-all text-navy-900">${esc(s.email)}</b></div><div><span class="text-slate-400">Phone</span><b class="mt-1 block text-navy-900">${esc(s.phone||'—')}</b></div><div><span class="text-slate-400">Room</span><b class="mt-1 block text-navy-900">${esc(s.room?.number||'Not allocated')}</b></div><div><span class="text-slate-400">Guardian</span><b class="mt-1 block text-navy-900">${esc(s.guardianName||'—')}</b><small class="text-slate-400">${esc(s.guardianPhone||'')}</small></div><div class="col-span-2"><span class="text-slate-400">Address</span><b class="mt-1 block text-navy-900">${esc(s.address||'—')}</b></div></div>`});
}

function openLeaveRequest() {
  modal({title:'Request hostel leave',subtitle:'Complete all travel and emergency details.',body:`<form data-form="leave"><div class="grid gap-4 sm:grid-cols-2">${field('Departure date','fromDate',{type:'date',value:todayInput(1),min:todayInput(0)})}${field('Return date','toDate',{type:'date',value:todayInput(2),min:todayInput(0)})}${field('Destination','destination',{placeholder:'City / hometown'})}${field('Emergency contact','emergencyContact',{value:state.user.guardianPhone||state.user.phone||''})}</div><div class="mt-4">${textArea('Reason for leave','reason','','Explain why you need leave')}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Submit request')}</div></form>`});
}

function openLeaveDecision(leave, decision) {
  modal({title:`${decision} leave request`,subtitle:`${leave.student?.name} · ${formatDate(leave.fromDate)} to ${formatDate(leave.toDate)}`,body:`<form data-form="leave-decision" data-id="${leave._id}" data-decision="${decision}">${textArea('Warden note','wardenNote','',decision==='Approved'?'Optional travel instructions':'Reason for rejection',decision==='Rejected')}<div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons(decision,decision==='Rejected')}</div></form>`,size:'modal-sm'});
}

function openFeeForm() {
  const students=(state.data.students||[]).filter(s=>s.active).map(s=>[s._id,`${s.name} · ${s.studentId}`]);
  modal({title:'Assign a new fee',subtitle:'Create a charge for a student account.',body:`<form data-form="fee">${selectField('Student','studentId',students)}<div class="mt-4">${field('Fee description','title',{placeholder:'Hostel Fee — Semester 1'})}</div><div class="mt-4 grid gap-4 sm:grid-cols-2">${field('Amount (₹)','amount',{type:'number',min:1,placeholder:'40000'})}${field('Due date','dueDate',{type:'date',value:todayInput(14),min:todayInput(0)})}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Assign fee')}</div></form>`});
}

function openFeeStatus(fee) {
  modal({title:'Update fee status',subtitle:`${fee.student?.name} · ${fee.title}`,size:'modal-sm',body:`<form data-form="fee-status" data-id="${fee._id}">${selectField('Payment status','status',['Pending','Paid','Overdue'],fee.status)}<div class="mt-4">${field('Transaction / reference ID','transactionId',{value:fee.transactionId||'',required:false})}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Update status')}</div></form>`});
}

function openComplaintForm() {
  modal({title:'Raise a complaint',subtitle:'Give enough detail for the maintenance team.',body:`<form data-form="complaint"><div class="grid gap-4 sm:grid-cols-2">${selectField('Category','category',['Electrical','Plumbing','Internet','Furniture','Housekeeping','Security','Other'],'Electrical')}${selectField('Priority','priority',['Low','Medium','High'],'Medium')}</div><div class="mt-4">${field('Subject','subject',{placeholder:'Short description of the issue'})}</div><div class="mt-4">${textArea('Details','description','','Where is the issue and what is happening?')}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Submit complaint')}</div></form>`});
}

function openComplaintUpdate(c) {
  modal({title:'Update complaint',subtitle:`${c.student?.name||''} · ${c.subject}`,body:`<form data-form="complaint-status" data-id="${c._id}">${selectField('Status','status',['Open','In Progress','Resolved'],c.status)}<div class="mt-4">${textArea('Resolution / update','resolution',c.resolution||'','Work completed or next action',false)}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Save update')}</div></form>`});
}

function openVisitorForm() {
  const studentSelect=state.user.role==='warden'?`<div class="mb-4">${selectField('Student to visit','studentId',(state.data.students||[]).filter(s=>s.active).map(s=>[s._id,`${s.name} · ${s.studentId}`]))}</div>`:'';
  modal({title:state.user.role==='warden'?'Add visitor record':'Request a visitor pass',subtitle:'Visitors must carry a valid identity document.',body:`<form data-form="visitor">${studentSelect}<div class="grid gap-4 sm:grid-cols-2">${field('Visitor name','visitorName')}${field('Relation','relation',{placeholder:'Father / Mother / Friend'})}${field('Phone number','phone')}${field('Visit date','visitDate',{type:'date',value:todayInput(1),min:todayInput(0)})}${field('Visit time','visitTime',{type:'time',value:'10:00'})}${field('Purpose','purpose',{placeholder:'Purpose of visit'})}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons(state.user.role==='warden'?'Add record':'Request pass')}</div></form>`});
}

function openPasswordForm() {
  modal({title:'Change password',subtitle:'Choose a strong password with at least 8 characters.',size:'modal-sm',body:`<form data-form="password">${field('Current password','currentPassword',{type:'password'})}<div class="mt-4">${field('New password','newPassword',{type:'password',min:8})}</div><div class="mt-4">${field('Confirm new password','confirmPassword',{type:'password',min:8})}</div><div class="modal-footer -mx-[22px] -mb-[22px] mt-6">${modalButtons('Change password')}</div></form>`});
}

function showReceipt(fee) {
  modal({title:'Payment receipt',subtitle:'SmartStay digital payment record',size:'modal-sm',body:`<div class="text-center"><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">${icon('check',25)}</div><h3 class="mt-4 text-lg font-black text-navy-950">Payment successful</h3><p class="mt-1 text-xs text-slate-500">${esc(fee.title)}</p></div><div class="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-xs"><div class="flex justify-between"><span class="text-slate-500">Amount</span><b class="text-navy-950">${money(fee.amount)}</b></div><div class="flex justify-between"><span class="text-slate-500">Paid on</span><b class="text-navy-950">${formatDate(fee.paidAt)}</b></div><div class="flex justify-between gap-4"><span class="text-slate-500">Transaction ID</span><b class="break-all text-right text-navy-950">${esc(fee.transactionId||'—')}</b></div></div><button class="btn-secondary mt-5 w-full" data-action="copy-transaction" data-value="${esc(fee.transactionId||'')}">${icon('copy',16)} Copy transaction ID</button>`});
}

async function submitForm(form) {
  const type=form.dataset.form; const data=formPayload(form); const button=$('[data-submit-button]',form); const original=button?.innerHTML;
  if(button){button.disabled=true;button.innerHTML=`<span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span> Please wait`}
  try {
    let result;
    if(type==='room'){result=await api(`/api/rooms${form.dataset.id?`/${form.dataset.id}`:''}`,{method:form.dataset.id?'PUT':'POST',body:JSON.stringify(data)});}
    else if(type==='allocation'){result=await api(`/api/rooms/${form.dataset.id}/allocate`,{method:'POST',body:JSON.stringify(data)});}
    else if(type==='student'){result=await api(`/api/students${form.dataset.id?`/${form.dataset.id}`:''}`,{method:form.dataset.id?'PUT':'POST',body:JSON.stringify(data)});}
    else if(type==='leave'){result=await api('/api/leaves',{method:'POST',body:JSON.stringify(data)});}
    else if(type==='leave-decision'){result=await api(`/api/leaves/${form.dataset.id}/status`,{method:'PATCH',body:JSON.stringify({...data,status:form.dataset.decision})});}
    else if(type==='fee'){result=await api('/api/fees',{method:'POST',body:JSON.stringify(data)});}
    else if(type==='fee-status'){result=await api(`/api/fees/${form.dataset.id}/status`,{method:'PATCH',body:JSON.stringify(data)});}
    else if(type==='complaint'){result=await api('/api/complaints',{method:'POST',body:JSON.stringify(data)});}
    else if(type==='complaint-status'){result=await api(`/api/complaints/${form.dataset.id}/status`,{method:'PATCH',body:JSON.stringify(data)});}
    else if(type==='visitor'){result=await api('/api/visitors',{method:'POST',body:JSON.stringify(data)});}
    else if(type==='profile'){result=await api('/api/profile',{method:'PUT',body:JSON.stringify(data)});state.user={...state.user,...result.user};setupApp();}
    else if(type==='password'){if(data.newPassword!==data.confirmPassword)throw new Error('New passwords do not match.');result=await api('/api/profile/password',{method:'PUT',body:JSON.stringify(data)});}
    toast(result.message); closeModal();
    if(type==='profile')renderProfile(); else if(type==='password'){} else await navigate(state.view);
  } catch(error){toast(error.message,'error');if(button){button.disabled=false;button.innerHTML=original;}}
}

async function handleAction(action, element, clickTarget) {
  const idValue=element.dataset.id;
  try {
    if(action==='open-sidebar')openSidebar();
    else if(action==='close-sidebar')closeSidebar();
    else if(action==='close-modal')closeModal();
    else if(action==='modal-backdrop' && element === clickTarget)closeModal();
    else if(action==='logout')await logout();
    else if(action==='profile')navigate('profile');
    else if(action==='notifications'){toast(state.user.role==='warden'?'Pending leave and complaint items are highlighted on your overview.':'New approval and payment updates appear on your dashboard.','info');$('#notificationDot').classList.add('hidden');}
    else if(action==='add-room')openRoomForm();
    else if(action==='edit-room')openRoomForm(state.data.rooms.find(x=>String(x._id)===idValue));
    else if(action==='room-details')openRoomDetails(state.data.rooms.find(x=>String(x._id)===idValue));
    else if(action==='allocate-room'){const room=state.data.rooms.find(x=>String(x._id)===idValue);if(room.status==='Maintenance')return toast('Finish maintenance before allocating this room.','error');if(room.vacantBeds<1)return toast('This room has no vacant beds.','error');openAllocation(room);}
    else if(action==='delete-room'){const room=state.data.rooms.find(x=>String(x._id)===idValue);if(await confirmAction({title:'Delete this room?',message:`Room ${room.number} will be permanently removed from inventory.`,confirmText:'Delete room',danger:true})){const r=await api(`/api/rooms/${idValue}`,{method:'DELETE'});toast(r.message);navigate('rooms');}}
    else if(action==='remove-allocation'){if(await confirmAction({title:'Remove room allocation?',message:'The student will become unallocated until a new room is assigned.',confirmText:'Remove',danger:true})){const r=await api(`/api/rooms/${element.dataset.room}/allocate/${idValue}`,{method:'DELETE'});toast(r.message);closeModal();navigate('rooms');}}
    else if(action==='add-student')openStudentForm();
    else if(action==='edit-student')openStudentForm(state.data.students.find(x=>String(x._id)===idValue));
    else if(action==='view-student')openStudentDetails(state.data.students.find(x=>String(x._id)===idValue));
    else if(action==='toggle-student'){const s=state.data.students.find(x=>String(x._id)===idValue);if(await confirmAction({title:`${s.active?'Deactivate':'Activate'} account?`,message:`${s.name} will ${s.active?'lose access to the student portal':'regain portal access'}.`,confirmText:s.active?'Deactivate':'Activate',danger:s.active})){const r=await api(`/api/students/${idValue}/status`,{method:'PATCH',body:JSON.stringify({active:!s.active})});toast(r.message);navigate('students');}}
    else if(action==='request-leave')openLeaveRequest();
    else if(action==='decide-leave')openLeaveDecision(state.data.leaves.find(x=>String(x._id)===idValue),element.dataset.decision);
    else if(action==='cancel-leave'){if(await confirmAction({title:'Cancel leave request?',message:'This pending application will be removed.',confirmText:'Cancel request',danger:true})){const r=await api(`/api/leaves/${idValue}`,{method:'DELETE'});toast(r.message);navigate('leaves');}}
    else if(action==='assign-fee')openFeeForm();
    else if(action==='update-fee')openFeeStatus(state.data.fees.find(x=>String(x._id)===idValue));
    else if(action==='pay-fee'){const f=state.data.fees.find(x=>String(x._id)===idValue);if(await confirmAction({title:`Pay ${money(f.amount)}?`,message:`This demo records payment for “${f.title}” and generates a transaction ID. No real money is charged.`,confirmText:'Confirm payment'})){const r=await api(`/api/fees/${idValue}/pay`,{method:'PATCH',body:'{}'});toast(r.message);navigate('fees');}}
    else if(action==='view-receipt')showReceipt(state.data.fees.find(x=>String(x._id)===idValue));
    else if(action==='raise-complaint')openComplaintForm();
    else if(action==='update-complaint')openComplaintUpdate(state.data.complaints.find(x=>String(x._id)===idValue));
    else if(action==='request-visitor')openVisitorForm();
    else if(action==='visitor-status'){const r=await api(`/api/visitors/${idValue}/status`,{method:'PATCH',body:JSON.stringify({status:element.dataset.status})});toast(r.message);navigate('visitors');}
    else if(action==='download-report'){toast(`Preparing ${element.dataset.type} workbook…`,'info');window.location.href=`/api/reports/${element.dataset.type}`;}
    else if(action==='change-password')openPasswordForm();
    else if(action==='copy-transaction'){await navigator.clipboard.writeText(element.dataset.value);toast('Transaction ID copied.');}
    else if(action==='toggle-password'){const input=$('#loginPassword');input.type=input.type==='password'?'text':'password';element.innerHTML=icon(input.type==='password'?'eye':'eye-off');}
    else if(action==='use-demo')fillDemo();
    else if(action==='forgot-password')modal({title:'Password assistance',subtitle:'Demo recovery information',size:'modal-sm',body:`<div class="flex gap-3 rounded-xl bg-sky-50 p-4 text-sky-800"><div>${icon('info',19)}</div><p class="text-xs leading-5">For this mini project, use the demo credentials shown below the login form. In production, connect this action to an email OTP or administrator-assisted reset flow.</p></div>`});
  }catch(error){toast(error.message,'error');}
}

function openSidebar(){$('#sidebar').classList.add('open');$('#sidebarOverlay').classList.add('open');}
function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebarOverlay').classList.remove('open');}

function fillDemo() {
  const role=state.loginRole; $('#loginEmail').value=role==='warden'?'warden@smartstay.edu':'arun@smartstay.edu'; $('#loginPassword').value=role==='warden'?'Warden@123':'Student@123'; $('#loginPassword').focus();
}

function selectLoginRole(role) {
  state.loginRole=role; $('#loginRole').value=role;
  $$('[data-login-role]').forEach(b=>b.classList.toggle('active',b.dataset.loginRole===role));
  $('#demoTitle').textContent=role==='warden'?'Warden demo':'Student demo';
  $('#demoEmail').textContent=role==='warden'?'warden@smartstay.edu · Warden@123':'arun@smartstay.edu · Student@123';
}

async function login(event) {
  event.preventDefault(); const button=$('#loginButton'); const original=button.innerHTML; button.disabled=true;button.innerHTML=`<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span> Signing in…`;
  try{
    const email=$('#loginEmail').value.trim(); const result=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password:$('#loginPassword').value,role:state.loginRole})});
    if($('#rememberEmail').checked)localStorage.setItem('smartstay_email',email);else localStorage.removeItem('smartstay_email');
    state.user=result.user;state.view='overview';showApp();toast(`Welcome back, ${state.user.name.split(' ')[0]}.`);await navigate('overview');
  }catch(error){toast(error.message,'error');}finally{button.disabled=false;button.innerHTML=original;hydrateIcons(button);}
}

async function logout() {
  const okay=await confirmAction({title:'Sign out of SmartStay?',message:'Your secure session will end on this device.',confirmText:'Sign out'}); if(!okay)return;
  try{await api('/api/auth/logout',{method:'POST',body:'{}'});}catch(_){}
  state.user=null;state.data={};showLogin();toast('You have been signed out.');
}

function showLogin(){
  state.user=null;$('#appScreen').classList.add('hidden');$('#loginScreen').classList.remove('hidden');closeModal();
  const node = $('#loginDbStatus');
  if (node) {
    node.classList.add('hidden');
    node.innerHTML = '';
  }
  refreshDbStatus();
}
function showApp(){$('#loginScreen').classList.add('hidden');$('#appScreen').classList.remove('hidden');setupApp();}

async function initialize() {
  hydrateIcons();
  $('#loginForm').addEventListener('submit',login);
  const saved=localStorage.getItem('smartstay_email');if(saved){$('#loginEmail').value=saved;$('#rememberEmail').checked=true;}
  refreshDbStatus();
  setInterval(refreshDbStatus, 20000);
  try{
    const result=await api('/api/auth/me');
    if(result.user){state.user=result.user;state.view='overview';showApp();await navigate('overview');}
    else showLogin();
  }catch(_){showLogin();}
  $('#loadingScreen').classList.add('hidden');
}

document.addEventListener('click',(event)=>{
  const roleButton=event.target.closest('[data-login-role]');if(roleButton){selectLoginRole(roleButton.dataset.loginRole);return;}
  const nav=event.target.closest('[data-view]');if(nav){navigate(nav.dataset.view);return;}
  const filter=event.target.closest('[data-filter-status]');if(filter){state.filters.status=filter.dataset.filterStatus;renderFilter();return;}
  const action=event.target.closest('[data-action]');if(action)handleAction(action.dataset.action, action, event.target);
});
document.addEventListener('submit',(event)=>{const form=event.target.closest('[data-form]');if(form){event.preventDefault();submitForm(form);}});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){if($('#confirmRoot').innerHTML)return;if($('#modalRoot').innerHTML)closeModal();else closeSidebar();}});
window.addEventListener('resize',()=>{if(window.innerWidth>=1024)closeSidebar();});

initialize();
;
