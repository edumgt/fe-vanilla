import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/auth/refresh', AuthController.refresh);
authRouter.get('/protected', AuthController.getProtected);
