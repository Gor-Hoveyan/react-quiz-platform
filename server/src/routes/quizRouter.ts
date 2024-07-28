import { Router } from "express";
import { quizController } from "../controllers/quizController";
import { authMiddleware } from "./../utils/middlewares/authMiddleware";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";


const router = Router();

router.get('/test/:id', quizController.getQuiz);
router.post('/test', /*createTestValidation*/ validationMiddleware, authMiddleware, quizController.createQuiz);
router.put('/test/:id', authMiddleware, quizController.updateQuiz);
router.delete('/test/:id', authMiddleware, quizController.deleteQuiz);
router.get('/tests', quizController.getTen);
router.get('/tests/:id', authMiddleware, quizController.getUserQuizzes);
router.post('/tests/search', quizController.search);
router.get('/tests/pagination', quizController.pagination);
router.put('/test/like/:id', authMiddleware, quizController.likeQuiz);
router.put('/test/save/:id', authMiddleware, quizController.saveQuiz);
router.post('/test/submit', authMiddleware, quizController.submitQuiz);

export const quizRouter = router;