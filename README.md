# 🐉 SlangLingo — Kuiz Slang Melayu ➜ Mandarin

App web kuiz gaya Duolingo untuk belajar padanan Mandarin bagi slang Melayu.

## Ciri-ciri
- **4 pelajaran** (Perasaan, Kawan & Gosip, Kehidupan Harian, Ungkapan Popular) + **Cabaran Rawak**
- **3 jenis soalan pilihan jawapan**: Melayu ➜ Mandarin, Mandarin ➜ Melayu, dan 🔊 dengar sebutan
- **Skor XP**: +10 setiap jawapan betul, bonus +5 bila 3 betul berturut-turut (combo 🔥)
- **❤️ 5 nyawa**: jawapan salah tolak satu nyawa, dan soalan itu diulang di hujung
- Bar kemajuan, bunyi, panel maklum balas hijau/merah, ulang kaji jawapan salah
- **Streak harian 🔥, jumlah XP dan skor terbaik** disimpan dalam browser (localStorage)
- Pintasan papan kekunci: `1`–`4` pilih jawapan, `Enter` semak / teruskan

## Cara guna
Buka `index.html` terus dalam browser — tiada pemasangan diperlukan.

Atau jalankan pelayan tempatan: `npm start`

## Ujian
```bash
npm test
```
Menguji integriti data (tiada slang berulang) dan logik kuiz (pilihan unik, XP, combo, nyawa).

## Struktur
| Fail | Fungsi |
|------|--------|
| `js/data.js` | Senarai slang (Melayu, aksara Cina, pinyin, maksud) — tambah slang baharu di sini |
| `js/quiz.js` | Logik kuiz tulen (tiada DOM), boleh diuji dengan Node |
| `js/app.js` | Antara muka: skrin, butang, simpanan kemajuan |
| `css/style.css` | Gaya visual ala Duolingo |
| `tests/` | Ujian automatik (`node --test`) |
