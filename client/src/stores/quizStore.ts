import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import API from './../api/axiosConfig';
import { IComment } from './commentStore';

export interface IQuiz {
    _id: string,
    name: string,
    description: string,
    author: {
        _id: string,
        username: string,
        avatarUrl: string,
    },
    questions: IQuizQuestion[],
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

export interface IQuizQuestion {
    question: string,
    answers: IQuizAnswer[],
    rightAnswer: number | null
}

export interface IQuizAnswer {
    answer: string,
}

interface IStore {
    quiz: IQuiz | null,
    result: number,
    isSuccess: boolean,
    comments: IComment[],
    formError: string,
    createdQuizId: string,
    getQuiz: (quizId: string) => void,
    createQuiz: (name: string, description: string, questions: IQuizQuestion[]) => void,
    submitQuiz: (quizId: string, rightAnswers: number) => void,
    setFormError: (err: string) => void,
    resetCreatedTestId: () => void,
}

const useQuizStore = create<IStore>()(devtools(immer((set, get) => ({
    quiz: null,
    result: 0,
    isSuccess: false,
    comments: [],
    formError: '',
    createdQuizId: '',
    getQuiz: async (quizId) => {
        API.get(`/quiz/${quizId}`).then(res => {
            set({ quiz: res.data.quiz });
        })
    },
    createQuiz: async (name, description, questions) => {
        await API.post(`quiz`, { name, description, questions }).then(res => set({ createdQuizId: res.data.id }));

    },
    setFormError: (err) => {
        set({formError: err});
    },
    resetCreatedTestId: () => {
        set({createdQuizId: ''});
    },
    submitQuiz: async (quizId, rightAnswers) => {
        await API.post('/quiz/submit', {quizId, rightAnswers}).then(res => {
            set({ result: res.data.result, isSuccess: true });
        }).catch(err => console.log(err));
    }
}))));

export default useQuizStore;