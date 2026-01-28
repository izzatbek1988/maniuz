# Maniuz E-Ticaret - Soğuk İçecekler ve Enerji İçecekleri

Tam özellikli, modern bir e-ticaret platformu. Next.js 14, TypeScript, Firebase ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

### Müşteri Özellikleri
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Kullanıcıya özel fiyatlandırma (fiyat tipleri)
- ✅ Alışveriş sepeti yönetimi
- ✅ Sipariş oluşturma (teslimat tipi seçimi ile)
- ✅ Sipariş geçmişi
- ✅ Kullanıcı profili
- ✅ Responsive tasarım (mobil, tablet, desktop)

### Admin Panel Özellikleri
- ✅ Dashboard (istatistikler)
- ✅ Ürün yönetimi (CRUD)
- ✅ Müşteri yönetimi
- ✅ Sipariş yönetimi (durum güncelleme)
- ✅ Fiyat tipi yönetimi
- ✅ Admin yetkilendirmesi

### Güvenlik
- ✅ Firebase Authentication
- ✅ Firestore Security Rules
- ✅ Role-based access control (Admin/Customer)

## 🛠️ Teknoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **State Management:** Zustand
- **Form Validation:** React Hook Form + Zod

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Firebase projesi

## 🔧 Kurulum

### 1. Repository'yi Klonlayın

```bash
git clone <repository-url>
cd maniuz
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Yeni bir proje oluşturun
3. Firestore Database'i etkinleştirin (Test mode ile başlayabilirsiniz)
4. Authentication'ı etkinleştirin ve Email/Password provider'ını aktif edin
5. Proje ayarlarından Web app yapılandırma bilgilerini alın

### 4. Environment Variables Ayarlayın

`.env.example` dosyasını `.env.local` olarak kopyalayın ve Firebase bilgilerinizi girin:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_ADMIN_EMAIL=admin@maniuz.com
```

### 5. Firestore Security Rules Ayarlayın

`firestore.rules` dosyasındaki kuralları Firebase Console'dan Firestore'a yükleyin:

1. Firebase Console > Firestore Database > Rules
2. `firestore.rules` dosyasının içeriğini kopyalayıp yapıştırın
3. Publish butonuna tıklayın

### 6. İlk Admin Kullanıcıyı Oluşturun

1. Uygulamayı başlatın (adım 7)
2. `/register` sayfasından `.env.local` dosyasında tanımladığınız admin email ile kayıt olun
3. Bu kullanıcı otomatik olarak admin rolü alacaktır

### 7. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📊 İlk Veri Girişi

### Otomatik Veri Ekleme (Önerilen)

1. Admin paneline giriş yapın (`/admin`)
2. Sol menüden "Veri Ekle" seçeneğine tıklayın
3. "Örnek Verileri Ekle" butonuna tıklayın
4. Sistem otomatik olarak:
   - 3 fiyat tipi (Perakende, Toptan, VIP)
   - 6 örnek ürün (içecekler) ekleyecektir

### Manuel Veri Ekleme

#### Fiyat Tiplerini Oluşturun

1. Admin paneline giriş yapın (`/admin`)
2. "Fiyat Tipleri" menüsüne gidin
3. En az bir fiyat tipi oluşturun (örn: "Perakende", "Toptan", "VIP")

#### Ürün Ekleyin

1. Admin panelinde "Ürünler" menüsüne gidin
2. "Yeni Ürün" butonuna tıklayın
3. Ürün bilgilerini girin
4. Her fiyat tipi için fiyat belirleyin
5. Kaydedin

## 🗺️ Sayfa Yapısı

```
/                    -> Ana sayfa (ürün listesi)
/login               -> Giriş sayfası
/register            -> Kayıt sayfası
/product/[id]        -> Ürün detay sayfası
/cart                -> Sepet sayfası
/orders              -> Siparişlerim
/profile             -> Profil sayfası

/admin               -> Admin dashboard
/admin/products      -> Ürün yönetimi
/admin/customers     -> Müşteri yönetimi
/admin/orders        -> Sipariş yönetimi
/admin/price-types   -> Fiyat tipi yönetimi
```

## 💾 Veri Yapısı

### Products Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stock: number;
  prices: {
    [priceTypeId: string]: number;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Customers Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  priceTypeId: string;
  role: 'admin' | 'customer';
  createdAt: timestamp;
}
```

### Orders Collection
```typescript
{
  id: string;
  customerId: string;
  customerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryType: 'pickup' | 'delivery';
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  createdAt: timestamp;
}
```

### PriceTypes Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  createdAt: timestamp;
}
```

## 🔐 Güvenlik Kuralları

Firestore güvenlik kuralları şunları sağlar:

- ✅ Herkes ürünleri ve fiyat tiplerini okuyabilir
- ✅ Sadece admin'ler ürün, müşteri ve fiyat tipi ekleyebilir/düzenleyebilir
- ✅ Kullanıcılar sadece kendi siparişlerini görebilir
- ✅ Admin'ler tüm siparişleri görebilir ve durumlarını güncelleyebilir
- ✅ Kullanıcılar sadece kendi profillerini görebilir

## 🎨 UI/UX

- Modern ve temiz tasarım
- Shadcn/UI component library
- Responsive layout (mobil first)
- Loading states
- Error handling
- Kullanıcı dostu bildirimler

## 📱 Mobil Uyumluluk

Uygulama tamamen responsive ve mobil uyumludur:
- Mobil cihazlarda optimize edilmiş layout
- Touch-friendly butonlar ve form elemanları
- Responsive navigation

## 🚀 Production Deployment

### Vercel (Önerilen)

1. GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınızla bağlanın
3. Repository'yi import edin
4. Environment variables'ları ekleyin
5. Deploy edin

### Diğer Platformlar

Next.js uygulamaları Node.js destekleyen herhangi bir platformda çalıştırılabilir:
- Netlify
- AWS
- Google Cloud
- Azure

## 📝 Önemli Notlar

- **Ödeme Sistemi Yok:** Bu uygulama ödeme entegrasyonu içermez. Siparişler sadece kayıt edilir.
- **İlk Admin:** `.env.local` dosyasında tanımlanan email ile kayıt olan ilk kullanıcı otomatik admin olur.
- **Fiyat Tipleri:** Yeni müşteriler kaydolduğunda ilk fiyat tipi otomatik atanır.

## 🐛 Sorun Giderme

### Firebase Bağlantı Hatası
- `.env.local` dosyasındaki Firebase ayarlarını kontrol edin
- Firebase console'da Web app'inizin doğru yapılandırıldığından emin olun

### Admin Paneline Erişemiyorum
- `.env.local` dosyasındaki `NEXT_PUBLIC_ADMIN_EMAIL` ile kayıt olduğunuzdan emin olun
- Firestore'da customers koleksiyonunda kullanıcınızın `role` alanının 'admin' olduğunu kontrol edin

### Ürünler Görünmüyor
- Firestore'da products koleksiyonunun oluşturulduğundan emin olun
- Admin panelinden en az bir ürün ekleyin

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için lütfen önce bir issue açarak neyi değiştirmek istediğinizi tartışın.

## 📧 İletişim

Sorularınız için lütfen bir issue açın.
