import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '@/shared/middlewares/error-handler.middleware';
import { httpLogger } from '@/shared/middlewares/http-logger.middleware';
import { envConfig } from '@/config/env.config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envConfig.app.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(helmet());
app.use(httpLogger);

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Application is running' });
});

const apiRouter = express.Router();
app.use('/api', apiRouter);

app.use((_req, _res, next) => {
  next({
    statusCode: 404,
    message: 'Not Found',
  });
});

app.use(errorHandler);

export { app };
