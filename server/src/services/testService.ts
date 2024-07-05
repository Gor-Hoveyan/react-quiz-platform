import User from './../models/userModel';
import Test from './../models/testModel';
import Comment from './../models/commentModel';
import Answer from './../models/answerModel';

async function create(name: string, description: string, author: string, questions: [], results: [], score: number) {
    const user = await User.findById({ _id: author });

    if (!user) {
        throw new Error('User not found');
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
        throw new Error('Test not found');
    }
    if (String(test.author) !== requestCreator) {
        throw new Error('Access denied')
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
        throw new Error('Test not found');
    }

    if (!user) {
        throw new Error('User not found');
    }

    if (String(test.author) !== requestCreator) {
        throw new Error('Access denied');
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
    const test = await Test.findById({ _id: id }).populate('author', 'username').exec();
    if (!test) {
        throw new Error('Test not found');
    }

    return test;
}

async function getTen() {
    let tests = await Test.aggregate().sample(10);

    for (let i = 0; i < tests.length; i++) {
        const user = await User.findById(tests[i].author);
        if (!user) {
            return;
        }
        tests[i].authorsName = user?.username;
    }


    if (!tests) {
        throw new Error('Tests not found');
    }

    return tests;
}

async function getUserTests(userId: string) {
    const user = await User.findById(userId).populate('createdTests');
    if (!user) {
        throw new Error('User not found');
    }
    return user.createdTests;
}

async function searchTests(name: string) {
    const tests = await Test.find({ name: new RegExp(name, 'i') });
    if (!tests) {
        throw new Error('Tests not found');
    }
    return tests;
}

async function pagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const tests = await Test.find({}, null, { skip, limit });
    const totalPages = Math.ceil(await Test.countDocuments() / limit)
    if (tests.length === 0) {
        throw new Error('Tests not found');
    }
    return { tests, totalPages };
}

export const testService = {
    create,
    remove,
    update,
    getOne,
    getTen,
    getUserTests,
    searchTests,
    pagination
};