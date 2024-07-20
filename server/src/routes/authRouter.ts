import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refreshToken);
router.get('/verify/:code', authController.verifyEmail);
router.get('/newCode', authMiddleware, authController.newVerificationCode);

export const authRouter = router;