import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    avatarUrl: { type: String, required: true, default: ' ' },
    isActivated: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    bio: { type: String, required: true, default: '' },
    likes: { type: Number, required: true, default: 0 },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    followings: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Test', required: true, default: [] }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Test', required: true, default: [] }],
    createdTests: [{ type: Schema.Types.ObjectId, ref: 'Test', required: true, default: [] }],
    showLikedPosts: { type: Boolean, required: true, default: false },
    showPassedTests: { type: Boolean, required: true, default: false },
    likedComments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true, default: [] }],
    likedAnswers: [{ type: Schema.Types.ObjectId, ref: 'Answer', required: true, default: [] }],
    createdQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz', required: true, default: [] }],
    likedQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz', required: true, default: [] }],
    savedQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz', required: true, default: [] }],
    passedTests: [
        {
            testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true  },
            result: { type: String, required: true },
        }
    ],
    passedQuizzes: [
        {
            quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
            result: { type: Number, required: true },
        }
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true, default: [] }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', required: true, default: [] }],
});

export default mongoose.model('User', userSchema);