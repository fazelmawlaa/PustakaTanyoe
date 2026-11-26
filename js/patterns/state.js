// ============================================================
// PustakaTanyoe — Design Patterns
// 11.2 STATE PATTERN: Lifecycle Eksemplar & Peminjaman
// ============================================================

// ------------------------------------------------------------
// A. SIKLUS HIDUP EKSEMPLAR (Tersedia, Dipinjam, Rusak, Nonaktif)
// ------------------------------------------------------------

/**
 * Antarmuka/Base State untuk Eksemplar Buku
 */
class EksemplarState {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  // Aksi yang dapat dilakukan
  pinjam(context) {
    throw new Error(`Aksi 'pinjam' tidak valid pada status ${this.name}`);
  }

  kembalikan(context) {
    throw new Error(`Aksi 'kembalikan' tidak valid pada status ${this.name}`);
  }

  laporkanRusak(context) {
    throw new Error(`Aksi 'laporkanRusak' tidak valid pada status ${this.name}`);
  }

  perbaiki(context) {
    throw new Error(`Aksi 'perbaiki' tidak valid pada status ${this.name}`);
  }

  nonaktifkan(context) {
    throw new Error(`Aksi 'nonaktifkan' tidak valid pada status ${this.name}`);
  }

  aktifkan(context) {
    throw new Error(`Aksi 'aktifkan' tidak valid pada status ${this.name}`);
  }
}

class TersediaState extends EksemplarState {
  constructor() {
    super('Tersedia');
  }

  pinjam(context) {
    // Eksemplar berhasil dipinjam, transisi ke DipinjamState
    context.setState(new DipinjamState());
    return { success: true, message: 'Eksemplar berhasil dipinjam.' };
  }

  laporkanRusak(context) {
    context.setState(new RusakState());
    return { success: true, message: 'Eksemplar ditandai rusak.' };
  }

  nonaktifkan(context) {
    context.setState(new NonaktifState());
    return { success: true, message: 'Eksemplar dinonaktifkan dari katalog.' };
  }
}

class DipinjamState extends EksemplarState {
  constructor() {
    super('Dipinjam');
  }

  kembalikan(context) {
    // Buku dikembalikan, transisi ke TersediaState
    context.setState(new TersediaState());
    return { success: true, message: 'Eksemplar berhasil dikembalikan dan tersedia.' };
  }

  laporkanRusak(context) {
    context.setState(new RusakState());
    return { success: true, message: 'Eksemplar yang dikembalikan dalam kondisi rusak.' };
  }
}

class RusakState extends EksemplarState {
  constructor() {
    super('Rusak');
  }

  // F11 dan Invariant 10: Eksemplar rusak TIDAK BOLEH dipinjam
  pinjam(context) {
    return { success: false, message: 'Pelanggaran Aturan F11: Eksemplar dalam kondisi rusak dan tidak dapat dipinjam.' };
  }

  perbaiki(context) {
    context.setState(new TersediaState());
    return { success: true, message: 'Eksemplar selesai diperbaiki dan kembali tersedia.' };
  }

  nonaktifkan(context) {
    context.setState(new NonaktifState());
    return { success: true, message: 'Eksemplar rusak dinonaktifkan secara permanen.' };
  }
}

class NonaktifState extends EksemplarState {
  constructor() {
    super('Nonaktif');
  }

  pinjam(context) {
    return { success: false, message: 'Eksemplar berstatus nonaktif dan tidak dapat dipinjam.' };
  }

  aktifkan(context) {
    context.setState(new TersediaState());
    return { success: true, message: 'Eksemplar berhasil diaktifkan kembali.' };
  }
}

/**
 * Context: Eksemplar
 */
class EksemplarContext {
  constructor(bookData, initialState = 'Tersedia') {
    this.book = bookData;
    this.state = this._resolveState(initialState);
  }

  _resolveState(stateName) {
    switch (stateName) {
      case 'Dipinjam': return new DipinjamState();
      case 'Rusak': return new RusakState();
      case 'Nonaktif': return new NonaktifState();
      case 'Tersedia':
      default: return new TersediaState();
    }
  }

  setState(state) {
    this.state = state;
    if (this.book) {
      this.book.statusEksemplar = state.getName();
    }
  }

  getStatus() {
    return this.state.getName();
  }

  pinjam() {
    return this.state.pinjam(this);
  }

  kembalikan() {
    return this.state.kembalikan(this);
  }

  laporkanRusak() {
    return this.state.laporkanRusak(this);
  }

  perbaiki() {
    return this.state.perbaiki(this);
  }

  nonaktifkan() {
    return this.state.nonaktifkan(this);
  }

  aktifkan() {
    return this.state.aktifkan(this);
  }
}

// ------------------------------------------------------------
// B. SIKLUS HIDUP TRANSAKSI PEMINJAMAN (MenungguVerifikasi, Dipinjam/Berlangsung, Dikembalikan, Ditolak)
// ------------------------------------------------------------

/**
 * Antarmuka/Base State untuk Transaksi Peminjaman
 */
