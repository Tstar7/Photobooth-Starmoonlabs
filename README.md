# 📸 Starmon Snap! ♡ Korean Aesthetic Photobooth

Website Photobooth interaktif, lucu, dan aesthetic ala **Korean 4-Cuts (Life Four Cuts / Haru Film / Photoism)** dengan pilihan fleksibel **2 hingga 6 kotak foto** dalam satu frame, koleksi 16+ variasi tema frame kawaii/vintage/Y2K, filter foto aesthetic, stiker seru yang bisa digeser, dan ekspor resolusi tinggi (HD).

---

## ✨ Fitur Utama

### 1. 🔲 Pilihan 2 - 6 Kotak Foto dalam Satu Frame
- **2 Kotak Foto**:
  - `Vertical Strip (1x2)`: Strip vertikal duo manis untuk pasangan / bestie.
  - `Duo Grid (2x1)`: Format horizontal berdampingan.
- **3 Kotak Foto**:
  - `Chic Strip (1x3)`: Strip 3 foto vertikal elegan ala Haru Film.
- **4 Kotak Foto**:
  - `Classic 4-Cuts Strip (1x4)`: Strip 4 foto vertikal legendaris ala Korean Life4Cuts.
  - `2x2 Square Grid`: Format kotak polaroid Instagram-ready.
- **5 Kotak Foto**:
  - `1 Hero + 4 Mini Collage`: 1 foto utama besar di atas + 4 foto mini di bawah.
  - `Long Strip (1x5)`: Strip vertikal 5 foto berurutan.
- **6 Kotak Foto**:
  - `2x3 Double Strip Grid`: Layout kontak film 6 foto aesthetic.
  - `3x2 Wide Grid`: Layout lebar 6 foto.
  - `Mega Strip (1x6)`: Strip panjang 6 foto seru bersama teman-teman.

### 2. 🎀 16+ Variasi Frame Lucu & Aesthetic
- 🎀 **Coquette Pink**: Pita manis, mutiara, nuansa pastel balletcore.
- ⭐ **Y2K Silver Star**: Hologram cyber, bintang retro 2000-an.
- 🧸 **Warm Teddy**: Nuansa latte hangat dengan telinga beruang & jejak kaki lucu.
- 🐱 **Neko Kitty**: Doodle kucing kawaii, cakar pink, dan ikan lucu.
- 🌸 **Sakura Dream**: Gradasi bunga sakura musim semi yang lembut.
- 🖤 **Korean Chic Noir**: Minimalis hitam-putih monokrom dengan barcode studio Seoul.
- 🎞️ **Vintage Kodak Film**: Bingkai film analog retro dengan cap tanggal oranye.
- 🍓 **Strawberry Milk**: Polka dot manis & buah stroberi segar.
- 🌌 **Starlight Galaxy**: Langit malam ungu tua, bulan sabit & rasi bintang emas.
- ☁️ **Cloud & Rainbow**: Langit biru pastel berawan dengan pelangi ceria.
- 🍵 **Matcha Mint**: Hijau sage aesthetic dengan daun kecambah segar.
- 💜 **Lavender Bliss**: Lilac ungu dengan kupu-kupu bermimpi.
- 🍑 **Peach Sunset**: Kilau hangat golden hour senja.
- 👾 **Pixel 8-Bit**: Frame retro arcade game bergaya pixel art.
- 🤍 **Minimal Polaroid**: Tampilan bersih polaroid putih klasik.
- 🎨 **Warna DIY (Custom Color)**: Color picker bebas untuk memilih warna frame favoritmu sendiri!

### 3. 📷 Kamera & Mode Pengambilan Foto
- **Live Webcam Mirroring**: Kamera otomatis di-mirror horizontal untuk pengalaman bercermin alami.
- **Timer Countdown (3s, 5s, 10s)**: Hitung mundur dengan suara bip lucu.
- **Mode Auto-Beruntun (Photobooth Sequence)**: Mengambil foto secara otomatis dari kotak 1 sampai selesai dengan jeda pose antar foto.
- **Manual Snap & Retake**: Bebas mengklik kotak mana saja untuk mengambil ulang foto tertentu.
- **Upload Foto Galeri**: Bisa mengunggah foto langsung dari penyimpanan HP/Laptop.
- **Shortcut Keyboard**: Cukup tekan tombol **Spacebar** untuk mengambil foto langsung!

### 4. 🎨 Filter Foto Real-Time
- Original / Clean
- ✨ **Kawaii Glow** (Soft blush & kecerahan lembut)
- 🎞️ **90s Vintage** (Hangat, nostalgia film lama)
- 🖤 **Noir B&W** (Monokrom kontras tinggi ala foto booth Korea)
- 🌸 **Fairy Pink** (Nuansa pastel pink dreamy)
- 🌅 **Golden Hour** (Cahaya senja keemasan)
- ❄️ **Cool Blue** (Nuansa dingin aesthetic)

### 5. 💖 Stiker Interaktif & Teks Custom
- **Stiker Lucu**: Pita, bintang Y2K, kucing, emoji pesta, dan kata-kata lucu Korea (*대박, 하트♡, Chu~, Cutie*).
- **Drag & Rotate**: Stiker dapat digeser ke posisi mana pun di atas frame dan diputar sesuai keinginan.
- **Teks Header & Subtitle**: Ubah judul atas (*misal: STARMON LABS*) dan pesan bawah (*misal: BESTIES FOREVER ♡*).
- **Tanggal Otomatis**: Terisi otomatis sesuai hari ini atau bisa diubah manual.

### 6. 🖨️ Ekspor & Cetak
- **Download PNG HD**: Resolusi tinggi (High-DPI 2.5x) yang jernih untuk dicetak di kertas foto atau diunggah ke Instagram Story / TikTok.
- **Mode Cetak 2 Strip (Double Strip)**: Opsi cetak 2 strip berdampingan dengan garis potong gunting (✂) persis seperti di photobooth sungguhan untuk dibagikan ke teman!
- **Print Langsung**: Terintegrasi dengan dialog printer browser.

---

## 🚀 Cara Menjalankan Website

Aplikasi ini dibuat secara mandiri (standalone) dengan HTML5, Tailwind CSS, dan JavaScript modern sehingga tidak memerlukan konfigurasi rumit.

### Opsi 1: Buka Langsung di Browser
Cukup klik ganda (double-click) file `index.html` di komputer Anda, maka photobooth langsung terbuka di browser favorit (Chrome, Edge, Firefox, Safari).

### Opsi 2: Menggunakan Local Server (Python / Node.js)
Jika ingin menggunakan localhost:

**Menggunakan Python:**
```bash
python -m http.server 3000
```
Lalu buka browser di `http://localhost:3000`.

**Menggunakan Vite (Node.js):**
```bash
npm install
npm run dev
```

---

## 📁 Struktur File

```
Photoboth Starmonlabs/
├── index.html            # Tampilan utama antarmuka Photobooth
├── package.json          # Konfigurasi dev runner
├── README.md             # Petunjuk lengkap penggunaan
├── css/
│   └── style.css         # Styling kustom, animasi flash, dan layout grid
└── js/
    ├── app.js            # Controller utama kamera, capture, dan state
    ├── frames.js         # Konfigurasi layout (2-6) dan tema frame lucu
    ├── stickers.js       # Katalog stiker dan logika drag-and-drop
    ├── audio.js          # Web Audio API sintetis (shutter, beep, pop)
    └── canvas-export.js  # Mesin render ekspor foto resolusi tinggi
```
