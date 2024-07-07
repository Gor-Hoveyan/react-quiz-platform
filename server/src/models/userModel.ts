import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    isActivated: {type: Boolean, required: true, default: false},
    password: {type: String, required: true},
    likedPosts: [{type: Schema.Types.ObjectId, ref: 'Test', required: true, default: []}],
    savedPosts: [{type: Schema.Types.ObjectId, ref: 'Test', required: true, default: []}],
    likedComments: [{type: Schema.Types.ObjectId, ref: 'Comment',  required: true, default: []}],
    likedAnswers: [{type: Schema.Types.ObjectId, ref: 'Answer',  required: true, default: []}],
    createdTests: [{type: Schema.Types.ObjectId, ref: 'Test', required: true, default: []}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', required: true, default: []}],
    answers: [{type: Schema.Types.ObjectId, ref: 'Answer', required: true, default: []}]
});

export default mongoose.model('User', userSchema);