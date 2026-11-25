// ============================================================
// PustakaTanyoe — Design Patterns
// 2. OBSERVER: Notification & Event System
// ============================================================

class NotificationSystem {
  constructor() {
    this._subscribers = {};
    this._notifications = this._loadNotifications();
  }

  // Subscribe to an event
  subscribe(event, callback, id = null) {
    if (!this._subscribers[event]) {
      this._subscribers[event] = [];
    }
    const sub = { callback, id: id || `sub_${Date.now()}_${Math.random()}` };
    this._subscribers[event].push(sub);
    return sub.id; // return subscription ID for unsubscribing
  }

  // Unsubscribe by ID
  unsubscribe(event, subscriptionId) {
    if (!this._subscribers[event]) return;
    this._subscribers[event] = this._subscribers[event].filter(s => s.id !== subscriptionId);
  }

  // Notify all subscribers of an event
  notify(event, data = {}) {
    const subs = this._subscribers[event] || [];
    subs.forEach(sub => {
      try { sub.callback(data); }
      catch (e) { console.error('Observer callback error:', e); }
    });
    // Also notify wildcard listeners
    const wildcards = this._subscribers['*'] || [];
    wildcards.forEach(sub => {
      try { sub.callback({ event, ...data }); }
      catch (e) { /* silent */ }
    });
  }

  // Create & store a notification
  addNotification({ type = 'info', title, message, userId = null, bookId = null, link = '#' }) {
    const notif = {
      id: `notif_${Date.now()}`,
      type,       // 'info' | 'success' | 'warning' | 'danger'
      title,
      message,
      userId,
      bookId,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this._notifications.unshift(notif);
    // Keep max 100 notifications
    if (this._notifications.length > 100) this._notifications.pop();
    this._saveNotifications();
    this.notify('notification:new', notif);
    return notif;
  }

  // Mark as read
  markRead(notifId) {
    const notif = this._notifications.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      this._saveNotifications();
      this.notify('notification:read', { id: notifId });
    }
  }

  markAllRead(userId = null) {
    this._notifications.forEach(n => {
      if (!userId || n.userId === userId) n.read = true;
    });
    this._saveNotifications();
    this.notify('notification:allRead', { userId });
  }

  // Get notifications for a user
  getNotifications(userId = null) {
    if (!userId) return this._notifications;
    return this._notifications.filter(n => !n.userId || n.userId === userId);
  }

  getUnreadCount(userId = null) {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  deleteNotification(notifId) {
    this._notifications = this._notifications.filter(n => n.id !== notifId);
    this._saveNotifications();
  }

  _loadNotifications() {
    try {
      return JSON.parse(localStorage.getItem('pt_notifications') || '[]');
    } catch { return []; }
  }

  _saveNotifications() {
    localStorage.setItem('pt_notifications', JSON.stringify(this._notifications));
  }

  // Convenience methods
  notifyBookAvailable(book, userId) {
    return this.addNotification({
      type: 'success',
      title: 'Buku Tersedia!',
      message: `"${book.title}" kini tersedia untuk dipinjam.`,
      userId,
      bookId: book.id,
      link: `../user/book-detail.html?id=${book.id}`,
    });
  }

  notifyDueSoon(loan, daysLeft) {
    return this.addNotification({
      type: 'warning',
      title: 'Jatuh Tempo Mendekati',
      message: `Buku "${loan.bookTitle}" harus dikembalikan dalam ${daysLeft} hari.`,
      userId: loan.userId,
      bookId: loan.bookId,
      link: '../user/my-loans.html',
    });
  }

  notifyLoanApproved(loan) {
    return this.addNotification({
      type: 'success',
      title: 'Peminjaman Disetujui',
      message: `Permintaan peminjaman "${loan.bookTitle}" telah disetujui.`,
      userId: loan.userId,
      bookId: loan.bookId,
      link: '../user/my-loans.html',
    });
  }

  notifyLoanRejected(loan, reason = '') {
    return this.addNotification({
      type: 'danger',
      title: 'Peminjaman Ditolak',
      message: `Permintaan peminjaman "${loan.bookTitle}" ditolak. ${reason}`,
      userId: loan.userId,
      bookId: loan.bookId,
      link: '../user/my-loans.html',
    });
  }

  notifyOverdue(loan) {
    return this.addNotification({
      type: 'danger',
      title: 'Buku Terlambat!',
      message: `Buku "${loan.bookTitle}" sudah melewati batas waktu pengembalian. Denda berlaku.`,
      userId: loan.userId,
      bookId: loan.bookId,
      link: '../user/my-loans.html',
    });
  }
}

// Singleton instance
const notificationSystem = new NotificationSystem();
window.NotificationSystem = NotificationSystem;
window.notificationSystem = notificationSystem;
