// ============================================================
// PustakaTanyoe — Design Patterns
// 11.4 FACADE PATTERN: SirkulasiFacade (BorrowingFacade)
// Mengoordinasikan EksemplarService, ReservasiService,
// PeminjamanService, RiwayatService, dan NotificationService
// ============================================================

// ------------------------------------------------------------
// SUBSISTEM-SUBSISTEM YANG DIKOORDINASIKAN OLEH FACADE
// ------------------------------------------------------------

/**
 * Subsistem 1: EksemplarService
 * Menangani validasi ketersediaan, kondisi fisik, dan status eksemplar via State Pattern
 */
class EksemplarService {
  getEksemplar(bookId) {
    if (typeof getBookById === 'function') {
      return getBookById(bookId);
    }
    const books = JSON.parse(localStorage.getItem('pt_books') || '[]');
    return books.find(b => b.id === bookId) || null;
  }

  isAvailable(bookId) {
    const book = this.getEksemplar(bookId);
    if (!book) return false;
    const available = (book.stock || 0) - (book.borrowed || 0);
    return available > 0 && book.statusEksemplar !== 'Rusak' && book.statusEksemplar !== 'Nonaktif';
  }

  reduceStock(bookId) {
    const book = this.getEksemplar(bookId);
    if (!book) return false;

    // Gunakan EksemplarContext (State Pattern)
    if (window.EksemplarContext) {
      const context = new EksemplarContext(book, book.statusEksemplar || 'Tersedia');
      context.pinjam();
    }

    book.borrowed = (book.borrowed || 0) + 1;
    book.borrowCount = (book.borrowCount || 0) + 1;
    if (typeof updateBook === 'function') {
      updateBook(bookId, { borrowed: book.borrowed, borrowCount: book.borrowCount, statusEksemplar: book.statusEksemplar });
    }
    return true;
  }

  restoreStock(bookId) {
    const book = this.getEksemplar(bookId);
    if (!book) return false;

    if (window.EksemplarContext) {
      const context = new EksemplarContext(book, 'Dipinjam');
      context.kembalikan();
    }

    book.borrowed = Math.max(0, (book.borrowed || 0) - 1);
    if (typeof updateBook === 'function') {
      updateBook(bookId, { borrowed: book.borrowed, statusEksemplar: book.statusEksemplar });
    }
    return true;
  }
}

/**
 * Subsistem 2: ReservasiService
 * Menangani antrean peminjaman buku yang sedang habis dan batas waktu pengambilan 2x24 jam
 */
class ReservasiService {
  constructor() {
    this._reservations = this._loadReservations();
  }

  _loadReservations() {
    try {
      return JSON.parse(localStorage.getItem('pt_reservations') || '[]');
    } catch {
      return [];
    }
  }

  _saveReservations() {
    localStorage.setItem('pt_reservations', JSON.stringify(this._reservations));
  }

  hasActiveReservation(userId, bookId) {
    return this._reservations.some(r => r.userId === userId && r.bookId === bookId && r.status === 'Aktif');
  }

  createReservation(userId, bookId) {
    if (this.hasActiveReservation(userId, bookId)) {
      return { success: false, message: 'Anda sudah memiliki antrean reservasi aktif untuk buku ini.' };
    }

    // Batas pengambilan 2 x 24 jam (2 hari)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);

    const reservation = {
      id: `res_${Date.now()}`,
      userId,
      bookId,
      status: 'Aktif',
      createdAt: new Date().toISOString(),
      expiresAt: expiry.toISOString()
    };

    this._reservations.push(reservation);
    this._saveReservations();
    return { success: true, reservation };
  }

  getNextInQueue(bookId) {
    return this._reservations.find(r => r.bookId === bookId && r.status === 'Aktif') || null;
  }

  fulfillReservation(reservationId) {
    const res = this._reservations.find(r => r.id === reservationId);
    if (res) {
      res.status = 'Terpenuhi';
      this._saveReservations();
    }
  }
}

/**
 * Subsistem 3: PeminjamanService
 * Menangani manipulasi transaksi peminjaman fisik dengan State Pattern
 */
class PeminjamanService {
  getLoan(loanId) {
    if (typeof getLoanById === 'function') {
      return getLoanById(loanId);
    }
    const loans = JSON.parse(localStorage.getItem('pt_loans') || '[]');
    return loans.find(l => l.id === loanId) || null;
  }

