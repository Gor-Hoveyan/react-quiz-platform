import { Router } from "express";
import { testController } from "./../controllers/testController";
import { authMiddleware } from "./../utils/authMiddleware";


const router = Router();

router.get('/test/:id', testController.getTest);
router.post('/test', authMiddleware, testController.createTest);
router.put('/test/:id', authMiddleware, testController.updateTest);
router.delete('/test/:id', authMiddleware, testController.deleteTest);
router.get('/tests', testController.getTen);
router.get('/tests/:id', authMiddleware, testController.getUserTests);
router.post('/tests/search', testController.search);
router.get('/testsPagination', testController.pagination);

export const testRouter = router;