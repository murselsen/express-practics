// Collections
import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { create } from 'domain';

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

  // eski oturum kaydı sil
  await SessionCollection.deleteOne({ userId: userData._id });
  // accessToken ve refreshToken oluştur
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  console.log('loginUser - accessToken:', accessToken);
  console.log('loginUser - refreshToken:', refreshToken);
  // yeni oturum kaydı oluştur
  return await SessionCollection.create({
    userId: userData._id,
    accessToken,
    refreshToken,
    accessTokenVaildUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenVaildUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  // accessToken ve refreshToken oluştur
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenVaildUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenVaildUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenVaildUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({ _id: sessionId });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