  getAllLoans() {
    if (typeof getLoans === 'function') {
      return getLoans();
    }
    return JSON.parse(localStorage.getItem('pt_loans') || '[]');
  }

  saveLoans(loans) {
    if (typeof saveLoans === 'function') {
      return saveLoans(loans);
    }
    localStorage.setItem('pt_loans', JSON.stringify(loans));
  }

  getUserActiveLoans(userId) {
    if (typeof getActiveLoans === 'function') {
      return getActiveLoans(userId, true);
    }
    const loans = this.getAllLoans();
    return loans.filter(l => l.userId === userId && ['pending', 'active', 'overdue'].includes(l.status));
  }
}

/**
 * Subsistem 4: RiwayatService
 * Menangani pencatatan riwayat sirkulasi untuk audit dan laporan
 */
class RiwayatService {
  record(action, data) {
    const history = this.getHistory();
    const entry = {
      id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      timestamp: new Date().toISOString(),
      ...data
    };
    history.unshift(entry);
    if (history.length > 500) history.pop();
    localStorage.setItem('pt_circulation_history', JSON.stringify(history));
  }

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem('pt_circulation_history') || '[]');
    } catch {
      return [];
    }
  }
}

/**
 * Subsistem 5: NotificationService
 * Mengintegrasikan Factory Method dan Observer Pattern untuk pengiriman pesan otomatis
 */
class FacadeNotificationService {
  notify(event, data) {
    // 1. Publikasikan ke Observer Subject
    if (window.sirkulasiSubject) {
      window.sirkulasiSubject.notify(event, data);
    }

    // 2. Gunakan Creator Factory Method jika relevan
    if (event === 'LOAN_APPROVED' && window.BorrowingNotificationCreator) {
      new window.BorrowingNotificationCreator().send({ ...data, approved: true });
    } else if (event === 'LOAN_REJECTED' && window.BorrowingNotificationCreator) {
      new window.BorrowingNotificationCreator().send({ ...data, rejected: true });
    } else if (event === 'LOAN_EXTENDED' && window.RenewalNotificationCreator) {
      new window.RenewalNotificationCreator().send(data);
    } else if (event === 'BOOK_AVAILABLE' && window.ReservationNotificationCreator) {
      new window.ReservationNotificationCreator().send(data);
    } else if (event === 'DUE_SOON' && window.DueDateNotificationCreator) {
      new window.DueDateNotificationCreator().send({ ...data, isOverdue: false });
    }
  }
}

// ------------------------------------------------------------
// FACADE: SirkulasiFacade (BorrowingFacade)
// ------------------------------------------------------------

/**
 * SirkulasiFacade
 * Antarmuka tunggal untuk Controller Mahasiswa dan Controller Admin
 */
class SirkulasiFacade {
  constructor() {
    this.eksemplarService   = new EksemplarService();
    this.reservasiService   = new ReservasiService();
    this.peminjamanService  = new PeminjamanService();
    this.riwayatService     = new RiwayatService();
    this.notifService       = new FacadeNotificationService();
  }

