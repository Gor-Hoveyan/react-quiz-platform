import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import API from './../api/axiosConfig';
import { TestPageFormValues } from '../pages/testPage/TestPage';

export type Answer = {
    answer: string,
    points: number
}

export interface IQuestion {
    question: string,
    answers: Answer[]
}

export type Result = {
    result: string,
    minScore: number,
    maxScore: number
}

export interface Test {
    _id: string,
    name: string,
    description: string,
    author: {
        _id: string,
        username: string,
        avatarUrl: string,
    },
    questions: IQuestion[],
    results: Result[],
    score: number,
    likes: number,
    passed: number,
    views: number,
    saves: number,
    comments: string[],
    commentAnswers: string[],
    createdAt: string,
    isUpdated: [],
    __v: number
}

interface IStore {
    test: Test | null,
    result: string,
    score: number,
    formError: string,
    createdTestId: string,
    getTest: (testId: string) => void,
    createTest: (name: string, description: string, questions: IQuestion[], results: Result[], score: number) => void,

    submitTest: (data: TestPageFormValues) => void,
    setFormError: (err: string) => void,
    setScore: (num: number) => void,
    resetCreatedTestId: () => void,
}

const useTestStore = create<IStore>()(devtools(immer((set, get) => ({
    test: null,
    result: '',
    formError: '',
    score: 0,
    createdTestId: '',
    getTest: async (testId) => {
        API.get(`/test/${testId}`).then(res => {
            set({ test: res.data.test });
        })
    },
    createTest: async (name, description, questions, results, score) => {
        await API.post(`test`, { name, description, questions, results, score }).then(res => set({ createdTestId: res.data.id }));
    },
    submitTest: async (data) => {
        let score = 0;
        data.questions.forEach(q => {
            if (q.selectedAnswer) {
                score += Number(q.selectedAnswer);
            }
        });
        const testId = get().test?._id;
        await API.post('/test/submit', {testId, score}).then(res => {
            set({ result: res.data.result });
        }).catch(err => console.log(err));
    },
    setFormError: (err) => {
        set({ formError: err });
    },
    setScore: (num) => {
        set({ score: num });
    },
    resetCreatedTestId: () => {
        set({createdTestId: ''});
    }
}))));

export default useTestStore;