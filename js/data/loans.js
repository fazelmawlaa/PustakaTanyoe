// ============================================================
// PustakaTanyoe — Loans & Fines Data
// ============================================================

const today = new Date();
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); };
const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString(); };

const SAMPLE_LOANS = [
  {
    id: 'ln001',
    userId: 'usr001',
    userName: 'Muhammad Fazel Mawla',
    bookId: 'bk001',
    bookTitle: 'Algoritma dan Pemrograman',
    bookAuthor: 'Rinaldi Munir',
    borrowDate: daysAgo(5),
    dueDate: daysFromNow(2),
    returnDate: null,
    status: 'active',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(5),
    notes: '',
    fine: 0,
  },
  {
    id: 'ln002',
    userId: 'usr001',
    userName: 'Muhammad Fazel Mawla',
    bookId: 'bk005',
    bookTitle: 'Jaringan Komputer',
    bookAuthor: 'Andrew S. Tanenbaum',
    borrowDate: daysAgo(10),
    dueDate: daysAgo(3),
    returnDate: null,
    status: 'overdue',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(10),
    notes: '',
    fine: 3000,
  },
  {
    id: 'ln003',
    userId: 'usr001',
    userName: 'Muhammad Fazel Mawla',
    bookId: 'bk004',
    bookTitle: 'Kalkulus: Edisi ke-9',
    bookAuthor: 'James Stewart',
    borrowDate: daysAgo(14),
    dueDate: daysAgo(7),
    returnDate: daysAgo(6),
    status: 'returned',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(14),
    returnedAt: daysAgo(6),
    notes: 'Dikembalikan dalam kondisi baik',
    fine: 0,
  },
  {
    id: 'ln004',
    userId: 'usr004',
    userName: 'Fatimah Azzahra',
    bookId: 'bk016',
    bookTitle: 'Ilmu Kedokteran Dasar',
    bookAuthor: 'Harrison\'s',
    borrowDate: daysAgo(3),
    dueDate: daysFromNow(4),
    returnDate: null,
    status: 'active',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(3),
    notes: '',
    fine: 0,
  },
  {
    id: 'ln005',
    userId: 'usr002',
    userName: 'Siti Rahma Dewi',
    bookId: 'bk008',
    bookTitle: 'Pengantar Ilmu Hukum',
    bookAuthor: 'Sudikno Mertokusumo',
    borrowDate: daysAgo(12),
    dueDate: daysAgo(5),
    returnDate: null,
    status: 'overdue',
    renewalCount: 1,
    approvedBy: 'admin001',
    approvedAt: daysAgo(12),
    notes: '',
    fine: 5000,
  },
  {
    id: 'ln006',
    userId: 'usr004',
    userName: 'Fatimah Azzahra',
    bookId: 'bk011',
    bookTitle: 'Fisika Dasar untuk Universitas',
    bookAuthor: 'Halliday, Resnick & Krane',
    borrowDate: daysAgo(8),
    dueDate: daysFromNow(0),
    returnDate: null,
    status: 'active',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(8),
    notes: '',
    fine: 0,
  },
  {
    id: 'ln007',
    userId: 'usr001',
    userName: 'Muhammad Fazel Mawla',
    bookId: 'bk017',
    bookTitle: 'Struktur Data dan Algoritma',
    bookAuthor: 'Thomas H. Cormen',
    borrowDate: null,
    dueDate: null,
    returnDate: null,
    status: 'pending',
    renewalCount: 0,
    approvedBy: null,
    notes: 'Mohon disetujui segera',
    fine: 0,
    requestDate: daysAgo(0),
  },
  {
    id: 'ln008',
    userId: 'usr002',
    userName: 'Siti Rahma Dewi',
    bookId: 'bk013',
    bookTitle: 'Manajemen Strategik',
    bookAuthor: 'Fred R. David',
    borrowDate: daysAgo(21),
    dueDate: daysAgo(14),
    returnDate: daysAgo(13),
    status: 'returned',
    renewalCount: 0,
    approvedBy: 'admin001',
    approvedAt: daysAgo(21),
    returnedAt: daysAgo(13),
    notes: '',
    fine: 0,
  },
];

