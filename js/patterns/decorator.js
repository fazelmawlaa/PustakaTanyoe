// ============================================================
// PustakaTanyoe — Design Patterns
// 5. DECORATOR: Book Object Decorator Chain
// ============================================================

class BookBase {
  constructor(data) {
    this.id          = data.id;
    this.title       = data.title;
    this.author      = data.author;
    this.isbn        = data.isbn;
    this.category    = data.category;
    this.year        = data.year;
    this.publisher   = data.publisher;
    this.stock       = data.stock || 0;
    this.borrowed    = data.borrowed || 0;
    this.description = data.description || '';
    this.rating      = data.rating || 0;
    this.ratingCount = data.ratingCount || 0;
    this.coverImage  = data.coverImage || null;
    this.coverColor  = data.coverColor || '#1B2B4B';
    this.coverColor2 = data.coverColor2 || '#0A1428';
    this.borrowCount = data.borrowCount || 0;
    this.addedAt     = data.addedAt || new Date().toISOString();
    this._decorators = [];
  }

  getAvailable() { return this.stock - this.borrowed; }
  isAvailable()  { return this.getAvailable() > 0; }

  getInfo() {
    return {
      id:          this.id,
      title:       this.title,
      author:      this.author,
      category:    this.category,
      available:   this.isAvailable(),
      stock:       this.stock,
      borrowed:    this.borrowed,
      badges:      this._decorators,
    };
  }

  render() {
    return `<span class="book-base">${this.title}</span>`;
  }
}

// --- Decorators ---
class BookDecorator extends BookBase {
  constructor(book) {
    super(book);
    // Copy all properties from wrapped book
    Object.assign(this, book);
    this._wrapped = book;
    this._decorators = [...(book._decorators || [])];
  }

  getInfo() { return this._wrapped.getInfo ? this._wrapped.getInfo() : super.getInfo(); }
}

class FeaturedBookDecorator extends BookDecorator {
  constructor(book) {
    super(book);
    this._decorators.push('featured');
    this.isFeatured = true;
  }

  getInfo() {
    const info = super.getInfo();
    return { ...info, badges: [...(info.badges || []), 'featured'], featured: true };
  }
  getLabel() { return '⭐ Unggulan'; }
}

class NewArrivalDecorator extends BookDecorator {
  constructor(book) {
    super(book);
    this._decorators.push('new');
    this.isNew = true;
  }

  getInfo() {
    const info = super.getInfo();
    return { ...info, badges: [...(info.badges || []), 'new'], newArrival: true };
  }
  getLabel() { return '🆕 Baru'; }
}

class ReservedDecorator extends BookDecorator {
  constructor(book, userId) {
    super(book);
    this._decorators.push('reserved');
    this.isReserved = true;
    this.reservedBy = userId;
  }

  getInfo() {
    const info = super.getInfo();
    return { ...info, badges: [...(info.badges || []), 'reserved'], reserved: true };
  }
  getLabel() { return '🔒 Dipesan'; }
}

class RecommendedDecorator extends BookDecorator {
  constructor(book) {
    super(book);
    this._decorators.push('recommended');
    this.isRecommended = true;
  }
  getLabel() { return '👍 Rekomendasi'; }
}

class OverdueDecorator extends BookDecorator {
  constructor(book, daysPastDue) {
    super(book);
    this._decorators.push('overdue');
    this.isOverdue    = true;
    this.daysPastDue  = daysPastDue;
    this.fine         = daysPastDue * 1000; // Rp 1.000/day
  }
  getLabel() { return `⚠️ Terlambat ${this.daysPastDue} hari`; }
  getFine()  { return this.fine; }
}

// --- BookFactory using Decorator pattern ---
class BookDecoratorFactory {
  static decorate(book, decorators = []) {
    let result = book instanceof BookBase ? book : new BookBase(book);

    decorators.forEach(deco => {
      switch (deco.type) {
        case 'featured':    result = new FeaturedBookDecorator(result); break;
        case 'new':         result = new NewArrivalDecorator(result); break;
        case 'reserved':    result = new ReservedDecorator(result, deco.userId); break;
        case 'recommended': result = new RecommendedDecorator(result); break;
        case 'overdue':     result = new OverdueDecorator(result, deco.days || 0); break;
        default: break;
      }
    });

    return result;
  }

  // Auto-detect decorators based on book data
  static autoDecorate(bookData) {
    const decorators = [];
    if (bookData.isFeatured)    decorators.push({ type: 'featured' });
    if (bookData.isNewArrival)  decorators.push({ type: 'new' });
    if (bookData.isRecommended) decorators.push({ type: 'recommended' });
    return BookDecoratorFactory.decorate(bookData, decorators);
  }
}

window.BookBase               = BookBase;
window.BookDecorator          = BookDecorator;
window.FeaturedBookDecorator  = FeaturedBookDecorator;
window.NewArrivalDecorator    = NewArrivalDecorator;
window.ReservedDecorator      = ReservedDecorator;
window.RecommendedDecorator   = RecommendedDecorator;
window.OverdueDecorator       = OverdueDecorator;
window.BookDecoratorFactory   = BookDecoratorFactory;
