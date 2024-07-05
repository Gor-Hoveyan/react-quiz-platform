import mongoose, { Schema } from "mongoose";

const testSchema = new Schema({
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
                        points: { type: Number, required: true, enum: [0, 1, 2, 3] }
                    }
                ]
            },
        }
    ],
    results: [
        {
            result: { type: String, required: true },
            minScore: { type: Number, required: true },
            maxScore: { type: Number, required: true }
        }
    ],
    score: { type: Number, required: true },
    likes: { type: Number, default: 0, required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    commentAnswers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    createdAt: { type: Date, default: Date.now() },
    isUpdated: [Date]
});


export default mongoose.model('Test', testSchema)