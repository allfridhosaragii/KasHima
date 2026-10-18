# KasHima — Kalender Kas v11 (React/TypeScript)

Route: /pengurus/buku-kas. Pembukaan default adalah tampilan Kalender, dengan mode Daftar untuk pencarian dan audit. Akses Bendahara dan Kahima, bukan Anggota.

## Navigasi
- Saat pertama dibuka, bulan dan tanggal dipilih berdasarkan zona waktu Asia/Jakarta (WIB), bukan timezone browser.
- Penanda hari ini diperbarui selama halaman terbuka. Jika pengguna memilih tanggal lain, kalender tidak memindahkan seleksi secara mendadak.
- Tombol Hari ini, panah bulan sebelumnya/berikutnya, dan input native pilih bulan/tahun. Minggu dimulai Senin; pergantian tahun dan Februari kabisat ditangani.
- Sel kalender memakai penanda iuran normal, tunggakan/denda, dan antrean pemeriksaan. Klik tanggal menampilkan detail tanggal itu.

## Definisi perhitungan
1. Satu objek payment terverifikasi dihitung tepat sebagai satu transaksi dalam hitungan harian walaupun membayar beberapa periode. Jumlah transaksi dan jumlah pembayar unik dipisah.
2. Jumlah kas normal, pokok tunggakan, dan denda diambil dari alokasi payment ke obligationIds; pokok disebut terlambat jika tanggal pembayaran menurut WIB setelah tanggal 15 periode yang bersangkutan. Tarif dan denda belum disahkan secara formal.
3. Jika payment.amount tidak dapat dialokasikan seluruhnya, sisanya diberi label Belum dialokasikan. Jangan mengarang pokok/denda yang tidak ada buktinya.
4. Objek intent berstatus pending tidak masuk total penerimaan. Pengeluaran approved diperhitungkan sebagai uang keluar, pending expense juga tidak dianggap uang keluar.
5. Referensi merchant yang berulang ditandai untuk audit, bukan dihapus otomatis. Dua transaksi dengan nominal sama dari anggota berbeda tidak otomatis dicurigai.
6. Data ini adalah simulasi lokal pada browser masing-masing, bukan buku kas resmi atau mutasi QRIS. Penggunaan produksi membutuhkan backend, catatan penerimaan sah, settlement reconciliation dan audit.

## UI dan role
- Pada mobile: satu kolom, tujuh tanggal dengan kontrol sentuh, panel rincian tepat di bawah kalender, filter dapat digeser ke samping tanpa menyebabkan overflow halaman.
- Pada desktop: kalender dan rincian tampil berdampingan.
- Mode Daftar memiliki kategori, pencarian nama/referensi, tampilan rincian lewat disclosure, pemuatan maksimal 40 baris per batch dan CSV terfilter.
- Bendahara tetap dapat mengajukan pengeluaran (memerlukan persetujuan Kahima di demo). Kahima membaca data tanpa tombol pengajuan.
- Mendukung light/dark, Glass Studio yang sudah ada, reduced motion, navigasi keyboard dan label status.

## File teknis
- src/features/cash-calendar/CashCalendar.tsx: date arithmetic, aggregator, render dan interaksi.
- src/features/cash-calendar/cashCalendar.css: responsive, konsisten token desain.
- src/features/cash-calendar/cashCalendar.test.ts: Vitest WIB, alokasi, duplikasi, pending.
- tests/cash-calendar.spec.ts: Playwright date selection, filter, role dan 14 viewport × 2 tema.
- src/pages/FinancePages.tsx: halaman Ledger diganti ke Kalender Kas, data React store sebelumnya tetap digunakan.

## Uji dan gate
Periksa npm run build, npm test, npm run test:e2e. Browser E2E mencakup layar 320, 344, 360, 375, 390, 414, 430, 600, 768, 850, 851, 1024, 1280, 1440 px dalam light/dark pada Chromium. Uji fisik Safari iPhone diperlukan sebelum klaim bebas bug pada semua device. Masalah QRIS sumber pembayaran otomatis yang sah tetap belum terselesaikan.