// CRUD functions
function initLoanData() {
  if (!localStorage.getItem('pt_loans')) {
    localStorage.setItem('pt_loans', JSON.stringify(SAMPLE_LOANS));
  } else {
    // Migration: fix 'Fazil' -> 'Fazel' in stored loans for usr001
    try {
      const loans = JSON.parse(localStorage.getItem('pt_loans') || '[]');
      let changed = false;
      loans.forEach(l => {
        if (l.userId === 'usr001' && l.userName === 'Muhammad Fazil Mawla') {
          l.userName = 'Muhammad Fazel Mawla';
          changed = true;
        }
      });
      if (changed) localStorage.setItem('pt_loans', JSON.stringify(loans));
    } catch (e) {}
  }
}

function getLoans() {
  try {
    return JSON.parse(localStorage.getItem('pt_loans') || '[]');
  } catch { return SAMPLE_LOANS; }
}

function saveLoans(loans) {
  localStorage.setItem('pt_loans', JSON.stringify(loans));
}

function getLoanById(id) {
  return getLoans().find(l => l.id === id) || null;
}

function getLoansByUser(userId) {
  return getLoans().filter(l => l.userId === userId);
}

function getActiveLoans(userId = null, includePending = true) {
  const loans = getLoans();
  const validStatuses = includePending ? ['active', 'overdue', 'pending'] : ['active', 'overdue'];
  const active = loans.filter(l => validStatuses.includes(l.status));
  return userId ? active.filter(l => l.userId === userId) : active;
}

function requestLoan(userId, bookId, notes = '', plannedBorrowDate = null) {
  const user = getUserById(userId);
  const book = getBookById(bookId);
  const loans = getLoans();

  if (!user || !book) return { success: false, message: 'Data tidak valid.' };
  if (user.memberStatus === 'suspended') return { success: false, message: 'Akun Anda sedang ditangguhkan.' };

  // Aturan F11 & Invariant 10: Eksemplar rusak TIDAK BOLEH dipinjam
  if (book.statusEksemplar === 'Rusak') {
    return {
      success: false,
      message: 'Pelanggaran Aturan F11 & Invariant 10: Eksemplar buku ini berstatus RUSAK dan tidak dapat diajukan peminjaman.'
    };
  }
  if (book.statusEksemplar === 'Nonaktif') {
    return {
      success: false,
      message: 'Eksemplar buku ini berstatus NONAKTIF dan tidak dapat dipinjam.'
    };
  }

  // Rule 1: Maksimal 3 buku sekaligus (termasuk yang sedang dipinjam & menunggu persetujuan)
  const userActive = getActiveLoans(userId, true);
  if (userActive.length >= 3) {
    // OTOMATIS TOLAK BUKU SELANJUTNYA JIKA MELEBIHI 3 BUKU
    const autoRejectedLoan = {
      id: `ln${String(Date.now()).slice(-6)}`,
      userId,
      userName: user.name,
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      borrowDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      returnDate: null,
      status: 'rejected',
      autoRejected: true,
      renewalCount: 0,
      approvedBy: null,
      notes: notes ? `${notes} (Ditolak otomatis oleh sistem: Melebihi kuota 3 buku)` : 'Ditolak otomatis oleh sistem: Melebihi kuota maksimal peminjaman 3 buku sekaligus (Ketentuan Perpustakaan USK).',
      rejectedReason: 'Melebihi kuota maksimal 3 buku sekaligus (Perpustakaan USK)',
      rejectedAt: new Date().toISOString(),
      fine: 0,
      requestDate: new Date().toISOString(),
    };

    loans.push(autoRejectedLoan);
    saveLoans(loans);

    if (window.notificationSystem) {
      window.notificationSystem.notifyLoanRejected(autoRejectedLoan, 'Melebihi batas maksimal peminjaman 3 buku sekaligus (Ketentuan Perpustakaan USK).');
    }
    if (window.sirkulasiSubject) {
      window.sirkulasiSubject.notifyLoanRejected(autoRejectedLoan, 'Melebihi batas maksimal peminjaman 3 buku sekaligus (Ketentuan Perpustakaan USK).');
    }

    return { 
      success: false, 
      autoRejected: true,
      loan: autoRejectedLoan,
      message: 'Pengajuan Ditolak Otomatis oleh Sistem: Anda sudah meminjam/mengajukan 3 buku. Sesuai ketentuan perpustakaan USK, batas maksimal peminjaman adalah 3 buku sekaligus.' 
    };
  }

  // Cek jika ada buku yang terlambat (overdue)
  const hasOverdue = userActive.some(l => l.status === 'overdue');
  if (hasOverdue) {
    return {
      success: false,
      message: 'Anda memiliki peminjaman buku yang melewati batas waktu (terlambat). Harap kembalikan buku dan selesaikan denda terlebih dahulu.'
    };
  }

  const alreadyBorrowed = loans.find(l => l.userId === userId && l.bookId === bookId && ['active','overdue','pending'].includes(l.status));
  if (alreadyBorrowed) {
    const statusText = alreadyBorrowed.status === 'pending' ? 'menunggu persetujuan' : 'sedang Anda pinjam';
    return { success: false, message: `Buku ini sudah ${statusText}.` };
  }

  const avail = (book.stock || 0) - (book.borrowed || 0);
  if (avail <= 0) return { success: false, message: 'Buku tidak tersedia saat ini (stok habis).' };

  // Rule 2: Durasi masa pinjam tepat 7 hari kalender
  let startD = new Date();
  if (plannedBorrowDate) {
    const parts = plannedBorrowDate.split('-');
    if (parts.length === 3) {
      startD = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 8, 0, 0);
    } else {
      startD = new Date(plannedBorrowDate);
    }
  }
  const dueD = new Date(startD);
  dueD.setDate(dueD.getDate() + 7);

  const newLoan = {
    id: `ln${String(Date.now()).slice(-6)}`,
    userId,
    userName: user.name,
    bookId,
    bookTitle: book.title,
    bookAuthor: book.author,
    borrowDate: startD.toISOString(),
    dueDate: dueD.toISOString(),
    returnDate: null,
    status: 'pending',
    renewalCount: 0,
    approvedBy: null,
    notes: notes || '',
    fine: 0,
    requestDate: new Date().toISOString(),
  };
  loans.push(newLoan);
  saveLoans(loans);
  return { success: true, loan: newLoan };
}