  /**
   * 1. ajukanPeminjaman()
   * Memvalidasi kuota (max 3 buku), status eksemplar (F11/Tersedia), antrean reservasi,
   * membuat transaksi MenungguVerifikasi, lalu memicu notifikasi.
   */
  ajukanPeminjaman(userId, bookId, notes = '', plannedBorrowDate = null) {
    // Cek kuota peminjaman pengguna (Maksimal 3 buku)
    const activeLoans = this.peminjamanService.getUserActiveLoans(userId);
    if (activeLoans.length >= 3) {
      // OTOMATIS TOLAK BUKU SELANJUTNYA JIKA SUDAH MELEBIHI / MENCAPAI 3 BUKU
      const book = this.eksemplarService.getEksemplar(bookId);
      const rejectedLoan = {
        id: `loan_${Date.now()}`,
        userId,
        bookId,
        bookTitle: book ? book.title : 'Buku',
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        status: 'rejected',
        statusState: 'Ditolak',
        autoRejected: true,
        rejectedReason: 'Ditolak otomatis: Melebihi kuota maksimal peminjaman 3 buku sekaligus (Ketentuan Perpustakaan USK)',
        rejectedAt: new Date().toISOString(),
        notes: notes ? `${notes} (Ditolak otomatis oleh sistem: Melebihi kuota 3 buku)` : 'Ditolak otomatis oleh sistem: Melebihi batas kuota peminjaman 3 buku sekaligus.',
        createdAt: new Date().toISOString()
      };

      const allLoans = this.peminjamanService.getAllLoans();
      allLoans.unshift(rejectedLoan);
      this.peminjamanService.saveLoans(allLoans);

      this.riwayatService.record('PENOLAKAN_OTOMATIS_KUOTA', {
        loanId: rejectedLoan.id,
        userId,
        bookId,
        alasan: 'Kuota peminjaman melebihi batas 3 buku'
      });

      this.notifService.notify('LOAN_REJECTED', {
        ...rejectedLoan,
        reason: 'Melebihi kuota maksimal peminjaman 3 buku sekaligus (Ketentuan Perpustakaan USK).'
      });

      return {
        success: false,
        autoRejected: true,
        loan: rejectedLoan,
        message: 'Pengajuan Ditolak Otomatis oleh Sistem: Anda sudah meminjam/mengajukan 3 buku (batas maksimal perpustakaan USK).'
      };
    }

    // Cek ketersediaan dan status fisik eksemplar
    const book = this.eksemplarService.getEksemplar(bookId);
    if (!book) {
      return { success: false, message: 'Buku tidak ditemukan di sistem katalog.' };
    }

    if (!this.eksemplarService.isAvailable(bookId)) {
      return {
        success: false,
        message: 'Eksemplar buku saat ini tidak tersedia atau dalam kondisi rusak/nonaktif.'
      };
    }

    // Hitung tanggal peminjaman dan perkiraan jatuh tempo (+7 hari kalender)
    const now = new Date();
    const borrowDateObj = plannedBorrowDate ? new Date(plannedBorrowDate) : now;
    const dueDateObj = new Date(borrowDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 7);

    const borrowDateStr = borrowDateObj.toISOString().split('T')[0];
    const dueDateStr = dueDateObj.toISOString().split('T')[0];

    const newLoan = {
      id: `loan_${Date.now()}`,
      userId,
      bookId,
      bookTitle: book.title,
      borrowDate: borrowDateStr,
      dueDate: dueDateStr,
      notes: notes || '',
      renewalCount: 0,
      fine: 0,
      createdAt: now.toISOString()
    };

    // Gunakan State Pattern untuk inisialisasi state MenungguVerifikasi
    if (window.PeminjamanContext) {
      const loanCtx = new window.PeminjamanContext(newLoan);
      loanCtx.setState(new window.MenungguVerifikasiState());
    } else {
      newLoan.status = 'pending';
    }

    // Simpan ke daftar transaksi peminjaman
    const allLoans = this.peminjamanService.getAllLoans();
    allLoans.unshift(newLoan);
    this.peminjamanService.saveLoans(allLoans);

    // Catat ke riwayat sirkulasi
    this.riwayatService.record('PENGAJUAN_PEMINJAMAN', {
      loanId: newLoan.id,
      userId,
      bookId,
      bookTitle: book.title
    });

    // Broadcast notifikasi via Observer
    this.notifService.notify('LOAN_REQUESTED', newLoan);

    return {
      success: true,
      message: 'Pengajuan peminjaman berhasil diajukan dan menunggu verifikasi admin.',
      loan: newLoan
    };
  }

