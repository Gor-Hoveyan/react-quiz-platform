import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './../models/userModel';
import RefreshToken from './../models/refreshTokenModel';
import dotenv from 'dotenv';
import Test from './../models/testModel';
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
        throw new Error('User with this email already exists')
    }
    if (isUsernameRegistered) {
        throw new Error('User with this username already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash, bio: '   ', passedTests: [] })
    await newUser.save();
    return newUser;
}

async function login(email: string, pass: string) {
    const userData = await User.findOne({ email: email });

    if (!userData) {
        throw new Error('Invalid email or password')
    }
    const { password, ...user } = userData.toObject();

    const isPasswordValid = await bcrypt.compare(pass, password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password')
    }

    const refreshToken = generateRefreshToken(email, String(userData._id));
    const accessToken = generateAccessToken(email, String(userData._id));

    return { accessToken, refreshToken, user };
}

async function logout(token: string) {
    const refToken = RefreshToken.findOne({ token });
    if (!refToken) {
        throw new Error('Invalid token');
    }
    return await RefreshToken.findOneAndDelete({ token });
}

async function refreshToken(token: string) {
    const refToken = await RefreshToken.findOne({ token });
    if (!refToken) {
        throw new Error('Invalid refresh token');
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_SECRET as Secret, async (err, payload) => {
            if (err) {
                throw new Error('Invalid refresh token');
            }
            const userPayload = payload as UserJWTPayload;
            const userData = await User.findById(userPayload.id);
            if (!userData) {
                throw new Error('user not found');
            }
            const newRefreshToken = generateRefreshToken(userPayload.email, userPayload.id);
            const newAccessToken = generateAccessToken(userPayload.email, userPayload.id);


            const { password, ...user } = userData.toObject();
            resolve({ newRefreshToken, newAccessToken, user });
            return await RefreshToken.findOneAndDelete({ token });
        })
    })
}

async function getUser(userId: string) {
    const userData = await User.findById(userId);
    if (!userData) {
        throw new Error('User not found');
    }

    const { password, ...user } = userData.toObject();
    return user;
}

async function likeTest(userId: string, testId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw new Error('Test not found');
    }
    if ((user.likedPosts as unknown[]).includes(testId)) {
        await Test.findByIdAndUpdate(testId, { $inc: { likes: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { likedPosts: test._id } });
        await User.findByIdAndUpdate(test.author, { $inc: { likes: - 1 } })
    } else {
        await Test.findByIdAndUpdate(testId, { $inc: { likes: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { likedPosts: [...user.likedPosts, test._id] } });
        await User.findByIdAndUpdate(test.author, { $inc: { likes: +1 } })
    }
}

async function saveTest(userId: string, testId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw new Error('Test not found');
    }
    if ((user.savedPosts as unknown[]).includes(testId)) {
        await Test.findByIdAndUpdate(testId, { $inc: { saves: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { savedPosts: test._id } });
    } else {
        await Test.findByIdAndUpdate(testId, { $inc: { saves: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { savedPosts: [...user.savedPosts, test._id] } });
    }
}

async function follow(userId: string, subscriberId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const subscriber = await User.findById(subscriberId);
    if (!subscriber) {
        throw new Error('Subscriber not found');
    }
    if (user._id === subscriber._id) {
        throw new Error('You can\'t follow youerself');
    }
    if ((subscriber.followings as unknown[]).includes(userId)) {
        throw new Error('User already subscribed');
    }
    await User.findByIdAndUpdate(userId, { $set: { followers: [...user.followers, subscriber.id] } });
    await User.findByIdAndUpdate(subscriberId, { $set: { followings: [...subscriber.followings, user.id] } });
}

async function unfollow(userId: string, subscriberId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const subscriber = await User.findById(subscriberId);
    if (!subscriber) {
        throw new Error('Subscriber not found');
    }
    if (user._id === subscriber._id) {
        throw new Error('You can\'t follow youerself');
    }
    if (!(subscriber.followings as unknown[]).includes(userId)) {
        throw new Error('User already unfollowed');
    }
    await User.findByIdAndUpdate(userId, { $pull: { followers: subscriber.id } });
    await User.findByIdAndUpdate(subscriberId, { $pull: { followings: user.id } });
}

async function getUserPage(userId: string) {
    const userData = await User.findById(userId).populate({
        path: 'createdTests',
        populate: {
            path: 'author',
            select: 'username'
        }
    });
    if (!userData) {
        throw new Error('User not found');
    }
    const {password, ...user} = userData.toObject();
    return user;
}

async function updateUser(userId: string, username: string, bio: string) {
    const user = await User.findById(userId);
    if(!user) {
        throw new Error('User not found');
    }
    const checkUsername = User.findOne({username});
    if(!checkUsername) {
        let err = 'Username already exists';
        return err;
    }
    await User.findByIdAndUpdate(userId, {$set: {username, bio}});
}

async function setAvatar(userId: string, avatarUrl: string) {
    const user = await User.findById(userId);
    if(!user) {
        throw new Error('User not found');
    }
    await User.findByIdAndUpdate(userId, {$set: {avatarUrl}});
}

export const userService = {
    registerUser,
    login,
    logout,
    refreshToken,
    getUser,
    likeTest,
    saveTest,
    follow,
    unfollow,
    getUserPage,
    updateUser,
    setAvatar
};