// Modules
import express from 'express';
// import pino from 'pino-http';
import cors from 'cors';

// Utils
import { env } from './utils/env.js';

// Services
import studentRouter from './routers/studentRouter.js';

// Middlewares
import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
import serverErrorMiddleware from './middlewares/serverErrorMiddleware.js';
import { createResponse } from './utils/createResponse.js';

const PORT = Number(env('PORT', 3000));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  //   app.use(
  //     pino({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     })
  //   );

  app.get('/', (req, res) => {
    res.json(createResponse(true, 'Welcome to the Express API', null, 200));
  });

  app.use('/students', studentRouter);

  app.use(notFoundMiddleware);
  app.use(serverErrorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
