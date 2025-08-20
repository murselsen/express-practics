import express from 'express';

// Routers
import authRouter from './authRouter.js';
import studentRouter from './studentRouter.js';

const appRouters = express.Router();

appRouters.use('/auth', authRouter);
appRouters.use('/students', studentRouter);

export default appRouters;
