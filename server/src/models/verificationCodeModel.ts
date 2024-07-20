import mongoose, { Schema } from 'mongoose';

const verificationCodeSchema = new Schema({
    code: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now() }
});

export default mongoose.model('VerificationCode', verificationCodeSchema);