function approveLoan(loanId, adminId) {
  const loans = getLoans();
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return { success: false, message: 'Peminjaman tidak ditemukan.' };
  if (loans[idx].status !== 'pending') return { success: false, message: 'Status tidak valid.' };

  const targetUserId = loans[idx].userId;
  // Cek apakah mahasiswa yang bersangkutan sudah memiliki 3 buku aktif
  const currentActiveLoans = loans.filter(l => l.userId === targetUserId && ['active', 'overdue'].includes(l.status));
  if (currentActiveLoans.length >= 3) {
    loans[idx].status = 'rejected';
    loans[idx].autoRejected = true;
    loans[idx].rejectedReason = 'Ditolak otomatis: Mahasiswa telah mencapai kuota maksimal 3 buku aktif';
    loans[idx].rejectedAt = new Date().toISOString();
    saveLoans(loans);
    if (window.notificationSystem) {
      window.notificationSystem.notifyLoanRejected(loans[idx], 'Batas kuota maksimal 3 buku aktif perpustakaan USK telah tercapai.');
    }
    return { success: false, autoRejected: true, message: 'Peminjaman ditolak otomatis oleh sistem: Mahasiswa ini sudah mencapai kuota maksimal 3 buku aktif.' };
  }

  const book = getBookById(loans[idx].bookId);
  if (!book) return { success: false, message: 'Buku tidak ditemukan.' };

  // F11 & Invariant 10: Admin TIDAK BISA mengubah status peminjaman menjadi Dipinjam jika eksemplar rusak
  if (book.statusEksemplar === 'Rusak') {
    return {
      success: false,
      message: 'Pelanggaran Aturan F11 & Invariant 10: Eksemplar buku ini berstatus RUSAK. Admin dilarang menyetujui atau mengubah statusnya menjadi Dipinjam.'
    };
  }
  if (book.statusEksemplar === 'Nonaktif') {
    return {
      success: false,
      message: 'Eksemplar buku berstatus NONAKTIF dan tidak dapat disetujui untuk dipinjam.'
    };
  }

  const avail = (book.stock || 0) - (book.borrowed || 0);
  if (avail <= 0) return { success: false, message: 'Stok buku habis.' };

  // Preserve borrower's chosen borrowDate and dueDate (+7 calendar days)
  let borrowDate = loans[idx].borrowDate ? new Date(loans[idx].borrowDate) : new Date();
  let dueDate = loans[idx].dueDate ? new Date(loans[idx].dueDate) : null;
  if (!dueDate || isNaN(dueDate.getTime())) {
    dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 7);
  }

  loans[idx] = {
    ...loans[idx],
    status: 'active',
    borrowDate: borrowDate.toISOString(),
    dueDate: dueDate.toISOString(),
    approvedBy: adminId,
    approvedAt: new Date().toISOString(),
  };

  updateBook(loans[idx].bookId, { borrowed: (book.borrowed || 0) + 1 });
  if (window.notificationSystem) {
    window.notificationSystem.notifyLoanApproved(loans[idx]);
  }

  // Jika setelah persetujuan ini kuota aktif mahasiswa telah mencapai 3 buku,
  // OTOMATIS TOLAK permohonan peminjaman buku berikutnya yang masih menunggu (pending)
  const updatedActiveLoans = loans.filter(l => l.userId === targetUserId && ['active', 'overdue'].includes(l.status));
  if (updatedActiveLoans.length >= 3) {
    loans.forEach(otherLoan => {
      if (otherLoan.userId === targetUserId && otherLoan.status === 'pending' && otherLoan.id !== loanId) {
        otherLoan.status = 'rejected';
        otherLoan.autoRejected = true;
        otherLoan.rejectedReason = 'Ditolak otomatis oleh sistem: Kuota peminjaman pengguna telah mencapai batas maksimal 3 buku aktif';
        otherLoan.rejectedAt = new Date().toISOString();
        if (window.notificationSystem) {
          window.notificationSystem.notifyLoanRejected(otherLoan, 'Peminjaman buku lain telah mencapai kuota maksimal (3 buku aktif).');
        }
      }
    });
  }

  saveLoans(loans);
  return { success: true, loan: loans[idx] };
}

