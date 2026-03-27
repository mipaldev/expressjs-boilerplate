import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '@/shared/middlewares/error-handler.middleware';
import { httpLogger } from '@/shared/middlewares/http-logger.middleware';
import { envConfig } from '@/config/env.config';
import { userRouter } from '@/module/user/user.route';
import { NotFoundException } from '@/shared/exceptions/not-found.exception';

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
apiRouter.use('/users', userRouter);
app.use('/api', apiRouter);

app.use((_req, _res, next) => {
  next(new NotFoundException('Route not found'));
});

app.use(errorHandler);

export { app };
