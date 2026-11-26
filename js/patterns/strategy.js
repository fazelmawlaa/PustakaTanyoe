// ============================================================
// PustakaTanyoe — Design Patterns
// 11.3 STRATEGY PATTERN: Algoritma Rekomendasi Buku & Search/Sort
// ============================================================

// ------------------------------------------------------------
// A. REKOMENDASI BUKU (R05, D01) - SESUAI SPESIFIKASI BAB 11.3
// ------------------------------------------------------------

/**
 * Antarmuka/Base Strategy Rekomendasi Buku
 */
class RecommendationStrategy {
  /**
   * Menghasilkan daftar buku rekomendasi
   * @param {Object} user - Objek pengguna
   * @param {Array} allBooks - Seluruh koleksi buku
   * @param {Array} allLoans - Riwayat seluruh peminjaman
   * @param {number} limit - Jumlah buku yang direkomendasikan
   * @returns {Array} Daftar buku rekomendasi
   */
  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    throw new Error("Method 'recommend()' must be implemented by concrete strategy");
  }

  getName() {
    return 'Default Strategy';
  }
}

/**
 * 1. BorrowingHistoryStrategy
 * Rekomendasi berdasarkan kategori atau penulis dari riwayat peminjaman pengguna
 */
class BorrowingHistoryStrategy extends RecommendationStrategy {
  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    if (!user || !user.id) return new TrendingStrategy().recommend(user, allBooks, allLoans, limit);

    // Ambil peminjaman oleh user ini
    const userLoans = allLoans.filter(l => l.userId === user.id);
    if (userLoans.length === 0) {
      // Fallback ke trending jika belum ada riwayat
      return new TrendingStrategy().recommend(user, allBooks, allLoans, limit);
    }

    // Kumpulkan buku yang pernah dipinjam
    const borrowedBookIds = new Set(userLoans.map(l => l.bookId));
    const borrowedCategories = new Set();
    const borrowedAuthors = new Set();

    allBooks.forEach(b => {
      if (borrowedBookIds.has(b.id)) {
        if (b.category) borrowedCategories.add(b.category);
        if (b.author) borrowedAuthors.add(b.author);
      }
    });

    // Cari buku yang sejenis (kategori atau penulis sama) tapi belum pernah dipinjam
    const candidates = allBooks.filter(b => !borrowedBookIds.has(b.id));

    candidates.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (borrowedCategories.has(a.category)) scoreA += 2;
      if (borrowedAuthors.has(a.author)) scoreA += 1;
      if (borrowedCategories.has(b.category)) scoreB += 2;
      if (borrowedAuthors.has(b.author)) scoreB += 1;

      return scoreB - scoreA || (b.rating || 0) - (a.rating || 0);
    });

    return candidates.slice(0, limit);
  }

  getName() {
    return 'Berdasarkan Riwayat Peminjaman';
  }
}

/**
 * 2. WishlistStrategy
 * Rekomendasi berdasarkan buku-buku yang disimpan dalam Wishlist pengguna
 */
class WishlistStrategy extends RecommendationStrategy {
  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    const wishlist = (user && user.wishlist) ? user.wishlist : [];
    if (wishlist.length === 0) {
      return new TrendingStrategy().recommend(user, allBooks, allLoans, limit);
    }

    const wishlistIds = new Set(wishlist);
    const wishlistCategories = new Set();

    allBooks.forEach(b => {
      if (wishlistIds.has(b.id) && b.category) {
        wishlistCategories.add(b.category);
      }
    });

    const candidates = allBooks.filter(b => !wishlistIds.has(b.id));

    candidates.sort((a, b) => {
      const matchA = wishlistCategories.has(a.category) ? 1 : 0;
      const matchB = wishlistCategories.has(b.category) ? 1 : 0;
      return matchB - matchA || (b.rating || 0) - (a.rating || 0);
    });

    return candidates.slice(0, limit);
  }

  getName() {
    return 'Berdasarkan Wishlist';
  }
}

/**
 * 3. ViewedBooksStrategy
 * Rekomendasi berdasarkan riwayat buku yang sering dilihat atau dikunjungi
 */
