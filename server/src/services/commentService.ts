import Comment from './../models/commentModel';
import Answer from './../models/answerModel';
import User from './../models/userModel';
import Test from './../models/testModel';
import Quiz from './../models/quizModel';

async function createComment(comment: string, userId: string, testId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = await Test.findById(testId);
    if (!test) {
        const quiz = await Quiz.findById(testId);
        if(!quiz) {
            throw ({ status: 404, message: 'Post not found' });
        }
        const comm = new Comment({ comment, author: userId, quiz: testId });
        await comm.save();
        await Quiz.findByIdAndUpdate(testId, { $set: { comments: [...quiz.comments, comm._id] } });
        await User.findByIdAndUpdate(userId, { $set: { comments: [...user.comments, comm._id] } });
        return await comm.populate('author', ['username', 'avatarUrl'])
    } else {
        const comm = new Comment({ comment, author: userId, test: testId });
        await comm.save();
        await Test.findByIdAndUpdate(testId, { $set: { comments: [...test.comments, comm._id] } });
        await User.findByIdAndUpdate(userId, { $set: { comments: [...user.comments, comm._id] } });
        return await comm.populate('author', ['username', 'avatarUrl']);
    }

}

async function updateComment(commentId: string, testId: string, userId: string, newComment: string) {
    const user = await User.findById(userId);
    if (!user || String(user._id) !== userId) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw ({ status: 404, message: 'Comment not found' });
    }
    if (String(comment.author) !== userId) {
        throw ({ status: 403, message: 'Acccess denied' });
    }
    await Comment.findByIdAndUpdate(commentId, { $set: { comment: newComment } });
    const updatedComment = await Comment.findById(commentId).populate('author', ['username', 'avatarUrl']);
    return updatedComment;
}

async function removeComment(commentId: string, userId: string, testId: string) {
    const test = await Test.findById(testId);
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw ({ status: 404, message: 'Comment not found' });
    }
    if (String(comment.author) !== userId) {
        throw ({ status: 403, message: 'Access denied' });
    }
    if (comment.answers.length) {
        comment.answers.map(async (answerId) => {
            const answer = await Answer.findById(answerId);
            if (answer) {
                await User.findByIdAndUpdate(answer?.author, { $pull: { answers: answer._id } })
                await answer?.deleteOne();
            }
        });
    }

    await Test.findByIdAndUpdate(comment.test, { $pull: { comments: comment._id } });
    await User.findByIdAndUpdate(comment.author, { $pull: { comments: comment._id } });
    await Comment.findByIdAndDelete(commentId);
}

async function likeComment(commentId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw ({ status: 404, message: 'Comment not found' });
    }
    if ((user.likedComments as unknown[]).includes(commentId)) {
        await comment.updateOne({ $set: { likes: --comment.likes } })
        await user.updateOne({ $pull: { likedComments: commentId } });
    } else {
        await comment.updateOne({ $set: { likes: ++comment.likes } })
        await user.updateOne({ $set: { likedComments: [...user.likedComments, commentId] } });
    }
}

async function getComments(testId: string) {
    const test = await Test.findById(testId).populate({
        path: 'comments',
        populate: [
            {
                path: 'author',
                model: 'User',
                select: ['username', 'avatarUrl']
            }
        ]
    });

    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    return test.comments;
}

async function createAnswer(answer: string, userId: string, testId: string, parentId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }

    const comment = await Comment.findById(parentId);
    if (!comment) {
        throw ({ status: 404, message: 'Comment not found' });
    }

    const test = await Test.findById(testId);
    if (!test) {
        const quiz = await Quiz.findById(testId);
        if(!quiz) {
            throw ({ status: 404, message: 'Post not found' });
        }
        const answ = new Answer({ comment: answer, author: userId, quiz: testId, parentComment: parentId });
        await answ.save();
        await Quiz.findByIdAndUpdate(testId, { $set: { commentAnswers: [...quiz.commentAnswers, answ._id] } });
        await User.findByIdAndUpdate(userId, { $set: { answers: [...user.comments, answ._id] } });
        await Comment.findByIdAndUpdate(parentId, { $set: { answers: [...comment.answers, answ._id] } });
        return answ;
    } else if(test) {
        const answ = new Answer({ comment: answer, author: userId, test: testId, parentComment: parentId });
        await answ.save();
        await Test.findByIdAndUpdate(testId, { $set: { commentAnswers: [...test.commentAnswers, answ._id] } });
        await User.findByIdAndUpdate(userId, { $set: { answers: [...user.comments, answ._id] } });
        await Comment.findByIdAndUpdate(parentId, { $set: { answers: [...comment.answers, answ._id] } });
        return answ;
    } else {
        throw({status: 400, message: 'Invalid request'});
    }
}

async function updateAnswer(answerId: string, userId: string, newComment: string) {
    const user = await User.findById(userId);
    if (!user || String(user._id) !== userId) {
        throw ({ status: 404, message: 'User not found' });
    }
    const answer = await Answer.findById(answerId);
    if (!answer) {
        throw ({ status: 404, message: 'Comment not found' });
    }
    if (String(answer.author) !== userId) {
        throw ({ status: 403, message: 'Access denied' });
    }
    await Answer.findByIdAndUpdate(answerId, { $set: { comment: newComment } });
    const updatedAnswer = await Answer.findById(answerId).populate('author', ['username', 'avatarUrl']);
    return updatedAnswer;
}

async function removeAnswer(parentId: string, answerId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const parent = await Comment.findById(parentId);
    if (!parent) {
        throw ({ status: 404, message: 'Parrent comment not found' });
    }
    const answer = await Answer.findById(answerId);
    if (!answer) {
        throw ({ status: 404, message: 'Answer not found' });
    }
    if (String(answer.author) !== userId) {
        throw ({ status: 403, message: 'Access denied' });
    }

    await Comment.findByIdAndUpdate(answer.parentComment, { $pull: { answers: answer._id } });
    await User.findByIdAndUpdate(userId, { $pull: { answers: answer._id } });
    await Test.findByIdAndUpdate(answer.test, { $pull: { commentAnswers: answer._id } });
    await Answer.findByIdAndDelete(answerId);
}

async function likeAnswer(answerId: string, userId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const answer = await Answer.findById(answerId);
    if (!answer) {
        throw ({ status: 404, message: 'Comment not found' });
    }
    if ((user.likedAnswers as unknown[]).includes(answerId)) {
        await answer.updateOne({ $set: { likes: --answer.likes } })
        await user.updateOne({ $pull: { likedAnswers: answerId } });
    } else {
        await answer.updateOne({ $set: { likes: ++answer.likes } })
        await user.updateOne({ $set: { likedAnswers: [...user.likedComments, answerId] } });
    }
}

async function getAnswers(commentId: string) {
    const comment = await Comment.findById(commentId).populate({
        path: 'answers',
        populate: {
            path: 'author',
            model: 'User',
            select: ['username', 'avatarUrl']
        }

    });
    if (!comment) {
        throw ({ status: 404, message: 'Test not found' });
    }
    return comment.answers;
}

export const commentService = {
    createComment,
    updateComment,
    removeComment,
    createAnswer,
    getComments,
    getAnswers,
    updateAnswer,
    removeAnswer,
    likeComment,
    likeAnswer
};