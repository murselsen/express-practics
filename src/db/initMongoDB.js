import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  // Ortam değişkenlerini kontrol et
  const mongoUser = env('MONGO_USER');
  const mongoPassword = env('MONGO_PASSWORD');
  const mongoUrl = env('MONGO_URL');
  const mongoDb = env('MONGO_DB');

  // Debug için bağlantı bilgilerini göster (şifre hariç)
  console.log('\n=== MongoDB bağlantı bilgileri: === ');
  console.log('User:', mongoUser);
  console.log('URL:', mongoUrl);
  console.log('Database:', mongoDb);
  console.log('===== =========================== ====\n');

  // Bağlantı URL'ini oluştur
  const connectionString = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoUrl}/${mongoDb}?retryWrites=true&w=majority`;

  // MongoDB bağlantı seçenekleri
  const options = {
    serverSelectionTimeoutMS: 5000, // 5 saniye timeout
    socketTimeoutMS: 45000, // 45 saniye socket timeout
  };
  try {
    await mongoose.connect(connectionString, options);
    console.log("✅ MongoDB'ye başarıyla bağlandı!");

    // Bağlantı event listener'ları
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB bağlantı hatası:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB bağlantısı kesildi');
    });
  } catch (error) {
    console.error('❌ MongoDB bağlantı başarısız:');
    console.error('Hata mesajı:', error.message);

    // Yaygın hata türlerini kontrol et
    if (error.message.includes('authentication failed')) {
      console.error(
        '🔑 Kimlik doğrulama hatası: Kullanıcı adı veya şifre yanlış'
      );
    } else if (error.message.includes('serverSelectionTimeoutMS')) {
      console.error(
        '⏰ Sunucu bağlantı zaman aşımı: Ağ bağlantısını kontrol edin'
      );
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error("🌐 DNS hatası: MongoDB URL'i kontrol edin");
    }

    throw error;
  }
};
