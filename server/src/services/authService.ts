import RefreshToken from './../models/refreshTokenModel';
import VerificationCode from './../models/verificationCodeModel';
import generateVerificationCode from '../utils/dataUtils/generateVerificationCode';
import sendCode from '../utils/emailVerification';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './../models/userModel';
import dotenv from 'dotenv';
dotenv.config();

export interface UserJWTPayload extends JwtPayload {
    id: string,
    email: string
}

function generateAccessToken(email: string, id: string) {
    const accessToken = jwt.sign({ id: id, email: email }, process.env.ACCESS_SECRET as Secret, { expiresIn: '1h' });

    return accessToken;
}

async function generateRefreshToken(email: string, id: string) {
    const refreshToken = jwt.sign({ id: id, email: email }, process.env.REFRESH_SECRET as Secret, { expiresIn: '60d' });

    const token = new RefreshToken({ user: id, token: refreshToken, expiresAt: (Date.now() + 60 * 24 * 60 * 60 * 1000) });
    await token.save();

    return refreshToken;
}

async function registerUser(username: string, email: string, password: string) {
    const isEmailRegistered = await User.findOne({ email });
    const isUsernameRegistered = await User.findOne({ username });

    if (isEmailRegistered) {
        throw ({ status: 409, message: 'User with this email already exists' })
    }
    if (isUsernameRegistered) {
        throw ({ status: 409, message: 'User with this username already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash, bio: `${username}\'s bio`, passedTests: [] })
    await newUser.save();
    const code = generateVerificationCode(128);
    const verification = new VerificationCode({ code, userId: newUser._id });
    const url = `${process.env.DOMAIN}/api/verify/${code}`;
    await sendCode(email, url, username);
    verification.save();
    return newUser;
}

async function verifyEmail(code: string) {
    const checkCode = await VerificationCode.findOne({ code });
    if (!checkCode) {
        throw ({ status: 400, message: 'Invalid verification code' });
    }
    await User.findByIdAndUpdate(checkCode.userId, { $set: { isActivated: true } });
    await VerificationCode.findByIdAndDelete(checkCode._id)
}

async function newVerificationCode(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const oldCode = await VerificationCode.findOne({ userId: user._id });
    if (oldCode && Date.now() - Number(oldCode?.createdAt) < 120000) {
        throw ({ status: 503, message: `Please try after ${Math.floor((120000 - (Date.now() - Number(oldCode.createdAt))) / 1000)} seconds` });
    } else if (oldCode && Date.now() - Number(oldCode?.createdAt) > 120000) {
        await VerificationCode.findOneAndDelete({ userId: user._id });
    } else {
        const code = generateVerificationCode(128);
        const newCode = new VerificationCode({ userId: user._id, code });
        const url = `${process.env.DOMAIN}/api/verify/${code}`;
        await sendCode(user.email, url, user.username);
        await newCode.save();
    }
}

async function login(email: string, pass: string) {
    const userData = await User.findOne({ email: email });

    if (!userData) {
        throw ({ status: 400, message: 'Invalid email or password' })
    }
    const { password, ...user } = userData.toObject();

    const isPasswordValid = await bcrypt.compare(pass, password);
    if (!isPasswordValid) {
        throw ({ status: 400, message: 'Invalid email or password' })
    }

    const refreshToken = generateRefreshToken(email, String(userData._id));
    const accessToken = generateAccessToken(email, String(userData._id));

    return { accessToken, refreshToken, user };
}

async function logout(token: string) {
    const refToken = RefreshToken.findOne({ token });
    if (!refToken) {
        throw ({ status: 401, message: 'Not authorized' })

    }
    return await RefreshToken.findOneAndDelete({ token });
}

async function refreshToken(token: string) {
    const refToken = await RefreshToken.findOne({ token });
    if (!refToken) {
        throw ({ status: 401, message: 'Not authorized' });
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_SECRET as Secret, async (err, payload) => {
            if (err) {
                throw ({ status: 401, message: 'Not authorized' });
            }
            const userPayload = payload as UserJWTPayload;
            const userData = await User.findById(userPayload.id);
            if (!userData) {
                throw ({ status: 404, message: 'User not found' });
            }
            const newRefreshToken = generateRefreshToken(userPayload.email, userPayload.id);
            const newAccessToken = generateAccessToken(userPayload.email, userPayload.id);


            const { password, ...user } = userData.toObject();
            resolve({ newRefreshToken, newAccessToken, user });
            return await RefreshToken.findOneAndDelete({ token });
        })
    })
}

export const authService = {registerUser, verifyEmail, newVerificationCode, login, logout, refreshToken}