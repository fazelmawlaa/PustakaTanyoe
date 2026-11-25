// ============================================================
// PustakaTanyoe — Design Patterns
// 1. SINGLETON: Library Configuration Manager
// ============================================================

class LibraryConfig {
  constructor() {
    if (LibraryConfig._instance) return LibraryConfig._instance;
    LibraryConfig._instance = this;

    this.settings = {
      appName: 'PustakaTanyoe',
      appSubtitle: 'Perpustakaan Digital USK',
      university: 'Universitas Syiah Kuala',
      address: 'Jl. Teuku Nyak Arief, Kopelma Darussalam, Banda Aceh 23111',
      email: 'pustaka@usk.ac.id',
      phone: '+62 651 7554395',
      maxBorrowBooks: 3,
      borrowDurationDays: 7,
      finePerDay: 1000,         // Rp 1.000 per hari
      gracePeriodDays: 1,
      renewalMaxTimes: 2,
      renewalDays: 7,
      openHour: '08:00',
      closeHour: '20:00',
      theme: {
        primaryColor: '#C9A227',
        secondaryColor: '#1B2B4B',
        accentColor: '#1A472A',
      },
      features: {
        wishlist: true,
        ratings: true,
        notifications: true,
        renewalOnline: true,
        emailNotifications: false, // simulated
      },
      categories: [
        'Teknologi Informasi',
        'Ilmu Komputer',
        'Matematika',
        'Fisika',
        'Kimia',
        'Biologi',
        'Kedokteran',
        'Hukum',
        'Ekonomi',
        'Manajemen',
        'Teknik',
        'Bahasa & Sastra',
        'Sejarah & Budaya Aceh',
        'Filsafat',
        'Agama Islam',
        'Sosial & Politik',
      ],
    };

    this._loadFromStorage();
  }

  static getInstance() {
    if (!LibraryConfig._instance) {
      new LibraryConfig();
    }
    return LibraryConfig._instance;
  }

  _loadFromStorage() {
    const saved = localStorage.getItem('libraryConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) { /* use defaults */ }
    }
  }

  get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.settings);
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.settings;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]] = obj[keys[i]] || {};
    }
    obj[keys[keys.length - 1]] = value;
    this._saveToStorage();
    return this;
  }

  _saveToStorage() {
    localStorage.setItem('libraryConfig', JSON.stringify(this.settings));
  }

  getAll() { return { ...this.settings }; }

  reset() {
    LibraryConfig._instance = null;
    localStorage.removeItem('libraryConfig');
  }
}
LibraryConfig._instance = null;

// Export
window.LibraryConfig = LibraryConfig;
