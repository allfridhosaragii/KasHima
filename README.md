# KasHima — Luxury Mobile-first Demo

Website demo KasHima dengan tampilan editorial luxury, tema terang/gelap, navigasi khusus anggota, bendahara dan Kahima, serta pengelolaan profil (nama lengkap, panggilan dan foto).

## Buka website

https://allfridhosaragii.github.io/KasHima/

Dibangun dengan HTML, CSS dan JavaScript tanpa dependensi runtime. Dashboard dan pembayaran yang ada **simulasi tersimpan di browser lokal**; ini bukan aplikasi keuangan produksi, tidak memiliki autentikasi server, bukan QRIS asli dan tidak memproses uang sungguhan. Jangan masukkan NIM, password atau bukti pembayaran asli.

## Cara menjalankan

Buka `index.html` di browser atau jalankan server statis lokal:

```sh
python -m http.server 8000
```

Lalu buka http://localhost:8000.

## Deployment

Workflow GitHub Actions `.github/workflows/deploy-pages.yml` menerbitkan isi root repository ke GitHub Pages. Pastikan Pages diaktifkan melalui Settings > Pages > Build and deployment > Source: GitHub Actions bila workflow pertama tidak dapat mengaktifkan secara otomatis.

## Batas keamanan dan QRIS

Semua role dan login pada demo hanya simulasi. Data dan profil disimpan di localStorage browser masing-masing, tanpa sinkronisasi antar pengguna. Halaman berhasil hanya hasil persetujuan simulasi bendahara, bukan verifikasi merchant. Implementasi produksi memerlukan backend aman, otentikasi NIM, database, kontrol hak akses, dan sumber transaksi QRIS yang sah.

## Pedoman desain

Mobile-first, premium editorial, light default, dark toggle, gerak halus dengan `prefers-reduced-motion`, mengikuti prinsip https://github.com/miqdadbadjuber/anti-slop tanpa menyalin template.
