import { Router} from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";
import { setAvatarValidation, updateUserValidation } from "../validations/userValidation";
import { validationMiddleware } from "../utils/middlewares/validationMiddleware";

const router = Router();

router.get('/user', authMiddleware, userController.getUser);
router.put('/follow/:id', authMiddleware, userController.follow);
router.put('/unfollow/:id', authMiddleware, userController.unfollow);
router.get('/userPage/:id', userController.getUserPage);
router.put('/user', authMiddleware, updateUserValidation, validationMiddleware, userController.updateUser);
router.put('/avatar', setAvatarValidation, validationMiddleware, authMiddleware, userController.setAvatar);
router.get('/likedPosts/:id?', authMiddleware, userController.getLikedPosts);
router.get('/followers/:id?', authMiddleware, userController.getFollowers);
router.get('/passedTests/:id?', authMiddleware, userController.getPassedTests);
router.get('/followings/:id?', authMiddleware, userController.getFollowings);
router.get('/savedPosts', authMiddleware, userController.getSavedPosts);

export const userRouter = router;