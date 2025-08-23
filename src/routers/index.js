import express from 'express';

// Routers
import authRouter from './authRouter.js';
import studentRouter from './studentRouter.js';
import { authenticate } from '../middlewares/authenticate.js';

const appRouters = express.Router();

appRouters.use('/auth', authRouter);
// Protect students routes with authenticate
appRouters.use('/students', authenticate, studentRouter);

export default appRouters;
