import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { generalRouter } from './general.routes.js';
import { aiRouter } from './ai.routes.js';

export const apiRouter = Router();

// Health check endpoints
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
apiRouter.get('/health/live', (_req, res) => {
  res.json({ status: 'ok' });
});
apiRouter.get('/health/ready', (_req, res) => {
  res.json({ status: 'ready' });
});

// Mount domain routes
apiRouter.use(authRouter);
apiRouter.use(generalRouter);
apiRouter.use(aiRouter);
