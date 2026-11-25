// ============================================================
// PustakaTanyoe — Design Patterns
// 4. STRATEGY: Search & Filter Algorithms
// ============================================================

// --- Strategies ---
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
      // Prioritize title matches
      const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
      return bTitle - aTitle;
    });
  }
  getName() { return 'Semua'; }
}

// --- Sort Strategies ---
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

// --- Context ---
class SearchContext {
  constructor() {
    this._searchStrategy = new FullTextSearchStrategy();
    this._sortStrategy   = new SortByTitleStrategy();
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

  // Combined: search + filter + sort
  execute(books, { query = '', strategy = 'all', category = '', year = null, available = false, sort = 'title' } = {}) {
    // 1. Select search strategy
    const strategies = {
      all:       new FullTextSearchStrategy(),
      title:     new TitleSearchStrategy(),
      author:    new AuthorSearchStrategy(),
      isbn:      new ISBNSearchStrategy(),
      category:  new CategorySearchStrategy(),
      publisher: new PublisherSearchStrategy(),
    };
    this._searchStrategy = strategies[strategy] || new FullTextSearchStrategy();

    // 2. Select sort strategy
    const sorts = {
      title:      new SortByTitleStrategy(),
      author:     new SortByAuthorStrategy(),
      year_desc:  new SortByYearDescStrategy(),
      year_asc:   new SortByYearAscStrategy(),
      rating:     new SortByRatingStrategy(),
      popular:    new SortByPopularityStrategy(),
    };
    this._sortStrategy = sorts[sort] || new SortByTitleStrategy();

    let results = this.executeSearch(books, query);

    // 3. Apply category filter
    if (category && category !== 'all') {
      results = results.filter(b => b.category === category);
    }

    // 4. Apply year filter
    if (year) {
      results = results.filter(b => b.year === parseInt(year));
    }

    // 5. Apply availability filter
    if (available) {
      results = results.filter(b => (b.stock - (b.borrowed || 0)) > 0);
    }

    // 6. Sort
    return this.executeSort(results);
  }
}

// Export
window.TitleSearchStrategy    = TitleSearchStrategy;
window.AuthorSearchStrategy   = AuthorSearchStrategy;
window.ISBNSearchStrategy     = ISBNSearchStrategy;
window.CategorySearchStrategy = CategorySearchStrategy;
window.FullTextSearchStrategy = FullTextSearchStrategy;
window.SortByTitleStrategy    = SortByTitleStrategy;
window.SortByYearDescStrategy = SortByYearDescStrategy;
window.SortByRatingStrategy   = SortByRatingStrategy;
window.SortByPopularityStrategy = SortByPopularityStrategy;
window.SearchContext          = SearchContext;
