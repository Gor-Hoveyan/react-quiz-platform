import { Router} from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../utils/authMiddleware";

const router = Router();

router.get('/user', authMiddleware, userController.getUser);
router.post('/likeTest/:id', authMiddleware, userController.likeTest);

export const userRouter = router;