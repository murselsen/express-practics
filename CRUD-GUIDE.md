# 🎓 MongoDB CRUD İşlemleri Rehberi

## 📋 İçindekiler

- [CRUD Nedir?](#crud-nedir)
- [MongoDB ve Mongoose](#mongodb-ve-mongoose)
- [Model Oluşturma](#model-oluşturma)
- [CREATE İşlemleri](#create-işlemleri)
- [READ İşlemleri](#read-işlemleri)
- [UPDATE İşlemleri](#update-işlemleri)
- [DELETE İşlemleri](#delete-işlemleri)
- [Gelişmiş Sorgular](#gelişmiş-sorgular)
- [API Endpoint Örnekleri](#api-endpoint-örnekleri)
- [Best Practices](#best-practices)
- [Mongoose Model Method'ları](#mongoose-model-methodları)

---

## 🔍 CRUD Nedir?

**CRUD**, veritabanı işlemlerinin temel dört operasyonunu ifade eder:

- **C**reate (Oluştur) - Yeni veri ekleme
- **R**ead (Oku) - Veri okuma/listeleme
- **U**pdate (Güncelle) - Mevcut veriyi değiştirme
- **D**elete (Sil) - Veri silme

---

## 🍃 MongoDB ve Mongoose

### MongoDB

- NoSQL dokümman tabanlı veritabanı
- JSON benzeri BSON formatında veri saklama
- Esnek şema yapısı
- Yüksek performans ve ölçeklenebilirlik

### Mongoose

- MongoDB için Object Document Mapper (ODM)
- Schema tanımlama ve validation
- Middleware (pre/post hooks)
- Query builder ve helper metodlar

---

## 📝 Model Oluşturma

### Schema Tanımlama

```javascript
import { Schema, model } from "mongoose";

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
      minlength: [2, "İsim en az 2 karakter olmalıdır"],
      maxlength: [50, "İsim en fazla 50 karakter olabilir"],
    },
    email: {
      type: String,
      required: [true, "Email zorunludur"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Geçerli bir email adresi giriniz",
      ],
    },
    age: {
      type: Number,
      required: [true, "Yaş zorunludur"],
      min: [16, "Yaş en az 16 olmalıdır"],
      max: [100, "Yaş en fazla 100 olabilir"],
    },
    grade: {
      type: String,
      required: [true, "Sınıf zorunludur"],
      enum: {
        values: ["9", "10", "11", "12"],
        message: "Sınıf 9, 10, 11 veya 12 olmalıdır",
      },
    },
    subjects: {
      type: [String],
      default: [],
      validate: {
        validator: function (subjects) {
          return subjects.length <= 10;
        },
        message: "Maksimum 10 ders seçilebilir",
      },
    },
    gpa: {
      type: Number,
      min: [0, "GPA 0'dan küçük olamaz"],
      max: [4, "GPA 4'ten büyük olamaz"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
    versionKey: false, // __v alanını kaldırır
  }
);

// Model oluşturma
const Student = model("Student", StudentSchema);
export default Student;
```

### Schema Özellikler

#### Veri Tipleri

- `String` - Metin
- `Number` - Sayı
- `Date` - Tarih
- `Boolean` - Doğru/Yanlış
- `Array` - Dizi
- `ObjectId` - MongoDB ID
- `Mixed` - Karışık tip

#### Validation Kuralları

- `required` - Zorunlu alan
- `unique` - Tekil alan
- `min/max` - Minimum/maksimum değer
- `minlength/maxlength` - Karakter sınırı
- `enum` - Belirli değerler
- `match` - Regex doğrulama
- `validate` - Özel doğrulama

---

## ✨ CREATE İşlemleri

### 1. Tek Döküman Oluşturma

```javascript
// Yöntem 1: new kullanarak
const student = new Student({
  name: "Ahmet Yılmaz",
  email: "ahmet@email.com",
  age: 17,
  grade: "11",
  subjects: ["Matematik", "Fizik"],
});
const savedStudent = await student.save();

// Yöntem 2: create() kullanarak
const student = await Student.create({
  name: "Ayşe Demir",
  email: "ayse@email.com",
  age: 16,
  grade: "10",
});
```

### 2. Çoklu Döküman Oluşturma

```javascript
const students = await Student.insertMany([
  {
    name: "Mehmet Kaya",
    email: "mehmet@email.com",
    age: 18,
    grade: "12",
  },
  {
    name: "Fatma Özkan",
    email: "fatma@email.com",
    age: 17,
    grade: "11",
  },
]);
```

### 3. Express Controller Örneği

```javascript
export const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const newStudent = new Student(studentData);
    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Öğrenci başarıyla oluşturuldu",
      data: savedStudent,
    });
  } catch (error) {
    // Validation hatası
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası",
        errors: errors,
      });
    }

    // Duplicate key hatası (email zaten var)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Bu email adresi zaten kullanılmakta",
      });
    }

    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};
```

---

## 📖 READ İşlemleri

### 1. Temel Sorgular

```javascript
// Tüm dökümanları getir
const allStudents = await Student.find();

// Tek döküman getir (ID ile)
const student = await Student.findById("60d5ec49eb2e5c2a1c8b4567");

// İlk eşleşen dökümanı getir
const student = await Student.findOne({ email: "ahmet@email.com" });

// Sayım
const count = await Student.countDocuments({ isActive: true });
```

### 2. Filtreleme

```javascript
// Koşullu sorgular
const activeStudents = await Student.find({ isActive: true });
const grade11Students = await Student.find({ grade: "11" });

// Çoklu koşul
const topStudents = await Student.find({
  gpa: { $gte: 3.5 },
  grade: { $in: ["11", "12"] },
  isActive: true,
});

// Regex ile arama
const searchResults = await Student.find({
  name: { $regex: "ahmet", $options: "i" },
});

// Yaş aralığı
const teenStudents = await Student.find({
  age: { $gte: 16, $lte: 18 },
});
```

### 3. Projeksiyon (Alan Seçimi)

```javascript
// Sadece belirli alanları getir
const students = await Student.find().select("name email grade gpa");

// Belirli alanları hariç tut
const students = await Student.find().select("-__v -createdAt");
```

### 4. Sıralama

```javascript
// GPA'ya göre azalan sırada
const students = await Student.find().sort({ gpa: -1 });

// Çoklu sıralama
const students = await Student.find().sort({ grade: 1, gpa: -1 });
```

### 5. Sayfalama (Pagination)

```javascript
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const students = await Student.find().skip(skip).limit(limit).sort({ name: 1 });

// Toplam sayı ile birlikte
const [students, totalCount] = await Promise.all([
  Student.find().skip(skip).limit(limit),
  Student.countDocuments(),
]);
```

### 6. Express Controller Örneği

```javascript
export const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "asc",
      grade,
      isActive,
      search,
    } = req.query;

    // Filtreleri oluştur
    const filters = {};
    if (grade) filters.grade = grade;
    if (isActive !== undefined) filters.isActive = isActive === "true";

    // Arama filtresi
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Sıralama
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Paralel sorgu
    const [students, totalCount] = await Promise.all([
      Student.find(filters)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v"),
      Student.countDocuments(filters),
    ]);

    // Pagination bilgileri
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};
```

---

## ✏️ UPDATE İşlemleri

### 1. Temel Güncelleme

```javascript
// Tek döküman güncelleme
const updatedStudent = await Student.findByIdAndUpdate(
  "60d5ec49eb2e5c2a1c8b4567",
  { gpa: 3.8, age: 18 },
  {
    new: true, // Güncellenmiş veriyi döndür
    runValidators: true, // Validation kurallarını çalıştır
  }
);

// findOneAndUpdate
const student = await Student.findOneAndUpdate(
  { email: "ahmet@email.com" },
  { $set: { isActive: false } },
  { new: true }
);
```

### 2. Çoklu Döküman Güncelleme

```javascript
// Birden fazla dökümanı güncelle
const result = await Student.updateMany(
  { grade: "12", isActive: true },
  { $set: { status: "graduated" } }
);

console.log(`${result.modifiedCount} öğrenci güncellendi`);
```

### 3. Array İşlemleri

```javascript
// Array'e eleman ekleme
await Student.findByIdAndUpdate(studentId, {
  $push: { subjects: "İngilizce" },
});

// Array'den eleman çıkarma
await Student.findByIdAndUpdate(studentId, { $pull: { subjects: "Tarih" } });

// Array'e çoklu eleman ekleme
await Student.findByIdAndUpdate(studentId, {
  $addToSet: { subjects: { $each: ["Kimya", "Biyoloji"] } },
});
```

### 4. Nested Object Güncelleme

```javascript
// Nested object alanlarını güncelle
await Student.findByIdAndUpdate(studentId, {
  $set: {
    "address.city": "İstanbul",
    "address.zipCode": "34000",
  },
});
```

### 5. Express Controller Örneği

```javascript
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ObjectId geçerli mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz öğrenci ID",
      });
    }

    // Güncellenmemesi gereken alanları kaldır
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Öğrenci bulunamadı",
      });
    }

    res.status(200).json({
      success: true,
      message: "Öğrenci başarıyla güncellendi",
      data: updatedStudent,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};
```

---

## 🗑️ DELETE İşlemleri

### 1. Temel Silme

```javascript
// ID ile silme
const deletedStudent = await Student.findByIdAndDelete(
  "60d5ec49eb2e5c2a1c8b4567"
);

// Koşullu silme
const result = await Student.deleteOne({ email: "ahmet@email.com" });

// Çoklu silme
const result = await Student.deleteMany({ isActive: false });
```

### 2. Soft Delete (Önerilen)

```javascript
// Kalıcı silme yerine isActive = false yapma
const softDeletedStudent = await Student.findByIdAndUpdate(
  studentId,
  { isActive: false },
  { new: true }
);

// Soft delete için custom method
StudentSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

// Kullanımı
const student = await Student.findById(studentId);
await student.softDelete();
```

### 3. Express Controller Örneği

```javascript
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz öğrenci ID",
      });
    }

    let deletedStudent;

    if (permanent === "true") {
      // Kalıcı silme
      deletedStudent = await Student.findByIdAndDelete(id);
    } else {
      // Soft delete
      deletedStudent = await Student.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
    }

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Öğrenci bulunamadı",
      });
    }

    res.status(200).json({
      success: true,
      message:
        permanent === "true"
          ? "Öğrenci kalıcı olarak silindi"
          : "Öğrenci deaktif edildi",
      data: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};
```

---

## 🔍 Gelişmiş Sorgular

### 1. Aggregation Pipeline

```javascript
// Sınıfa göre istatistikler
const gradeStats = await Student.aggregate([
  { $match: { isActive: true } },
  {
    $group: {
      _id: "$grade",
      count: { $sum: 1 },
      averageGPA: { $avg: "$gpa" },
      maxGPA: { $max: "$gpa" },
      minAge: { $min: "$age" },
    },
  },
  { $sort: { _id: 1 } },
]);

// Şehir bazında dağılım
const cityDistribution = await Student.aggregate([
  {
    $group: {
      _id: "$address.city",
      studentCount: { $sum: 1 },
      averageGPA: { $avg: "$gpa" },
    },
  },
  { $sort: { studentCount: -1 } },
  { $limit: 5 },
]);
```

### 2. Complex Queries

```javascript
// Birden fazla koşul
const complexQuery = await Student.find({
  $and: [
    { age: { $gte: 17 } },
    { gpa: { $gte: 3.0 } },
    {
      $or: [{ grade: "11" }, { grade: "12" }],
    },
  ],
});

// Array arama
const mathStudents = await Student.find({
  subjects: { $in: ["Matematik"] },
});

// Existence kontrolü
const studentsWithAddress = await Student.find({
  "address.city": { $exists: true, $ne: null },
});
```

### 3. Text Search

```javascript
// Schema'da text index oluştur
StudentSchema.index({
  name: "text",
  email: "text",
});

// Text search
const searchResults = await Student.find({
  $text: { $search: "ahmet matematik" },
});
```

---

## 🌐 API Endpoint Örnekleri

### REST API Routes

```javascript
import { Router } from "express";
import { studentController } from "../controllers/studentController.js";

const router = Router();

// CREATE
router.post("/", studentController.createStudent);

// READ
router.get("/", studentController.getAllStudents);
router.get("/stats", studentController.getStudentStats);
router.get("/:id", studentController.getStudentById);

// UPDATE
router.put("/:id", studentController.updateStudent);
router.patch("/:id", studentController.updateStudent);

// DELETE
router.delete("/:id", studentController.deleteStudent);

// SPECIAL
router.patch("/:id/reactivate", studentController.reactivateStudent);

export default router;
```

### API Kullanım Örnekleri

#### 1. Öğrenci Oluşturma

```bash
POST /api/students
Content-Type: application/json

{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@email.com",
  "age": 17,
  "grade": "11",
  "subjects": ["Matematik", "Fizik"]
}
```

#### 2. Filtreleme ve Sayfalama

```bash
GET /api/students?page=1&limit=5&grade=11&sort=gpa&order=desc
```

#### 3. Arama

```bash
GET /api/students?search=ahmet
```

#### 4. Güncelleme

```bash
PUT /api/students/60d5ec49eb2e5c2a1c8b4567
Content-Type: application/json

{
  "gpa": 3.8,
  "subjects": ["Matematik", "Fizik", "Kimya"]
}
```

#### 5. Soft Delete

```bash
DELETE /api/students/60d5ec49eb2e5c2a1c8b4567
```

#### 6. Hard Delete

```bash
DELETE /api/students/60d5ec49eb2e5c2a1c8b4567?permanent=true
```

---

## 🛡️ Best Practices

### 1. Schema Design

```javascript
// İyi: Açık ve net alan adları
const StudentSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  enrollmentDate: Date,
});

// Kötü: Belirsiz alan adları
const StudentSchema = new Schema({
  n: String,
  e: String,
  d: Date,
});
```

### 2. Validation

```javascript
// Kapsamlı validation kuralları
const StudentSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email zorunludur"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+@\w+\.\w{2,3}$/, "Geçerli email formatı gerekli"],
  },
  age: {
    type: Number,
    required: [true, "Yaş zorunludur"],
    min: [16, "Yaş en az 16 olmalı"],
    max: [100, "Yaş en fazla 100 olabilir"],
    validate: {
      validator: Number.isInteger,
      message: "Yaş tam sayı olmalı",
    },
  },
});
```

### 3. Error Handling

```javascript
export const handleDatabaseError = (error, res) => {
  // Validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Doğrulama hatası",
      errors,
    });
  }

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} zaten kullanımda`,
    });
  }

  // Cast error
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Geçersiz ID formatı",
    });
  }

  // Generic error
  return res.status(500).json({
    success: false,
    message: "Sunucu hatası",
    error: error.message,
  });
};
```

### 4. Performance Optimization

```javascript
// Index'ler oluştur
StudentSchema.index({ email: 1 });
StudentSchema.index({ grade: 1, isActive: 1 });
StudentSchema.index({ createdAt: -1 });

// Projection kullan
const students = await Student.find().select("name email grade gpa").lean(); // Plain JavaScript objects

// Pagination ile memory kullanımını sınırla
const limit = Math.min(req.query.limit || 10, 100);
```

### 5. Security

```javascript
// Input sanitization
import mongoSanitize from "express-mongo-sanitize";
app.use(mongoSanitize());

// Rate limiting
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // maksimum 100 istek
});
app.use("/api/", limiter);
```

---

## 📊 Örnek Test Senaryosu

```javascript
// Test verisi oluşturma
const testStudent = {
  name: "Test Öğrenci",
  email: "test@email.com",
  age: 17,
  grade: "11",
  subjects: ["Matematik", "Fizik"],
  gpa: 3.5,
};

// 1. CREATE test
const createdStudent = await Student.create(testStudent);
console.log("✅ Öğrenci oluşturuldu:", createdStudent._id);

// 2. READ test
const foundStudent = await Student.findById(createdStudent._id);
console.log("✅ Öğrenci bulundu:", foundStudent.name);

// 3. UPDATE test
const updatedStudent = await Student.findByIdAndUpdate(
  createdStudent._id,
  { gpa: 3.8 },
  { new: true }
);
console.log("✅ GPA güncellendi:", updatedStudent.gpa);

// 4. DELETE test (soft)
await Student.findByIdAndUpdate(createdStudent._id, { isActive: false });
console.log("✅ Öğrenci deaktif edildi");

// 5. Hard DELETE test
await Student.findByIdAndDelete(createdStudent._id);
console.log("✅ Öğrenci kalıcı olarak silindi");
```

---

## 🔧 Mongoose Model Method'ları Detaylı Açıklama

Mongoose model method'ları nasıl çalışır ve sizin mevcut `Student.js` modelinizle nasıl kullanılır açıklayayım:

### Model Method'ları Nasıl Çalışır?

Mongoose model'ları, MongoDB ile etkileşim kurmak için kullanılan ana yapılardır. Model method'ları iki kategoriye ayrılır:

#### 1. **Static Methods (Model Level)**

Bu method'lar doğrudan model üzerinde çağrılır:

```javascript
// Örnek: StudentsCollection.find()
const students = await StudentsCollection.find();
```

#### 2. **Instance Methods (Document Level)**

Bu method'lar model'den oluşturulan document (örnek) üzerinde çağrılır:

```javascript
// Örnek: student.save()
const student = new StudentsCollection({...});
await student.save();
```

### Sizin Student Modelinizle Ana Mongoose Method'ları

Mevcut `Student.js` modeliniz:

```javascript
import { model, Schema } from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    avgMark: { type: Number, required: true },
    onDuty: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

const StudentsCollection = model("students", studentSchema);
export default StudentsCollection;
```

### **Create Operations (Oluşturma)**

```javascript
// 1. new + save
const student = new StudentsCollection({
  name: "Ali Veli",
  age: 20,
  gender: "male",
  avgMark: 85.5,
  onDuty: false,
});
await student.save();

// 2. create (direkt oluşturma)
const student = await StudentsCollection.create({
  name: "Ayşe Fatma",
  age: 19,
  gender: "female",
  avgMark: 92.0,
  onDuty: true,
});

// 3. insertMany (çoklu oluşturma)
const students = await StudentsCollection.insertMany([
  { name: "Mehmet", age: 21, gender: "male", avgMark: 78.5, onDuty: false },
  { name: "Zeynep", age: 20, gender: "female", avgMark: 88.0, onDuty: true },
]);
```

### **Read Operations (Okuma)**

```javascript
// 1. Tümünü getir
const allStudents = await StudentsCollection.find();

// 2. Koşullu arama
const maleStudents = await StudentsCollection.find({ gender: "male" });

// 3. Tek kayıt getir
const student = await StudentsCollection.findOne({ name: "Ali Veli" });

// 4. ID ile getir
const student = await StudentsCollection.findById("64a1b2c3d4e5f6789012345");

// 5. Projeksiyonla (belirli alanlar)
const students = await StudentsCollection.find({}, "name age avgMark");

// 6. Sıralama ve limit
const topStudents = await StudentsCollection.find()
  .sort({ avgMark: -1 }) // Yüksekten düşüğe
  .limit(5);

// 7. Sayfa sayfa (pagination)
const students = await StudentsCollection.find().skip(10).limit(5);

// 8. Yaş aralığı filtreleme
const youngStudents = await StudentsCollection.find({
  age: { $gte: 18, $lte: 25 },
});

// 9. Ortalama not filtreleme
const goodStudents = await StudentsCollection.find({
  avgMark: { $gte: 80 },
});

// 10. Görevde olan öğrenciler
const onDutyStudents = await StudentsCollection.find({ onDuty: true });
```

### **Update Operations (Güncelleme)**

```javascript
// 1. Tek kayıt güncelle
const result = await StudentsCollection.updateOne(
  { name: "Ali Veli" },
  { $set: { avgMark: 90.0, onDuty: true } }
);

// 2. Çoklu güncelleme
const result = await StudentsCollection.updateMany(
  { age: { $gte: 20 } },
  { $set: { onDuty: true } }
);

// 3. Bul ve güncelle (güncellenmiş kaydı döner)
const updatedStudent = await StudentsCollection.findOneAndUpdate(
  { name: "Ali Veli" },
  { $set: { avgMark: 95.0 } },
  { new: true } // Güncellenmiş versiyonu döner
);

// 4. ID ile bul ve güncelle
const student = await StudentsCollection.findByIdAndUpdate(
  "64a1b2c3d4e5f6789012345",
  { $set: { onDuty: false, avgMark: 87.5 } },
  { new: true }
);

// 5. Increment işlemi (sayısal değer artırma)
const incrementResult = await StudentsCollection.updateOne(
  { name: "Ali Veli" },
  { $inc: { avgMark: 5 } } // avgMark'ı 5 puan artır
);
```

### **Delete Operations (Silme)**

```javascript
// 1. Tek kayıt sil
const result = await StudentsCollection.deleteOne({ name: "Ali Veli" });

// 2. Çoklu silme
const result = await StudentsCollection.deleteMany({ avgMark: { $lt: 50 } });

// 3. Bul ve sil (silinen kaydı döner)
const deletedStudent = await StudentsCollection.findOneAndDelete({
  name: "Ali Veli",
});

// 4. ID ile bul ve sil
const deletedStudent = await StudentsCollection.findByIdAndDelete(
  "64a1b2c3d4e5f6789012345"
);
```

### **Gelişmiş Özellikler**

#### **Aggregation (Toplama)**

```javascript
// Cinsiyete göre ortalama not
const avgByGender = await StudentsCollection.aggregate([
  {
    $group: {
      _id: "$gender",
      averageMark: { $avg: "$avgMark" },
      count: { $sum: 1 },
      maxMark: { $max: "$avgMark" },
      minMark: { $min: "$avgMark" },
    },
  },
  { $sort: { averageMark: -1 } },
]);

// Yaş gruplarına göre istatistikler
const ageStats = await StudentsCollection.aggregate([
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            { case: { $lt: ["$age", 20] }, then: "18-19" },
            { case: { $lt: ["$age", 25] }, then: "20-24" },
            { case: { $gte: ["$age", 25] }, then: "25+" },
          ],
          default: "Bilinmeyen",
        },
      },
      count: { $sum: 1 },
      avgMark: { $avg: "$avgMark" },
    },
  },
]);

