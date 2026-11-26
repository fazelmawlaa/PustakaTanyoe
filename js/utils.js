// ============================================================
// PustakaTanyoe — Utility Functions
// ============================================================

// ── Toast Notifications ──
function showToast(type, title, message = '', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.classList.add('hiding');setTimeout(()=>this.parentElement.remove(),250)">
      <i class="fas fa-times"></i>
    </button>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// ── Date Formatting ──
function formatDate(isoString, options = {}) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  const defaults = { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('id-ID', { ...defaults, ...options });
}

function formatDateShort(isoString) {
  if (!isoString) return '-';
  return formatDate(isoString, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Baru saja';
  if (mins < 60)  return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7)   return `${days} hari lalu`;
  return formatDateShort(isoString);
}

function getDaysLeft(dueDateStr) {
  if (!dueDateStr) return null;
  const diff = new Date(dueDateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function getDueDateStatus(dueDateStr) {
  const days = getDaysLeft(dueDateStr);
  if (days === null) return { text: '-', class: '' };
  if (days < 0) return { text: `Terlambat ${Math.abs(days)} hari`, class: 'text-danger' };
  if (days === 0) return { text: 'Jatuh tempo hari ini', class: 'text-warning' };
  if (days <= 2) return { text: `${days} hari lagi`, class: 'text-warning' };
  return { text: `${days} hari lagi`, class: 'text-success' };
}

// ── Loan Status Badge ──
function getLoanStatusBadge(status, loan = null) {
  if (loan && (loan.autoRejected || (loan.rejectedReason && loan.rejectedReason.includes('3 buku')) || (loan.notes && loan.notes.includes('Otomatis')))) {
    return `<span class="badge badge-red" style="font-weight:700;" title="Ditolak otomatis oleh sistem karena kuota 3 buku terpenuhi"><i class="fas fa-ban"></i> Ditolak Otomatis</span>`;
  }
  const map = {
    pending:  { label: 'Menunggu',     class: 'badge-yellow' },
    active:   { label: 'Dipinjam',     class: 'badge-blue' },
    overdue:  { label: 'Terlambat',    class: 'badge-red' },
    returned: { label: 'Dikembalikan', class: 'badge-green' },
    rejected: { label: 'Ditolak',      class: 'badge-gray' },
  };
  const s = map[status] || { label: status, class: 'badge-gray' };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

function getMemberStatusBadge(status) {
  const map = {
    active:    { label: 'Aktif',    class: 'badge-green' },
    suspended: { label: 'Ditangguhkan', class: 'badge-red' },
    pending:   { label: 'Menunggu', class: 'badge-yellow' },
  };
  const s = map[status] || { label: status, class: 'badge-gray' };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

// ── Star Rating ──
function renderStars(rating, max = 5) {
  const r = (typeof rating === 'number' && !isNaN(rating)) ? Math.max(0, Math.min(max, rating)) : 5.0;
  let html = '<div class="book-rating">';
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(r)) {
      html += '<i class="fas fa-star star filled"></i>';
    } else if (i - 0.5 <= r) {
      html += '<i class="fas fa-star-half-alt star filled"></i>';
    } else {
      html += '<i class="far fa-star star"></i>';
    }
  }
  html += `<span class="rating-count">(${r.toFixed(1)})</span></div>`;
  return html;
}

// ── Book Cover Gradient & Source Helper ──
const DEFAULT_BOOK_COVERS = {
  bk001: 'assets/images/covers/bk001.jpg',
  bk002: 'assets/images/covers/bk002.jpeg',
  bk003: 'assets/images/covers/bk003.jpg',
  bk004: 'assets/images/covers/bk004.jpeg',
  bk005: 'assets/images/covers/bk005.jpeg',
  bk006: 'assets/images/covers/bk006.jpeg',
  bk007: 'assets/images/covers/bk007.jpeg',
  bk008: 'assets/images/covers/bk008.jpeg',
  bk009: 'assets/images/covers/bk009.jpeg',
  bk010: 'assets/images/covers/bk010.jpeg',
  bk011: 'assets/images/covers/bk011.jpg',
  bk012: 'assets/images/covers/bk012.jpg',
  bk013: 'assets/images/covers/bk013.jpeg',
  bk014: 'assets/images/covers/bk014.jpeg',
  bk015: 'assets/images/covers/bk015.jpg',
  bk016: 'assets/images/covers/bk016.jpg',
  bk017: 'assets/images/covers/bk017.jpeg',
  bk018: 'assets/images/covers/bk018.jpeg',
  bk019: 'assets/images/covers/bk019.jpg',
  bk020: 'assets/images/covers/bk020.jpg',
  bk021: 'assets/images/covers/bk021.jpeg',
  bk022: 'assets/images/covers/bk022.jpeg'
};

function getBookCoverGradient(book) {
  return `linear-gradient(135deg, ${book.coverColor || '#1B2B4B'} 0%, ${book.coverColor2 || '#0A1428'} 100%)`;
}

function getBookCoverSrc(book) {
  if (!book) return '';
  let imgPath = book.coverImage;
  if (!imgPath || imgPath.endsWith('.svg')) {
    imgPath = (book.id && DEFAULT_BOOK_COVERS[book.id]) ? DEFAULT_BOOK_COVERS[book.id] : 'assets/images/covers/bk001.jpg';
  }
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
    return imgPath;
  }
  const isSubdir = (typeof window !== 'undefined' && window.location && window.location.pathname)
    ? (window.location.pathname.includes('/user/') || window.location.pathname.includes('/admin/'))
    : false;
  if (imgPath.startsWith('../')) {
    imgPath = imgPath.replace(/^\.\.\//, '');
  }
  return (isSubdir ? '../' : '') + imgPath;
}

function renderBookCover(book, classes = '') {
  const src = getBookCoverSrc(book);
  const isRusak = book.statusEksemplar === 'Rusak';
  const avail = (book.stock || 0) - (book.borrowed || 0);

  let badgeHtml = '';
  if (isRusak) {
    badgeHtml = `<span class="book-availability-badge badge-rusak"><i class="fas fa-tools"></i> Rusak (F11)</span>`;
  } else if (book.isBorrowedByMe) {
    badgeHtml = `<span class="book-availability-badge badge-my-loan"><i class="fas fa-book-reader"></i> Dipinjam</span>`;
  } else if (avail > 0) {
    badgeHtml = `<span class="book-availability-badge badge-available">Tersedia</span>`;
  } else {
    badgeHtml = `<span class="book-availability-badge badge-borrowed">Habis</span>`;
  }

  return `
    <div class="book-cover ${classes}" style="background:${getBookCoverGradient(book)}; position:relative; overflow:hidden;">
      <img src="${src}" alt="${book.title}" class="book-cover-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" loading="lazy" />
      <div class="book-cover-placeholder" style="display:none;">
        <i class="fas fa-book"></i>
        <span class="book-cover-title">${book.title}</span>
      </div>
      ${badgeHtml}
      ${book.isNewArrival ? '<span class="book-availability-badge badge-new" style="top:40px;">Baru</span>' : ''}
    </div>`;
}

// ── Animated Counter ──
function animateCounter(element, target, duration = 1200) {
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current.toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    if (!isNaN(target)) animateCounter(el, target);
  });
}

// ── Scroll Reveal ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

// ── Navbar scroll behavior ──
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const handler = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

// ── Mobile Hamburger ──
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Modal ──
function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

// ── Dropdown ──
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-trigger]');
    const menu    = dd.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
      if (!isOpen) menu.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });
}

