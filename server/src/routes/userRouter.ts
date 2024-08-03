import { Router} from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";
import { setAvatarValidation, updateUserValidation } from "../validations/userValidation";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";

const router = Router({strict: true});

router.get('/user', authMiddleware, userController.getUser);
router.get('/user/tests/:id', authMiddleware, userController.getUserTests);
router.get('/user/quizzes/:id', authMiddleware, userController.getUserQuizzes);
router.put('/follow/:id', authMiddleware, userController.follow);
router.put('/unfollow/:id', authMiddleware, userController.unfollow);
router.get('/userPage/:id', userController.getUserPage);
router.put('/user', authMiddleware, updateUserValidation, validationMiddleware, userController.updateUser);
router.put('/avatar', setAvatarValidation, validationMiddleware, authMiddleware, userController.setAvatar);
router.get('/followers/:id?', authMiddleware, userController.getFollowers);
router.get('/followings/:id?', authMiddleware, userController.getFollowings);

export const userRouter = router;