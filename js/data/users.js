// ============================================================
// PustakaTanyoe — Users & Auth Data
// ============================================================

const SAMPLE_USERS = [
  {
    id: 'admin001',
    name: 'Ahmad Fauzi',
    email: 'admin@usk.ac.id',
    password: 'admin123',
    role: 'admin',
    phone: '+62 651 7554395',
    department: 'Perpustakaan Universitas',
    employeeId: 'EMP-2024-001',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'usr001',
    name: 'Muhammad Fazel Mawla',
    email: 'mahasiswa@usk.ac.id',
    password: 'user123',
    role: 'user',
    phone: '+62 823 1234 5678',
    studentId: '2108107010001',
    faculty: 'Fakultas MIPA',
    major: 'Informatika',
    semester: '5',
    memberStatus: 'active',
    wishlist: ['bk003', 'bk010'],
    borrowCount: 12,
    totalFines: 0,
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'usr002',
    name: 'Siti Rahma Dewi',
    email: 'siti.rahma@student.usk.ac.id',
    password: 'user123',
    role: 'user',
    phone: '+62 812 9876 5432',
    studentId: '2008201010045',
    faculty: 'Fakultas Hukum',
    major: 'Hukum',
    semester: '7',
    memberStatus: 'active',
    wishlist: ['bk008'],
    borrowCount: 8,
    totalFines: 2000,
    isActive: true,
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'usr003',
    name: 'Budi Santoso',
    email: 'budi.santoso@student.usk.ac.id',
    password: 'user123',
    role: 'user',
    phone: '+62 857 3456 7890',
    studentId: '2108301010023',
    faculty: 'Fakultas Ekonomi',
    major: 'Manajemen',
    semester: '5',
    memberStatus: 'suspended',
    wishlist: [],
    borrowCount: 5,
    totalFines: 15000,
    isActive: true,
    createdAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 'usr004',
    name: 'Fatimah Azzahra',
    email: 'fatimah@student.usk.ac.id',
    password: 'user123',
    role: 'user',
    phone: '+62 895 6789 0123',
    studentId: '2108109010067',
    faculty: 'Fakultas Kedokteran',
    major: 'Pendidikan Dokter',
    semester: '3',
    memberStatus: 'active',
    wishlist: ['bk016', 'bk011'],
    borrowCount: 15,
    totalFines: 0,
    isActive: true,
    createdAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'usr005',
    name: 'Rizki Ananda',
    email: 'rizki.ananda@student.usk.ac.id',
    password: 'user123',
    role: 'user',
    phone: '+62 822 2345 6789',
    studentId: '2208107010089',
    faculty: 'Fakultas MIPA',
    major: 'Informatika',
    semester: '3',
    memberStatus: 'pending',
    wishlist: ['bk001', 'bk017'],
    borrowCount: 2,
    totalFines: 0,
    isActive: false,
    createdAt: '2024-11-01T00:00:00Z',
  },
];

// Auth functions
function initUserData() {
  if (!localStorage.getItem('pt_users')) {
    localStorage.setItem('pt_users', JSON.stringify(SAMPLE_USERS));
  } else {
    // Migration: ensure usr001 has name 'Muhammad Fazel Mawla' if previously stored as 'Fazil'
    try {
      const users = JSON.parse(localStorage.getItem('pt_users') || '[]');
      let changed = false;
      users.forEach(u => {
        if (u.id === 'usr001' && (u.name === 'Muhammad Fazil Mawla' || u.name === 'Muhammad Fazil')) {
          u.name = 'Muhammad Fazel Mawla';
          changed = true;
        }
      });
      if (changed) localStorage.setItem('pt_users', JSON.stringify(users));

      // Also migrate active session name if needed
      const session = JSON.parse(localStorage.getItem('pt_session') || 'null');
      if (session && session.userId === 'usr001' && (session.name === 'Muhammad Fazil Mawla' || session.name === 'Muhammad Fazil')) {
        session.name = 'Muhammad Fazel Mawla';
        localStorage.setItem('pt_session', JSON.stringify(session));
      }
    } catch (e) {}
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('pt_users') || '[]');
  } catch { return SAMPLE_USERS; }
}