class ViewedBooksStrategy extends RecommendationStrategy {
  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    // Ambil histori view dari storage lokal
    let viewedIds = [];
    try {
      viewedIds = JSON.parse(localStorage.getItem('pt_viewed_books') || '[]');
    } catch { viewedIds = []; }

    if (viewedIds.length === 0) {
      return new TrendingStrategy().recommend(user, allBooks, allLoans, limit);
    }

    const viewedSet = new Set(viewedIds);
    const viewedCategories = new Set();

    allBooks.forEach(b => {
      if (viewedSet.has(b.id) && b.category) {
        viewedCategories.add(b.category);
      }
    });

    const candidates = allBooks.filter(b => !viewedSet.has(b.id));

    candidates.sort((a, b) => {
      const matchA = viewedCategories.has(a.category) ? 1 : 0;
      const matchB = viewedCategories.has(b.category) ? 1 : 0;
      return matchB - matchA || (b.rating || 0) - (a.rating || 0);
    });

    return candidates.slice(0, limit);
  }

  getName() {
    return 'Berdasarkan Buku Dilihat';
  }
}

/**
 * 4. TrendingStrategy
 * Rekomendasi buku trending/terpopuler (default untuk pengguna baru tanpa aktivitas)
 */
class TrendingStrategy extends RecommendationStrategy {
  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    const sorted = [...allBooks].sort((a, b) => {
      const borrowA = a.borrowCount || a.borrowed || 0;
      const borrowB = b.borrowCount || b.borrowed || 0;
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;

      return (borrowB * 2 + ratingB) - (borrowA * 2 + ratingA);
    });

    return sorted.slice(0, limit);
  }

  getName() {
    return 'Buku Populer & Trending';
  }
}

/**
 * Context: RecommendationService
 * Menyimpan strategi aktif dan memfasilitasi pertukaran strategi secara dinamis saat runtime
 */
class RecommendationService {
  constructor(initialStrategy = null) {
    this._strategy = initialStrategy || new TrendingStrategy();
  }

  setStrategy(strategy) {
    this._strategy = strategy;
    return this;
  }

  getStrategy() {
    return this._strategy;
  }

  /**
   * Memilih strategi otomatis berdasarkan kelengkapan profil/aktivitas pengguna
   */
  selectOptimalStrategy(user, allLoans = []) {
    if (!user) {
      this.setStrategy(new TrendingStrategy());
      return this;
    }

    const userLoans = allLoans.filter(l => l.userId === user.id);
    if (userLoans.length > 0) {
      this.setStrategy(new BorrowingHistoryStrategy());
    } else if (user.wishlist && user.wishlist.length > 0) {
      this.setStrategy(new WishlistStrategy());
    } else {
      this.setStrategy(new TrendingStrategy());
    }
    return this;
  }

  recommend(user, allBooks = [], allLoans = [], limit = 4) {
    return this._strategy.recommend(user, allBooks, allLoans, limit);
  }
}

// ------------------------------------------------------------
// B. ALGORITMA PENCARIAN & SORTING KATALOG (EXISTING)
// ------------------------------------------------------------

class TitleSearchStrategy {
  search(books, query) {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b => b.title.toLowerCase().includes(q));
  }
  getName() { return 'Judul'; }
}

class AuthorSearchStrategy {
  search(books, query) {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b => b.author.toLowerCase().includes(q));
  }
  getName() { return 'Penulis'; }
}

class ISBNSearchStrategy {
  search(books, query) {
    const q = query.trim().replace(/[-\s]/g, '');
    if (!q) return books;
    return books.filter(b => (b.isbn || '').replace(/[-\s]/g, '').includes(q));
  }
  getName() { return 'ISBN'; }
}

class CategorySearchStrategy {
  search(books, query) {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b => b.category.toLowerCase().includes(q));
  }
  getName() { return 'Kategori'; }
}

class PublisherSearchStrategy {
  search(books, query) {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b => (b.publisher || '').toLowerCase().includes(q));
  }
  getName() { return 'Penerbit'; }
}

class FullTextSearchStrategy {
  search(books, query) {
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn || '').includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q) ||
      (b.publisher || '').toLowerCase().includes(q)
    ).sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
      return bTitle - aTitle;
    });
  }
  getName() { return 'Semua'; }
}

