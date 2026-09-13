import { Router } from 'express';
import {
  createDilemma,
  getDilemmas,
  getDilemmaById,
  addComment,
  voteDilemma,
  triggerAIConsensus,
} from '../controllers/dilemmaController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getDilemmas);
router.get('/:id', getDilemmaById);
router.post('/:id/ai-consensus', triggerAIConsensus);

// Protected routes
router.post('/', verifyToken, createDilemma);
router.post('/:id/comments', verifyToken, addComment);
router.post('/:id/vote', verifyToken, voteDilemma);

export default router;
