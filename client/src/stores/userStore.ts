import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import API from '../api/axiosConfig';
import { AxiosResponse } from 'axios';
import { Test } from './testStore';
import uploadImg from '../services/uploadService';
import { IQuiz } from './quizStore';

export interface IUserIcon {
    _id: string,
    username: string,
    avatarUrl: string,
}

export interface PaginationData {
    page: number,
    limit: number
}

type PostType = IQuiz | Test;

interface IStore {
    errText: string,
    postsCount: number,
    likedPostsCount: number,
    savedPostsCount: number,
    passedPostsCount: number,
    followersCount: number,
    followingsCount: number,
    testsCount: number,
    quizzesCount: number,
    followers: IUserIcon[],
    followings: IUserIcon[],
    isUpdated: boolean,
    isMenuOpen: boolean,
    isLogged: boolean,
    isRegistered: boolean,
    dropArea: boolean
    user: IUser | null,
    userPage: IUser | null,
    tests: Test[],
    quizzes: IQuiz[],
    posts: PostType[],
    likedPosts: PostType[],
    savedPosts: PostType[],
    passedPosts: (IPassedQuiz | IPassedTest)[],
    isLoading: boolean,
    verificationTimer: number,
    register: (email: string, username: string, password: string) => void,
    login: (email: string, password: string) => void,
    setError: (err: string) => void,
    logout: () => void,
    refresh: () => void,
    getUser: () => void,
    updateUser: (username: string, bio: string, showLikedPosts: boolean, showPassedTests: boolean) => void,
    getUserTests: (userId: string, page: number, limit: number) => void,
    getUserQuizzes: (userId: string, page: number, limit: number) => void,
    getUserPosts: (userId: string, page: number, limit: number) => void,
    handleIsLogged: (val: boolean) => void,
    handleIsRegistered: (val: boolean) => void,
    handleIsUpdated: (val: boolean) => void,
    handleDropArea: (val: boolean) => void,
    like: (testId: string) => void,
    save: (testId: string) => void,
    likeQuiz: (quizId: string) => void,
    saveQuiz: (quizId: string) => void,
    toggleMenu: () => void,
    follow: (userId: string) => void,
    unfollow: (userId: string) => void,
    getUserPage: (userid: string) => void,
    setAvatar: (img: File) => void,
    getFollowers: (id: string, page: number, limit: number) => void,
    getFollowings: (id: string, page: number, limit: number) => void,
    getLikedPosts: (id: string, page: number, limit: number) => void,
    getPassedPosts: (id: string, page: number, limit: number) => void,
    getSavedPosts: (page: number, limit: number) => void,
    newVerificationCode: () => void,
    setVerificationTimer: (seconds: number) => void,
    clearPosts: () => void,
}

type PassedTest = {
    testId: string,
    result: string
}

export interface IPassedTest extends Test {
    finalResult: string
}

type PassedQuiz = {
    quizId: string,
    result: number,
}

export interface IPassedQuiz extends IQuiz {
    finalResult: number
}

interface IUser {
    _id: string,
    username: string,
    email: string,
    bio: string,
    avatarUrl: string,
    isActivated: boolean,
    likes: number,
    followers: (IUserIcon | Number)[],
    followings: (IUserIcon | Number)[],
    likedTests: (Test | string)[],
    savedTests: (Test | string)[],
    passedTests: (PassedTest | IPassedTest)[],
    createdTests: [],
    likedQuizzes: (IQuiz | string)[],
    savedQuizzes: (IQuiz | string)[],
    passedQuizzes: (PassedQuiz | IPassedQuiz)[],
    createdQuizzes: [],
    showLikedPosts: boolean,
    showPassedPosts: boolean,
    likedComments: [],
    likedAnswers: [],
    posts: [],
    __v: number,
}

