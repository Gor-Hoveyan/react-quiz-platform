import { Router } from "express";
import { quizController } from "../controllers/quizController";
import { authMiddleware } from "./../utils/middlewares/authMiddleware";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";


const router = Router({strict: true});

router.get('/quiz/:id', quizController.getQuiz);
router.post('/quiz', /*createTestValidation*/ validationMiddleware, authMiddleware, quizController.createQuiz);
router.put('/quiz/:id', authMiddleware, quizController.updateQuiz);
router.delete('/quiz/:id', authMiddleware, quizController.deleteQuiz);
router.get('/quizzes', quizController.getTen);
router.get('/quizzes/:id', authMiddleware, quizController.getUserQuizzes);
router.post('/quizzes/search/', quizController.search);
router.get('/quizzes/pagination/', quizController.pagination);
router.put('/quiz/like/:id', authMiddleware, quizController.likeQuiz);
router.put('/quiz/save/:id', authMiddleware, quizController.saveQuiz);
router.post('/quiz/submit', authMiddleware, quizController.submitQuiz);

export const quizRouter = router;