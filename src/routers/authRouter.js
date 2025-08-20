import express from 'express';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
} from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController
);

authRouter.post('/login', validateBody(loginUserSchema), loginUserController);
authRouter.post('/logout', logoutUserController);
export default authRouter;
