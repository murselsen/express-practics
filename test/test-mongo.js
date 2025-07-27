import { initMongoDB } from '../src/db/initMongoDB.js';

// MongoDB bağlantısını test et
console.log('🧪 MongoDB bağlantı testi başlatılıyor...');

initMongoDB()
  .then(() => {
    console.log('✅ Test başarılı! MongoDB bağlantısı çalışıyor.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test başarısız!');
    console.error('Hata:', error.message);
    process.exit(1);
  });
