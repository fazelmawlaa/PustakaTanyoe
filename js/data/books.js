// ============================================================
// PustakaTanyoe — Sample Book Data (20+ books)
// ============================================================

const SAMPLE_BOOKS = [
  {
    id: 'bk001',
    title: 'Algoritma dan Pemrograman',
    author: 'Rinaldi Munir',
    isbn: '978-602-022-032-8',
    category: 'Ilmu Komputer',
    year: 2022,
    publisher: 'Informatika Bandung',
    stock: 5, borrowed: 2,
    description: 'Buku ini membahas konsep dasar algoritma dan struktur data yang digunakan dalam pemrograman komputer, dilengkapi dengan contoh program dalam berbagai bahasa pemrograman.',
    rating: 4.8, ratingCount: 124, borrowCount: 89,
    coverImage: 'assets/images/covers/bk001.svg',
    coverColor: '#1B2B4B', coverColor2: '#0A1428',
    isFeatured: true, isNewArrival: false,
  },
  {
    id: 'bk002',
    title: 'Sistem Basis Data',
    author: 'Ramez Elmasri',
    isbn: '978-013-468-859-1',
    category: 'Ilmu Komputer',
    year: 2023,
    publisher: 'Pearson Education',
    stock: 3, borrowed: 3,
    description: 'Buku teks komprehensif tentang sistem manajemen basis data, mencakup model relasional, SQL, normalisasi, dan konsep basis data lanjutan.',
    rating: 4.6, ratingCount: 98, borrowCount: 76,
    coverImage: 'assets/images/covers/bk002.svg',
    coverColor: '#1A472A', coverColor2: '#0F2914',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk003',
    title: 'Kecerdasan Buatan: Pendekatan Modern',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-013-468-491-3',
    category: 'Ilmu Komputer',
    year: 2023,
    publisher: 'Pearson',
    stock: 4, borrowed: 1,
    description: 'Buku referensi utama kecerdasan buatan yang mencakup semua aspek AI modern dari pencarian dan logika hingga pembelajaran mesin dan robotika.',
    rating: 4.9, ratingCount: 203, borrowCount: 112,
    coverImage: 'assets/images/covers/bk003.svg',
    coverColor: '#7C3AED', coverColor2: '#5B21B6',
    isFeatured: true, isNewArrival: true,
  },
  {
    id: 'bk004',
    title: 'Kalkulus: Edisi ke-9',
    author: 'James Stewart',
    isbn: '978-131-385-016-3',
    category: 'Matematika',
    year: 2021,
    publisher: 'Cengage Learning',
    stock: 6, borrowed: 2,
    description: 'Buku kalkulus standar yang digunakan di universitas-universitas terkemuka, mencakup limit, turunan, integral, dan persamaan diferensial.',
    rating: 4.5, ratingCount: 311, borrowCount: 145,
    coverImage: 'assets/images/covers/bk004.svg',
    coverColor: '#B45309', coverColor2: '#78350F',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk005',
    title: 'Jaringan Komputer',
    author: 'Andrew S. Tanenbaum',
    isbn: '978-013-212-695-3',
    category: 'Teknologi Informasi',
    year: 2022,
    publisher: 'Pearson',
    stock: 4, borrowed: 2,
    description: 'Buku lengkap tentang jaringan komputer yang mencakup model OSI/TCP-IP, protokol jaringan, keamanan jaringan, dan jaringan nirkabel.',
    rating: 4.7, ratingCount: 167, borrowCount: 95,
    coverImage: 'assets/images/covers/bk005.svg',
    coverColor: '#0369A1', coverColor2: '#075985',
    isFeatured: true, isNewArrival: false,
  },
  {
    id: 'bk006',
    title: 'Rekayasa Perangkat Lunak',
    author: 'Ian Sommerville',
    isbn: '978-013-394-421-5',
    category: 'Teknologi Informasi',
    year: 2021,
    publisher: 'Pearson',
    stock: 5, borrowed: 1,
    description: 'Panduan komprehensif untuk rekayasa perangkat lunak modern, termasuk metodologi agile, pengujian, dan pemeliharaan sistem.',
    rating: 4.6, ratingCount: 142, borrowCount: 88,
    coverImage: 'assets/images/covers/bk006.svg',
    coverColor: '#065F46', coverColor2: '#064E3B',
    isFeatured: false, isNewArrival: true,
  },
  {
    id: 'bk007',
    title: 'Sejarah Aceh: Dari Kerajaan hingga Otonomi',
    author: 'Anthony Reid',
    isbn: '978-979-461-823-2',
    category: 'Sejarah & Budaya Aceh',
    year: 2020,
    publisher: 'Yayasan Pustaka Obor',
    stock: 3, borrowed: 0,
    description: 'Kajian mendalam tentang sejarah Aceh dari zaman Kerajaan Aceh Darussalam hingga era otonomi khusus, ditulis berdasarkan penelitian sejarah yang komprehensif.',
    rating: 4.8, ratingCount: 76, borrowCount: 54,
    coverImage: 'assets/images/covers/bk007.svg',
    coverColor: '#9D2235', coverColor2: '#7B1A29',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk008',
    title: 'Pengantar Ilmu Hukum',
    author: 'Sudikno Mertokusumo',
    isbn: '978-979-411-234-5',
    category: 'Hukum',
    year: 2022,
    publisher: 'Liberty Yogyakarta',
    stock: 4, borrowed: 1,
    description: 'Buku pengantar yang membahas dasar-dasar ilmu hukum, sistem hukum Indonesia, dan prinsip-prinsip hukum yang berlaku di Indonesia.',
    rating: 4.4, ratingCount: 89, borrowCount: 67,
    coverImage: 'assets/images/covers/bk008.svg',
    coverColor: '#374151', coverColor2: '#1F2937',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk009',
    title: 'Ekonomi Mikro: Teori dan Aplikasi',
    author: 'N. Gregory Mankiw',
    isbn: '978-053-445-511-8',
    category: 'Ekonomi',
    year: 2021,
    publisher: 'Erlangga',
    stock: 6, borrowed: 3,
    description: 'Buku teks ekonomi mikro yang menjelaskan prinsip supply-demand, perilaku konsumen, teori produksi, dan struktur pasar.',
    rating: 4.5, ratingCount: 198, borrowCount: 134,
    coverImage: 'assets/images/covers/bk009.svg',
    coverColor: '#B45309', coverColor2: '#92400E',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk010',
    title: 'Machine Learning dengan Python',
    author: 'Aurélien Géron',
    isbn: '978-149-209-648-4',
    category: 'Teknologi Informasi',
    year: 2023,
    publisher: "O'Reilly Media",
    stock: 3, borrowed: 2,
    description: 'Panduan praktis machine learning menggunakan Python, Scikit-Learn, Keras, dan TensorFlow. Cocok untuk pemula hingga praktisi.',
    rating: 4.9, ratingCount: 287, borrowCount: 198,
    coverImage: 'assets/images/covers/bk010.svg',
    coverColor: '#1B2B4B', coverColor2: '#0A1428',
    isFeatured: true, isNewArrival: true,
  },
  {
    id: 'bk011',
    title: 'Fisika Dasar untuk Universitas',
    author: 'Halliday, Resnick & Krane',
    isbn: '978-047-154-402-6',
    category: 'Fisika',
    year: 2020,
    publisher: 'Wiley',
    stock: 5, borrowed: 2,
    description: 'Buku fisika dasar komprehensif yang mencakup mekanika, gelombang, termodinamika, elektromagnetisme, dan fisika modern.',
    rating: 4.6, ratingCount: 234, borrowCount: 156,
    coverImage: 'assets/images/covers/bk011.svg',
    coverColor: '#1E40AF', coverColor2: '#1E3A8A',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk012',
    title: 'Kimia Organik: Dasar & Mekanisme',
    author: 'Robert T. Morrison',
    isbn: '978-013-010-030-9',
    category: 'Kimia',
    year: 2021,
    publisher: 'Prentice Hall',
    stock: 4, borrowed: 0,
    description: 'Buku kimia organik yang membahas struktur, sifat, reaksi, dan mekanisme reaksi senyawa organik secara mendalam.',
    rating: 4.5, ratingCount: 145, borrowCount: 89,
    coverImage: 'assets/images/covers/bk012.svg',
    coverColor: '#065F46', coverColor2: '#047857',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk013',
    title: 'Manajemen Strategik',
    author: 'Fred R. David',
    isbn: '978-013-612-949-6',
    category: 'Manajemen',
    year: 2022,
    publisher: 'Salemba Empat',
    stock: 5, borrowed: 2,
    description: 'Panduan lengkap manajemen strategik untuk mahasiswa bisnis dan para profesional, dilengkapi studi kasus perusahaan Indonesia dan multinasional.',
    rating: 4.3, ratingCount: 112, borrowCount: 78,
    coverImage: 'assets/images/covers/bk013.svg',
    coverColor: '#7C3AED', coverColor2: '#6D28D9',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk014',
    title: 'Sastra Aceh: Hikayat dan Puisi',
    author: 'Teuku Iskandar',
    isbn: '978-979-685-213-7',
    category: 'Bahasa & Sastra',
    year: 2019,
    publisher: 'Balai Pustaka',
    stock: 2, borrowed: 0,
    description: 'Kumpulan karya sastra Aceh klasik termasuk hikayat, syair, pantun, dan puisi yang merepresentasikan kekayaan budaya Aceh.',
    rating: 4.7, ratingCount: 43, borrowCount: 32,
    coverImage: 'assets/images/covers/bk014.svg',
    coverColor: '#9D2235', coverColor2: '#7B1A29',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk015',
    title: 'Pemrograman Web Modern: React & Node.js',
    author: 'Brad Traversy',
    isbn: '978-178-995-355-4',
    category: 'Teknologi Informasi',
    year: 2023,
    publisher: 'Packt Publishing',
    stock: 4, borrowed: 2,
    description: 'Panduan lengkap membangun aplikasi web modern menggunakan React.js untuk frontend dan Node.js/Express untuk backend.',
    rating: 4.8, ratingCount: 176, borrowCount: 143,
    coverImage: 'assets/images/covers/bk015.svg',
    coverColor: '#0369A1', coverColor2: '#0284C7',
    isFeatured: false, isNewArrival: true,
  },
  {
    id: 'bk016',
    title: 'Ilmu Kedokteran Dasar',
    author: 'Harrison\'s',
    isbn: '978-007-174-889-6',
    category: 'Kedokteran',
    year: 2022,
    publisher: 'McGraw-Hill',
    stock: 3, borrowed: 1,
    description: 'Referensi utama kedokteran klinis yang mencakup penyakit dalam, diagnosis, dan tatalaksana pasien secara komprehensif.',
    rating: 4.9, ratingCount: 89, borrowCount: 67,
    coverImage: 'assets/images/covers/bk016.svg',
    coverColor: '#BE185D', coverColor2: '#9D174D',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk017',
    title: 'Struktur Data dan Algoritma',
    author: 'Thomas H. Cormen',
    isbn: '978-026-203-384-8',
    category: 'Ilmu Komputer',
    year: 2022,
    publisher: 'MIT Press',
    stock: 5, borrowed: 3,
    description: 'Buku "CLRS" yang menjadi referensi utama algoritma dan struktur data di seluruh dunia. Mencakup analisis kompleksitas, sorting, graph, dan dynamic programming.',
    rating: 4.9, ratingCount: 412, borrowCount: 234,
    coverImage: 'assets/images/covers/bk017.svg',
    coverColor: '#374151', coverColor2: '#111827',
    isFeatured: true, isNewArrival: false,
  },
  {
    id: 'bk018',
    title: 'Teknik Sipil: Konstruksi dan Desain',
    author: 'Jack C. McCormac',
    isbn: '978-047-172-048-9',
    category: 'Teknik',
    year: 2021,
    publisher: 'Wiley',
    stock: 4, borrowed: 1,
    description: 'Buku teknik sipil yang membahas desain struktur, material konstruksi, geoteknik, dan manajemen proyek konstruksi.',
    rating: 4.4, ratingCount: 67, borrowCount: 45,
    coverImage: 'assets/images/covers/bk018.svg',
    coverColor: '#6B7280', coverColor2: '#4B5563',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk019',
    title: 'Fiqh Muamalah Kontemporer',
    author: 'Dr. Wahbah az-Zuhayli',
    isbn: '978-979-927-854-3',
    category: 'Agama Islam',
    year: 2020,
    publisher: 'Darul Fikr',
    stock: 3, borrowed: 0,
    description: 'Kajian hukum Islam kontemporer dalam bidang muamalah mencakup transaksi keuangan, perbankan syariah, dan ekonomi Islam.',
    rating: 4.7, ratingCount: 54, borrowCount: 38,
    coverImage: 'assets/images/covers/bk019.svg',
    coverColor: '#065F46', coverColor2: '#064E3B',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk020',
    title: 'Big Data Analytics',
    author: 'Bill Franks',
    isbn: '978-111-863-170-8',
    category: 'Teknologi Informasi',
    year: 2023,
    publisher: 'Wiley',
    stock: 3, borrowed: 1,
    description: 'Panduan komprehensif analitik big data, mencakup Apache Hadoop, Spark, machine learning skala besar, dan visualisasi data.',
    rating: 4.6, ratingCount: 134, borrowCount: 98,
    coverImage: 'assets/images/covers/bk020.svg',
    coverColor: '#1B2B4B', coverColor2: '#3B4F7C',
    isFeatured: false, isNewArrival: true,
  },
  {
    id: 'bk021',
    title: 'Sosiologi Masyarakat Aceh',
    author: 'Prof. Dr. Badruzzaman Ismail',
    isbn: '978-979-592-156-8',
    category: 'Sosial & Politik',
    year: 2021,
    publisher: 'USK Press',
    stock: 4, borrowed: 1,
    description: 'Kajian sosiologi tentang struktur sosial, budaya, dan dinamika masyarakat Aceh pasca konflik dan tsunami.',
    rating: 4.5, ratingCount: 38, borrowCount: 29,
    coverImage: 'assets/images/covers/bk021.svg',
    coverColor: '#7C3AED', coverColor2: '#5B21B6',
    isFeatured: false, isNewArrival: false,
  },
  {
    id: 'bk022',
    title: 'Cybersecurity: Prinsip dan Praktik',
    author: 'William Stallings',
    isbn: '978-013-408-504-9',
    category: 'Teknologi Informasi',
    year: 2023,
    publisher: 'Pearson',
    stock: 4, borrowed: 2,
    description: 'Panduan lengkap keamanan siber mencakup kriptografi, keamanan jaringan, ancaman siber modern, dan praktik terbaik keamanan informasi.',
    rating: 4.7, ratingCount: 156, borrowCount: 112,
    coverImage: 'assets/images/covers/bk022.svg',
    coverColor: '#374151', coverColor2: '#1F2937',
    isFeatured: false, isNewArrival: true,
  },
];

