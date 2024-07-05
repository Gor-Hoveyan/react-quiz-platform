import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import API from '../api/axiosConfig';
import { AxiosResponse } from 'axios';
import { Test } from './testStore';

interface IStore {
    errText: string,
    isLogged: boolean,
    isRegistered: boolean,
    user: IUser | null,
    tests: Test[],
    isLoading: boolean,
    register: (email: string, username: string, password: string) => void,
    login: (email: string, password: string) => void,
    setError: (err: string) => void,
    logout: () => void,
    refresh: () => void,
    getUser: () => void,
    getUserTests: (userId: string) => void,
    handleIsLogged: (val: boolean) => void,
    handleIsRegistered: (val: boolean) => void,
    like: (testId: string) => void
}

interface IUser {
    _id: string,
    username: string,
    email: string,
    isActivated: boolean,
    likedPosts: [],
    likedComments: [],
    createdTests: [],
    posts: [],
    __v: number,
}

const useUserStore = create<IStore>()(devtools(immer((set, get) => ({
    errText: '',
    isLogged: false,
    isRegistered: false,
    user: null,
    tests: [],
    isLoading: false,
    register: async (email, username, password) => {
        await API.post(`/auth/register`, { email, username, password }).then(res => {
            if (res.data.message === 'Success') {
                set({ isRegistered: true });
            }
        });
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

        });
    },
    logout: async () => {
        await API.post(`/auth/logout`).then(res => {
            console.log(res)
            if (res.data.message === 'Success') {
                document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
                set({ isLogged: false });
            } else {
                console.log('something went wrong')
            }
        });
    },
    refresh: async () => {
        await API.get(`/auth/refresh`).then(res => {
            if (res.data.accessToken) {
                document.cookie = `token=${res.data.accessToken};`;
                set({ isLogged: true, user: res.data.user });
            } else {
                set({ isLogged: false });
            }
        }).catch(err => console.log(err))
    },
    getUser: async () => {
        await API.get(`/user`).then(res => {
            if (res.data.user) {
                set({ user: res.data.user });
            }
        }).catch(err => console.log(err));
    },
    getUserTests: async (userId) => {
        set({ isLoading: true });
        await API.get(`/tests/${userId}`).then(res => {
            set({ tests: res.data.tests });
            set({ isLoading: false });
        }).catch(err => console.log(err))
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
    like: async (testId) => {
        await API.post(`/likeTest/${testId}`).catch(err => console.log(err));
    }
})
),
),
);

export default useUserStore;