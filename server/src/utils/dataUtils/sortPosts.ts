import { QuizType, TestType } from "../../services/postService";

export default function sortPosts(posts: (TestType | QuizType)[]) {
    posts.sort((a, b) => Date.parse(String(a.createdAt)) - Date.parse(String(b.createdAt)));
}