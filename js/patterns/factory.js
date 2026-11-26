// ============================================================
// PustakaTanyoe — Design Patterns
// 11.5 FACTORY METHOD PATTERN: Sistem Notifikasi Pustaka Tanyoe
// & User Object Factory
// ============================================================

// ------------------------------------------------------------
// A. FACTORY METHOD: NOTIFIKASI SISTEM (SESUAI BAB 11.5)
// ------------------------------------------------------------

/**
 * Base Product: Notifikasi Sistem
 */
class BaseNotification {
  constructor(data) {
    this.id        = data.id || `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.type      = data.type || 'info'; // 'info' | 'success' | 'warning' | 'danger'
    this.title     = data.title || 'Pemberitahuan';
    this.message   = data.message || '';
    this.userId    = data.userId || null;
    this.bookId    = data.bookId || null;
    this.link      = data.link || '#';
    this.read      = false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  getContent() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      userId: this.userId,
      bookId: this.bookId,
      link: this.link,
      read: this.read,
      createdAt: this.createdAt
    };
  }
}

/**
 * Concrete Product 1: Notifikasi Peminjaman
 */
class BorrowingNotification extends BaseNotification {
  constructor(data) {
    super({
      ...data,
      type: data.approved ? 'success' : (data.rejected ? 'danger' : 'info'),
      title: data.title || (data.approved ? 'Peminjaman Disetujui' : (data.rejected ? 'Peminjaman Ditolak' : 'Pengajuan Peminjaman')),
      message: data.message || `Status peminjaman buku "${data.bookTitle}" telah diperbarui.`,
      link: data.link || '../user/my-loans.html'
    });
    this.category = 'borrowing';
  }
}

/**
 * Concrete Product 2: Notifikasi Batas Waktu / Jatuh Tempo
 */
class DueDateNotification extends BaseNotification {
  constructor(data) {
    super({
      ...data,
      type: data.isOverdue ? 'danger' : 'warning',
      title: data.title || (data.isOverdue ? 'Peminjaman Terlambat!' : 'Pengingat Jatuh Tempo'),
      message: data.message || `Buku "${data.bookTitle}" memiliki batas waktu pengembalian pada ${data.dueDate}.`,
      link: data.link || '../user/my-loans.html'
    });
    this.category = 'due_date';
  }
}

/**
 * Concrete Product 3: Notifikasi Perpanjangan Masa Pinjam
 */
class RenewalNotification extends BaseNotification {
  constructor(data) {
    super({
      ...data,
      type: 'success',
      title: data.title || 'Perpanjangan Masa Pinjam Berhasil',
      message: data.message || `Perpanjangan peminjaman buku "${data.bookTitle}" disetujui hingga ${data.dueDate}.`,
      link: data.link || '../user/my-loans.html'
    });
    this.category = 'renewal';
  }
}

/**
 * Concrete Product 4: Notifikasi Ketersediaan Buku Reservasi
 */
class ReservationNotification extends BaseNotification {
  constructor(data) {
    super({
      ...data,
      type: 'success',
      title: data.title || 'Buku Reservasi Tersedia!',
      message: data.message || `Buku yang Anda reservasi "${data.bookTitle}" kini telah tersedia dan siap diambil.`,
      link: data.link || `../user/book-detail.html?id=${data.bookId}`
    });
    this.category = 'reservation';
  }
}

// ------------------------------------------------------------
// CREATOR HIERARCHY (FACTORY METHOD)
// ------------------------------------------------------------

/**
 * Base Creator: NotificationCreator
 * Mendefinisikan Factory Method `createNotification` dan Template Method `send`
 */
class NotificationCreator {
  /**
   * Factory Method: diimplementasikan oleh subclass konkret
   */
  createNotification(data) {
    throw new Error("Factory Method 'createNotification(data)' must be implemented by concrete creator");
  }

  /**
   * Template Method: membuat notifikasi lalu menyimpannya dan memicu Observer
   */
  send(data) {
    const notification = this.createNotification(data);

    // Kirim ke NotificationObserver jika tersedia
    if (window.notificationObserver) {
      window.notificationObserver.addNotification(notification.getContent());
    } else if (window.notificationSystem) {
      window.notificationSystem.addNotification(notification.getContent());
    }

    return notification;
  }
}

/**
 * Concrete Creator 1: BorrowingNotificationCreator
 */
class BorrowingNotificationCreator extends NotificationCreator {
  createNotification(data) {
    return new BorrowingNotification(data);
  }
}

/**
 * Concrete Creator 2: DueDateNotificationCreator
 */
class DueDateNotificationCreator extends NotificationCreator {
  createNotification(data) {
    return new DueDateNotification(data);
  }
}

/**
 * Concrete Creator 3: RenewalNotificationCreator
 */
class RenewalNotificationCreator extends NotificationCreator {
  createNotification(data) {
    return new RenewalNotification(data);
  }
}

/**
 * Concrete Creator 4: ReservationNotificationCreator
 */
class ReservationNotificationCreator extends NotificationCreator {
  createNotification(data) {
    return new ReservationNotification(data);
  }
}

// ------------------------------------------------------------
// B. FACTORY: USER OBJECT FACTORY (EXISTING COMPATIBILITY)
// ------------------------------------------------------------

class BaseUser {
  constructor(data) {
    this.id         = data.id || `user_${Date.now()}`;
    this.name       = data.name || '';
    this.email      = data.email || '';
    this.password   = data.password || '';
    this.phone      = data.phone || '';
    this.avatar     = data.avatar || null;
    this.createdAt  = data.createdAt || new Date().toISOString();
    this.updatedAt  = data.updatedAt || new Date().toISOString();
    this.isActive   = data.isActive !== undefined ? data.isActive : true;
  }

  getInitials() {
    return this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  toJSON() {
    return { ...this };
  }
}

class AdminUser extends BaseUser {
  constructor(data) {
    super(data);
    this.role         = 'admin';
    this.permissions  = data.permissions || ['all'];
    this.department   = data.department || 'Perpustakaan';
    this.employeeId   = data.employeeId || '';
  }

  can(action) { return this.permissions.includes('all') || this.permissions.includes(action); }

  getDashboardRoute() { return '../admin/dashboard.html'; }
  getDisplayRole()    { return 'Administrator'; }
}

class MemberUser extends BaseUser {
  constructor(data) {
    super(data);
    this.role           = 'user';
    this.studentId      = data.studentId || '';
    this.faculty        = data.faculty || '';
    this.major          = data.major || '';
    this.semester       = data.semester || '';
    this.memberStatus   = data.memberStatus || 'active';
    this.wishlist       = data.wishlist || [];
    this.borrowCount    = data.borrowCount || 0;
    this.totalFines     = data.totalFines || 0;
  }

  getDashboardRoute() { return '../user/dashboard.html'; }
  getDisplayRole()    { return 'Mahasiswa'; }

  isSuspended() { return this.memberStatus === 'suspended'; }

  addToWishlist(bookId) {
    if (!this.wishlist.includes(bookId)) this.wishlist.push(bookId);
    return this;
  }

  removeFromWishlist(bookId) {
    this.wishlist = this.wishlist.filter(id => id !== bookId);
    return this;
  }
}

class UserFactory {
  static createUser(type, data) {
    switch (type) {
      case 'admin':  return new AdminUser(data);
      case 'user':
      case 'member': return new MemberUser(data);
      default:
        console.warn(`Unknown user type: ${type}, defaulting to MemberUser`);
        return new MemberUser(data);
    }
  }

  static fromStorage(data) {
    return UserFactory.createUser(data.role || 'user', data);
  }

  static createAdmin(data) {
    return new AdminUser(data);
  }

  static createMember(data) {
    return new MemberUser(data);
  }
}

// Export ke window
window.BaseNotification               = BaseNotification;
window.BorrowingNotification          = BorrowingNotification;
window.DueDateNotification            = DueDateNotification;
window.RenewalNotification            = RenewalNotification;
window.ReservationNotification        = ReservationNotification;

window.NotificationCreator            = NotificationCreator;
window.BorrowingNotificationCreator   = BorrowingNotificationCreator;
window.DueDateNotificationCreator     = DueDateNotificationCreator;
window.RenewalNotificationCreator     = RenewalNotificationCreator;
window.ReservationNotificationCreator = ReservationNotificationCreator;

window.BaseUser    = BaseUser;
window.AdminUser   = AdminUser;
window.MemberUser  = MemberUser;
window.UserFactory = UserFactory;