// Görevde olan/olmayan dağılımı
const dutyStats = await StudentsCollection.aggregate([
  {
    $group: {
      _id: "$onDuty",
      count: { $sum: 1 },
      averageMark: { $avg: "$avgMark" },
    },
  },
]);
```

#### **Validation (Doğrulama)**

```javascript
// Schema'nızda zaten validation var:
// - name: required string
// - age: required number
// - gender: required, sadece "male", "female", "other"
// - avgMark: required number
// - onDuty: required boolean, default false

// Validation hatası örneği:
try {
  const student = await StudentsCollection.create({
    name: "Test",
    age: "invalid", // Hata: number olmalı
    gender: "invalid", // Hata: enum'da yok
    // avgMark eksik - Hata: required
  });
} catch (error) {
  console.log(error.errors); // Validation hataları

  // Specific error handling
  if (error.name === "ValidationError") {
    Object.keys(error.errors).forEach((key) => {
      console.log(`${key}: ${error.errors[key].message}`);
    });
  }
}
```

#### **Middleware (Hooks)**

```javascript
// Schema'ya middleware ekleyebilirsiniz:
studentSchema.pre("save", function (next) {
  console.log("Öğrenci kaydediliyor:", this.name);

  // Ortalama notun 0-100 arasında olup olmadığını kontrol et
  if (this.avgMark < 0 || this.avgMark > 100) {
    return next(new Error("Ortalama not 0-100 arasında olmalıdır"));
  }

  next();
});

