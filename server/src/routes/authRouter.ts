import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refreshToken);

export const authRouter = router;