import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";
import { createAnswerValidation, createCommentValidation, updateAnswerValidation, updateCommentValidation } from "../validations/commentValidation";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";

const router = Router({strict: true});

router.post('/comment', createCommentValidation, validationMiddleware, authMiddleware, commentController.createComment);
router.delete('/comment', authMiddleware, commentController.removeComment);
router.put('/comment', updateCommentValidation, validationMiddleware, authMiddleware, commentController.updateComment);
router.post('/comment/like/:id', authMiddleware, commentController.likeComment);
router.get('/comment/:id', commentController.getComments);
router.post('/answer', createAnswerValidation,  validationMiddleware, authMiddleware, commentController.createAnswer);
router.put('/answer', updateAnswerValidation,  validationMiddleware, authMiddleware, commentController.updateAnswer);
router.delete('/answer', authMiddleware, commentController.removeAnswer);
router.post('/answer/like/:id', authMiddleware, commentController.likeAnswer);
router.get('/answer/:id', commentController.getAnswers);

export const commentRouter = router;