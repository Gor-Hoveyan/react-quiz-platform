import React, { useEffect } from 'react';
import styles from './TestPage.module.scss';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import useTestStore, { Answer } from '../../stores/testStore';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Loader from '../../components/loader/Loader';
import useUserStore from '../../stores/userStore';

type Question = {
    question: string;
    answers: Answer[];
    selectedAnswer: string;
}

export type TestPageFormValues = {
    questions: Question[]
}

export default function TestPage() {
    const getTest = useTestStore(state => state.getTest);
    const test = useTestStore(state => state.test);
    const submitTest = useTestStore(state => state.submitTest);
    const user = useUserStore(state => state.user)
    const params = useParams();
    const testId = params.id;
    const result = useTestStore(state => state.result);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<TestPageFormValues>({
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
        if (testId) {
            getTest(testId);
        }
    }, [testId, getTest]);

    useEffect(() => {
        if (test) {
            setValue('questions', test.questions.map(q => ({
                question: q.question,
                answers: q.answers,
                selectedAnswer: ''
            })));
        }
    }, [test, setValue]);

    const onSubmit = (data: TestPageFormValues) => {
        submitTest(data);
    }

    return (
        user?.isActivated ? <div className={styles.main}>
            {test ?
                <div className={styles.testPage} >
                    <h1>{test.name}</h1>
                    <p>{test.description}</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((question, qIndex) => (
                            <div key={question.id} className={styles.question}>
                                <h3>{question.question}</h3>
                                {question.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className={styles.answer}>
                                        <Controller
                                            name={`questions.${qIndex}.selectedAnswer`}
                                            control={control}
                                            rules={{ required: 'You need to select an answer' }}
                                            render={({ field }) => (
                                                <input
                                                    type='radio'
                                                    name={`questions.${qIndex}.selectedAnswer`}
                                                    value={String(answer.points)}
                                                    checked={String(field.value) === String(answer.points)}
                                                    onChange={() => field.onChange(String(answer.points))}
                                                />
                                            )}
                                        />
                                        <label>{answer.answer}</label>
                                    </div>
                                ))}
                                <p className={styles.error}>{errors.questions && errors.questions[qIndex]?.selectedAnswer?.message}</p>
                            </div>
                        ))}


                        {!result ? <button className={styles.button} type='submit'>Submit</button> : <NavLink className={styles.navLink} to={`/test/${test._id}/result`}><button className={styles.button}>View results</button></NavLink>}

                    </form>
                </div>
                : <Loader />}
        </div> : <Navigate to={`/verify`} />
    );
};