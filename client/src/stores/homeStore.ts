import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';
import API from './../api/axiosConfig';
import { Test } from './testStore';

interface IStore {
    tests: Test[] | null,
    searchVal: string,
    currentPage: number,
    totalPages: number,
    isLoading: boolean,
    getTests: () => void,
    searchTests: () => void,
    handleSearchVal: (val: string) => void,
    setPagination: () => void,
    setCurrentPage: (page: number) => void,
}

const useHomeStore = create<IStore>()(devtools(immer((set, get) => ({
    tests: null,
    searchVal: '',
    currentPage: 1,
    totalPages: 10,
    isLoading: false,
    getTests: async () => {
        set({ isLoading: true });
        await API.get(`/tests`).then(res => {
            set({ tests: res.data.tests });
            set({ isLoading: false });
        })
    },
    searchTests: async () => {
        set({ isLoading: true });
        await API.post(`/tests/search`, { name: get().searchVal }).then(res => {
            if (res.data.tests.length) {
                set({ tests: res.data.tests });
                set({ isLoading: false });
            } else {
                set({ tests: null });
                set({ isLoading: false });
            }
        }).catch(err => console.log(err));
    },
    handleSearchVal: (val) => {
        set({ searchVal: val });
    },
    setPagination: async () => {
        await API.get(`/tests/pagination?page=${get().currentPage}&limit=10`).then(res => {
            if(res.data.totalPages && res.data.tests.length) {
                set({totalPages: Number(res.data.totalPages)});
                set({tests: res.data.tests});
            }
        }).catch(err => { new Error(err)});
    },
    setCurrentPage: (page) => {
        set({currentPage: page});
    }
}))));

export default useHomeStore;