function rejectLoan(loanId, reason = '') {
  const loans = getLoans();
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return { success: false };
  loans[idx] = { ...loans[idx], status: 'rejected', notes: reason, updatedAt: new Date().toISOString() };
  saveLoans(loans);
  if (window.notificationSystem) {
    window.notificationSystem.notifyLoanRejected(loans[idx], reason);
  }
  return { success: true };
}

function returnLoan(loanId) {
  const loans = getLoans();
  const idx = loans.findIndex(l => l.id === loanId);
  if (idx === -1) return { success: false };
  if (!['active','overdue'].includes(loans[idx].status)) return { success: false };

  const loan = loans[idx];
  const dueDate = new Date(loan.dueDate);
  const now = new Date();
  const daysLate = Math.max(0, Math.ceil((now - dueDate) / (1000*60*60*24)));
  const fine = daysLate * 1000;

  loans[idx] = { ...loan, status: 'returned', returnDate: now.toISOString(), fine };
  saveLoans(loans);

  const book = getBookById(loan.bookId);
  if (book) updateBook(loan.bookId, { borrowed: Math.max(0, (book.borrowed || 0) - 1) });
  if (fine > 0) updateUser(loan.userId, { totalFines: (getUserById(loan.userId)?.totalFines || 0) + fine });
  return { success: true, fine };
}

function calculateFine(loan) {
  if (!loan.dueDate || loan.status === 'returned') return loan.fine || 0;
  const dueDate = new Date(loan.dueDate);
  const now = new Date();
  const daysLate = Math.max(0, Math.ceil((now - dueDate) / (1000*60*60*24)));
  return daysLate * 1000;
}

function updateOverdueStatus() {
  const loans = getLoans();
  let changed = false;
  loans.forEach(l => {
    if (l.status === 'active' && l.dueDate) {
      const due = new Date(l.dueDate);
      if (new Date() > due) { l.status = 'overdue'; changed = true; }
    }
  });
  if (changed) saveLoans(loans);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

window.SAMPLE_LOANS     = SAMPLE_LOANS;
window.initLoanData     = initLoanData;
window.getLoans         = getLoans;
window.saveLoans        = saveLoans;
window.getLoanById      = getLoanById;
window.getLoansByUser   = getLoansByUser;
window.getActiveLoans   = getActiveLoans;
window.requestLoan      = requestLoan;
window.approveLoan      = approveLoan;
window.rejectLoan       = rejectLoan;
window.returnLoan       = returnLoan;
window.calculateFine    = calculateFine;
window.updateOverdueStatus = updateOverdueStatus;
window.formatCurrency   = formatCurrency;
