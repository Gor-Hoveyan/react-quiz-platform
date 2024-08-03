import User from './../models/userModel';
import Quiz from './../models/quizModel';
import Comment from './../models/commentModel';
import Answer from './../models/answerModel';
import calculateQuizResult from '../utils/dataUtils/calculateQuizResult';

async function create(name: string, description: string, author: string, questions: []) {
    const user = await User.findById({ _id: author });

    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const quiz = new Quiz({ name, description, author, questions});
    await quiz.save()
    await User.findOneAndUpdate({ _id: author }, { createdQuizzes: [...user.createdQuizzes, quiz._id] })
    await user.save();
    return quiz;
}

async function remove(quizId: string, requestCreator: string) {
    const quiz = await Quiz.findById({ _id: quizId });

    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }
    if (String(quiz.author) !== requestCreator) {
        throw ({ status: 403, message: 'Access denied' });
    }
    if (quiz.comments.length) {
        quiz.comments.map(async (commentId) => {
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
    await Quiz.findOneAndDelete({ _id: quizId });
    await User.findByIdAndUpdate(requestCreator, { $pull: { createdQuizzes: quizId } });
}

async function update(requestCreator: string, id: string, name: string, description: string, author: string, questions: []) {
    const user = await User.findById({ _id: author });
    let quiz = await Quiz.findById({ _id: id });
    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }

    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }

    if (String(quiz.author) !== requestCreator) {
        throw ({ status: 403, message: 'Access denied' });
    }
    const updatedData = {
        name,
        description,
        author,
        questions,
        score: questions.length * 3,
        isUpdated: [...quiz.isUpdated, Date.now()]
    };

    const updatedQuiz = await Quiz.findOneAndUpdate(
        { _id: quiz._id },
        updatedData,
        { new: true, runValidators: true }
    );
    return updatedQuiz;
}

async function getOne(id: string) {
    const quiz = await Quiz.findById(id).populate('author', ['username', 'avatarUrl']).exec();
    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }
    await Quiz.findByIdAndUpdate(id, { $inc: { views: +1 } });
    return quiz;
}

async function likeQuiz(userId: string, quizId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }
    if ((user.likedQuizzes as unknown[]).includes(quizId)) {
        await Quiz.findByIdAndUpdate(quizId, { $inc: { likes: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { likedQuizzes: quiz._id } });
        await User.findByIdAndUpdate(quiz.author, { $inc: { likes: - 1 } })
    } else {
        await Quiz.findByIdAndUpdate(quizId, { $inc: { likes: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { likedQuizzes: [...user.likedQuizzes, quiz._id] } });
        await User.findByIdAndUpdate(quiz.author, { $inc: { likes: +1 } })
    }
}

async function saveQuiz(userId: string, quizId: string) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }
    if ((user.savedQuizzes as unknown[]).includes(quizId)) {
        await Quiz.findByIdAndUpdate(quizId, { $inc: { saves: -1 } });
        await User.findByIdAndUpdate(userId, { $pull: { savedQuizzes: quiz._id } });
    } else {
        await Quiz.findByIdAndUpdate(quizId, { $inc: { saves: +1 } });
        await User.findByIdAndUpdate(userId, { $set: { savedQuizzes: [...user.savedQuizzes, quiz._id] } });
    }
}

async function submitQuiz(userId: string, quizId: string, rightAnswers: number) {
    const user = await User.findById(userId);
    if (!user) {
        throw ({ status: 404, message: 'User not found' });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw ({ status: 404, message: 'Quiz not found' });
    }

    const result = calculateQuizResult(quiz.questions.length, rightAnswers);
    await User.findByIdAndUpdate(userId, { $set: { passedQuizzes: [...user.passedQuizzes, { quizId, result }] } });
    await Quiz.findByIdAndUpdate(quizId, { $inc: { passed: +1 } });
    return result;
}

export const quizService = {
    create,
    remove,
    update,
    getOne,
    likeQuiz,
    saveQuiz,
    submitQuiz
};