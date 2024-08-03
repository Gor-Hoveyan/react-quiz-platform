import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import API from './../api/axiosConfig';

export interface IComment extends Omit<ICommentAnswer, 'parentComment'> {
    answers: ICommentAnswer[],
}

export interface ICommentAnswer {
    _id: string,
    comment: string,
    author: {
        username: string,
        _id: string,
        avatarUrl: string,
    },
    parentComment: string,
    likes: number,
    createdAt: string
}

interface IStore {
    comments: IComment[],
    isAnswering: string,
    isUpdating: string,
    updatingAnswer: string,
    createComment: (comment: string, testId: string) => void,
    updateComment: (newComment: string, commentId: string, testId: string) => void,
    removeComment: (commentId: string, testId: string) => void,
    likeComment: (comment: string) => void,
    createAnswer: (answer: string, testId: string) => void,
    updateAnswer: (newAnswer: string, answerId: string) => void,
    removeAnswer: (answerId: string, parentId: string) => void,
    likeAnswer: (answerId: string) => void,
    getComments: (testId: string) => void,
    getAnswers: (commentId: string) => void,
    setIsAnswering: (val: string) => void,
    setIsUpdating: (val: string) => void,
    setUpdatingAnswer: (val: string) => void,
}

const useCommentStore = create<IStore>()(devtools(immer((set, get) => ({
    isUpdating: '',
    updatingAnswer: '',
    isAnswering: '',
    comments: [],
    createComment: async (comment, testId) => {
        await API.post(`/comment`, { comment, testId }).then(res => {
            set((state) => {
                state.comments.push(res.data.newComment);
            });
        }).catch(err => console.log(err));
    },
    updateComment: async (newComment, commentId, testId) => {
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
    removeComment: async (commentId, testId) => {
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
        await API.post(`/comment/like/${comment}`).catch(err => console.log(err));
    },
    createAnswer: async (answer, testId) => {
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
        await API.post(`/answer/like/${answer}`).catch(err => console.log(err));
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
    getComments: async (testId) => {
        await API.get(`/comment/${testId}`).then(res => {
            set({ comments: res.data });
        }).catch(err => console.log(err));
    },
    getAnswers: async (commentId) => {
        await API.get(`/answer/${commentId}`).then(res => {
            console.log(res.data);
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
}))));

export default useCommentStore;