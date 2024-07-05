import React, { useEffect } from 'react';
import styles from './Comments.module.scss';
import useTestStore from '../../stores/testStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import Answer from '../answers/Answer';
import { BiSolidComment } from 'react-icons/bi';

type FormValues = {
    comment: string,
    answer: string,
    updatingComment: string
}

export default function Comments() {
    const testId = useTestStore(state => state.test?._id);
    const { register, handleSubmit, formState: { errors }, reset} = useForm<FormValues>();

    const getComments = useTestStore(state => state.getComments);
    const createComment = useTestStore(state => state.createComment);
    const comments = useTestStore(state => state.comments);
    const isUpdating = useTestStore(state => state.isUpdating);
    const setIsUpdating = useTestStore(state => state.setIsUpdating);
    const updateComment = useTestStore(state => state.updateComment);
    const removeComment = useTestStore(state => state.removeComment);
    const likeComment = useTestStore(state => state.likeComment);

    const createAnswer = useTestStore(state => state.createAnswer);
    const setIsAnswering = useTestStore(state => state.setIsAnswering);
    const getAnswers = useTestStore(state => state.getAnswers);
    const isAnswering = useTestStore(state => state.isAnswering);
    const likeAnswer = useTestStore(state => state.likeAnswer);
    const removeAnswer = useTestStore(state => state.removeAnswer);
    const updateAnswer = useTestStore(state => state.updateAnswer);
    const updatingAnswer = useTestStore(state => state.updatingAnswer);
    const setUpdatingAnswer = useTestStore(state => state.setUpdatingAnswer);

    useEffect(() => {
        if (testId) {
            getComments();
        }
    }, [getComments, testId]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!isAnswering && !isUpdating) {
            if (data.comment.length) {
                createComment(data.comment);
                reset({ comment: '' });
            }

        } else if (isAnswering && !isUpdating) {
            if (data.answer.length) {
                createAnswer(data.answer);
                reset({ answer: '' });
                setIsAnswering('');
            }
        } else if (!isAnswering && isUpdating) {
            if (data.updatingComment.length) {
                updateComment(data.updatingComment, isUpdating);
                reset({ updatingComment: '' });
                setIsUpdating('');
            }
        }

    }


    function handleAnswer(commentId: string) {
        if (isAnswering !== commentId) {
            return <p className={styles.answerLink} onClick={() => setIsAnswering(commentId)}>Answer</p>
        } else {
            return (
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                            placeholder="Your answer"
                            {...register('answer')}
                            className={styles.textarea}
                        />
                        <button className={styles.button} type='submit'>
                            Add Comment
                        </button>
                        <button onClick={() => setIsAnswering('')} type='button' className={styles.cancelButton}>
                            Cancel
                        </button>
                    </form>
                </div>);
        }
    }

    return (
        <div className={styles.commentsSection}>
            <h2>Comments</h2>
            <ul className={styles.commentsList}>
                {comments && comments.map((comment) => (
                    <li key={comment._id} className={styles.comment}>
                        {isUpdating === comment._id ?
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <textarea
                                    defaultValue={comment.comment}
                                    placeholder="Updated comment"
                                    {...register('updatingComment')}
                                    className={styles.textarea}
                                />
                                <button className={styles.button} type='submit'>
                                    Update comment
                                </button>
                                <button onClick={() => setIsUpdating('')} type='button' className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </form>
                            :
                            <div className={styles.nameAndCircles}>
                                <p>{comment.comment}</p>
                                <div className={styles.dropdown}>
                                    <p className={`${styles.dropdownBtn} ${styles.answerLink}`}>Actions</p>
                                    <div className={styles.dropdownContent}>
                                        <p onClick={() => setIsUpdating(comment._id)}>Update</p>
                                        <p onClick={() => removeComment(comment._id)}>Remove</p>
                                    </div>
                                </div>
                            </div>}
                        <span>— {comment.author.username}</span>
                        <div className={styles.testOtherData}>
                            <p className={styles.testLikes}>
                                <span onClick={() => likeComment(comment._id)} style={{ color: 'red' }}>&#10084;</span>
                                {comment.likes}
                            </p>
                            <p className={styles.testComments}>
                                <BiSolidComment color='#2065ce' className={styles.testCommentIcon} />
                                {comment.answers.length}
                            </p>
                        </div>
                        {handleAnswer(comment._id)}
                        {comment.answers[0] && !comment.answers[0].comment ? <p className={styles.answerLink} onClick={() => getAnswers(comment._id)}>Show answers</p>
                            :
                            comment?.answers?.map((answer, index) => (
                                <Answer key={index} updatingAnswer={updatingAnswer} parent={comment._id} setUpdatingAnswer={setUpdatingAnswer}
                                    likeAnswer={likeAnswer} updateAnswer={updateAnswer} removeAnswer={removeAnswer}
                                    answer={answer.comment} author={comment.author.username} id={answer._id ? answer._id : String(answer)} likes={comment.likes} />
                            ))
                        }
                    </li>
                ))}
            </ul>
            <div className={styles.formSection}>
                <h3>Add a Comment</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        placeholder="Your comment"
                        {...register('comment')}
                        className={styles.textarea}
                    />
                    <p className={styles.error}>{errors.comment?.message && errors.comment.message}</p>
                    <button className={styles.button} type='submit'>
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    );
};