# Stock Manager

Stock Manager, mağaza ürün stoklarını web tabanlı bir panel üzerinden yönetmek için hazırlanmış basit ve kullanışlı bir stok yönetim uygulamasıdır. Uygulama HTML, CSS ve JavaScript ile geliştirilmiştir; herhangi bir sunucuya ihtiyaç duymadan doğrudan tarayıcıda çalışır.

## Ne İşe Yarar?

Bu uygulama ile mağazadaki ürünleri listeleyebilir, yeni ürün ekleyebilir, ürün silebilir ve satış işlemi yapabilirsiniz. Satış yapıldığında ilgili ürünün stok miktarı otomatik olarak azalır. Stok miktarı `0` olan ürünlerde satış yapılamaz.

Uygulama ayrıca satışlardan elde edilen toplam kazancı ve hangi üründen kaç adet satıldığını gösterir. Böylece hem mevcut stok durumunu hem de satış performansını tek ekrandan takip etmek mümkündür.

## Özellikler

- Ürün ekleme
- Ürünleri tablo halinde listeleme
- Ürün silme
- Satış yapma
- Satış yapıldığında stok miktarını otomatik azaltma
- Stok `0` olduğunda satış işlemini engelleme
- Toplam ürün sayısını gösterme
- Toplam stok miktarını gösterme
- Mevcut stok değerini hesaplama
- Kazanılan toplam parayı gösterme
- Hangi üründen kaç adet satıldığını listeleme
- Verileri tarayıcı `localStorage` alanında saklama
- Sayfa yenilense bile verileri koruma
- Modern dashboard tasarımı

## Kullanılan Teknolojiler

- HTML
- CSS
- JavaScript
- Browser localStorage

## Nasıl Çalıştırılır?

Projeyi çalıştırmak için ek bir kurulum gerekmez.

1. Proje klasörünü açın.
2. `index.html` dosyasını tarayıcıda çalıştırın.
3. Ürün ekleyerek stok yönetimine başlayın.

## Dosya Yapısı

```text
StockManager/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Veriler Nasıl Saklanır?

Uygulamadaki ürünler, satış bilgileri ve kazanılan para tarayıcının `localStorage` alanında saklanır. Bu sayede sayfa yenilendiğinde veya tarayıcı kapatılıp tekrar açıldığında kayıtlı veriler korunur.

Veriler yalnızca kullanılan tarayıcıda tutulur. Farklı bir tarayıcıda veya farklı bir cihazda aynı veriler otomatik olarak görünmez.

## Kullanım Akışı

1. Sol menüden `Ürün Ekle` bölümüne girin.
2. Ürün adı, fiyat ve stok miktarı bilgilerini doldurun.
3. `Ürün Ekle` butonuna basarak ürünü listeye ekleyin.
4. `Ürünler` bölümünde ürünleri görüntüleyin.
5. Bir ürün satıldığında `Satış Yap` butonuna basın.
6. Satış sonrası stok miktarı azalır ve kazanılan para artar.
7. `Özet` bölümünden toplam stok, stok değeri, kazanılan para ve ürün bazlı satış sayılarını takip edin.

## Proje Amacı

Bu proje, C# ile geliştirilen temel bir stok yönetim sisteminin web arayüzüne dönüştürülmüş halidir. Amaç, stok işlemlerini sayfa yenilenmeden dinamik olarak yapabilen, sade ve kurumsal görünüme sahip bir mağaza yönetim paneli oluşturmaktır.