studentSchema.post("save", function (doc) {
  console.log("Öğrenci kaydedildi:", doc.name);
});

// Delete middleware
studentSchema.pre("remove", function (next) {
  console.log("Öğrenci siliniyor:", this.name);
  next();
});
```

#### **Custom Instance Methods**

```javascript
// Schema'ya özel method'lar ekleyebilirsiniz
studentSchema.methods.getFullInfo = function () {
  return `${this.name} (${this.age} yaş, ${this.gender}, Not Ort: ${this.avgMark})`;
};

studentSchema.methods.isHighAchiever = function () {
  return this.avgMark >= 85;
};

studentSchema.methods.toggleDuty = function () {
  this.onDuty = !this.onDuty;
  return this.save();
};

// Kullanımı:
const student = await StudentsCollection.findById(studentId);
console.log(student.getFullInfo());
console.log("Başarılı öğrenci mi?", student.isHighAchiever());
await student.toggleDuty();
```

#### **Custom Static Methods**

```javascript
// Model seviyesinde static method'lar
studentSchema.statics.findByGender = function (gender) {
  return this.find({ gender: gender });
};

studentSchema.statics.getTopStudents = function (limit = 10) {
  return this.find().sort({ avgMark: -1 }).limit(limit);
};

studentSchema.statics.getAverageMarkByGender = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$gender",
        averageMark: { $avg: "$avgMark" },
        count: { $sum: 1 },
      },
    },
  ]);
};

