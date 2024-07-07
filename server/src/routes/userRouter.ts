import { Router} from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../utils/authMiddleware";

const router = Router();

router.get('/user', authMiddleware, userController.getUser);
router.put('/likeTest/:id', authMiddleware, userController.likeTest);
router.put('/saveTest/:id', authMiddleware, userController.saveTest);


export const userRouter = router;