class PeminjamanState {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  verifikasi(context, adminId) {
    return { success: false, message: `Transaksi tidak dapat diverifikasi pada status ${this.name}` };
  }
  tolak(context, reason) {
    return { success: false, message: `Transaksi tidak dapat ditolak pada status ${this.name}` };
  }
  kembalikan(context) {
    return { success: false, message: `Buku tidak dapat dikembalikan pada status ${this.name}` };
  }
  perpanjang(context) {
    return { success: false, message: `Peminjaman tidak dapat diperpanjang pada status ${this.name}` };
  }
}

class MenungguVerifikasiState extends PeminjamanState {
  constructor() {
    super('MenungguVerifikasi');
  }
  // Pre-Condition 7: Transaksi hanya dapat diverifikasi apabila berstatus MenungguVerifikasi
  verifikasi(context, adminId) {
    context.setState(new BerlangsungState());
    context.loan.approvedBy = adminId || 'admin';
    context.loan.approvedAt = new Date().toISOString();
    return { success: true, message: 'Peminjaman berhasil diverifikasi oleh admin.' };
  }
  tolak(context, reason = '') {
    context.setState(new DitolakState());
    context.loan.rejectedReason = reason;
    context.loan.rejectedAt = new Date().toISOString();
    return { success: true, message: 'Peminjaman telah ditolak.' };
  }
}

class BerlangsungState extends PeminjamanState {
  constructor() {
    super('Dipinjam'); // Berlangsung / Dipinjam
  }

  // Pre-Condition 3: Pengembalian hanya dapat diproses apabila transaksi berstatus Dipinjam
  kembalikan(context) {
    context.setState(new DikembalikanState());
    context.loan.returnedDate = new Date().toISOString().split('T')[0];
    return { success: true, message: 'Buku berhasil dikembalikan.' };
  }

  // Aturan F10: Perpanjangan maksimal 2 kali
  perpanjang(context) {
    const currentRenewals = context.loan.renewalCount || 0;
    if (currentRenewals >= 2) {
      return { success: false, message: 'Batas maksimal perpanjangan (2 kali) telah tercapai.' };
    }

    // Tambah 7 hari kalender dari jatuh tempo sebelumnya
    const currentDue = new Date(context.loan.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    context.loan.dueDate = currentDue.toISOString().split('T')[0];
    context.loan.renewalCount = currentRenewals + 1;

    return {
      success: true,
      message: `Perpanjangan ke-${context.loan.renewalCount} berhasil. Jatuh tempo baru: ${context.loan.dueDate}`,
      dueDate: context.loan.dueDate
    };
  }
}

class DikembalikanState extends PeminjamanState {
  constructor() {
    super('Dikembalikan');
  }
  // Tidak ada transisi lagi (terminal state transaksi)
}

class DitolakState extends PeminjamanState {
  constructor() {
    super('Ditolak');
  }
  // Terminal state
}

/**
 * Context: Transaksi Peminjaman
 */
class PeminjamanContext {
  constructor(loanData) {
    this.loan = loanData;
    this.state = this._resolveState(loanData.status);
  }

  _resolveState(status) {
    switch (status) {
      case 'pending':
      case 'MenungguVerifikasi':
        return new MenungguVerifikasiState();
      case 'active':
      case 'overdue':
      case 'Dipinjam':
      case 'Berlangsung':
        return new BerlangsungState();
      case 'returned':
      case 'Dikembalikan':
        return new DikembalikanState();
      case 'rejected':
      case 'Ditolak':
        return new DitolakState();
      default:
        return new MenungguVerifikasiState();
    }
  }

  setState(state) {
    this.state = state;
    if (this.loan) {
      // Sinkronkan status untuk UI
      const name = state.getName();
      if (name === 'MenungguVerifikasi') this.loan.status = 'pending';
      else if (name === 'Dipinjam') this.loan.status = 'active';
      else if (name === 'Dikembalikan') this.loan.status = 'returned';
      else if (name === 'Ditolak') this.loan.status = 'rejected';
      this.loan.statusState = name;
    }
  }

  getStatus() {
    return this.state.getName();
  }

  verifikasi(adminId) {
    return this.state.verifikasi(this, adminId);
  }

  tolak(reason) {
    return this.state.tolak(this, reason);
  }

  kembalikan() {
    return this.state.kembalikan(this);
  }

  perpanjang() {
    return this.state.perpanjang(this);
  }
}

// Export global untuk window browser
window.EksemplarState = EksemplarState;
window.TersediaState = TersediaState;
window.DipinjamState = DipinjamState;
window.RusakState = RusakState;
window.NonaktifState = NonaktifState;
window.EksemplarContext = EksemplarContext;

window.PeminjamanState = PeminjamanState;
window.MenungguVerifikasiState = MenungguVerifikasiState;
window.BerlangsungState = BerlangsungState;
window.DikembalikanState = DikembalikanState;
window.DitolakState = DitolakState;
window.PeminjamanContext = PeminjamanContext;