  /**
   * 2. verifikasiTransaksi()
   * Memastikan transaksi MenungguVerifikasi, mengubah status menjadi Dipinjam (Berlangsung),
   * mengurangi stok fisik eksemplar, menetapkan jatuh tempo, mencatat riwayat, dan notifikasi.
   */
  verifikasiTransaksi(loanId, adminId = 'admin') {
    const allLoans = this.peminjamanService.getAllLoans();
    const loan = allLoans.find(l => l.id === loanId);

    if (!loan) {
      return { success: false, message: 'Transaksi peminjaman tidak ditemukan.' };
    }

    // Periksa apakah peminjam sudah memiliki 3 buku aktif
    const userActiveLoans = allLoans.filter(l => l.userId === loan.userId && ['active', 'overdue'].includes(l.status));
    if (userActiveLoans.length >= 3) {
      loan.status = 'rejected';
      loan.autoRejected = true;
      loan.rejectedReason = 'Ditolak otomatis: Mahasiswa telah mencapai kuota maksimal 3 buku aktif';
      loan.rejectedAt = new Date().toISOString();
      this.peminjamanService.saveLoans(allLoans);
      this.notifService.notify('LOAN_REJECTED', { ...loan, reason: 'Kuota maksimal 3 buku aktif telah tercapai.' });
      return { success: false, autoRejected: true, message: 'Peminjaman ditolak otomatis oleh sistem: Mahasiswa ini sudah mencapai kuota maksimal 3 buku aktif.' };
    }

    // Periksa kondisi fisik eksemplar (Aturan F11 & Invariant 10)
    const book = this.eksemplarService.getEksemplar(loan.bookId);
    if (book && book.statusEksemplar === 'Rusak') {
      return {
        success: false,
        message: 'Pelanggaran Aturan F11 & Invariant 10: Eksemplar buku ini berstatus RUSAK. Admin tidak dapat menyetujui peminjaman atau mengubah status transaksi menjadi Dipinjam.'
      };
    }

    // Pre-Condition 7: Transaksi harus berstatus MenungguVerifikasi
    if (window.PeminjamanContext) {
      const loanCtx = new window.PeminjamanContext(loan);
      const transitionResult = loanCtx.verifikasi(adminId);
      if (!transitionResult.success) {
        return transitionResult;
      }
    } else {
      if (loan.status !== 'pending') {
        return { success: false, message: 'Transaksi ini tidak dalam status menunggu verifikasi.' };
      }
      loan.status = 'active';
      loan.approvedBy = adminId;
      loan.approvedAt = new Date().toISOString();
    }

    // Kurangi stok eksemplar dan ubah state eksemplar
    this.eksemplarService.reduceStock(loan.bookId);

    // Jika setelah persetujuan ini peminjam telah mencapai 3 buku aktif,
    // OTOMATIS TOLAK permohonan buku lainnya yang masih pending
    const updatedActiveLoans = allLoans.filter(l => l.userId === loan.userId && ['active', 'overdue'].includes(l.status));
    if (updatedActiveLoans.length >= 3) {
      allLoans.forEach(otherLoan => {
        if (otherLoan.userId === loan.userId && otherLoan.status === 'pending' && otherLoan.id !== loanId) {
          otherLoan.status = 'rejected';
          otherLoan.autoRejected = true;
          otherLoan.rejectedReason = 'Ditolak otomatis oleh sistem: Kuota peminjaman pengguna telah mencapai batas maksimal 3 buku aktif';
          otherLoan.rejectedAt = new Date().toISOString();
          this.notifService.notify('LOAN_REJECTED', { ...otherLoan, reason: 'Peminjaman buku lain telah memenuhi kuota 3 buku aktif.' });
        }
      });
    }

    // Simpan transaksi
    this.peminjamanService.saveLoans(allLoans);

    // Catat log riwayat
    this.riwayatService.record('VERIFIKASI_PEMINJAMAN', {
      loanId: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      adminId
    });

    // Pemicu notifikasi via Observer
    this.notifService.notify('LOAN_APPROVED', loan);

    return { success: true, message: 'Peminjaman berhasil diverifikasi.', loan };
  }

  /**
   * tolakTransaksi()
   * Membatalkan transaksi peminjaman dengan alasan
   */
  tolakTransaksi(loanId, reason = '', adminId = 'admin') {
    const allLoans = this.peminjamanService.getAllLoans();
    const loan = allLoans.find(l => l.id === loanId);

    if (!loan) return { success: false, message: 'Transaksi tidak ditemukan.' };

    if (window.PeminjamanContext) {
      const loanCtx = new window.PeminjamanContext(loan);
      const res = loanCtx.tolak(reason);
      if (!res.success) return res;
    } else {
      loan.status = 'rejected';
      loan.rejectedReason = reason;
    }

    this.peminjamanService.saveLoans(allLoans);
    this.riwayatService.record('PENOLAKAN_PEMINJAMAN', { loanId, reason, adminId });
    this.notifService.notify('LOAN_REJECTED', { ...loan, reason });

    return { success: true, message: 'Peminjaman telah ditolak.', loan };
  }

