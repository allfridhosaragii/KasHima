# Profil KasHima, Editorial Minimal v4

Status: UI demo interaktif. Tidak mengubah aturan pembayaran, autentikasi, ataupun data simulasi.

## Tujuan
Halaman Profil menggunakan komposisi yang lebih tenang dan ringkas, tetap mobile-first, identitas sebagai prioritas, dan akses cepat sederhana. Seluruh konten dan tindakan penting v3 dipertahankan.

## Konten wajib
Nama lengkap, nama panggilan, NIM, angkatan, peran aktif, periode, foto/avatar, tombol ganti/hapus foto, ringkasan pembayaran/status pengurus, peringkat atau status akses, tagihan terbuka atau periode, tiga akses cepat sesuai role, pengaturan tampilan termasuk Glass Studio, bantuan akun, pindah akun demo dan logout.

## Desain
Hilangkan hero kartu hijau besar, ornamen watermark dan heading berulang. Gunakan satu panel identitas dengan satu aksen tipis, header editorial, daftar berdivider, whitespace, kontrol minimum 44px, dan tipografi numerik tabular. Glass Studio tetap mengontrol transparansi pada panel identitas. Dark mode, prefer-reduced-motion/transparency dipertahankan.

## Skenario acceptance
- Anggota, bendahara dan Kahima memiliki konten dan akses cepat sesuai peran.
- Nama/foto dapat diubah dan hapus foto tetap berfungsi.
- Logout mengarahkan kembali ke login dan route privat ditutup pada demo.
- Tidak ada overflow pada 320/360/390/430/768/1024/1440 px, light/dark dan Glass Studio tetap ada.
- Data pengguna tetap hanya tersimpan di browser demo, bukan server.
