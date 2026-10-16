# Glass Studio — KasHima Luxury v3

Glass Studio adalah pengaturan visual per akun demo. Buka **Profil → Pengaturan → Glass Studio** pada akun anggota, bendahara, maupun Kahima.

## Empat material

| Preset | Blur awal | Tujuan |
|---|---:|---|
| Solid | 0 px | Material tanpa blur, prioritas daya baterai dan keterbacaan |
| Satin | 8 px | Kaca tipis/halus, permukaan hampir solid |
| Frost | 16 px | Keseimbangan efek kaca dan konten (default) |
| Crystal | 22 px | Transparansi dan depth lebih nyata |

Slider dari **0 sampai 28 px** dengan interval **2 px** dapat digeser ke kanan/kiri dan langsung mengubah komposisi preview. Pemilihan preset menyesuaikan nilai slider; setiap pengguna dapat mengatur ulang secara bebas. Dalam mode Solid slider dinonaktifkan.

## Penerapan dan kualitas UI

- Efek diterapkan secara selektif ke navbar, sidebar, panel dan dialog. Teks, nominal, QR, dan tabel keuangan tetap tajam.
- Light mode tetap default. Dark mode memiliki opacity material tersendiri.
- Tidak ada animasi blur terus-menerus atau parallax. Preferensi `prefers-reduced-transparency` dan `prefers-reduced-motion` dihormati.
- Jika browser tidak mendukung `backdrop-filter`, CSS memberikan tampilan solid.
- Semua kontrol punya label dan `aria-pressed`, slider bisa digunakan dengan keyboard.

## Penyimpanan akun

Preferensi disimpan dalam `db.users[].appearance` melalui localStorage perangkat yang sama. Perubahan tiap role tersimpan per identitas demo, **belum** tersinkron lintas HP. Untuk produk nyata perlu akun server dan kebijakan sinkronisasi.

## Verifikasi

Pengujian browser lokal dilakukan menggunakan Playwright Chromium: 20/20 checks untuk preset, blur, penyimpanan profil, tema gelap, perilaku role, aksesibilitas dan responsivitas 320–1440 px. Ini pemeriksaan frontend demo, bukan uji performa iPhone sungguhan ataupun verifikasi transaksi QRIS.

## Batas pembayaran

Website ini masih demonstrasi. Seluruh angka, role, dan halaman sukses dibangun di browser lokal; tidak ada koneksi bank atau QRIS produksi. Jangan menggunakan NIM, password, atau transaksi nyata pada demo.

Standar UI/UX: https://github.com/miqdadbadjuber/anti-slop
