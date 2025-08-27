import express from 'express';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  refreshUserSessionController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController
);

router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshUserSessionController);
router.post('/logout', logoutUserController);

router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  requestResetEmailController
);

router.post('/reset-password', validateBody(resetPasswordSchema), resetPasswordController)


export default router;
