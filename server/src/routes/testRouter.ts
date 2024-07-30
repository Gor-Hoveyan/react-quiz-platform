import { Router } from "express";
import { testController } from "./../controllers/testController";
import { authMiddleware } from "./../utils/middlewares/authMiddleware";
import { createTestValidation } from "../validations/testValidation";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";


const router = Router({strict: true});

router.get('/test/:id', testController.getTest);
router.post('/test', createTestValidation, validationMiddleware, authMiddleware, testController.createTest);
router.put('/test/:id', authMiddleware, testController.updateTest);
router.delete('/test/:id', authMiddleware, testController.deleteTest);
router.get('/tests', testController.getTen);
router.get('/tests/:id', authMiddleware, testController.getUserTests);
router.post('/tests/search/', testController.search);
router.get('/tests/pagination/', testController.pagination);
router.put('/test/like/:id', authMiddleware, testController.likeTest);
router.put('/test/save/:id', authMiddleware, testController.saveTest);
router.post('/test/submit', authMiddleware, testController.submitTest);

export const testRouter = router;