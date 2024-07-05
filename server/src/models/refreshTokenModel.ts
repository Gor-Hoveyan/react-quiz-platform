import mongoose, { Schema } from "mongoose";

const refreshTokenModel = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: 'true'},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), required: true},
    expiresAt: {type: Date, required: true}
});

export default mongoose.model('RefreshToken', refreshTokenModel);