// Save to localStorage if not exists
function initBookData() {
  const existing = localStorage.getItem('pt_books');
  if (!existing) {
    localStorage.setItem('pt_books', JSON.stringify(SAMPLE_BOOKS));
    return;
  }
  try {
    const parsed = JSON.parse(existing);
    let updated = false;
    const sampleMap = new Map(SAMPLE_BOOKS.map(b => [b.id, b]));
    parsed.forEach(b => {
      // Only set default if missing; do NOT overwrite admin edits!
      if (!b.coverImage) {
        const sample = sampleMap.get(b.id);
        b.coverImage = sample ? sample.coverImage : `assets/images/covers/${b.id}.svg`;
        updated = true;
      }
      if (b.borrowCount === undefined) {
        const sample = sampleMap.get(b.id);
        b.borrowCount = sample ? sample.borrowCount : 0;
        updated = true;
      }
      if (b.rating === undefined || isNaN(b.rating)) {
        b.rating = 5.0;
        b.ratingCount = 1;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('pt_books', JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Error in initBookData:', e);
  }
}

function getBooks() {
  try {
    return JSON.parse(localStorage.getItem('pt_books') || '[]');
  } catch { return SAMPLE_BOOKS; }
}

function saveBooks(books) {
  try {
    localStorage.setItem('pt_books', JSON.stringify(books));
    return true;
  } catch (err) {
    console.error('Failed to save pt_books to localStorage:', err);
    if (window.showToast) {
      window.showToast('error', 'Gagal Menyimpan', 'Ukuran data terlalu besar untuk penyimpanan browser.');
    }
    return false;
  }
}

function getBookById(id) {
  return getBooks().find(b => b.id === id) || null;
}

function addBook(book) {
  const books = getBooks();
  book.id = `bk${String(Date.now()).slice(-6)}`;
  book.addedAt = new Date().toISOString();
  book.borrowCount = 0;
  book.borrowed = 0;
  book.rating = (typeof book.rating === 'number' && !isNaN(book.rating)) ? book.rating : 5.0;
  book.ratingCount = (typeof book.ratingCount === 'number' && !isNaN(book.ratingCount)) ? book.ratingCount : 1;
  book.coverColor = book.coverColor || '#1B2B4B';
  book.coverColor2 = book.coverColor2 || '#0A1428';
  book.isFeatured = !!book.isFeatured;
  book.isNewArrival = true;
  if (!book.coverImage) {
    book.coverImage = `assets/images/covers/bk001.svg`;
  }
  books.unshift(book); // Place new book at beginning so it appears on page 1 of catalog
  saveBooks(books);
  return book;
}

function updateBook(id, updates) {
  const books = getBooks();
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return null;
  books[idx] = { ...books[idx], ...updates, updatedAt: new Date().toISOString() };
  saveBooks(books);
  return books[idx];
}

function deleteBook(id) {
  const books = getBooks().filter(b => b.id !== id);
  saveBooks(books);
}

window.SAMPLE_BOOKS = SAMPLE_BOOKS;
window.initBookData = initBookData;
window.getBooks     = getBooks;
window.saveBooks    = saveBooks;
window.getBookById  = getBookById;
window.addBook      = addBook;
window.updateBook   = updateBook;
window.deleteBook   = deleteBook;
