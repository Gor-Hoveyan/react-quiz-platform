import React, { useEffect } from 'react';
import styles from './QuizForm.module.scss';
import useQuizStore, { IQuizQuestion } from '../../stores/quizStore';
import useUserStore from '../../stores/userStore';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Navigate, NavLink } from 'react-router-dom';


type FormValues = {
    name: string,
    description: string,
    questions: IQuizQuestion[],
}


export default function QuizForm() {
    const user = useUserStore(state => state.user);
    const formError = useQuizStore(state => state.formError);
    const setError = useQuizStore(state => state.setFormError);
    const createPost = useQuizStore(state => state.createQuiz);
    const id = useQuizStore(state => state.createdQuizId)
    const resetCreatedQuizId = useQuizStore(state => state.resetCreatedTestId);

    const { register, control, handleSubmit, formState: { errors }, unregister } = useForm<FormValues>({
        mode: 'onSubmit'
    });
    const { fields: questionFields, append: appendQuestion } = useFieldArray({
        control,
        name: 'questions'
    });

    useEffect(() => {
        resetCreatedQuizId();
    }, [resetCreatedQuizId]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.questions.length >= 2) {
            const questionSet = new Set();
            for (let i = 0; i < data.questions.length; i++) {
                const uniqueAnswers = new Set();
                if (questionSet.has(data.questions[i].question)) {
                    return setError(`Duplicate question found: "${data.questions[i].question}"`);
                }
                questionSet.add(data.questions[i].question);
                for (let j = 0; j < 4; j++) {
                    if (uniqueAnswers.has(data.questions[i].answers[j].answer)) {
                        return setError(`Duplicate answer in question №${i + 1}`);
                    }
                    uniqueAnswers.add(data.questions[i].answers[j].answer);
                }
            }
            createPost(data.name, data.description, data.questions);
            setError('')
        } else {
            setError('The quiz must have at least 2 questions')
        }


    }

    const addQuestion = () => {
        appendQuestion({
            question: '',
            rightAnswer: null,
            answers: [
                { answer: '' },
                { answer: '' },
                { answer: '' },
                { answer: '' }
            ]
        });
    };

    function removeQuestion(index: number) {
        unregister(`questions.${index}.question`);
        unregister(`questions.${index}.rightAnswer`);
        for (let i = 0; i < 4; i++) {
            unregister(`questions.${index}.answers.${i}.answer`);
        }
        delete questionFields[index];
    }

    return (
        user?.isActivated ?
            <div className={styles.main}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <h1 className={styles.header}>New quiz</h1>
                    <div className={styles.formGroup}>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name' {...register('name', {
                            required: 'This field is required',
                            minLength: { value: 5, message: 'Name must contain at least 5 characters' },
                            maxLength: { value: 60, message: 'Name can contain maximum 60 characters' },
                        }
                        )} />
                        <p className={styles.error}>{errors?.name?.message && errors.name?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label >Description</label>
                        <textarea className={styles.textarea} {...register('description', {
                            required: 'This field is required',
                            minLength: { value: 10, message: 'Description must contain at least 10 characters' },
                            maxLength: { value: 300, message: 'Description can contain maximum 300 characters' },
                        })} />
                        <p className={styles.error}>{errors?.description?.message}</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Questions</label>
                        {questionFields.map((field, index) => (
                            <div key={field.id} className={styles.nestedFormGroup}>
                                <label>Question  №{index}</label>
                                <input type='text' {...register(`questions.${index}.question`, {
                                    required: 'This field is required',
                                    minLength: { value: 10, message: 'Question must contain at least 10 characters' },
                                    maxLength: { value: 200, message: 'Question can contain maximum 60 characters' },
                                })} />
                                <p className={styles.error}>{Array.isArray(errors?.questions) && (errors?.questions as any[])[index]?.question?.message}</p>
                                <label>Answers</label>
                                {field?.answers?.map((answer, aIndex) => (
                                    <><div key={aIndex} className={styles.answerGroup}>
                                        <input type='radio' value={aIndex}
                                            {...register(`questions.${index}.rightAnswer`, { required: 'You have to select the right answer' })}
                                        />
                                        <input
                                            type='text'
                                            {...register(`questions.${index}.answers.${aIndex}.answer`, {
                                                required: 'This field is required',
                                                minLength: { value: 2, message: 'Question must contain at least 2 characters' },
                                                maxLength: { value: 200, message: 'Answer can contain maximum 200 characters' },

                                            })}
                                            placeholder={`Answer ${aIndex + 1}`}
                                        />

                                    </div>
                                        <p className={styles.error}>{Array.isArray(errors?.questions) && Array.isArray(errors?.questions[index]?.answers) ? errors?.questions[index]?.answers[aIndex]?.answer?.message : ''}</p>
                                    </>
                                ))}
                                <p className={styles.error}>{Array.isArray(errors?.questions) && (errors?.questions as any[])[index]?.rightAnswer?.message}</p>

                                <button className={styles.button} type='button' onClick={() => removeQuestion(index)}>Remove question</button>
                            </div>
                        ))}
                        <button className={styles.button} type='button' onClick={() => addQuestion()}>Add question</button>
                    </div>
                    <p className={styles.error}>{formError && formError}</p>
                    {id ? <NavLink className={styles.navLink} to={`/quiz/${id}`}><button className={styles.button} type='button'>View test</button></NavLink> : <button className={styles.button} type='submit'>Submit</button>}
                </form >
            </div> : <Navigate to={`/verify`} />);
};