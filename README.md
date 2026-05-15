# İşlem Defteri

Sanal trading + ekonomi öğrenme defteri. PWA olarak telefona kurulabilir.

## Özellikler

- Açık pozisyon takibi (BIST + NASDAQ + NYSE)
- Zorunlu tez alanı (sezgi ile işlem açamazsın)
- Kapatma post-mortem'i: çıkış sebebi, tezin doğru muydu, ne öğrendin
- 4-quadrant karar kalitesi analizi (skill / unlucky / lucky / lesson)
- Türkiye 2026 vergi/komisyon hesabı (BIST stopajsız, yurtdışı kazanç vergisi)
- 30 günlük rotasyonlu ekonomi/finans kavramı eğitimi
- 30 terimlik sözlük
- LocalStorage'da kalıcı veri
- Çevrimdışı çalışır (Service Worker)

## Vercel Deploy

```bash
cd C:\Users\uysal\islem-defteri
git init
git add .
git commit -m "init"
gh repo create islem-defteri --public --source=. --remote=origin --push
```

Sonra vercel.com → Add New Project → repo'yu seç → Deploy.

## Telefona Kurulum

- iPhone: Safari'de URL'yi aç → Paylaş → "Ana Ekrana Ekle"
- Android: Chrome'da URL'yi aç → menüden "Uygulamayı Yükle"
