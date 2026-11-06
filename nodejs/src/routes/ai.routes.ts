import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';

export const aiRouter = Router();

// Glossary
aiRouter.get('/api/glos', AiController.getGlos);
aiRouter.post('/api/setGlos', AiController.setGlos);
aiRouter.put('/api/glos/:item_id', AiController.updateGlos);
aiRouter.post('/api/glos/delete', AiController.deleteGlos);
aiRouter.delete('/api/glos/:item_id', AiController.deleteGlos);
aiRouter.post('/api/glos_req', AiController.addGlosReq);
aiRouter.get('/api/getGlosReq', AiController.getGlosReq);

// CEO Schedule & News
aiRouter.get('/api/ceo-news', AiController.getCeoNews);

// AI Video Forensics Inference
aiRouter.post('/api/video-forensics/analyze', AiController.analyzeVideo);
