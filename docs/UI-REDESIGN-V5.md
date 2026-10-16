# KasHima v5: Quiet Luxury & Usability Update

**Status:** Demo frontend untuk GitHub Pages. Tidak ada koneksi bank, API merchant, autentikasi backend, atau database produksi. Data contoh disimpan lokal di browser. Jangan gunakan pembayaran atau data anggota yang sesungguhnya.

## Scope redesign

- Pengaturan menggunakan tiga kelompok yang tetap memuat semua kontrol: **Tampilan dan kenyamanan** (tema dan reminder), **Glass Studio** (preset + blur), **Keamanan dan privasi** (peringkat dan password). Panel akun demo tetap menyediakan pilihan role dan reset.
- Glass Studio mengganti katalog empat kartu dekoratif dengan empat opsi ringkas: Solid, Satin, Frost, Crystal. Slider **0–28 px, step 2** menampilkan perubahan langsung melalui variabel CSS `--glass-blur` dan pratinjau dengan pola yang terlihat berbeda saat blur digeser. Kalau Solid dipilih lalu blur dinaikkan, mode berpindah ke Frost otomatis. Nilai langsung tersimpan **per akun demo** dalam `localStorage`.
- Bendahara dan Kahima memakai pola **task-first**. Dashboard menempatkan pekerjaan prioritas, daftar antrean, serta tiga ringkasan penting sebagai navigasi. Halaman verifikasi memiliki filter **Menunggu / Diproses / Semua** yang aktif. Navigasi kerja tambahan dapat digeser horizontal pada mobile tanpa membuat halaman overflow.
- Semua route pengurus dan anggota menggunakan permukaan yang lebih tenang dengan garis pemisah, hierarki tipografi rapi, tombol minim dekorasi, dan layout mobile-first. Data keuangan, QR, bukti dan tabel tetap solid demi keterbacaan.
- Transisi memakai CSS ringkas, `prefers-reduced-motion` tetap dihormati, dan `prefers-reduced-transparency` memberikan fallback.

## Pengujian dilakukan (Chromium headless, simulasi mobile)

- `test_v5.py`: **32/32 PASS**. Menilai slider mengubah CSS `backdrop-filter`, storage, empat preset, akses staff, review filter, dan tidak ada overflow untuk tiga role di lebar 320,360,390,430,768,1024,1440.
- `tests/luxury_sweep.py`: **30/30 PASS**. Memeriksa profil, ganti foto, edit nama/nickname, light-dark, logout/login demo, akses antarrole dan guard halaman sukses demo.
- `visual_v5.py`: pratinjau blur 0 dan 28 menunjukkan perbedaan piksel nyata (rata-rata antar kanal RGB 11,0 / 7,0 / 5,5 untuk satu cuplikan), tetapi ini **bukan** angka performa atau benchmark aksesibilitas.
- Pengujian dilakukan lokal pada Chromium, bukan klaim sudah diuji fisik iPhone Safari atau data bank.

## Penggunaan

Kunjungi `#/app/pengaturan`, pilih mode kaca dan geser slider. Nilai tersimpan untuk user demo yang aktif. Pada mode pengurus, buka `#/pengurus/keuangan`, lalu navigasikan menu kerja. Halaman profil dan role switching masih berjalan seperti sebelumnya.

## Batasan

Masih dibutuhkan backend dan sumber transaksi merchant resmi untuk status pembayaran otomatis sungguhan. QR contoh tidak bisa membayar. `localStorage` tidak mensinkronkan pilihan di berbagai HP.