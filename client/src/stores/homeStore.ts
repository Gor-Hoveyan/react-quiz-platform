import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import API from './../api/axiosConfig';
import { Test } from './testStore';
import { IQuiz } from './quizStore';

interface IStore {
    
    posts: Test[] | IQuiz[] | null,
    filter: '' | 'quiz' | 'test',
    searchVal: string,
    currentPage: number,
    totalPages: number,
    isLoading: boolean,
    getTests: () => void,
    searchPosts: () => void,
    handleSearchVal: (val: string) => void,
    setPagination: () => void,
    setCurrentPage: (page: number) => void,
    setFilter: (val: 'quiz' | 'test' | '') => void,
}

const useHomeStore = create<IStore>()(devtools(immer((set, get) => ({
    posts: null,
    filter: '',
    searchVal: '',
    currentPage: 1,
    totalPages: 10,
    isLoading: false,
    getTests: async () => {
        set({ isLoading: true });
        await API.get(`/tests`).then(res => {
            set({ posts: res.data.tests });
            set({ isLoading: false });
        })
    },
    searchPosts: async () => {
        set({ isLoading: true });
        if(get().filter && get().searchVal) {
            await API.get(`/posts/search/?filter=${get().filter}&name=${get().searchVal}`).then(res => {
                if (res.data.posts.length) {
                    set({ posts: res.data.posts });
                    set({ isLoading: false });
                } else {
                    set({ posts: null });
                    set({ isLoading: false });
                }
            }).catch(err => console.log(err));
        } else if(!get().filter) {
            await API.get(`/posts/search/?name=${get().searchVal}`).then(res => {
                if (res.data.posts.length) {
                    set({ posts: res.data.posts });
                    set({ isLoading: false });
                } else {
                    set({ posts: null });
                    set({ isLoading: false });
                }
            }).catch(err => console.log(err));
        } else if(get().filter && !get().searchVal) {
            await API.get(`/posts/search/?filter=${get().filter}`).then(res => {
                if (res.data.posts.length) {
                    set({ posts: res.data.posts });
                    set({ isLoading: false });
                } else {
                    set({ posts: null });
                    set({ isLoading: false });
                }
            }).catch(err => console.log(err))
        }
    },
    handleSearchVal: (val) => {
        set({ searchVal: val });
    },
    setPagination: async () => {
        await API.get(`/posts/?page=${get().currentPage}&limit=10`).then(res => {
            if(res.data.totalPages && res.data.posts.length) {
                set({totalPages: Number(res.data.totalPages)});
                set({posts: res.data.posts});
            }
        }).catch(err => { new Error(err)});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    },
    setFilter: (val) => {
        set({filter: val});
    }
}))));

export default useHomeStore;