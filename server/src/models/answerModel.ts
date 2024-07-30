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

export default mongoose.model('Answer', answerSchema)