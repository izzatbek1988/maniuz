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
  "order_items": "Mahsulotlar",
  
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
  "order_items": "Ürünler",
  
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
  "order_items": "Товары",
  
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
