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

type PostType = IQuiz | Test;

interface IStore {
    errText: string,
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
    getUserTests: (userId: string) => void,
    getUserQuizzes: (userId: string) => void,
    getUserPosts: (userId: string) => void,
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
    getFollowers: (id?: string) => void,
    getFollowings: (id?: string) => void,
    getLikedPosts: (id?: string) => void,
    getPassedPosts: (id?: string) => void,
    getSavedPosts: () => void,
    newVerificationCode: () => void,
    setVerificationTimer: (seconds: number) => void
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
        }).catch(err =>{ console.log(err); set({ isLogged: false });});
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
    getUserTests: async (userId) => {
        set({ isLoading: true });
        await API.get(`/tests/${userId}`).then(res => {
            set({ tests: res.data.tests });
            set({ isLoading: false });
        }).catch(err => { new Error(err) });
        set({isLoading: false});
    },
    getUserQuizzes: async (userId) => {
        set({ isLoading: true });
        await API.get(`/quizzes/${userId}`).then(res => {
            set({ quizzes: res.data.quizzes });
            set({ isLoading: false });
        }).catch(err => { new Error(err) });
        set({isLoading: false});
    },
    getUserPosts:  async (userId) => {
        set({ isLoading: true });
        await API.get(`/posts/user/${userId}`).then(res => {
            set({ posts: res.data.posts });
            set({ isLoading: false });
        }).catch(err => { new Error(err) });
        set({isLoading: false});
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
    getFollowers: async (id) => {
        if (id) {
            await API.get(`/followers/${id}`).then(res => {
                set((state) => {
                    return {
                        ...state,
                        userPage: {
                            ...state.userPage,
                            followers: res.data.followers,
                        },
                    };
                });
            }).catch(err => console.log(err));
        } else {
            await API.get(`/followers`).then(res => {
                set((state) => {
                    return {
                        ...state,
                        user: {
                            ...state.user,
                            followers: res.data.followers,
                        },
                    };
                });
            }).catch(err => console.log(err));
        }
    },
    getFollowings: async (id) => {
        if (id) {
            await API.get(`/followings/${id}`).then(res => {
                set((state) => {
                    return {
                        ...state,
                        userPage: {
                            ...state.userPage,
                            followings: res.data.followings,
                        },
                    };
                });
            }).catch(err => console.log(err));
        } else {
            await API.get(`/followings`).then(res => {
                set((state) => {
                    return {
                        ...state,
                        user: {
                            ...state.user,
                            followings: res.data.followings,
                        },
                    };
                });
            }).catch(err => console.log(err));
        }
    },
    getLikedPosts: async (id) => {
        if (id) {
            await API.get(`/posts/liked/${id}`).then(res => {
                set({likedPosts: res.data.posts});
            }).catch(err => console.log(err));
        } else {
            await API.get(`/posts/liked`).then(res => {
                set({likedPosts: res.data.posts});
            }).catch(err => console.log(err));
        }
    },
    getSavedPosts: async () => {
        await API.get(`/posts/saved`).then(res => {
            set({savedPosts: res.data.posts});
        }).catch(err => console.log(err));
    },
    getPassedPosts: async (id) => {
        if (id) {
            await API.get(`/posts/passed/${id}`).then(res => {
                set({passedPosts: res.data.posts});
            }).catch(err => console.log(err));
        } else {
            await API.get(`/posts/passed`).then(res => {
                set({passedPosts: res.data.posts});
            }).catch(err => console.log(err));
        }
    },
    newVerificationCode: async () => {
        await API.get(`/newCode`).then(() => {
            set({verificationTimer: 120});
        }).catch(err => {
            
            if(err.response.data.status === 503) {debugger
                set({verificationTimer: Number(err.response.data.message.split(' ')[3])})
                console.log(Number(err.response.data.message.split(' ')[3]))
            }
            console.log(err);
        });
    },
    setVerificationTimer: (seconds) => {
        set({verificationTimer: seconds});
    }
})
),
),
);

export default useUserStore;