// ── Pagination ──
function createPagination(total, perPage, currentPage, onPageChange) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return '';
  let html = '<div class="pagination">';

  html += `<div class="page-item ${currentPage === 1 ? 'disabled' : ''}" onclick="${currentPage > 1 ? `(${onPageChange})(${currentPage-1})` : ''}"><i class="fas fa-chevron-left"></i></div>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
      html += `<div class="page-item ${i === currentPage ? 'active' : ''}" onclick="(${onPageChange})(${i})">${i}</div>`;
    } else if (Math.abs(i - currentPage) === 3) {
      html += `<div class="page-item disabled">...</div>`;
    }
  }

  html += `<div class="page-item ${currentPage === totalPages ? 'disabled' : ''}" onclick="${currentPage < totalPages ? `(${onPageChange})(${currentPage+1})` : ''}"><i class="fas fa-chevron-right"></i></div>`;
  html += '</div>';
  return html;
}

// ── Update notification badge ──
function updateNotifBadge() {
  const session = window.getCurrentSession ? window.getCurrentSession() : null;
  if (!session || !window.notificationSystem) return;
  const count = window.notificationSystem.getUnreadCount(session.userId);
  document.querySelectorAll('.notif-count').forEach(el => {
    el.textContent = count || '';
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── User Avatar Helper ──
function renderUserAvatarHtml(userOrSession, sizeClass = '') {
  if (!userOrSession) return `<div class="avatar ${sizeClass}">?</div>`;
  const name = userOrSession.name || 'User';
  const initial = name.slice(0, 1).toUpperCase();
  if (userOrSession.avatar) {
    return `<div class="avatar ${sizeClass}"><img src="${userOrSession.avatar}" class="avatar-img" alt="${name}" onerror="this.remove();" /></div>`;
  }
  return `<div class="avatar ${sizeClass}">${initial}</div>`;
}

function updateUserNavAvatar() {
  const session = window.getCurrentSession ? window.getCurrentSession() : null;
  if (!session) return;
  const user = window.getUserById ? window.getUserById(session.userId) : null;
  const u = user || session;
  const avatarEl = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userNameHeader');
  if (nameEl && u.name) {
    nameEl.textContent = u.name.split(' ')[0];
  }
  if (avatarEl) {
    if (u.avatar) {
      avatarEl.innerHTML = `<img src="${u.avatar}" class="avatar-img" alt="${u.name}" onerror="this.parentElement.textContent='${(u.name||'M').slice(0,1).toUpperCase()}';" />`;
      avatarEl.style.background = 'transparent';
    } else {
      avatarEl.textContent = (u.name || 'M').slice(0, 1).toUpperCase();
      avatarEl.style.background = '';
    }
  }
}

// ── Render user info in nav ──
function renderNavUser() {
  const session = window.getCurrentSession ? window.getCurrentSession() : null;
  const navUserArea = document.getElementById('navUserArea');
  if (!navUserArea) return;
  if (session) {
    const user = window.getUserById ? window.getUserById(session.userId) : null;
    const u = user || session;
    const avatarInner = u.avatar
      ? `<img src="${u.avatar}" class="avatar-img" alt="${u.name}" onerror="this.parentElement.textContent='${u.name.slice(0,1).toUpperCase()}';" />`
      : u.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    navUserArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-ghost" data-dropdown-trigger style="display:flex;align-items:center;gap:8px;padding:6px 10px;">
          <div class="avatar avatar-sm" style="${u.avatar ? 'background:transparent;' : ''}">${avatarInner}</div>
          <span class="text-sm font-medium hidden-mobile">${session.name.split(' ')[0]}</span>
          <i class="fas fa-chevron-down text-xs text-muted"></i>
        </button>
        <div class="dropdown-menu" style="min-width:200px;">
          <div style="padding:12px 16px;border-bottom:1px solid var(--color-border);">
            <div class="font-semibold text-sm">${session.name}</div>
            <div class="text-xs text-muted">${session.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</div>
          </div>
          <a class="dropdown-item" href="${session.role === 'admin' ? 'admin/dashboard.html' : 'user/dashboard.html'}">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </a>
          ${session.role === 'user' ? `<a class="dropdown-item" href="user/profile.html"><i class="fas fa-user"></i> Profil</a>` : ''}
          <div class="dropdown-divider"></div>
          <div class="dropdown-item text-danger" onclick="handleLogout()" style="cursor:pointer;">
            <i class="fas fa-sign-out-alt"></i> Keluar
          </div>
        </div>
      </div>`;
    initDropdowns();
  } else {
    navUserArea.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Masuk</a>
      <a href="register.html" class="btn btn-primary btn-sm">Daftar <i class="fas fa-arrow-right"></i></a>`;
  }
}

function handleLogout() {
  if (window.logoutUser) window.logoutUser();
  window.location.href = window.location.href.includes('/user/') || window.location.href.includes('/admin/')
    ? '../index.html' : 'index.html';
}

// ── Sidebar active link ──
function initSidebarActiveLink() {
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) link.classList.add('active');
  });
}

// ── Render sidebar user info ──
function renderSidebarUser() {
  const session = window.getCurrentSession ? window.getCurrentSession() : null;
  const el = document.getElementById('sidebarUser');
  if (!el || !session) return;
  const initials = session.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  el.innerHTML = `
    <div class="sidebar-user">
      <div class="sidebar-avatar">${initials}</div>
      <div>
        <div class="sidebar-user-name">${session.name.split(' ').slice(0,2).join(' ')}</div>
        <div class="sidebar-user-role">${session.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</div>
      </div>
    </div>
    <button onclick="handleLogout()" class="btn btn-ghost w-full" style="color:rgba(255,255,255,0.5);justify-content:flex-start;padding:8px 0;font-size:0.8rem;">
      <i class="fas fa-sign-out-alt"></i> Keluar
    </button>`;
}

// ── Init App ──
function initApp() {
  if (window.initBookData) initBookData();
  if (window.initUserData) initUserData();
  if (window.initLoanData) initLoanData();
  if (window.updateOverdueStatus) updateOverdueStatus();
  initNavbar();
  initMobileMenu();
  initModals();
  initDropdowns();
  initScrollReveal();

  setTimeout(() => {
    initCounters();
    updateNotifBadge();
    updateUserNavAvatar();
    renderSidebarUser();
    initSidebarActiveLink();
    initAdminSidebar();
  }, 100);
}

// ── Admin Sidebar Toggle & Collapse ──
function toggleAdminSidebar() {
  const layout = document.querySelector('.app-layout');
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const isDesktop = window.innerWidth > 1024;
  if (isDesktop) {
    if (layout) {
      layout.classList.toggle('sidebar-collapsed');
      const isCollapsed = layout.classList.contains('sidebar-collapsed');
      localStorage.setItem('pt_admin_sidebar_collapsed', isCollapsed ? 'true' : 'false');
      updateSidebarToggleState(isCollapsed);
    }
  } else {
    sidebar.classList.toggle('mobile-open');
  }
}

function initAdminSidebar() {
  const isDesktop = window.innerWidth > 1024;
  if (isDesktop && localStorage.getItem('pt_admin_sidebar_collapsed') === 'true') {
    const layout = document.querySelector('.app-layout');
    if (layout) layout.classList.add('sidebar-collapsed');
    updateSidebarToggleState(true);
  }
}

function updateSidebarToggleState(isCollapsed) {
  const btns = document.querySelectorAll('.sidebar-toggle-btn');
  btns.forEach(btn => {
    btn.setAttribute('title', isCollapsed ? 'Tampilkan Menu Sidebar' : 'Sembunyikan Menu Sidebar');
    btn.setAttribute('aria-label', isCollapsed ? 'Tampilkan Menu Sidebar' : 'Sembunyikan Menu Sidebar');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isCollapsed ? 'fas fa-indent' : 'fas fa-bars';
    }
  });
}

// Expose globals
window.showToast         = showToast;
window.renderUserAvatarHtml = renderUserAvatarHtml;
window.updateUserNavAvatar  = updateUserNavAvatar;
window.formatDate        = formatDate;
window.formatDateShort   = formatDateShort;
window.formatDateTime    = formatDateTime;
window.timeAgo           = timeAgo;
window.getDaysLeft       = getDaysLeft;
window.getDueDateStatus  = getDueDateStatus;
window.getLoanStatusBadge = getLoanStatusBadge;
window.getMemberStatusBadge = getMemberStatusBadge;
window.renderStars       = renderStars;
window.getBookCoverGradient = getBookCoverGradient;
window.getBookCoverSrc   = getBookCoverSrc;
window.renderBookCover   = renderBookCover;
window.animateCounter    = animateCounter;
window.initCounters      = initCounters;
window.openModal         = openModal;
window.closeModal        = closeModal;
window.initModals        = initModals;
window.createPagination  = createPagination;
window.updateNotifBadge  = updateNotifBadge;
window.renderNavUser     = renderNavUser;
window.handleLogout      = handleLogout;
window.renderSidebarUser = renderSidebarUser;
window.initSidebarActiveLink = initSidebarActiveLink;
window.toggleAdminSidebar = toggleAdminSidebar;
window.initAdminSidebar   = initAdminSidebar;
window.initApp           = initApp;

document.addEventListener('DOMContentLoaded', initApp);
