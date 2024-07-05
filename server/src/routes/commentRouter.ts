import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authMiddleware } from "../utils/authMiddleware";

const router = Router();

router.post('/comment', authMiddleware, commentController.createComment);
router.delete('/comment', authMiddleware, commentController.removeComment);
router.put('/comment', authMiddleware, commentController.updateComment);
router.post('/likeComment/:id', authMiddleware, commentController.likeComment);
router.get('/comment/:id', commentController.getComments);
router.post('/answer', authMiddleware, commentController.createAnswer);
router.put('/answer', authMiddleware, commentController.updateAnswer);
router.delete('/answer', authMiddleware, commentController.removeAnswer);
router.post('/likeAnswer/:id', authMiddleware, commentController.likeAnswer);
router.get('/answer/:id', commentController.getAnswers);

export const commentRouter = router;