const useUserStore = create<IStore>()(devtools(immer((set, get) => ({
    errText: '',
    postsCount: 1,
    likedPostsCount: 1,
    savedPostsCount: 1,
    passedPostsCount: 1,
    followersCount: 1,
    followingsCount: 1,
    testsCount: 1,
    quizzesCount: 1,
    followers: [],
    followings: [],
    isUpdated: false,
    isLogged: false,
    isMenuOpen: false,
    isRegistered: false,
    dropArea: false,
    verificationTimer: 0,
    user: null,
    userPage: null,
    tests: [],
    quizzes: [],
    posts: [],
    likedPosts: [],
    savedPosts: [],
    passedPosts: [],
    isLoading: false,
    register: async (email, username, password) => {
        await API.post(`/auth/register`, { email, username, password }).then(res => {
            console.log(res)
            if (res.data.message === 'Success') {
                set({ isRegistered: true });
            }
        }).catch(err => { new Error(err.response); set({ errText: err.response.data.message }); });
    },
    login: async (email, password) => {
        await API.post(`/auth/login`, { email, password }).then((res: AxiosResponse<any>) => {
            if (res.data.accessToken) {
                document.cookie = `token=${res.data.accessToken};`;
                set({ isLogged: true, user: res.data.user });
            } else {
                set({ errText: 'Invalid email or password' });
                set({ isLogged: false });
            }
        }).catch(err => {
            set({ errText: 'Invalid password or email' });
        });
    },
    logout: async () => {
        await API.post(`/auth/logout`).then(res => {
            if (res.data.message === 'Success') {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
                set({ isLogged: false, isRegistered: false });

            }
        }).catch(err => { new Error(err) });
    },
    refresh: async () => {
        await API.get(`/auth/refresh`).then(res => {
            if (res.data.accessToken.length) {
                document.cookie = `token=${res.data.accessToken};`;
                set({ isLogged: true, user: res.data.user });
            } else {
                set({ isLogged: false });
            }
        }).catch(err => { console.log(err); set({ isLogged: false }); });
    },
    getUser: async () => {
        await API.get(`/user`).then(res => {
            if (res.data.user) {
                set({ user: res.data.user });
            }
        }).catch(err => { new Error(err) });
    },
    updateUser: async (username, bio, showLikedPosts, showPassedTests) => {
        await API.put(`/user`, { username, bio, showLikedPosts, showPassedTests }).then(res => {
            if (res.data.message !== 'Success') {
                set({ errText: res.data.message });
            }
        }).catch(err => { new Error(err) });
    },
    getUserTests: async (userId, page, limit) => {
        set({ isLoading: true });
        await API.get(`/user/tests/${userId}?page=${page}&limit=${limit}`).then(res => {
            set({ tests: res.data.tests, testsCount: res.data.totalTests, isLoading: false});
        }).catch(err => { new Error(err) });
        set({ isLoading: false });
    },
    getUserQuizzes: async (userId, page, limit) => {
        set({ isLoading: true });
        await API.get(`/user/quizzes/${userId}?page=${page}&limit=${limit}`).then(res => {
            set({ quizzes: res.data.quizzes, quizzesCount: res.data.totalQuizzes, isLoading: false });
        }).catch(err => { new Error(err) });
        set({ isLoading: false });
    },
    getUserPosts: async (userId, page, limit) => {
        set({ isLoading: true });
        const posts = get().posts;
        await API.get(`/posts/user/${userId}?page=${page}&limit=${limit}`).then(res => {
            set({ posts: [...posts, ...res.data.posts], postsCount: res.data.totalPosts });
            set({ isLoading: false });
        }).catch(err => { new Error(err) });
        set({ isLoading: false });
    },
    setError: (err) => {
        set({ errText: err });
    },
    handleIsLogged: (val) => {
        set({ isLogged: val });
    },
    handleIsRegistered: (val) => {
        set({ isRegistered: val });
    },
    handleIsUpdated: (val) => {
        set({ isUpdated: val });
    },
    handleDropArea: (val) => {
        set({ dropArea: val });
    },
    like: async (testId) => {
        await API.put(`/test/like/${testId}`).catch(err => { new Error(err) });
    },
    save: async (testId) => {
        await API.put(`/test/save/${testId}`).catch(err => { new Error(err) });
    },
    likeQuiz: async (quizId) => {
        await API.put(`/quiz/like/${quizId}`).catch(err => { new Error(err) });
    },
    saveQuiz: async (quizId) => {
        await API.put(`/quiz/save/${quizId}`).catch(err => { new Error(err) });
    },
    toggleMenu: () => {
        const isMenuOpen = get().isMenuOpen;
        set({ isMenuOpen: !isMenuOpen });
    },
    follow: async (userId) => {
        await API.put(`/follow/${userId}`, { userId }).catch(err => { new Error(err) });
    },
    unfollow: async (userId) => {
        await API.put(`/unfollow/${userId}`).catch(err => { new Error(err) });
    },
    getUserPage: async (userId) => {
        await API.get(`/userPage/${userId}`).then(res => {
            if (res.data.user) {
                set({ userPage: res.data.user });
            }
        }).catch(err => { new Error(err) });
    },
    setAvatar: async (img) => {
        const avatarUrl = await uploadImg(img);
        await API.put(`/avatar`, { avatarUrl }).catch(err => { new Error(err) });
    },
    getFollowers: async (id, page, limit) => {
        const followers = get().followers;
        await API.get(`/followers/${id}?page=${page}&limit=${limit}`).then(res => {
            set({followers: [...followers, ...res.data.followers], followersCount: res.data.followersCount});
        }).catch(err => console.log(err));
    },
    getFollowings: async (id, page, limit) => {
        const followings = get().followings;
        await API.get(`/followings/${id}?page=${page}&limit=${limit}`).then(res => {
            set({followings: [...followings, ...res.data.followings], followingsCount: res.data.followersCount});
        }).catch(err => console.log(err));
    },
    getLikedPosts: async (id, page, limit) => {
        const likedPosts = get().likedPosts;
        await API.get(`/posts/liked/${id}?page=${page}&limit=${limit}`).then(res => {
            set({ likedPosts: [...likedPosts, ...res.data.posts], likedPostsCount: res.data.totalPosts });
        }).catch(err => console.log(err));
    },
    getSavedPosts: async (page, limit) => {
        const savedPosts = get().savedPosts;
        await API.get(`/posts/saved?page=${page}&limit=${limit}`).then(res => {
            set({ savedPosts: [...savedPosts, ...res.data.posts], savedPostsCount: res.data.totalPosts });
        }).catch(err => console.log(err));
    },
    getPassedPosts: async (id, page, limit) => {
        const passedPosts = get().passedPosts;
        await API.get(`/posts/passed/${id}?page=${page}&limit=${limit}`).then(res => {
            set({ passedPosts: [...passedPosts, ...res.data.posts], passedPostsCount: res.data.totalPosts });
        }).catch(err => console.log(err));
    },
    newVerificationCode: async () => {
        await API.get(`/newCode`).then(() => {
            set({ verificationTimer: 120 });
        }).catch(err => {
            if (err.response.data.status === 503) {
                set({ verificationTimer: Number(err.response.data.message.split(' ')[3]) })
                console.log(Number(err.response.data.message.split(' ')[3]))
            }
            console.log(err);
        });
    },
    setVerificationTimer: (seconds) => {
        set({ verificationTimer: seconds });
    },
    clearPosts: () => {
        set({ posts: [], likedPosts: [], savedPosts: [], passedPosts: [], followers: [], followings: [], postsCount: 1, followersCount: 1, followingsCount: 1, likedPostsCount: 1, savedPostsCount: 1, passedPostsCount: 1 });
    },
})
),
),
);

export default useUserStore;