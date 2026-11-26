// ============================================================
// PustakaTanyoe — Design Patterns
// 11.1 OBSERVER PATTERN: Automatic Notification & Event System
// ============================================================

/**
 * Interface / Base Class Observer (Subscriber)
 */
class Observer {
  update(event, data) {
    throw new Error("Method 'update(event, data)' must be implemented by concrete observer");
  }
}

/**
 * Base Class Subject (Publisher)
 */
class Subject {
  constructor() {
    this._observers = [];
  }

  attach(observer) {
    if (!this._observers.includes(observer)) {
      this._observers.push(observer);
    }
  }

  detach(observer) {
    this._observers = this._observers.filter(obs => obs !== observer);
  }

  notify(event, data = {}) {
    this._observers.forEach(observer => {
      try {
        observer.update(event, data);
      } catch (err) {
        console.error(`Error notifying observer ${observer.constructor.name}:`, err);
      }
    });
  }
}

// ------------------------------------------------------------
// KELAS-KELAS OBSERVER KONKRET (Subscriber)
// ------------------------------------------------------------

/**
 * 1. NotificationService / NotificationObserver
 * Mengelola notifikasi in-app untuk antarmuka pengguna
 */
class NotificationObserver extends Observer {
  constructor() {
    super();
    this._notifications = this._loadNotifications();
  }

