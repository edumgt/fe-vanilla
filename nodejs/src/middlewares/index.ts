import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;

  _res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.DEBUG_LOGS === 'true' || _res.statusCode >= 400) {
      console.log(`[HTTP] ${method} ${url} -> ${_res.statusCode} (${duration}ms)`);
    }
  });

  next();
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token) {
    (req as any).user = {
      username: 'admin',
      role: 'admin',
    };
  }

  next();
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[GlobalErrorHandler]', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
    timestamp: new Date().toISOString(),
  });
}