  /**
   * 3. ajukanPerpanjangan()
   * Memeriksa jatuh tempo dan reservasi aktif pengguna lain, memperbarui jatuh tempo (+7 hari),
   * menambah counter perpanjangan (F10 max 2x), dan mengirim notifikasi.
   */
  ajukanPerpanjangan(loanId) {
    const allLoans = this.peminjamanService.getAllLoans();
    const loan = allLoans.find(l => l.id === loanId);

    if (!loan) return { success: false, message: 'Transaksi peminjaman tidak ditemukan.' };

    // Cek apakah ada reservasi aktif dari pengguna lain untuk buku ini
    const nextReservation = this.reservasiService.getNextInQueue(loan.bookId);
    if (nextReservation && nextReservation.userId !== loan.userId) {
      return {
        success: false,
        message: 'Perpanjangan tidak dapat diproses karena buku ini telah direservasi oleh peminjam lain.'
      };
    }

    // Gunakan State Pattern untuk mengeksekusi perpanjangan
    if (window.PeminjamanContext) {
      const loanCtx = new window.PeminjamanContext(loan);
      const res = loanCtx.perpanjang();
      if (!res.success) return res;
    } else {
      if ((loan.renewalCount || 0) >= 2) {
        return { success: false, message: 'Batas maksimal perpanjangan (2 kali) telah tercapai.' };
      }
      const due = new Date(loan.dueDate);
      due.setDate(due.getDate() + 7);
      loan.dueDate = due.toISOString().split('T')[0];
      loan.renewalCount = (loan.renewalCount || 0) + 1;
    }

    this.peminjamanService.saveLoans(allLoans);
    this.riwayatService.record('PERPANJANGAN_PEMINJAMAN', { loanId, newDueDate: loan.dueDate });
    this.notifService.notify('LOAN_EXTENDED', loan);

    return { success: true, message: `Peminjaman berhasil diperpanjang hingga ${loan.dueDate}.`, loan };
  }

  /**
   * 4. kembalikanBuku()
   * Mengubah status transaksi menjadi Dikembalikan, mengembalikan stok eksemplar,
   * menghitung denda, dan memeriksa antrean reservasi untuk memberi tahu peminjam berikutnya.
   */
  kembalikanBuku(loanId) {
    const allLoans = this.peminjamanService.getAllLoans();
    const loan = allLoans.find(l => l.id === loanId);

    if (!loan) return { success: false, message: 'Transaksi tidak ditemukan.' };

    // Pre-Condition 3: Transaksi harus berstatus Dipinjam (active / overdue)
    if (window.PeminjamanContext) {
      const loanCtx = new window.PeminjamanContext(loan);
      const res = loanCtx.kembalikan();
      if (!res.success) return res;
    } else {
      loan.status = 'returned';
      loan.returnedDate = new Date().toISOString().split('T')[0];
    }

    // Kembalikan stok eksemplar buku
    this.eksemplarService.restoreStock(loan.bookId);

    this.peminjamanService.saveLoans(allLoans);
    this.riwayatService.record('PENGEMBALIAN_BUKU', { loanId, bookId: loan.bookId, userId: loan.userId });
    this.notifService.notify('LOAN_RETURNED', loan);

    // Cek apakah ada antrean reservasi untuk buku ini
    const waitingRes = this.reservasiService.getNextInQueue(loan.bookId);
    if (waitingRes) {
      const book = this.eksemplarService.getEksemplar(loan.bookId);
      this.notifService.notify('BOOK_AVAILABLE', {
        bookTitle: book ? book.title : 'Buku',
        bookId: loan.bookId,
        userId: waitingRes.userId
      });
      this.reservasiService.fulfillReservation(waitingRes.id);
    }

    return { success: true, message: 'Buku berhasil dikembalikan dan stok diperbarui.', loan };
  }

  /**
   * 5. buatReservasi()
   * Memastikan tidak ada reservasi ganda, membuat reservasi Aktif, dan menetapkan batas waktu.
   */
  buatReservasi(userId, bookId) {
    const book = this.eksemplarService.getEksemplar(bookId);
    if (!book) return { success: false, message: 'Buku tidak ditemukan.' };

    const res = this.reservasiService.createReservation(userId, bookId);
    if (!res.success) return res;

    this.riwayatService.record('PEMBUATAN_RESERVASI', { userId, bookId });
    return {
      success: true,
      message: `Buku "${book.title}" berhasil direservasi. Anda akan diberi tahu saat buku telah tersedia.`,
      reservation: res.reservation
    };
  }
}

// Inisialisasi Singleton SirkulasiFacade
const sirkulasiFacade = new SirkulasiFacade();

// Export ke window
window.EksemplarService   = EksemplarService;
window.ReservasiService   = ReservasiService;
window.PeminjamanService  = PeminjamanService;
window.RiwayatService     = RiwayatService;
window.SirkulasiFacade    = SirkulasiFacade;
window.BorrowingFacade    = SirkulasiFacade; // Alias sesuai spesifikasi
window.sirkulasiFacade    = sirkulasiFacade;