  update(event, data) {
    switch (event) {
      case 'LOAN_APPROVED':
        this.addNotification({
          type: 'success',
          title: 'Peminjaman Disetujui',
          message: `Permintaan peminjaman buku "${data.bookTitle || 'Buku'}" telah disetujui pustakawan. Batas pengembalian: ${data.dueDate}.`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      case 'LOAN_REJECTED':
        this.addNotification({
          type: 'danger',
          title: 'Peminjaman Ditolak',
          message: `Permintaan peminjaman buku "${data.bookTitle || 'Buku'}" ditolak. Alasan: ${data.reason || 'Tidak memenuhi syarat'}.`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      case 'LOAN_RETURNED':
        this.addNotification({
          type: 'info',
          title: 'Buku Dikembalikan',
          message: `Buku "${data.bookTitle || 'Buku'}" telah berhasil dikembalikan. Terima kasih!`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      case 'LOAN_EXTENDED':
        this.addNotification({
          type: 'success',
          title: 'Perpanjangan Berhasil',
          message: `Masa pinjam buku "${data.bookTitle || 'Buku'}" telah diperpanjang hingga ${data.dueDate}.`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      case 'BOOK_AVAILABLE':
        this.addNotification({
          type: 'success',
          title: 'Buku Reservasi Tersedia!',
          message: `Buku antrean Anda "${data.bookTitle || 'Buku'}" kini tersedia untuk diambil di perpustakaan (batas waktu 2x24 jam).`,
          userId: data.userId,
          bookId: data.bookId,
          link: `../user/book-detail.html?id=${data.bookId}`
        });
        break;

      case 'DUE_SOON':
        this.addNotification({
          type: 'warning',
          title: 'Jatuh Tempo Mendekati',
          message: `Buku "${data.bookTitle || 'Buku'}" harus dikembalikan dalam ${data.daysLeft || 1} hari.`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      case 'LOAN_OVERDUE':
        this.addNotification({
          type: 'danger',
          title: 'Peminjaman Terlambat!',
          message: `Buku "${data.bookTitle || 'Buku'}" telah melewati batas pengembalian. Denda Rp 1.000/hari berlaku.`,
          userId: data.userId,
          bookId: data.bookId,
          link: '../user/my-loans.html'
        });
        break;

      default:
        // Notifikasi umum jika ada pesan
        if (data.title && data.message) {
          this.addNotification(data);
        }
        break;
    }
  }

  addNotification(notifData) {
    const notif = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: notifData.type || 'info',
      title: notifData.title || 'Notifikasi',
      message: notifData.message || '',
      userId: notifData.userId || null,
      bookId: notifData.bookId || null,
      link: notifData.link || '#',
      read: false,
      createdAt: new Date().toISOString()
    };

    this._notifications.unshift(notif);
    if (this._notifications.length > 100) this._notifications.pop();
    this._saveNotifications();
    return notif;
  }

  getNotifications(userId = null) {
    if (!userId) return this._notifications;
    return this._notifications.filter(n => !n.userId || n.userId === userId);
  }

  getUnreadCount(userId = null) {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  markRead(notifId) {
    const notif = this._notifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      this._saveNotifications();
    }
  }

  markAllRead(userId = null) {
    this._notifications.forEach(n => {
      if (!userId || n.userId === userId) n.read = true;
    });
    this._saveNotifications();
  }

  deleteNotification(notifId) {
    this._notifications = this._notifications.filter(n => n.id !== notifId);
    this._saveNotifications();
  }

  _loadNotifications() {
    try {
      return JSON.parse(localStorage.getItem('pt_notifications') || '[]');
    } catch {
      return [];
    }
  }

  _saveNotifications() {
    localStorage.setItem('pt_notifications', JSON.stringify(this._notifications));
  }
}

/**
 * 2. EmailService / EmailObserver
 * Mensimulasikan pengiriman email kepada mahasiswa sivitas USK
 */
class EmailObserver extends Observer {
  constructor() {
    super();
    this.emailLogs = [];
  }

  update(event, data) {
    // Simulasi pengiriman email ke alamat @mhs.usk.ac.id
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      recipient: data.userEmail || `mhs_${data.userId || 'user'}@mhs.usk.ac.id`,
      subject: `[Pustaka Tanyoe USK] ${event.replace('_', ' ')}: ${data.bookTitle || ''}`,
      payload: data
    };
    this.emailLogs.push(logEntry);
    console.info(`[EmailService] 📧 Email terkirim ke ${logEntry.recipient} untuk event: ${event}`);
  }
}

/**
 * 3. AuditLogService / AuditLogObserver
 * Mencatat log audit seluruh transaksi sirkulasi dan perubahan status buku
 */
class AuditLogObserver extends Observer {
  constructor() {
    super();
    this.auditLogs = this._loadLogs();
  }

  update(event, data) {
    const entry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      event,
      actor: data.actor || data.userId || 'SYSTEM',
      bookId: data.bookId || null,
      loanId: data.loanId || null,
      details: data
    };

    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    this._saveLogs();
    console.info(`[AuditLogService] 📝 Log tercatat: [${event}] oleh ${entry.actor}`);
  }

  _loadLogs() {
    try {
      return JSON.parse(localStorage.getItem('pt_audit_logs') || '[]');
    } catch {
      return [];
    }
  }

  _saveLogs() {
    localStorage.setItem('pt_audit_logs', JSON.stringify(this.auditLogs));
  }
}

// ------------------------------------------------------------
// KELAS SUBJECT KONKRET (Publisher)
// ------------------------------------------------------------

/**
 * SirkulasiSubject (Peminjaman / Reservasi Subject)
 * Mengelola pendaftaran observer dan menyiarkan event sirkulasi
 */
class SirkulasiSubject extends Subject {
  notifyLoanRequested(loan) {
    this.notify('LOAN_REQUESTED', loan);
  }

  notifyLoanApproved(loan) {
    this.notify('LOAN_APPROVED', loan);
  }

  notifyLoanRejected(loan, reason) {
    this.notify('LOAN_REJECTED', { ...loan, reason });
  }

  notifyLoanReturned(loan) {
    this.notify('LOAN_RETURNED', loan);
  }

  notifyLoanExtended(loan) {
    this.notify('LOAN_EXTENDED', loan);
  }

  notifyBookAvailable(book, userId) {
    this.notify('BOOK_AVAILABLE', { bookTitle: book.title, bookId: book.id, userId });
  }

  notifyDueSoon(loan, daysLeft) {
    this.notify('DUE_SOON', { ...loan, daysLeft });
  }

  notifyOverdue(loan) {
    this.notify('LOAN_OVERDUE', loan);
  }
}

// Inisialisasi Singleton SirkulasiSubject & Observers
const sirkulasiSubject = new SirkulasiSubject();
const notificationObserver = new NotificationObserver();
const emailObserver = new EmailObserver();
const auditLogObserver = new AuditLogObserver();

// Daftarkan observer ke subject
sirkulasiSubject.attach(notificationObserver);
sirkulasiSubject.attach(emailObserver);
sirkulasiSubject.attach(auditLogObserver);

// ------------------------------------------------------------
// Backward-Compatibility Wrapper untuk Kode UI Lama
// ------------------------------------------------------------
class NotificationSystemAdapter {
  constructor(subject, notifObserver) {
    this.subject = subject;
    this.notifObserver = notifObserver;
  }

  subscribe(event, callback) {
    // Custom inline observer adapter
    const customObs = {
      update: (evt, data) => {
        if (evt === event || event === '*') callback(data);
      }
    };
    this.subject.attach(customObs);
    return customObs;
  }

  unsubscribe(event, observerRef) {
    this.subject.detach(observerRef);
  }

  notify(event, data) {
    this.subject.notify(event, data);
  }

  addNotification(data) {
    return this.notifObserver.addNotification(data);
  }

  markRead(id) {
    return this.notifObserver.markRead(id);
  }

  markAllRead(userId) {
    return this.notifObserver.markAllRead(userId);
  }

  getNotifications(userId) {
    return this.notifObserver.getNotifications(userId);
  }

  getUnreadCount(userId) {
    return this.notifObserver.getUnreadCount(userId);
  }

  deleteNotification(id) {
    return this.notifObserver.deleteNotification(id);
  }

  notifyBookAvailable(book, userId) {
    this.subject.notifyBookAvailable(book, userId);
  }

  notifyDueSoon(loan, daysLeft) {
    this.subject.notifyDueSoon(loan, daysLeft);
  }

  notifyLoanApproved(loan) {
    this.subject.notifyLoanApproved(loan);
  }

  notifyLoanRejected(loan, reason) {
    this.subject.notifyLoanRejected(loan, reason);
  }

  notifyOverdue(loan) {
    this.subject.notifyOverdue(loan);
  }
}

const notificationSystem = new NotificationSystemAdapter(sirkulasiSubject, notificationObserver);

// Export ke window
window.Observer               = Observer;
window.Subject                = Subject;
window.NotificationObserver   = NotificationObserver;
window.EmailObserver          = EmailObserver;
window.AuditLogObserver       = AuditLogObserver;
window.SirkulasiSubject       = SirkulasiSubject;
window.sirkulasiSubject       = sirkulasiSubject;
window.NotificationSystem     = NotificationSystemAdapter;
window.notificationSystem     = notificationSystem;
