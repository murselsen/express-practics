// Collections
import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email is use');
  const notEncryptedPassword = payload.password;
  const encryptedPassword = await bcrypt.hashSync(payload.password, 10);

  payload.password = encryptedPassword;

  console.log('registerUser - payload:', payload);
  await UsersCollection.create(payload);
  payload.password = notEncryptedPassword; // Şifreyi tekrar eski haline getir
  await loginUser(payload);
};

export const loginUser = async (payload) => {
  // email sorgulama
  const userData = await UsersCollection.findOne({
    email: payload.email,
  });
  // eğer kullanıcıya ait email yoksa hata fırlat
  if (!userData) throw createHttpError(404, 'User not found');

  // şifre kontrolü
  const isEqualPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  // eğer şifre eşleşmiyorsa hata fırlat
  if (!isEqualPassword) throw createHttpError(401, 'Unauthorized');

  const session = await createUserSession(userData._id);
  return {
    user: userData,
    session,
  };
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createUserSession = async (userId) => {
  // eski oturum kaydı sil
  await SessionCollection.deleteOne({ userId: userId });

  // accessToken ve refreshToken oluştur
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  // yeni oturum kaydı oluştur
  return await SessionCollection.create({
    userId: userId,
    accessToken,
    refreshToken,
    accessTokenVaildUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenVaildUntil: new Date(Date.now() + ONE_DAY),
  });
};
