import { Router } from "express";
import { postController } from "./../controllers/postController";
import { authMiddleware } from "./../utils/middlewares/authMiddleware";

const router = Router();

router.get('/posts/user/:id?', postController.getUserPosts);
router.get('/posts/search/:name', postController.searchPosts);
router.get('/posts/liked/:id', postController.getLikedPosts);
router.get('/posts/liked', authMiddleware, postController.getLikedPosts);
router.get('/posts/saved', authMiddleware, postController.getSavedPosts);
router.get('/posts/passed/:id', postController.getPassedPosts);
router.get('/posts/passed', authMiddleware, postController.getPassedPosts);

export const postRouter = router;