// Kullanımı:
const maleStudents = await StudentsCollection.findByGender("male");
const topStudents = await StudentsCollection.getTopStudents(5);
const genderStats = await StudentsCollection.getAverageMarkByGender();
```

### **Pratik Kullanım Örnekleri**

```javascript
// Express service dosyanızda kullanabileceğiniz örnek function'lar:

// Tüm öğrencileri getir (pagination ile)
export const getAllStudents = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const students = await StudentsCollection.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await StudentsCollection.countDocuments();

  return {
    students,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    },
  };
};

// Başarılı öğrencileri getir
export const getTopStudents = async () => {
  return await StudentsCollection.find({ avgMark: { $gte: 85 } }).sort({
    avgMark: -1,
  });
};

// Cinsiyet bazında istatistik
export const getStudentStatsByGender = async () => {
  return await StudentsCollection.aggregate([
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
        averageMark: { $avg: "$avgMark" },
        highAchievers: {
          $sum: { $cond: [{ $gte: ["$avgMark", 85] }, 1, 0] },
        },
      },
    },
  ]);
};

// Öğrenci arama
export const searchStudents = async (searchTerm) => {
  return await StudentsCollection.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { gender: { $regex: searchTerm, $options: "i" } },
    ],
  });
};

// Toplu not güncelleme
export const updateMarksByGender = async (gender, markIncrease) => {
  return await StudentsCollection.updateMany(
    { gender: gender },
    { $inc: { avgMark: markIncrease } }
  );
};
```

Bu rehber MongoDB'de CRUD işlemlerinin tüm detaylarını kapsar. Express.js ile birlikte kullanarak güçlü ve güvenli API'ler oluşturabilirsiniz! 🚀
