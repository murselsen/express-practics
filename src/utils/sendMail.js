import nodeMailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from './env.js';

const transporter = nodeMailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: env(SMTP.SMTP_PORT),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

export const sendMail = async (options) => {
  return await transporter.sendMail(options);
};
