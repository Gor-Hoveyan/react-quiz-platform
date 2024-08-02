import React, { useEffect } from 'react';
import styles from './TestForm.module.scss';
import useTestStore, { IQuestion, Result } from '../../stores/testStore';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Navigate, NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

type FormValues = {
    name: string,
    description: string,
    questions: IQuestion[],
    results: Result[]
}


export default function TestForm() {
    const user = useUserStore(state => state.user);
    const formError = useTestStore(state => state.formError);
    const setError = useTestStore(state => state.setFormError);
    const setScore = useTestStore(state => state.setScore);
    const createPost = useTestStore(state => state.createTest);
    const id = useTestStore(state => state.createdTestId)
    const resetCreatedTestId = useTestStore(state => state.resetCreatedTestId);

    const { register, control, handleSubmit, formState: { errors }, unregister } = useForm<FormValues>({
        mode: 'onBlur'
    });
    const { fields: questionFields, append: appendQuestion } = useFieldArray({
        control,
        name: 'questions'
    });
    const { fields: resultFields, append: appendResult } = useFieldArray({
        control,
        name: 'results'
    });

    useEffect(() => {
        resetCreatedTestId();
    }, [resetCreatedTestId]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.questions.length < 2) {
            return setError('The test must have at least 2 questions');
        } else if (data.results.length < 2) {
            return setError('The test must have at least 2 results');
        }
        let score = 0;
        const questionSet = new Set();
        for (let i = 0; i < data.questions.length; i++) {
            const uniqueAnswers = new Set();
            const uniquePoints = new Set();
            if (questionSet.has(data.questions[i].question)) {
                return setError(`Duplicate question found: "${data.questions[i].question}"`);
            }
            questionSet.add(data.questions[i].question);
            for (let j = 0; j < 4; j++) {
                if (uniqueAnswers.has(data.questions[i].answers[j].answer)) {
                    return setError(`Duplicate answer in question №${i + 1}`);
                }
                if (uniquePoints.has(data.questions[i].answers[j].points)) {
                    return setError(`Duplicate points in question №${i + 1}`);
                }
                uniqueAnswers.add(data.questions[i].answers[j].answer);
                uniquePoints.add(data.questions[i].answers[j].points);
                score += Number(data.questions[i].answers[j].points);
            }
        }
        setScore(score);
        for (let i = 0; i < data.results.length; i++) {
            let iMinScore = Number(data.results[i].minScore);
            let iMaxScore = Number(data.results[i].maxScore);
            if (iMinScore > score || iMaxScore > score) {
                return setError('Min or max score of result can\'t be greater than the total score');
            } else if (iMinScore > iMaxScore) {
                return setError('Min score of result can\'t be greater than max score');
            } else if (iMinScore < 0 || iMaxScore < 0) {
                return setError('Min or max score of result can\'t be less than 0');
            }

            if (i < data.results.length - 1) {
                for (let j = i + 1; j < data.results.length; j++) {
                    let jMinScore = Number(data.results[j].minScore);
                    let jMaxScore = Number(data.results[j].maxScore);
                    if (iMinScore < jMinScore && iMaxScore > jMaxScore) {
                        return setError(`Invalid scores in results  №${i} and  №${j}`);
                    } else if (iMinScore > jMinScore && iMaxScore < jMaxScore) {

                        return setError(`Invalid scores in results  №${i} and  №${j}`);
                    } else if (iMinScore === jMinScore || iMaxScore === jMaxScore) {
                        return setError(`Invalid scores in results  №${i} and  №${j}`);
                    } else if (iMinScore === jMaxScore) {
                        return setError(`Invalid scores in results  №${i} and  №${j}`);
                    }
                }
            }
        }
        createPost(data.name, data.description, data.questions, data.results, score)
        setError('')
    }

    const addQuestion = () => {
        appendQuestion({
            question: '',
            answers: [
                { answer: '', points: 0 },
                { answer: '', points: 0 },
                { answer: '', points: 0 },
                { answer: '', points: 0 }
            ]
        });
    };

    function removeQuestion(index: number) {
        unregister(`questions.${index}.question`);
        for (let i = 0; i < 4; i++) {
            unregister(`questions.${index}.answers.${i}.answer`);
            unregister(`questions.${index}.answers.${i}.points`);
        }
        delete questionFields[index];
    }

    function removeResult(index: number) {
        unregister(`results.${index}.result`);
        unregister(`results.${index}.minScore`);
        unregister(`results.${index}.maxScore`);

        delete resultFields[index];
    }

    return (
        user?.isActivated ? <div className={styles.main}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={styles.header}>New test</h1>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" {...register('name', {
                        required: 'This field is required',
                        minLength: { value: 5, message: 'Name must contain at least 5 characters' },
                        maxLength: { value: 60, message: 'Name can contain maximum 60 characters' },
                    }
                    )} />
                    <p className={styles.error}>{errors.name?.message && errors.name?.message}</p>
                </div>

                <div className={styles.formGroup}>
                    <label >Description</label>
                    <textarea className={styles.textarea} {...register('description', {
                        required: 'This field is required',
                        minLength: { value: 10, message: 'Description must contain at least 10 characters' },
                        maxLength: { value: 300, message: 'Description can contain maximum 300 characters' },
                    })} />
                    <p className={styles.error}>{errors.description?.message && errors.description?.message}</p>
                </div>

                <div className={styles.formGroup}>
                    <label>Questions</label>
                    {questionFields.map((field, index) => (
                        <div key={field.id} className={styles.nestedFormGroup}>
                            <label>Question  №{index}</label>
                            <input type='text' {...register(`questions.${index}.question`, {
                                required: 'This field is required',
                                minLength: { value: 10, message: 'Question must contain at least 5 characters' },
                                maxLength: { value: 200, message: 'Question can contain maximum 60 characters' },
                            })} />
                            <p className={styles.error}>{errors.questions && (errors.questions as any[])[index]?.question?.message}</p>
                            <label>Answers</label>
                            {field.answers.map((answer, aIndex) => (
                                <>
                                    <div key={aIndex} className={styles.answerGroup}>
                                        <input
                                            type="text"
                                            {...register(`questions.${index}.answers.${aIndex}.answer`, {
                                                required: 'This field is required',
                                                minLength: { value: 2, message: 'Question must contain at least 2 characters' },
                                                maxLength: { value: 200, message: 'Answer can contain maximum 200 characters' },

                                            })}
                                            placeholder={`Answer ${aIndex + 1}`}
                                        />

                                        <select {...register(`questions.${index}.answers.${aIndex}.points`, { required: 'This field is required' })}>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                    <p className={styles.error}>{Array.isArray(errors?.questions) && Array.isArray(errors?.questions[index]?.answers) ? errors?.questions[index]?.answers[aIndex]?.answer?.message : ''}</p>
                                </>
                            ))}
                            <button className={styles.button} type="button" onClick={() => removeQuestion(index)}>Remove question</button>
                        </div>
                    ))}
                    <button className={styles.button} type="button" onClick={() => addQuestion()}>Add question</button>
                </div>

                <div className={styles.formGroup}>
                    <label>Results</label>
                    {resultFields.map((field, index) => (
                        <div key={field.id} className={styles.nestedFormGroup}>
                            <label>Result  №{index}</label>
                            <input id={`results[${index}].result`} {...register(`results.${index}.result`, {
                                required: 'This field is required',
                                minLength: { value: 10, message: 'Result must contain at least 10 characters' },
                                maxLength: { value: 500, message: 'Result can contain maximum 500 characters' },
                            })} />
                            <p className={styles.error}>{errors.results && (errors.results as any[])[index]?.result?.message}</p>
                            <label>Min Score</label>
                            <input value={(Number(resultFields[index - 1]?.maxScore) + 1) || 0} {...register(`results.${index}.minScore`, { required: 'This field is required', value: (Number(resultFields[index - 1]?.maxScore) + 1) || 0 })} />

                            <label>Max Score</label>
                            <input type="number" {...register(`results.${index}.maxScore`, { required: 'This field is required' })} />
                            <button className={styles.button} type="button" onClick={() => removeResult(index)}>Remove result</button>
                        </div>
                    ))}
                    <p className={styles.error}>{errors.results?.message && errors.results?.message}</p>
                    <button className={styles.button} type="button" onClick={() => appendResult({ result: '', minScore: 0, maxScore: 0 })}>Add Result</button>
                </div>

                <p className={styles.error}>{formError && formError}</p>
                {id ? <NavLink className={styles.navLink} to={`/test/${id}`}><button className={styles.button} type='button'>View test</button></NavLink> : <button className={styles.button} type="submit">Submit</button>}
            </form >
        </div > : <Navigate to={`/verify`} />
    );
};