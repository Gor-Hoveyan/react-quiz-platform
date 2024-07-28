import mongoose, { Schema } from 'mongoose';

const quizSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [
        {
            question: { type: String, require: true },
            answers: {
                type: [
                    {
                        answer: { type: String, required: true },
                        isRight: { type: Boolean, required: true }
                    }
                ]
            },
        }
    ],
    likes: { type: Number, default: 0, required: true },
    saves: { type: Number, default: 0, required: true },
    passed: { type: Number, default: 0, required: true },
    views: { type: Number, default: 0, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    commentAnswers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    createdAt: { type: Date, default: Date.now() },
    isUpdated: [Date]
});

export default mongoose.model('Quiz', quizSchema);