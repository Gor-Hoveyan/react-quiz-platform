import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },   
    test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' , default: []}],
    likes: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model('Comment', commentSchema)