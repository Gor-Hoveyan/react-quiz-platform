import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: Schema.Types.ObjectId, ref: 'Test' },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: '' },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
});

answerSchema.pre('validate', function (next) {
    if (!this.test && !this.quiz) {
        next(new Error('Either quizId or testId must be present.'));
    } else if (this.test && this.quiz) {
        next(new Error('Only one of quizId or testId can be present.'));
    }
});

export default mongoose.model('Answer', answerSchema)