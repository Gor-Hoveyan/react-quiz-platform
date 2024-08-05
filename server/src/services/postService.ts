import Test from './../models/testModel';
import Quiz from './../models/quizModel';
import User from './../models/userModel';
import { InferSchemaType } from 'mongoose';
import sortPosts from '../utils/dataUtils/sortPosts';

export type TestType = InferSchemaType<typeof Test.schema>;
export type QuizType = InferSchemaType<typeof Quiz.schema>;
type PostType = TestType | QuizType;

async function getUserPosts(userId: string, page: number, limit: number) {
    const user = await User.findById(userId).populate({
        path: 'createdTests',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        }
    }).populate({
        path: 'createdQuizzes',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        },
    });
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const posts: PostType[] = [...((user.createdTests as unknown) as TestType[]), ...((user.createdQuizzes as unknown) as QuizType[])];
    sortPosts(posts);
    return {posts: posts.slice((page - 1)  * limit, page * limit), totalPosts: posts.length};
}

async function searchPosts(name: any, filter: string, page: number, limit: number) {
    if (filter === 'test') {
        const tests = await Test.find(name ? { name: new RegExp(name, 'i') } : {}).populate('author', ['username', 'avatarUrl']);
        if (!tests) {
            throw ({ status: 404, message: 'Posts not found' });
        }
        sortPosts(tests);
        return {posts: tests.slice((page - 1)  * limit, page * limit), totalPosts: tests.length};
    } else if (filter === 'quiz') {
        const quizzes = await Quiz.find(name ? { name: new RegExp(name, 'i') } : {}).populate('author', ['username', 'avatarUrl'])
        if (!quizzes) {
            throw ({ status: 404, message: 'Posts not found' });
        }
        sortPosts(quizzes);
        return {posts: quizzes.slice((page - 1)  * limit, page * limit), totalPosts: quizzes.length};
    }
    const tests = await Test.find(name ? { name: new RegExp(name, 'i') } : {}).populate('author', ['username', 'avatarUrl']);
    const quizzes = await Quiz.find(name ? { name: new RegExp(name, 'i') } : {}).populate('author', ['username', 'avatarUrl'])
    if (!tests && !quizzes) {
        throw ({ status: 404, message: 'Posts not found' });
    }
    const posts: PostType[] = [...tests, ...quizzes];
    sortPosts(posts);
    return {posts: posts.slice((page - 1)  * limit, page * limit), totalPosts: posts.length};
}

async function pagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    limit = limit / 2;
    const tests = await Test.find({}, null, { skip, limit }).populate('author', ['username', 'avatarUrl']);
    const quizzes = await Quiz.find({}, null, { skip, limit }).populate('author', ['username', 'avatarUrl']);
    const totalPages = Math.ceil((tests.length + quizzes.length) / limit * 2);

    if (tests.length === 0 && quizzes.length === 0) {
        throw ({ status: 404, message: 'Posts not found' });
    }
    return { posts: [...tests, ...quizzes], totalPages };
}

async function getLikedPosts(userId: string, page: number, limit: number) {
    const user = await User.findById(userId).populate({
        path: 'likedTests',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        }
    }).populate({
        path: 'likedQuizzes',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        }
    });
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const posts: PostType[] = [...((user.likedTests as unknown) as TestType[]), ...((user.likedQuizzes as unknown) as QuizType[])];
    sortPosts(posts)
    return {posts: posts.slice((page - 1)  * limit, page * limit), totalPosts: posts.length};
}

async function getPassedPosts(userId: string, page: number, limit: number) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }

    const passedTests = [];
    for (let i = 0; i < user.passedTests.length; i++) {
        const test = await Test.findById(user.passedTests[i].testId).populate({
            path: 'author',
            select: ['username', 'avatarUrl']
        });
        if (!test) {
            throw { status: 404, message: 'Test not found' };
        }
        const finalResult = user.passedTests[i].result;
        passedTests[i] = { ...test.toObject(), finalResult };
    }
    const passedQuizzes = [];
    for (let i = 0; i < user.passedQuizzes.length; i++) {
        const quiz = await Quiz.findById(user.passedQuizzes[i].quizId).populate({
            path: 'author',
            select: ['username', 'avatarUrl']
        });
        if (!quiz) {
            throw { status: 404, message: 'Quiz not found' };
        }
        const finalResult = user.passedQuizzes[i].result;
        passedQuizzes[i] = { ...quiz.toObject(), finalResult };
    }
    const posts: PostType[] = [...((passedTests as unknown) as TestType[]), ...((passedQuizzes as unknown) as QuizType[])];
    sortPosts(posts)
    return {posts: posts.slice((page - 1)  * limit, page * limit), totalPosts: posts.length};
}

async function getSavedPosts(userId: string, page: number, limit: number) {
    const user = await User.findById(userId).populate({
        path: 'savedTests',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        }
    }).populate({
        path: 'savedQuizzes',
        populate: {
            path: 'author',
            select: ['username', 'avatarUrl']
        }
    });
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const posts: PostType[] = [...((user.savedTests as unknown) as TestType[]), ...((user.savedQuizzes as unknown) as QuizType[])];
    sortPosts(posts)
    return {posts: posts.slice((page - 1)  * limit, page * limit), totalPosts: posts.length};
}

export const postService = {
    getUserPosts,
    searchPosts,
    pagination,
    getLikedPosts,
    getPassedPosts,
    getSavedPosts
}