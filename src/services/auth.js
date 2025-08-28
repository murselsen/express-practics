// Collections
import UsersCollection from '../db/models/user.js';
import SessionCollection from '../db/models/session.js';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../utils/env.js';
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


  const newSession = createSession();

  // yeni oturum kaydı oluştur
  return await SessionCollection.create({
    userId: userData._id,
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    accessTokenVaildUntil: newSession.accessTokenVaildUntil,
    refreshTokenVaildUntil: newSession.refreshTokenVaildUntil,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({
    email,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    }
  );

  console.log('requestResetToken - resetToken:', resetToken);

  const resetPasswordTemplateSource = await fs.readFile(
    path.join(TEMPLATES_DIR, 'reset-password-email.html'),
    'utf-8'
  );

  const template = handlebars.compile(resetPasswordTemplateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: user.email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    {
      _id: user._id,
    },
    {
      password: encryptedPassword,
    }
  );
};
