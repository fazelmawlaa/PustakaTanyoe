// ============================================================
// PustakaTanyoe — Design Patterns
// 3. FACTORY: User Object Factory
// ============================================================

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
    this.memberStatus   = data.memberStatus || 'active'; // active | suspended | pending
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

window.BaseUser    = BaseUser;
window.AdminUser   = AdminUser;
window.MemberUser  = MemberUser;
window.UserFactory = UserFactory;
