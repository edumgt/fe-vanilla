import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { ENV } from './config/env.js';
import { requestLogger, authMiddleware, errorHandler } from './middlewares/index.js';
import { apiRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // 1. Ensure upload directory exists
  if (!fs.existsSync(ENV.UPLOAD_DIR)) {
    fs.mkdirSync(ENV.UPLOAD_DIR, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ENV.UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.png';
      const filename = `${crypto.randomUUID()}${ext}`;
      cb(null, filename);
    },
  });
  const upload = multer({ storage });

  // 2. Global Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(authMiddleware);

  // 3. Image Upload Endpoint
  app.post('/upload/image', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.json({ url: `/uploads/${req.file.filename}` });
  });

  // 4. API & Health Routes
  app.use(apiRouter);

  // 5. Static Assets
  app.use('/infra', express.static(ENV.INFRA_DIR));
  app.use(express.static(ENV.PUBLIC_DIR));

  // 6. SPA / HTML Route Handler
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(ENV.PUBLIC_DIR, 'index.html'));
  });

  app.use((req: Request, res: Response, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    const cleanPath = req.path.replace(/^\//, '');
    const targetFile = path.join(ENV.PUBLIC_DIR, cleanPath);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
      return res.sendFile(targetFile);
    }
    const targetHtml = path.join(ENV.PUBLIC_DIR, `${cleanPath}.html`);
    if (fs.existsSync(targetHtml) && fs.statSync(targetHtml).isFile()) {
      return res.sendFile(targetHtml);
    }
    return res.sendFile(path.join(ENV.PUBLIC_DIR, 'index.html'));
  });

  // 7. Error Handling Middleware
  app.use(errorHandler);

  return app;
}