class SortByTitleStrategy {
  sort(books) { return [...books].sort((a, b) => a.title.localeCompare(b.title, 'id')); }
  getName() { return 'Judul A-Z'; }
}

class SortByAuthorStrategy {
  sort(books) { return [...books].sort((a, b) => a.author.localeCompare(b.author, 'id')); }
  getName() { return 'Penulis A-Z'; }
}

class SortByYearDescStrategy {
  sort(books) { return [...books].sort((a, b) => (b.year || 0) - (a.year || 0)); }
  getName() { return 'Terbaru'; }
}

class SortByYearAscStrategy {
  sort(books) { return [...books].sort((a, b) => (a.year || 0) - (b.year || 0)); }
  getName() { return 'Terlama'; }
}

class SortByRatingStrategy {
  sort(books) { return [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0)); }
  getName() { return 'Rating Tertinggi'; }
}

class SortByPopularityStrategy {
  sort(books) { return [...books].sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0)); }
  getName() { return 'Terpopuler'; }
}

class SearchContext {
  constructor() {
    this._searchStrategy = new FullTextSearchStrategy();
    this._sortStrategy = new SortByTitleStrategy();
  }
  setSearchStrategy(strategy) {
    this._searchStrategy = strategy;
    return this;
  }
  setSortStrategy(strategy) {
    this._sortStrategy = strategy;
    return this;
  }
  executeSearch(books, query) {
    return this._searchStrategy.search(books, query);
  }
  executeSort(books) {
    return this._sortStrategy.sort(books);
  }

  execute(books, { query = '', strategy = 'all', category = '', year = null, available = false, sort = 'title' } = {}) {
    const strategies = {
      all: new FullTextSearchStrategy(),
      title: new TitleSearchStrategy(),
      author: new AuthorSearchStrategy(),
      isbn: new ISBNSearchStrategy(),
      category: new CategorySearchStrategy(),
      publisher: new PublisherSearchStrategy(),
    };
    this._searchStrategy = strategies[strategy] || new FullTextSearchStrategy();

    const sorts = {
      title: new SortByTitleStrategy(),
      author: new SortByAuthorStrategy(),
      year_desc: new SortByYearDescStrategy(),
      year_asc: new SortByYearAscStrategy(),
      rating: new SortByRatingStrategy(),
      popular: new SortByPopularityStrategy(),
    };
    this._sortStrategy = sorts[sort] || new SortByTitleStrategy();

    let results = this.executeSearch(books, query);

    if (category && category !== 'all') {
      results = results.filter(b => b.category === category);
    }
    if (year) {
      results = results.filter(b => b.year === parseInt(year));
    }
    if (available) {
      results = results.filter(b => (b.stock - (b.borrowed || 0)) > 0);
    }

    return this.executeSort(results);
  }
}

// Inisialisasi Singleton RecommendationService
const recommendationService = new RecommendationService();

// Export ke window
window.RecommendationStrategy = RecommendationStrategy;
window.BorrowingHistoryStrategy = BorrowingHistoryStrategy;
window.WishlistStrategy = WishlistStrategy;
window.ViewedBooksStrategy = ViewedBooksStrategy;
window.TrendingStrategy = TrendingStrategy;
window.RecommendationService = RecommendationService;
window.recommendationService = recommendationService;

window.TitleSearchStrategy = TitleSearchStrategy;
window.AuthorSearchStrategy = AuthorSearchStrategy;
window.ISBNSearchStrategy = ISBNSearchStrategy;
window.CategorySearchStrategy = CategorySearchStrategy;
window.PublisherSearchStrategy = PublisherSearchStrategy;
window.FullTextSearchStrategy = FullTextSearchStrategy;
window.SortByTitleStrategy = SortByTitleStrategy;
window.SortByAuthorStrategy = SortByAuthorStrategy;
window.SortByYearDescStrategy = SortByYearDescStrategy;
window.SortByYearAscStrategy = SortByYearAscStrategy;
window.SortByRatingStrategy = SortByRatingStrategy;
window.SortByPopularityStrategy = SortByPopularityStrategy;
window.SearchContext = SearchContext;
