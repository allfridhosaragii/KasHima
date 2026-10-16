# KasHima — Luxury Editorial Demo

Prototipe antarmuka KasHima yang berfokus pada **mobile-first**, luxury editorial, dan pedoman [Anti-Slop](https://github.com/miqdadbadjuber/anti-slop).

**Demo:** https://allfridhosaragii.github.io/KasHima/ (aktif setelah GitHub Pages dikonfigurasi).

## Menjalankan

Unduh/clone repo, lalu jalankan server statis pada folder root:

```bash
python -m http.server 5173
```

Buka http://localhost:5173/ di browser. Tanpa dependensi npm.

## Struktur

- `index.html` — kerangka halaman dan fallback ketika JavaScript tidak berjalan
- `styles.css` — desain premium, responsive layout, motion, tema terang/gelap
- `app.js` — router dan interaksi demo untuk peran anggota/bendahara/Kahima
- `assets/favicon.svg` — ikon KasHima
- `.github/workflows/pages.yml` — workflow publikasi GitHub Pages
- `DESIGN.md`, `AGENTS.md` — prinsip desain dan panduan agent

## Peringatan penting

Website publik ini **hanya prototipe**; nama, iuran, akun, dan pembayaran memakai data **simulasi di browser lokal**. Login bukan autentikasi server dan QR bukan QRIS merchant. **Jangan masukkan NIM asli, password sungguhan, foto sensitif, atau uang nyata.** Penyimpanan lokal hanya berlaku per browser/perangkat.

Pembayaran berhasil baru tampil setelah verifikasi simulasi bendahara. Integrasi produksi memerlukan database server aman dan sumber transaksi QRIS sah yang bisa memvalidasi pembayaran.

## GitHub Pages

Buka [Settings → Pages](https://github.com/allfridhosaragii/KasHima/settings/pages), pilih **GitHub Actions** sebagai sumber, lalu workflow `Deploy KasHima` akan menerbitkan website. Lihat tab [Actions](https://github.com/allfridhosaragii/KasHima/actions).

Lisensi aset bawaan tetap mengikuti lisensi asalnya; tidak ada aset Awwwards yang disalin.
