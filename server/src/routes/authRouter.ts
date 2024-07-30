import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";
import { registrationValidation } from "../validations/userValidation";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";

const router = Router({strict: true});

router.post('/auth/register', registrationValidation, validationMiddleware, authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refreshToken);
router.get('/verify/:code', authController.verifyEmail);
router.get('/newCode', authMiddleware, authController.newVerificationCode);

export const authRouter = router;