function saveUsers(users) {
  localStorage.setItem('pt_users', JSON.stringify(users));
}

function getUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

function getUserByEmail(email) {
  return getUsers().find(u => u.email === email.toLowerCase()) || null;
}

function updateUser(id, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  saveUsers(users);

  // Sync session name if current session belongs to this user
  try {
    const session = JSON.parse(localStorage.getItem('pt_session') || 'null');
    if (session && session.userId === id && updates.name) {
      session.name = updates.name;
      localStorage.setItem('pt_session', JSON.stringify(session));
    }
  } catch (e) {}

  // Sync loans if user name changed
  if (updates.name) {
    try {
      const loans = JSON.parse(localStorage.getItem('pt_loans') || '[]');
      let loanChanged = false;
      loans.forEach(l => {
        if (l.userId === id) {
          l.userName = updates.name;
          loanChanged = true;
        }
      });
      if (loanChanged) localStorage.setItem('pt_loans', JSON.stringify(loans));
    } catch (e) {}
  }

  return users[idx];
}

function registerUser(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email.toLowerCase())) {
    return { success: false, message: 'Email sudah terdaftar.' };
  }
  const newUser = {
    id: `usr${String(Date.now()).slice(-6)}`,
    ...data,
    email: data.email.toLowerCase(),
    role: 'user',
    memberStatus: 'pending',
    wishlist: [],
    borrowCount: 0,
    totalFines: 0,
    isActive: false,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

function loginUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) return { success: false, message: 'Email tidak ditemukan.' };
  if (user.password !== password) return { success: false, message: 'Password salah.' };
  if (user.role === 'user' && user.memberStatus === 'pending') {
    return { success: false, message: 'Akun Anda menunggu persetujuan admin.' };
  }
  if (user.role === 'user' && user.memberStatus === 'suspended') {
    return { success: false, message: 'Akun Anda telah dinonaktifkan. Hubungi perpustakaan.' };
  }
  // Store session
  const session = { userId: user.id, role: user.role, name: user.name, email: user.email, loginAt: new Date().toISOString() };
  localStorage.setItem('pt_session', JSON.stringify(session));
  return { success: true, user, session };
}

function logoutUser() {
  localStorage.removeItem('pt_session');
}

function getCurrentSession() {
  try {
    return JSON.parse(localStorage.getItem('pt_session') || 'null');
  } catch { return null; }
}

function getCurrentUser() {
  const session = getCurrentSession();
  if (!session) return null;
  return getUserById(session.userId);
}

function requireAuth(redirectTo = '../login.html') {
  const session = getCurrentSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

function requireAdmin(redirectTo = '../login.html') {
  const session = requireAuth(redirectTo);
  if (session && session.role !== 'admin') {
    window.location.href = '../user/dashboard.html';
    return null;
  }
  return session;
}

function requireUser(redirectTo = '../login.html') {
  const session = requireAuth(redirectTo);
  if (session && session.role === 'admin') {
    window.location.href = '../admin/dashboard.html';
    return null;
  }
  return session;
}

window.SAMPLE_USERS     = SAMPLE_USERS;
window.initUserData     = initUserData;
window.getUsers         = getUsers;
window.saveUsers        = saveUsers;
window.getUserById      = getUserById;
window.getUserByEmail   = getUserByEmail;
window.updateUser       = updateUser;
window.registerUser     = registerUser;
window.loginUser        = loginUser;
window.logoutUser       = logoutUser;
window.getCurrentSession= getCurrentSession;
window.getCurrentUser   = getCurrentUser;
window.requireAuth      = requireAuth;
window.requireAdmin     = requireAdmin;
window.requireUser      = requireUser;
