import React, { useEffect } from 'react';
import styles from './QuizPage.module.scss';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import useQuizStore, { IQuizAnswer } from '../../stores/quizStore';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Loader from '../../components/loader/Loader';
import useUserStore from '../../stores/userStore';

type Question = {
    question: string;
    rightAnswer: number;
    answers: IQuizAnswer[];
    selectedAnswer: string;
}

export type QuizPageFormValues = {
    questions: Question[]
}

export default function QuizPage() {
    const getQuiz = useQuizStore(state => state.getQuiz);
    const quiz = useQuizStore(state => state.quiz);
    const submitQuiz = useQuizStore(state => state.submitQuiz);
    const user = useUserStore(state => state.user)
    const params = useParams();
    const quizId = params.id;
    const result = useQuizStore(state => state.result);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<QuizPageFormValues>({
        defaultValues: {
            questions: []
        },
        mode: 'all',
    });

    const { fields } = useFieldArray({
        control,
        name: 'questions'
    });

    useEffect(() => {
        if (quizId) {
            getQuiz(quizId);
        }
    }, [quizId, getQuiz]);

    useEffect(() => {
        if (quiz) {
            setValue('questions', quiz.questions.map(q => ({
                question: q.question,
                rightAnswer: Number(q.rightAnswer),
                answers: q.answers,
                selectedAnswer: ''
            })));
        }
    }, [quiz, setValue]);

    const onSubmit = (data: QuizPageFormValues) => {
        console.log(data);
        let rightAnswers = 0;
        for (let i = 0; i < data.questions.length; i++) {
            if (data.questions[i].rightAnswer === Number(data.questions[i].selectedAnswer)) {
                rightAnswers++;
            }
        }
        if (quiz) {
            submitQuiz(quiz._id, rightAnswers);
        }
    }

    return (
        user?.isActivated ? <div className={styles.main}>
            {quiz ?
                <div className={styles.testPage} >
                    <h1>{quiz.name}</h1>
                    <p>{quiz.description}</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((question, qIndex) => (
                            <div key={question.id} className={styles.question}>
                                <h3>{question.question}</h3>
                                {question.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className={styles.answer}>
                                        <Controller
                                            name={`questions.${qIndex}.selectedAnswer`}
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <input
                                                    type='radio'
                                                    name={`questions.${qIndex}.selectedAnswer`}
                                                    value={String(aIndex)}
                                                    checked={String(field.value) === String(aIndex)}
                                                    onChange={() => field.onChange(String(aIndex))}
                                                />
                                            )}
                                        />
                                        <label>{answer.answer}</label>
                                    </div>
                                ))}
                            </div>
                        ))}


                        {!result ? <button className={styles.button} type='submit'>Submit</button> : <NavLink className={styles.navLink} to={`/quiz/${quiz._id}/result`}><button className={styles.button}>View results</button></NavLink>}

                    </form>
                </div>
                : <Loader />}
        </div> : <Navigate to={`/verify`} />
    );
}