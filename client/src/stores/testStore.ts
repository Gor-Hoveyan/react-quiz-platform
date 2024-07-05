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

export interface IComment extends ICommentAnswer {
    answers: ICommentAnswer[],
}

export interface ICommentAnswer {
    _id: string,
    comment: string,
    author: {
        username: string,
        _id: string
    },
    likes: number,
    createdAt: string
}

export interface Test {
    _id: string,
    name: string,
    description: string,
    author: {
        _id: string,
        username: string
    },
    questions: IQuestion[],
    results: Result[],
    score: number,
    likes: number,
    comments: string[],
    commentAnswers: string[],
    createdAt: string,
    isUpdated: [],
    __v: number
}

interface IStore {
    test: Test | null,
    isAnswering: string,
    isUpdating: string,
    updatingAnswer: string,
    result: string,
    score: number,
    comments: IComment[],
    formError: string,
    createdTestId: string,
    getTest: (testId: string) => void,
    createTest: (name: string, description: string, questions: IQuestion[], results: Result[], score: number) => void,
    getComments: () => void,
    getAnswers: (commentId: string) => void,
    calculateResult: (data: TestPageFormValues) => void,
    setFormError: (err: string) => void,
    setScore: (num: number) => void,
    createComment: (comment: string) => void,
    updateComment: (newComment: string, commentId: string) => void,
    removeComment: (commentId: string) => void,
    likeComment: (comment: string) => void,
    createAnswer: (answer: string) => void,
    updateAnswer: (newAnswer: string, answerId: string) => void,
    removeAnswer: (answerId: string, parentId: string) => void,
    likeAnswer: (answerId: string) => void,
    setIsAnswering: (val: string) => void,
    setIsUpdating: (val: string) => void,
    setUpdatingAnswer: (val: string) => void,
}


const useTestStore = create<IStore>()(devtools(immer((set, get) => ({
    test: null,
    result: '',
    formError: '',
    isUpdating: '',
    updatingAnswer: '',
    isAnswering: '',
    comments: [],
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
    getComments: async () => {
        await API.get(`/comment/${get().test?._id}`).then(res => {
            set({ comments: res.data });
        }).catch(err => console.log(err));
    },
    getAnswers: async (commentId) => {
        await API.get(`/answer/${commentId}`).then(res => {
            set((state) => {
                state.comments.map(comment => {
                    if (comment._id === commentId) {
                        comment.answers = res.data;
                    }
                    return comment;
                })
            })
        }).catch(err => console.log(err));
    },
    calculateResult: (data) => {
        let score = 0;

        data.questions.forEach(q => {
            if (q.selectedAnswer) {
                score += Number(q.selectedAnswer);
            }
        });

        const currentTest = get().test;

        if (currentTest !== null) {
            let computedResult = '';

            for (let i = 0; i < currentTest.results.length; i++) {
                const res = currentTest.results[i];
                if (score >= res.minScore && score <= res.maxScore) {
                    computedResult = res.result;
                    break;
                }
            }

            set({ result: computedResult });
        }
    },
    setFormError: (err) => {
        set({ formError: err });
    },
    setScore: (num) => {
        set({ score: num });
    },
    createComment: async (comment) => {
        const testId = get().test?._id;
        await API.post(`/comment`, { comment, testId }).then(res => {
            set((state) => {
                state.comments.push(res.data.newComment);
            });
        }).catch(err => console.log(err));
    },
    updateComment: async (newComment, commentId) => {
        const testId = get().test?._id;
        await API.put(`/comment`, { comment: commentId, testId, newComment }).then(res => {
            set((state) => {
                state.comments.map((comment, index) => {
                    if (res.data.updatedComment._id === commentId) {
                        state.comments[index] = res.data.updatedComment;
                    }
                    return comment;
                })
            })
        });
    },
    removeComment: async (commentId) => {
        const testId = get().test?._id;
        await API.delete(`/comment`, { data: { commentId, testId } }).then(res => {
            if (res.data.message === 'Success') {
                set((state) => {
                    state.comments.map((comment, index) => {
                        if (comment._id === commentId) {
                            state.comments.splice(index, 1);
                        }
                        return comment
                    })
                })
            }
        });
    },
    likeComment: async (comment) =>{
        await API.post(`/likeComment/${comment}`).catch(err => console.log(err));
    },
    createAnswer: async (answer) => {
        const testId = get().test?._id;
        let parentId = get().isAnswering;
        await API.post(`/answer`, { answer, testId, parentId }).then(res => {
            set((state) => {
                state.comments.map(comment => {
                    if (comment._id === parentId) {
                        comment.answers = [...comment.answers, res.data.newAnswer];
                    }
                    return comment;
                })
            })
        }).catch(err => console.log(err));
    },
    updateAnswer: async (newAnswer, answerId) => {
        await API.put(`/answer`, { answerId, newAnswer }).then(res => {
            set((state) => {
                state.comments.map((comment) => {
                    if (comment._id === res.data.updatedAnswer.parentComment) {
                        comment.answers.map((answer, index) => {
                            if (answer._id === res.data.updatedAnswer._id) {
                                comment.answers[index] = res.data.updatedAnswer;
                            }
                            return answer;
                        });
                    }
                    return comment;
                })
            })
        });
    },
    removeAnswer: async (answerId, parentId) => {
        await API.delete(`/answer`, { data: { parentId, answerId } }).then(res => {
            if (res.data.message === 'Success') {
                set((state) => {
                    state.comments.map((comment) => {
                        if (comment._id === parentId) {
                            comment.answers.map((answer, index) => {
                                if (answer._id === answerId) {
                                    comment.answers.splice(index, 1);
                                }
                                return comment;
                            })
                        }
                        return comment
                    })
                })
            }
        });
    },
    likeAnswer: async (answer) =>{
        await API.post(`/likeAnswer/${answer}`).catch(err => console.log(err));
    },
    setIsAnswering: (val) => {
        set({ isAnswering: val });
    },
    setIsUpdating: (val) => {
        set({ isUpdating: val });
    },
    setUpdatingAnswer: (val) => {
        set({ updatingAnswer: val });
    },
}))));

export default useTestStore;