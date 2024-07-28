import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: Schema.Types.ObjectId, ref: 'Test' },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', default: [] }],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
});

commentSchema.pre('validate', function (next) {
    if (!this.quiz && !this.test) {
        next(new Error('Either quizId or testId must be present.'));
    } else if (this.quiz && this.test) {
        next(new Error('Only one of testId or quizId can be present'));
    } else {
        next();
    }
});

export default mongoose.model('Comment', commentSchema)