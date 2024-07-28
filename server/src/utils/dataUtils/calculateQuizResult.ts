export default function calculateQuizResult(questionsCount: number, rightAnswers: number) {
    return Math.floor(rightAnswers / questionsCount * 100);
}