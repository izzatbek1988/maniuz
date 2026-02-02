const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin (requires service account credentials)
// For this script to work, you need to set GOOGLE_APPLICATION_CREDENTIALS env variable
// or provide credentials directly

let app;
try {
  app = initializeApp();
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.log('\nPlease set up Firebase Admin credentials:');
  console.log('1. Download service account JSON from Firebase Console');
  console.log('2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
  process.exit(1);
}

const db = getFirestore(app);

// Uzbek translations
const uzbekTranslations = {
  // Navigation
  "nav_home": "Bosh sahifa",
  "nav_products": "Mahsulotlar",
  "nav_cart": "Savat",
  "nav_orders": "Buyurtmalar",
  "nav_profile": "Profil",
  "nav_admin": "Admin Panel",
  "nav_login": "Kirish",
  "nav_register": "Ro'yxatdan o'tish",
  "nav_logout": "Chiqish",
  
  // Products
  "products_title": "Mahsulotlar",
  "products_empty": "Hozircha mahsulot yo'q",
  "product_add_to_cart": "Savatga qo'shish",
  "product_view_details": "Batafsil ko'rish",
  "product_stock": "Omborda",
  "product_price": "Narx",
  "product_description": "Ta'rif",
  "product_quantity": "Miqdor",
  "product_details": "Mahsulot tafsilotlari",
  "product_back": "Orqaga",
  
  // Cart
  "cart_title": "Savat",
  "cart_empty": "Savatchangiz bo'sh",
  "cart_total": "Jami",
  "cart_delivery_type": "Yetkazib berish turi",
  "cart_pickup": "O'zim olib ketaman",
  "cart_delivery": "Yetkazib berish kerak",
  "cart_complete_order": "Buyurtmani rasmiylashtirish",
  "cart_remove": "O'chirish",
  "cart_continue_shopping": "Xaridni davom ettirish",
  
  // Orders
  "orders_title": "Mening buyurtmalarim",
  "orders_empty": "Sizda hali buyurtmalar yo'q",
  "orders_date": "Sana",
  "orders_status": "Holati",
  "orders_total": "Summa",
  "orders_delivery": "Yetkazib berish",
  "order_status_pending": "Kutilmoqda",
  "order_status_preparing": "Tayyorlanmoqda",
  "order_status_delivering": "Yetkazilmoqda",
  "order_status_completed": "Bajarildi",
  "order_status_cancelled": "Bekor qilindi",
  "order_items": "Mahsulotlar",
  "order_number": "Buyurtma raqami",
  "order_date": "Sana",
  "my_orders": "Mening buyurtmalarim",
  "no_orders": "Hali buyurtmalar yo'q",
  "start_shopping": "Xarid qilishni boshlang",
  
  // Auth
  "login_title": "Kirish",
  "login_email": "Email",
  "login_password": "Parol",
  "login_button": "Kirish",
  "login_no_account": "Hisobingiz yo'qmi?",
  "login_error": "Xato yuz berdi",
  "register_title": "Ro'yxatdan o'tish",
  "register_name": "Ism",
  "register_button": "Ro'yxatdan o'tish",
  "register_have_account": "Hisobingiz bormi?",
  
  // Profile
  "profile_title": "Profil",
  "profile_name": "Ism",
  "profile_email": "Email",
  "profile_price_type": "Narx turi",
  "profile_role": "Rol",
  "profile_role_admin": "Administrator",
  "profile_role_customer": "Mijoz",
  
  // Product
  "product_not_found": "Mahsulot topilmadi",
  "product_pieces": "dona",
  "product_out_of_stock": "Stokda yo'q",
  "product_boxes": "koli",
  "cart_added": "Savatga qo'shildi",
  
  // Order
  "order_delivery_pickup": "O'zim olib ketaman",
  "order_delivery_address": "Yetkazib berish",
  
  // Validation
  "validation_password_mismatch": "Parollar mos kelmaydi",
  "validation_password_length": "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
  
  // Admin
  "admin_dashboard": "Boshqaruv paneli",
  "admin_products": "Mahsulotlar",
  "admin_customers": "Mijozlar",
  "admin_orders": "Buyurtmalar",
  "admin_price_types": "Narx turlari",
  "admin_translations": "Tarjimalar",
  "admin_add_product": "Mahsulot qo'shish",
  "admin_edit": "Tahrirlash",
  "admin_delete": "O'chirish",
  "admin_save": "Saqlash",
  "admin_cancel": "Bekor qilish",
  "admin_total_products": "Jami mahsulotlar",
  "admin_total_customers": "Jami mijozlar",
  "admin_total_orders": "Jami buyurtmalar",
  "admin_seed_data": "Ma'lumot qo'shish",
  "admin_home": "Bosh sahifa",
  "admin_partnerships": "Hamkorlik arizalari",
  "admin_view_details": "Batafsil",
  "admin_actions": "Amallar",
  "admin_delete_confirm": "O'chirishni tasdiqlaysizmi?",
  "admin_notes": "Admin izohi",
  "admin_notes_placeholder": "Bu ariza haqida izoh yozing...",
  "admin_notes_saved": "Izoh saqlandi",
  
  // Footer
  "footer_about": "Biz haqimizda",
  "footer_partnership": "Hamkorlik",
  "footer_contact": "Aloqa",
  "footer_terms": "Foydalanish shartlari",
  "footer_rights": "Barcha huquqlar himoyalangan",
  "footer_company": "Kompaniya",
  "footer_info": "Ma'lumot",
  
  // New Pages
  "about_title": "Biz haqimizda",
  "about_content": "Maniuz - sovuq va energetik ichimliklar sotuvchi yetakchi kompaniya.",
  "about_mission": "Missiyamiz",
  "about_vision": "Vizyonimiz",
  "about_why_us": "Nima uchun biz?",
  
  "partnership_title": "Biznes hamkorlik",
  "partnership_content": "Bizning hamkorimiz bo'ling va yuqori daromad oling!",
  "partnership_benefits": "Afzalliklar",
  "partnership_apply": "Ariza topshirish",
  "partnership_your_name": "Ismingiz",
  "partnership_your_email": "Email manzilingiz",
  "partnership_your_phone": "Telefon raqamingiz",
  "partnership_message": "Xabar",
  "partnership_submit": "Yuborish",
  "partnership_success": "Arizangiz muvaffaqiyatli yuborildi!",
  "partnership_name": "Ism",
  "partnership_email": "Email",
  "partnership_phone": "Telefon",
  "partnership_date": "Sana",
  "partnership_status": "Holati",
  "partnership_status_pending": "Kutilmoqda",
  "partnership_status_contacted": "Bog'lanildi",
  "partnership_status_approved": "Tasdiqlandi",
  "partnership_status_rejected": "Rad etildi",
  "partnership_no_applications": "Hozircha ariza yo'q",
  "partnership_application_details": "Ariza tafsilotlari",
  
  "contact_title": "Biz bilan bog'laning",
  "contact_phone": "Telefon",
  "contact_email": "Email",
  "contact_address": "Manzil",
  "contact_form_title": "Xabar yuboring",
  "contact_name": "Ismingiz",
  "contact_message": "Xabaringiz",
  "contact_send": "Yuborish",
  "contact_success": "Xabaringiz yuborildi!",
  
  // Common
  "loading": "Yuklanmoqda...",
  "error": "Xato",
  "success": "Muvaffaqiyatli",
  "close": "Yopish",
  "open": "Ochish",
  "search": "Qidirish",
  "filter": "Filtr",
  "sort": "Saralash",
  "all": "Hammasi",
  "view_price": "Narxni ko'rish uchun kiring",
  
  // Partnership benefits
  "partnership_benefit_1": "Raqobatbardosh foyda marjasi",
  "partnership_benefit_2": "Eksklyuziv hudud huquqlari",
  "partnership_benefit_3": "Marketing va reklama yordami",
  "partnership_benefit_4": "O'qitish va doimiy yordam",
  "partnership_benefit_5": "Moslashuvchan to'lov shartlari",
  
  // Admin Settings
  "admin_settings": "Sozlamalar",
  "settings_title": "Tizim sozlamalari",
  "settings_default_price_type": "Standart narx turi",
  "settings_save": "Saqlash",
  "settings_saved": "Saqlandi!",
  
  // About page content
  "about_mission_text": "Maniuz mijozlarimizga eng yuqori sifatli sovuq va energetik ichimliklar taqdim etishga intiladi. Biz chakana va ulgurji mijozlar ehtiyojlarini qondiradigan ajoyib xizmat va mahsulotlarni yetkazib berishga harakat qilamiz.",
  "about_vision_text": "Mintaqadagi sovuq va energetik ichimliklar yetkazib beruvchisining yetakchi kompaniyasiga aylanish, ishonchlilik, sifatli mahsulotlar va mukammal mijozlarga xizmat ko'rsatish bilan tanilish.",
  "about_why_us_1": "Yuqori sifatli sovuq va energetik ichimliklarning keng tanlovi",
  "about_why_us_2": "Turli mijozlar uchun moslashuvchan narx turlari bilan raqobatbardosh narxlar",
  "about_why_us_3": "Tez va ishonchli yetkazib berish xizmati",
  "about_why_us_4": "Ajoyib mijozlarga xizmat ko'rsatish",
  "about_why_us_5": "Qulaylik uchun onlayn buyurtma tizimi",
  
  // Currency
  "currency_symbol": "so'm",
  
  // Unit/Box Labels
  "unit_price": "Dona narxi",
  "box_price": "Quti narxi",
  "units": "dona",
  "unit": "Dona",
  "box": "Quti",
  
  // Cart Translations
  "cart_items": "mahsulot",
  "cart_summary": "Buyurtma xulosasi",
  "cart_removed": "o'chirildi",
  "cart_empty_description": "Savatingiz bo'sh. Mahsulotlarni ko'rib chiqing!",
  "product": "Mahsulot",
  "price": "Narx",
  "quantity": "Miqdor",
  "total": "Jami",
  "actions": "Amallar",
  "remove": "O'chirish",
  "clear_cart": "Savatni tozalash",
  "checkout": "Buyurtma berish",
  "subtotal": "Oraliq jami",
  "shipping": "Yetkazib berish",
  "calculated_at_checkout": "To'lovda hisoblanadi",
  "continue_shopping": "Xarid qilishni davom ettirish",
  
  // Toast Settings
  "toast_settings": "Bildirishnoma sozlamalari",
  "toast_position": "Bildirishnoma joylashuvi",
  "toast_duration": "Bildirishnoma davomiyligi",
  "top_right": "Yuqori o'ng",
  "top_left": "Yuqori chap",
  "bottom_right": "Pastki o'ng",
  "bottom_left": "Pastki chap",
  "second": "soniya", // Singular for 1 second
  "seconds": "soniya",
  "test_toast": "Sinab ko'rish",
  "test_message": "Bu test xabari!",
  "save_settings": "Saqlash",
  "settings_error": "Xatolik yuz berdi",
  "saving": "Saqlanmoqda...",
  
  // Navbar Tooltips
  "cart": "Savat",
  "profile": "Profil",
  "my_orders": "Buyurtmalarim",
  
  // Products Page
  "products_subtitle": "Eng sifatli mahsulotlarimiz bilan tanishing",
  "products_empty_description": "Hozircha mahsulotlar mavjud emas",
  "product_new": "Yangi",
  
  // About Page
  "nav_about": "Haqimizda",
  "nav_partnership": "Hamkorlik",
  "nav_my_account": "Mening hisobim",
  "order_success": "Buyurtma muvaffaqiyatli yaratildi!",
  
  // Contact Page - NEW ADDITIONS
  "contact_description": "Savol yoki takliflaringiz bormi? Biz bilan bog'laning!",
  "full_name": "To'liq ism",
  "email_address": "Elektron pochta",
  "phone_number": "Telefon raqami",
  "message": "Xabar",
  "send_message": "Xabar yuborish",
  "contact_info": "Aloqa ma'lumotlari",
  "address": "Manzil",
  "working_hours": "Ish vaqti",
  "monday_friday": "Dushanba - Juma",
  "saturday_sunday": "Shanba - Yakshanba",
  "sending": "Yuborilmoqda...",
  "message_sent": "Xabar yuborildi!",
  
  // Orders Page - NEW ADDITIONS
  "view_details": "Batafsil",
  "pending": "Kutilmoqda",
  "processing": "Qayta ishlanmoqda",
  "shipped": "Yuborildi",
  "delivered": "Yetkazildi",
  "cancelled": "Bekor qilindi",
  
  // Profile Page - NEW ADDITIONS
  "my_profile": "Mening profilim",
  "personal_info": "Shaxsiy ma'lumotlar",
  "edit_profile": "Profilni tahrirlash",
  "change_password": "Parolni o'zgartirish",
  "logout": "Chiqish",
  "save_changes": "O'zgarishlarni saqlash",
  
  // Admin Panel - NEW ADDITIONS
  "dashboard": "Boshqaruv paneli",
  "total_products": "Jami mahsulotlar",
  "total_orders": "Jami buyurtmalar",
  "total_customers": "Jami mijozlar",
  "revenue": "Daromad",
  "recent_orders": "So'nggi buyurtmalar",
  "low_stock_products": "Kam qolgan mahsulotlar",
  "add_product": "Mahsulot qo'shish",
  "edit_product": "Mahsulotni tahrirlash",
  "delete_product": "Mahsulotni o'chirish",
  "confirm_delete": "O'chirishni tasdiqlaysizmi?",
  "yes_delete": "Ha, o'chirish",
  "cancel": "Bekor qilish",
  
  // Form Validation - NEW ADDITIONS
  "field_required": "Bu maydon to'ldirilishi shart",
  "invalid_email": "Noto'g'ri email manzil",
  "invalid_phone": "Noto'g'ri telefon raqami",
  "password_min_length": "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
  "passwords_not_match": "Parollar mos kelmadi",
  
  // Success/Error Messages - NEW ADDITIONS
  "added_to_cart": "Savatga qo'shildi",
  "removed_from_cart": "Savatdan o'chirildi",
  "order_placed": "Buyurtma qabul qilindi",
  "profile_updated": "Profil yangilandi",
  "product_added": "Mahsulot qo'shildi",
  "product_updated": "Mahsulot yangilandi",
  "product_deleted": "Mahsulot o'chirildi",
};

// Turkish translations
const turkishTranslations = {
  // Navigation
  "nav_home": "Ana Sayfa",
  "nav_products": "Ürünler",
  "nav_cart": "Sepet",
  "nav_orders": "Siparişler",
  "nav_profile": "Profil",
  "nav_admin": "Admin Paneli",
  "nav_login": "Giriş Yap",
  "nav_register": "Kayıt Ol",
  "nav_logout": "Çıkış Yap",
  
  // Products
  "products_title": "Ürünler",
  "products_empty": "Henüz ürün yok",
  "product_add_to_cart": "Sepete Ekle",
  "product_view_details": "Detaylar",
  "product_stock": "Stok",
  "product_price": "Fiyat",
  "product_description": "Açıklama",
  "product_quantity": "Miktar",
  "product_details": "Ürün Detayları",
  "product_back": "Geri",
  
  // Cart
  "cart_title": "Sepet",
  "cart_empty": "Sepetiniz boş",
  "cart_total": "Toplam",
  "cart_delivery_type": "Teslimat Türü",
  "cart_pickup": "Kendim alacağım",
  "cart_delivery": "Teslimat gerekli",
  "cart_complete_order": "Siparişi Tamamla",
  "cart_remove": "Kaldır",
  "cart_continue_shopping": "Alışverişe Devam Et",
  
  // Orders
  "orders_title": "Siparişlerim",
  "orders_empty": "Henüz siparişiniz yok",
  "orders_date": "Tarih",
  "orders_status": "Durum",
  "orders_total": "Tutar",
  "orders_delivery": "Teslimat",
  "order_status_pending": "Beklemede",
  "order_status_preparing": "Hazırlanıyor",
  "order_status_delivering": "Teslim Ediliyor",
  "order_status_completed": "Tamamlandı",
  "order_status_cancelled": "İptal edildi",
  "order_items": "Ürünler",
  "order_number": "Sipariş numarası",
  "order_date": "Tarih",
  "my_orders": "Siparişlerim",
  "no_orders": "Henüz sipariş yok",
  "start_shopping": "Alışverişe başla",
  
  // Auth
  "login_title": "Giriş Yap",
  "login_email": "E-posta",
  "login_password": "Şifre",
  "login_button": "Giriş Yap",
  "login_no_account": "Hesabınız yok mu?",
  "login_error": "Hata oluştu",
  "register_title": "Kayıt Ol",
  "register_name": "İsim",
  "register_button": "Kayıt Ol",
  "register_have_account": "Hesabınız var mı?",
  
  // Profile
  "profile_title": "Profil",
  "profile_name": "İsim",
  "profile_email": "E-posta",
  "profile_price_type": "Fiyat Türü",
  "profile_role": "Rol",
  "profile_role_admin": "Yönetici",
  "profile_role_customer": "Müşteri",
  
  // Product
  "product_not_found": "Ürün bulunamadı",
  "product_pieces": "adet",
  "product_out_of_stock": "Stokta yok",
  "product_boxes": "koli",
  "cart_added": "Sepete eklendi",
  
  // Order
  "order_delivery_pickup": "Kendim alacağım",
  "order_delivery_address": "Teslimat",
  
  // Validation
  "validation_password_mismatch": "Şifreler eşleşmiyor",
  "validation_password_length": "Şifre en az 6 karakter olmalıdır",
  
  // Admin
  "admin_dashboard": "Kontrol Paneli",
  "admin_products": "Ürünler",
  "admin_customers": "Müşteriler",
  "admin_orders": "Siparişler",
  "admin_price_types": "Fiyat Türleri",
  "admin_translations": "Çeviriler",
  "admin_add_product": "Ürün Ekle",
  "admin_edit": "Düzenle",
  "admin_delete": "Sil",
  "admin_save": "Kaydet",
  "admin_cancel": "İptal",
  "admin_total_products": "Toplam Ürün",
  "admin_total_customers": "Toplam Müşteri",
  "admin_total_orders": "Toplam Sipariş",
  "admin_seed_data": "Veri Ekle",
  "admin_home": "Ana Sayfa",
  "admin_partnerships": "İş Ortaklığı Başvuruları",
  "admin_view_details": "Detaylar",
  "admin_actions": "İşlemler",
  "admin_delete_confirm": "Silmek istediğinizden emin misiniz?",
  "admin_notes": "Admin Notu",
  "admin_notes_placeholder": "Bu başvuru hakkında not yazın...",
  "admin_notes_saved": "Not kaydedildi",
  
  // Footer
  "footer_about": "Hakkımızda",
  "footer_partnership": "İş Ortaklığı",
  "footer_contact": "İletişim",
  "footer_terms": "Kullanım Şartları",
  "footer_rights": "Tüm hakları saklıdır",
  "footer_company": "Şirket",
  "footer_info": "Bilgi",
  
  // New Pages
  "about_title": "Hakkımızda",
  "about_content": "Maniuz - soğuk ve enerji içecekleri satan lider şirket.",
  "about_mission": "Misyonumuz",
  "about_vision": "Vizyonumuz",
  "about_why_us": "Neden Biz?",
  
  "partnership_title": "İş Ortaklığı",
  "partnership_content": "Ortağımız olun ve yüksek gelir elde edin!",
  "partnership_benefits": "Avantajlar",
  "partnership_apply": "Başvuru Yapın",
  "partnership_your_name": "Adınız",
  "partnership_your_email": "E-posta Adresiniz",
  "partnership_your_phone": "Telefon Numaranız",
  "partnership_message": "Mesaj",
  "partnership_submit": "Gönder",
  "partnership_success": "Başvurunuz başarıyla gönderildi!",
  "partnership_name": "Ad",
  "partnership_email": "E-posta",
  "partnership_phone": "Telefon",
  "partnership_date": "Tarih",
  "partnership_status": "Durum",
  "partnership_status_pending": "Beklemede",
  "partnership_status_contacted": "Görüşüldü",
  "partnership_status_approved": "Onaylandı",
  "partnership_status_rejected": "Reddedildi",
  "partnership_no_applications": "Henüz başvuru yok",
  "partnership_application_details": "Başvuru Detayları",
  
  "contact_title": "Bize Ulaşın",
  "contact_phone": "Telefon",
  "contact_email": "E-posta",
  "contact_address": "Adres",
  "contact_form_title": "Mesaj Gönderin",
  "contact_name": "Adınız",
  "contact_message": "Mesajınız",
  "contact_send": "Gönder",
  "contact_success": "Mesajınız gönderildi!",
  
  // Common
  "loading": "Yükleniyor...",
  "error": "Hata",
  "success": "Başarılı",
  "close": "Kapat",
  "open": "Aç",
  "search": "Ara",
  "filter": "Filtre",
  "sort": "Sırala",
  "all": "Tümü",
  "view_price": "Fiyat görmek için giriş yapın",
  
  // Partnership benefits
  "partnership_benefit_1": "Rekabetçi kar marjları",
  "partnership_benefit_2": "Özel bölge hakları",
  "partnership_benefit_3": "Pazarlama ve promosyon desteği",
  "partnership_benefit_4": "Eğitim ve sürekli destek",
  "partnership_benefit_5": "Esnek ödeme koşulları",
  
  // Admin Settings
  "admin_settings": "Ayarlar",
  "settings_title": "Sistem Ayarları",
  "settings_default_price_type": "Varsayılan fiyat türü",
  "settings_save": "Kaydet",
  "settings_saved": "Kaydedildi!",
  
  // About page content
  "about_mission_text": "Maniuz, müşterilerimize en yüksek kaliteli soğuk ve enerji içeceklerini sunmayı taahhüt eder. Hem perakende hem de toptan müşterilerin ihtiyaçlarını karşılayan olağanüstü hizmet ve ürünler sunmaya çalışıyoruz.",
  "about_vision_text": "Bölgedeki soğuk ve enerji içecekleri distribütörlerinin lider şirketi olmak, güvenilirlik, kaliteli ürünler ve olağanüstü müşteri hizmeti ile tanınmak.",
  "about_why_us_1": "Premium soğuk ve enerji içeceklerinin geniş seçimi",
  "about_why_us_2": "Farklı müşteri segmentleri için esnek fiyat türleri ile rekabetçi fiyatlandırma",
  "about_why_us_3": "Hızlı ve güvenilir teslimat hizmeti",
  "about_why_us_4": "Mükemmel müşteri desteği",
  "about_why_us_5": "Kolaylık için online sipariş sistemi",
  
  // Currency
  "currency_symbol": "₺",
  
  // Unit/Box Labels
  "unit_price": "Adet fiyatı",
  "box_price": "Koli fiyatı",
  "units": "adet",
  "unit": "Adet",
  "box": "Koli",
  
  // Cart Translations
  "cart_items": "ürün",
  "cart_summary": "Sipariş özeti",
  "cart_removed": "kaldırıldı",
  "cart_empty_description": "Sepetiniz boş. Ürünlere göz atın!",
  "product": "Ürün",
  "price": "Fiyat",
  "quantity": "Miktar",
  "total": "Toplam",
  "actions": "İşlemler",
  "remove": "Kaldır",
  "clear_cart": "Sepeti temizle",
  "checkout": "Sipariş ver",
  "subtotal": "Ara toplam",
  "shipping": "Kargo",
  "calculated_at_checkout": "Ödemede hesaplanır",
  "continue_shopping": "Alışverişe devam et",
  
  // Toast Settings
  "toast_settings": "Bildirim ayarları",
  "toast_position": "Bildirim konumu",
  "toast_duration": "Bildirim süresi",
  "top_right": "Sağ üst",
  "top_left": "Sol üst",
  "bottom_right": "Sağ alt",
  "bottom_left": "Sol alt",
  "second": "saniye", // Singular for 1 second
  "seconds": "saniye",
  "test_toast": "Test et",
  "test_message": "Bu bir test mesajıdır!",
  "save_settings": "Kaydet",
  "settings_error": "Hata oluştu",
  "saving": "Kaydediliyor...",
  
  // Navbar Tooltips
  "cart": "Sepet",
  "profile": "Profil",
  "my_orders": "Siparişlerim",
  
  // Products Page
  "products_subtitle": "En kaliteli ürünlerimizle tanışın",
  "products_empty_description": "Şu anda ürün bulunmamaktadır",
  "product_new": "Yeni",
  
  // About Page
  "nav_about": "Hakkımızda",
  "nav_partnership": "İş Ortaklığı",
  "nav_my_account": "Hesabım",
  "order_success": "Sipariş başarıyla oluşturuldu!",
  
  // Contact Page - NEW ADDITIONS
  "contact_description": "Sorularınız veya önerileriniz mi var? Bizimle iletişime geçin!",
  "full_name": "Tam adınız",
  "email_address": "E-posta adresi",
  "phone_number": "Telefon numarası",
  "message": "Mesaj",
  "send_message": "Mesaj gönder",
  "contact_info": "İletişim bilgileri",
  "address": "Adres",
  "working_hours": "Çalışma saatleri",
  "monday_friday": "Pazartesi - Cuma",
  "saturday_sunday": "Cumartesi - Pazar",
  "sending": "Gönderiliyor...",
  "message_sent": "Mesaj gönderildi!",
  
  // Orders Page - NEW ADDITIONS
  "view_details": "Detaylar",
  "pending": "Beklemede",
  "processing": "İşleniyor",
  "shipped": "Kargoya verildi",
  "delivered": "Teslim edildi",
  "cancelled": "İptal edildi",
  
  // Profile Page - NEW ADDITIONS
  "my_profile": "Profilim",
  "personal_info": "Kişisel bilgiler",
  "edit_profile": "Profili düzenle",
  "change_password": "Şifre değiştir",
  "logout": "Çıkış yap",
  "save_changes": "Değişiklikleri kaydet",
  
  // Admin Panel - NEW ADDITIONS
  "dashboard": "Kontrol paneli",
  "total_products": "Toplam ürün",
  "total_orders": "Toplam sipariş",
  "total_customers": "Toplam müşteri",
  "revenue": "Gelir",
  "recent_orders": "Son siparişler",
  "low_stock_products": "Stok azalan ürünler",
  "add_product": "Ürün ekle",
  "edit_product": "Ürünü düzenle",
  "delete_product": "Ürünü sil",
  "confirm_delete": "Silmek istediğinizden emin misiniz?",
  "yes_delete": "Evet, sil",
  "cancel": "İptal",
  
  // Form Validation - NEW ADDITIONS
  "field_required": "Bu alan zorunludur",
  "invalid_email": "Geçersiz e-posta adresi",
  "invalid_phone": "Geçersiz telefon numarası",
  "password_min_length": "Şifre en az 6 karakter olmalıdır",
  "passwords_not_match": "Şifreler eşleşmiyor",
  
  // Success/Error Messages - NEW ADDITIONS
  "added_to_cart": "Sepete eklendi",
  "removed_from_cart": "Sepetten çıkarıldı",
  "order_placed": "Sipariş alındı",
  "profile_updated": "Profil güncellendi",
  "product_added": "Ürün eklendi",
  "product_updated": "Ürün güncellendi",
  "product_deleted": "Ürün silindi",
};

// Russian translations
const russianTranslations = {
  // Navigation
  "nav_home": "Главная",
  "nav_products": "Товары",
  "nav_cart": "Корзина",
  "nav_orders": "Заказы",
  "nav_profile": "Профиль",
  "nav_admin": "Админ Панель",
  "nav_login": "Войти",
  "nav_register": "Регистрация",
  "nav_logout": "Выйти",
  
  // Products
  "products_title": "Товары",
  "products_empty": "Пока нет товаров",
  "product_add_to_cart": "Добавить в корзину",
  "product_view_details": "Подробности",
  "product_stock": "На складе",
  "product_price": "Цена",
  "product_description": "Описание",
  "product_quantity": "Количество",
  "product_details": "Информация о товаре",
  "product_back": "Назад",
  
  // Cart
  "cart_title": "Корзина",
  "cart_empty": "Ваша корзина пуста",
  "cart_total": "Итого",
  "cart_delivery_type": "Тип доставки",
  "cart_pickup": "Самовывоз",
  "cart_delivery": "Доставка",
  "cart_complete_order": "Оформить заказ",
  "cart_remove": "Удалить",
  "cart_continue_shopping": "Продолжить покупки",
  
  // Orders
  "orders_title": "Мои заказы",
  "orders_empty": "У вас пока нет заказов",
  "orders_date": "Дата",
  "orders_status": "Статус",
  "orders_total": "Сумма",
  "orders_delivery": "Доставка",
  "order_status_pending": "Ожидание",
  "order_status_preparing": "Готовится",
  "order_status_delivering": "Доставляется",
  "order_status_completed": "Выполнен",
  "order_status_cancelled": "Отменен",
  "order_items": "Товары",
  "order_number": "Номер заказа",
  "order_date": "Дата",
  "my_orders": "Мои заказы",
  "no_orders": "Заказов пока нет",
  "start_shopping": "Начать покупки",
  
  // Auth
  "login_title": "Войти",
  "login_email": "Email",
  "login_password": "Пароль",
  "login_button": "Войти",
  "login_no_account": "Нет аккаунта?",
  "login_error": "Произошла ошибка",
  "register_title": "Регистрация",
  "register_name": "Имя",
  "register_button": "Зарегистрироваться",
  "register_have_account": "Уже есть аккаунт?",
  
  // Profile
  "profile_title": "Профиль",
  "profile_name": "Имя",
  "profile_email": "Email",
  "profile_price_type": "Тип цены",
  "profile_role": "Роль",
  "profile_role_admin": "Администратор",
  "profile_role_customer": "Клиент",
  
  // Product
  "product_not_found": "Товар не найден",
  "product_pieces": "шт",
  "product_out_of_stock": "Нет в наличии",
  "product_boxes": "коробка",
  "cart_added": "Добавлено в корзину",
  
  // Order
  "order_delivery_pickup": "Самовывоз",
  "order_delivery_address": "Доставка",
  
  // Validation
  "validation_password_mismatch": "Пароли не совпадают",
  "validation_password_length": "Пароль должен быть не менее 6 символов",
  
  // Admin
  "admin_dashboard": "Панель управления",
  "admin_products": "Товары",
  "admin_customers": "Клиенты",
  "admin_orders": "Заказы",
  "admin_price_types": "Типы цен",
  "admin_translations": "Переводы",
  "admin_add_product": "Добавить товар",
  "admin_edit": "Редактировать",
  "admin_delete": "Удалить",
  "admin_save": "Сохранить",
  "admin_cancel": "Отмена",
  "admin_total_products": "Всего товаров",
  "admin_total_customers": "Всего клиентов",
  "admin_total_orders": "Всего заказов",
  "admin_seed_data": "Добавить данные",
  "admin_home": "Главная",
  "admin_partnerships": "Заявки на партнёрство",
  "admin_view_details": "Подробнее",
  "admin_actions": "Действия",
  "admin_delete_confirm": "Вы уверены, что хотите удалить?",
  "admin_notes": "Заметка администратора",
  "admin_notes_placeholder": "Напишите заметку об этой заявке...",
  "admin_notes_saved": "Заметка сохранена",
  
  // Footer
  "footer_about": "О нас",
  "footer_partnership": "Сотрудничество",
  "footer_contact": "Контакты",
  "footer_terms": "Условия использования",
  "footer_rights": "Все права защищены",
  "footer_company": "Компания",
  "footer_info": "Информация",
  
  // New Pages
  "about_title": "О нас",
  "about_content": "Maniuz - ведущая компания по продаже холодных и энергетических напитков.",
  "about_mission": "Наша миссия",
  "about_vision": "Наше видение",
  "about_why_us": "Почему мы?",
  
  "partnership_title": "Бизнес партнерство",
  "partnership_content": "Станьте нашим партнером и получайте высокий доход!",
  "partnership_benefits": "Преимущества",
  "partnership_apply": "Подать заявку",
  "partnership_your_name": "Ваше имя",
  "partnership_your_email": "Ваш email",
  "partnership_your_phone": "Ваш телефон",
  "partnership_message": "Сообщение",
  "partnership_submit": "Отправить",
  "partnership_success": "Ваша заявка успешно отправлена!",
  "partnership_name": "Имя",
  "partnership_email": "Email",
  "partnership_phone": "Телефон",
  "partnership_date": "Дата",
  "partnership_status": "Статус",
  "partnership_status_pending": "Ожидает",
  "partnership_status_contacted": "Связались",
  "partnership_status_approved": "Одобрено",
  "partnership_status_rejected": "Отклонено",
  "partnership_no_applications": "Пока нет заявок",
  "partnership_application_details": "Детали заявки",
  
  "contact_title": "Свяжитесь с нами",
  "contact_phone": "Телефон",
  "contact_email": "Email",
  "contact_address": "Адрес",
  "contact_form_title": "Отправить сообщение",
  "contact_name": "Ваше имя",
  "contact_message": "Ваше сообщение",
  "contact_send": "Отправить",
  "contact_success": "Ваше сообщение отправлено!",
  
  // Common
  "loading": "Загрузка...",
  "error": "Ошибка",
  "success": "Успешно",
  "close": "Закрыть",
  "open": "Открыть",
  "search": "Поиск",
  "filter": "Фильтр",
  "sort": "Сортировка",
  "all": "Все",
  "view_price": "Войдите, чтобы увидеть цену",
  
  // Partnership benefits
  "partnership_benefit_1": "Конкурентная прибыль",
  "partnership_benefit_2": "Эксклюзивные территориальные права",
  "partnership_benefit_3": "Маркетинговая и рекламная поддержка",
  "partnership_benefit_4": "Обучение и постоянная поддержка",
  "partnership_benefit_5": "Гибкие условия оплаты",
  
  // Admin Settings
  "admin_settings": "Настройки",
  "settings_title": "Системные настройки",
  "settings_default_price_type": "Тип цены по умолчанию",
  "settings_save": "Сохранить",
  "settings_saved": "Сохранено!",
  
  // About page content
  "about_mission_text": "Maniuz стремится предоставлять нашим клиентам холодные и энергетические напитки высочайшего качества. Мы стремимся предоставлять исключительный сервис и продукты, которые отвечают потребностям как розничных, так и оптовых клиентов.",
  "about_vision_text": "Стать ведущим дистрибьютором холодных и энергетических напитков в регионе, известным своей надежностью, качественными продуктами и исключительным обслуживанием клиентов.",
  "about_why_us_1": "Широкий выбор премиальных холодных и энергетических напитков",
  "about_why_us_2": "Конкурентные цены с гибкими типами цен для различных сегментов клиентов",
  "about_why_us_3": "Быстрая и надежная служба доставки",
  "about_why_us_4": "Отличная поддержка клиентов",
  "about_why_us_5": "Онлайн-система заказов для удобства",
  
  // Currency
  "currency_symbol": "сум",
  
  // Unit/Box Labels
  "unit_price": "Цена за штуку",
  "box_price": "Цена за коробку",
  "units": "штук",
  "unit": "Штук",
  "box": "Коробка",
  
  // Cart Translations
  "cart_items": "товар",
  "cart_summary": "Итоги заказа",
  "cart_removed": "удалено",
  "cart_empty_description": "Ваша корзина пуста. Посмотрите товары!",
  "product": "Товар",
  "price": "Цена",
  "quantity": "Количество",
  "total": "Итого",
  "actions": "Действия",
  "remove": "Удалить",
  "clear_cart": "Очистить корзину",
  "checkout": "Оформить заказ",
  "subtotal": "Промежуточный итог",
  "shipping": "Доставка",
  "calculated_at_checkout": "Рассчитывается при оплате",
  "continue_shopping": "Продолжить покупки",
  
  // Toast Settings
  "toast_settings": "Настройки уведомлений",
  "toast_position": "Позиция уведомлений",
  "toast_duration": "Длительность уведомлений",
  "top_right": "Верхний правый",
  "top_left": "Верхний левый",
  "bottom_right": "Нижний правый",
  "bottom_left": "Нижний левый",
  "second": "секунда", // Singular for 1 second
  "seconds": "секунд",
  "test_toast": "Тест",
  "test_message": "Это тестовое сообщение!",
  "save_settings": "Сохранить",
  "settings_error": "Произошла ошибка",
  "saving": "Сохранение...",
  
  // Navbar Tooltips
  "cart": "Корзина",
  "profile": "Профиль",
  "my_orders": "Мои заказы",
  
  // Products Page
  "products_subtitle": "Познакомьтесь с нашими лучшими товарами",
  "products_empty_description": "Пока нет товаров",
  "product_new": "Новое",
  
  // About Page
  "nav_about": "О нас",
  "nav_partnership": "Партнёрство",
  "nav_my_account": "Мой аккаунт",
  "order_success": "Заказ успешно создан!",
  
  // Contact Page - NEW ADDITIONS
  "contact_description": "Есть вопросы или предложения? Свяжитесь с нами!",
  "full_name": "Полное имя",
  "email_address": "Адрес электронной почты",
  "phone_number": "Номер телефона",
  "message": "Сообщение",
  "send_message": "Отправить сообщение",
  "contact_info": "Контактная информация",
  "address": "Адрес",
  "working_hours": "Часы работы",
  "monday_friday": "Понедельник - Пятница",
  "saturday_sunday": "Суббота - Воскресенье",
  "sending": "Отправка...",
  "message_sent": "Сообщение отправлено!",
  
  // Orders Page - NEW ADDITIONS
  "view_details": "Подробнее",
  "pending": "Ожидает",
  "processing": "Обрабатывается",
  "shipped": "Отправлено",
  "delivered": "Доставлено",
  "cancelled": "Отменено",
  
  // Profile Page - NEW ADDITIONS
  "my_profile": "Мой профиль",
  "personal_info": "Личная информация",
  "edit_profile": "Редактировать профиль",
  "change_password": "Изменить пароль",
  "logout": "Выйти",
  "save_changes": "Сохранить изменения",
  
  // Admin Panel - NEW ADDITIONS
  "dashboard": "Панель управления",
  "total_products": "Всего товаров",
  "total_orders": "Всего заказов",
  "total_customers": "Всего клиентов",
  "revenue": "Доход",
  "recent_orders": "Последние заказы",
  "low_stock_products": "Товары с низким запасом",
  "add_product": "Добавить товар",
  "edit_product": "Редактировать товар",
  "delete_product": "Удалить товар",
  "confirm_delete": "Вы уверены, что хотите удалить?",
  "yes_delete": "Да, удалить",
  "cancel": "Отмена",
  
  // Form Validation - NEW ADDITIONS
  "field_required": "Это поле обязательно",
  "invalid_email": "Недействительный адрес электронной почты",
  "invalid_phone": "Недействительный номер телефона",
  "password_min_length": "Пароль должен содержать не менее 6 символов",
  "passwords_not_match": "Пароли не совпадают",
  
  // Success/Error Messages - NEW ADDITIONS
  "added_to_cart": "Добавлено в корзину",
  "removed_from_cart": "Удалено из корзины",
  "order_placed": "Заказ принят",
  "profile_updated": "Профиль обновлен",
  "product_added": "Товар добавлен",
  "product_updated": "Товар обновлен",
  "product_deleted": "Товар удален",
};

async function seedTranslations() {
  try {
    console.log('Starting translation seeding...');

    // Seed Uzbek translations
    await db.collection('translations').doc('uz').set(uzbekTranslations);
    console.log('✓ Uzbek translations seeded');

    // Seed Turkish translations
    await db.collection('translations').doc('tr').set(turkishTranslations);
    console.log('✓ Turkish translations seeded');

    // Seed Russian translations
    await db.collection('translations').doc('ru').set(russianTranslations);
    console.log('✓ Russian translations seeded');

    console.log('\n✓ All translations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding translations:', error);
    process.exit(1);
  }
}

seedTranslations();
