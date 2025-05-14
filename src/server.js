import { readFileSync } from 'node:fs';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routers/contacts.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { authenticate } from './middlewares/authenticate.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRouter from './routers/auth.js';

const swaggerDocument = JSON.parse(
  readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);
export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(express.json());
  app.use('/uploads', express.static(path.resolve('src', 'uploads')));

  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = Number(getEnvVar('PORT', 3000));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
