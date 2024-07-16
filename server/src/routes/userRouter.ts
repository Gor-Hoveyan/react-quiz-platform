import { Router} from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../utils/middlewares/authMiddleware";

const router = Router();

router.get('/user', authMiddleware, userController.getUser);
router.put('/likeTest/:id', authMiddleware, userController.likeTest);
router.put('/saveTest/:id', authMiddleware, userController.saveTest);
router.put('/follow/:id', authMiddleware, userController.follow);
router.put('/unfollow/:id', authMiddleware, userController.unfollow);
router.get('/userPage/:id', userController.getUserPage);
router.put('/user', authMiddleware, userController.updateUser);
router.put('/avatar', authMiddleware, userController.setAvatar);
router.get('/likedPosts/:id?', authMiddleware, userController.getLikedPosts);
router.get('/followers/:id?', authMiddleware, userController.getFollowers);
router.get('/followings/:id?', authMiddleware, userController.getFollowings);
router.get('/savedPosts', authMiddleware, userController.getSavedPosts);

export const userRouter = router;