# Express Practice - Student Management API

Bu proje, Express.js ve MongoDB kullanarak öğrenci yönetimi için RESTful API geliştirme pratiği yapmak amacıyla oluşturulmuştur.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [API Endpoints](#api-endpoints)
- [Proje Yapısı](#proje-yapısı)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Geliştirme](#geliştirme)

## ✨ Özellikler

- RESTful API mimarisi
- MongoDB ile veri yönetimi
- Mongoose ODM kullanımı
- Express.js middleware'leri
- CORS desteği
- Pino logger ile loglama
- Modüler proje yapısı
- ES6 modules kullanımı

## 🛠 Teknolojiler

- **Node.js** - JavaScript runtime
- **Express.js v5.1.0** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose v8.16.4** - MongoDB ODM
- **Pino** - Yüksek performanslı logger
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Ortam değişkenleri yönetimi

## 🚀 Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel kurulum veya MongoDB Atlas)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**

   ```bash
   git clone https://github.com/murselsen/express-practics.git
   cd express-practics
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**

   - Proje root dizininde `.env` dosyası oluşturun
   - Gerekli değişkenleri ekleyin (detaylar için [Ortam Değişkenleri](#ortam-değişkenleri) bölümüne bakın)

4. **MongoDB'yi başlatın:**

   - Yerel MongoDB servisini başlatın veya MongoDB Atlas bağlantı string'ini kullanın

5. **Uygulamayı çalıştırın:**

   ```bash
   # Geliştirme modu (nodemon ile)
   npm run dev

   # Prodüksiyon modu
   npm start
   ```

## 📖 Kullanım

Uygulama başlatıldıktan sonra varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

### Test Etme

Ana endpoint'i test etmek için:

```bash
curl http://localhost:3000
```

Öğrenci listesini almak için:

```bash
curl http://localhost:3000/students
```

## 🔗 API Endpoints

### Genel

| Method | Endpoint | Açıklama               |
| ------ | -------- | ---------------------- |
| GET    | `/`      | Ana sayfa - API durumu |

### Öğrenci İşlemleri

| Method | Endpoint        | Açıklama                    |
| ------ | --------------- | --------------------------- |
| GET    | `/students`     | Tüm öğrencileri listele     |
| GET    | `/students/:id` | Belirli bir öğrenciyi getir |

### Öğrenci Modeli

```javascript
{
  name: String,        // Öğrenci adı (zorunlu)
  age: Number,         // Yaş (zorunlu)
  gender: String,      // Cinsiyet: "male", "female", "other" (zorunlu)
  avgMark: Number,     // Ortalama not (zorunlu)
  onDuty: Boolean,     // Nöbetçi durumu (varsayılan: false)
  createdAt: Date,     // Oluşturulma tarihi (otomatik)
  updatedAt: Date      // Güncellenme tarihi (otomatik)
}
```

### Örnek Yanıtlar

**GET /students**

```json
{
  "statusCode": 200,
  "message": "All students fetched successfully",
  "data": [
    {
      "_id": "64abc123def456789",
      "name": "Ahmet Yılmaz",
      "age": 20,
      "gender": "male",
      "avgMark": 85.5,
      "onDuty": false,
      "createdAt": "2023-07-25T10:30:00.000Z",
      "updatedAt": "2023-07-25T10:30:00.000Z"
    }
  ]
}
```

**GET /students/:id**

```json
{
  "statusCode": 200,
  "message": "Student fetched successfully",
  "data": {
    "_id": "64abc123def456789",
    "name": "Ahmet Yılmaz",
    "age": 20,
    "gender": "male",
    "avgMark": 85.5,
    "onDuty": false,
    "createdAt": "2023-07-25T10:30:00.000Z",
    "updatedAt": "2023-07-25T10:30:00.000Z"
  }
}
```

## 📁 Proje Yapısı

```
express-practics/
├── src/
│   ├── index.js                 # Ana giriş noktası
│   ├── server.js                # Express server konfigürasyonu
│   ├── constants/
│   │   └── index.js             # Sabitler
│   ├── controllers/
│   │   └── studentController.js # Öğrenci controller'ları
│   ├── db/
│   │   ├── initMongoDB.js       # MongoDB bağlantı konfigürasyonu
│   │   └── models/
│   │       └── students.js      # Öğrenci Mongoose modeli
│   ├── middlewares/
│   │   └── notFoundMiddleware.js # 404 middleware
│   ├── routers/
│   │   └── studentRouter.js     # Öğrenci route'ları
│   ├── services/
│   │   └── students.js          # Öğrenci iş mantığı
│   ├── templates/               # Template dosyaları
│   ├── utils/
│   │   └── env.js               # Ortam değişkenleri yardımcısı
│   └── validation/              # Validation şemaları
├── CRUD-GUIDE.md               # MongoDB CRUD işlemleri rehberi
├── package.json
├── jsconfig.json
├── test-crud.js                # CRUD test dosyası
├── test-mongo.js               # MongoDB test dosyası
└── README.md
```

## 🔧 Ortam Değişkenleri

Proje root dizininde `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Server Konfigürasyonu
PORT=3000

# MongoDB Konfigürasyonu
MONGODB_USER=kullanici_adi
MONGODB_PASSWORD=sifre
MONGODB_URL=mongodb://localhost:27017/express-practics
# veya MongoDB Atlas için:
# MONGODB_URL=mongodb+srv://kullanici:sifre@cluster.mongodb.net/veritabani_adi

# Diğer konfigürasyonlar (gerekirse)
NODE_ENV=development
```

## 👨‍💻 Geliştirme

### Geliştirme Modu

Geliştirme modunda çalıştırmak için nodemon kullanılır:

```bash
npm run dev
```

### Test Dosyaları

- `test-crud.js` - CRUD işlemleri test dosyası
- `test-mongo.js` - MongoDB bağlantı test dosyası

### Loglama

Proje Pino logger kullanır. Geliştirme ortamında `pino-pretty` ile güzel formatlanmış loglar görüntülenir.

### Middleware'ler

- **CORS**: Cross-origin isteklere izin verir
- **Express JSON**: JSON request body'lerini parse eder
- **Pino HTTP**: HTTP isteklerini loglar
- **Error Handler**: Genel hata yakalama middleware'i

## 📚 Ek Kaynaklar

- [CRUD-GUIDE.md](./CRUD-GUIDE.md) - MongoDB CRUD işlemleri için detaylı rehber
- [Express.js Dokümantasyonu](https://expressjs.com/)
- [Mongoose Dokümantasyonu](https://mongoosejs.com/)
- [MongoDB Dokümantasyonu](https://docs.mongodb.com/)

## 👤 Yazar

**Mürsel Şen**

- Email: murselsen_35@hotmail.com
- GitHub: [@murselsen](https://github.com/murselsen)

## 📄 Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

---

⭐ Bu proje faydalı olduysa, yıldız vermeyi unutmayın!
