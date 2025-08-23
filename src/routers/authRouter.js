import express from 'express';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  refreshUserSessionController,
} from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController
);

router.post('/login', validateBody(loginUserSchema), loginUserController);
router.post('/refresh', refreshUserSessionController);
router.post('/logout', logoutUserController);

export default router;
