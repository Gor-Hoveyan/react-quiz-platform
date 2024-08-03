import User from './../models/userModel';
import Test from './../models/testModel';
import Comment from './../models/commentModel';
import Answer from './../models/answerModel';
import calculateTestResult from '../utils/dataUtils/calculateTestResult';

async function create(name: string, description: string, author: string, questions: [], results: [], score: number) {
    const user = await User.findById({ _id: author });

    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = new Test({ name, description, author, questions, results, score });
    await test.save()
    await User.findOneAndUpdate({ _id: author }, { createdTests: [...user.createdTests, test._id] })
    await user.save();
    return test;
}

async function remove(testId: string, requestCreator: string) {
    const test = await Test.findById({ _id: testId });

    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    if (String(test.author) !== requestCreator) {
        throw ({ status: 403, message: 'Access denied' });
    }
    if (test.comments.length) {
        test.comments.map(async (commentId) => {
            const comment = await Comment.findById(commentId);
            if (comment) {
                if (comment.answers.length) {
                    comment.answers.map(async (answerId) => {
                        const answer = await Answer.findById(answerId);
                        if (answer) {
                            await User.findByIdAndUpdate(answer.author, { $pull: { answers: answer._id } });
                            await answer.deleteOne();
                        }
                    })
                }
                await User.findByIdAndUpdate(comment.author, { $pull: { comments: comment._id } });
                await comment.deleteOne();
            }
        })
    }
    await Test.findOneAndDelete({ _id: testId });
    await User.findByIdAndUpdate(requestCreator, { $pull: { createdTests: testId } });
}

async function update(requestCreator: string, id: string, name: string, description: string, author: string, questions: [], results: []) {
    const user = await User.findById({ _id: author });
    let test = await Test.findById({ _id: id });
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }

    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }

    if (String(test.author) !== requestCreator) {
        throw ({ status: 403, message: 'Access denied' });
    }
    const updatedData = {
        name,
        description,
        author,
        questions,
        results,
        score: questions.length * 3,
        isUpdated: [...test.isUpdated, Date.now()]
    };

    const updatedTest = await Test.findOneAndUpdate(
        { _id: test._id },
        updatedData,
        { new: true, runValidators: true }
    );
    return updatedTest;
}

async function getOne(id: string) {
    const test = await Test.findById(id).populate('author', ['username', 'avatarUrl']).exec();
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    await Test.findByIdAndUpdate(id, { $inc: { views: +1 } });
    return test;
}

async function likeTest(userId: string, testId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    if ((user.likedTests as unknown[]).includes(testId)) {
        await Test.findByIdAndUpdate(testId, { $inc: { likes: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { likedTests: test._id } });
        await User.findByIdAndUpdate(test.author, { $inc: { likes: - 1 } })
    } else {
        await Test.findByIdAndUpdate(testId, { $inc: { likes: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { likedTests: [...user.likedTests, test._id] } });
        await User.findByIdAndUpdate(test.author, { $inc: { likes: +1 } })
    }
}

async function saveTest(userId: string, testId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }
    if ((user.savedTests as unknown[]).includes(testId)) {
        await Test.findByIdAndUpdate(testId, { $inc: { saves: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { savedTests: test._id } });
    } else {
        await Test.findByIdAndUpdate(testId, { $inc: { saves: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { savedTests: [...user.savedTests, test._id] } });
    }
}

async function submitTest(userId: string, testId: string, score: number) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const test = await Test.findById(testId);
    if (!test) {
        throw ({ status: 404, message: 'Test not found' });
    }

    const result = calculateTestResult(test.results, score);
    await User.findByIdAndUpdate(userId, { $set: { passedTests: [...user.passedTests, { testId, result }] } });
    await Test.findByIdAndUpdate(testId, { $inc: { passed: +1 } });
    return result;
}

export const testService = {
    create,
    remove,
    update,
    getOne,
    submitTest,
    likeTest,
    saveTest,
};