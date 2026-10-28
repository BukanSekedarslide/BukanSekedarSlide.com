# Website BukanSekedarSlide (BSS)

Website statis (HTML, CSS, JavaScript). Tanpa database, tanpa framework, gratis dihosting.

## Struktur
```
bukansekedarslide/
├── index.html   (struktur & konten)
├── style.css    (desain)
├── script.js    (konfigurasi + interaksi)
├── assets/logo.png
└── README.md
```

## Menjalankan di komputer
Klik dua kali `index.html`, atau jalankan `python3 -m http.server 8000` di folder ini lalu buka `http://localhost:8000`.

## Mengganti nomor WhatsApp, Instagram, email
Buka `script.js`, edit bagian `CONFIG` paling atas:
- `waNumber`: format `628123456789` (tanpa +, spasi, atau strip)
- `instagram`: link profil Instagram
- `email`: alamat email

Semua tombol WhatsApp otomatis ikut berubah.

## Mengganti template contoh
Di `script.js`, edit daftar `TEMPLATES` (nama, kategori, deskripsi, jumlah slide, format). Harga masih placeholder "Rp XXX"; ganti di fungsi `renderCatalog` dan dialog detail setelah harga ditentukan. Saat ini semua data ditandai "CONTOH DEMO"; hapus label itu setelah memakai produk asli.

## Mengisi konten lain
- Teks FAQ yang masih berkurung `[...]` ada di `index.html` (bagian `id="faq"`).
- Paket jasa & harga: bagian `id="layanan"`.
- Halaman Kebijakan Privasi & Syarat Layanan masih placeholder (muncul pesan "segera tersedia").

## Deploy ke Cloudflare Pages (upload langsung, tanpa GitHub)
1. Masuk ke dashboard Cloudflare, buka **Workers & Pages**, pilih **Create**, lalu **Pages**.
2. Pilih **Upload assets** (Direct Upload), beri nama proyek, lalu unggah folder `bukansekedarslide` (atau isinya).
3. Klik **Deploy**. Kamu akan mendapat alamat `*.pages.dev`.

## Menghubungkan domain bukansekedarslide.my.id
1. Di proyek Pages, buka tab **Custom domains** lalu **Set up a custom domain**.
2. Masukkan `bukansekedarslide.my.id` dan ikuti instruksi DNS yang ditampilkan Cloudflare (biasanya record CNAME ke alamat `*.pages.dev`, atau mengarahkan nameserver domain ke Cloudflare).
3. Atur record tersebut di penyedia domain `.my.id` kamu, lalu tunggu propagasi DNS.

Ikuti petunjuk resmi di dokumentasi Cloudflare Pages karena tampilan dan langkahnya bisa berubah. Domain baru terhubung setelah DNS benar-benar aktif.

## Memperbarui website
Edit file, lalu di proyek Pages pilih **Create deployment** dan unggah ulang folder.
