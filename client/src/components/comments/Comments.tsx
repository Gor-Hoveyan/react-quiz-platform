import React, { useEffect } from 'react';
import styles from './Comments.module.scss';
import useTestStore from '../../stores/testStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import Answer from '../answers/Answer';
import LikesComments from '../likesComments/LikesComments';
import useUserStore from '../../stores/userStore';
import UserIcon from '../userIcon/UserIcon';

type FormValues = {
    comment: string,
    answer: string,
    updatingComment: string
}

export default function Comments() {
    const testId = useTestStore(state => state.test?._id);
    const user = useUserStore(state => state.user);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

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
                            {...register('answer', {
                                required: 'This field is required',
                                minLength: { value: 3, message: 'Answer must contain at least 3 characters' },
                                maxLength: { value: 1000, message: 'Answer can contain maximum 1000 characters' },
                            })}
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
                        <UserIcon createdAt={comment.createdAt} username={comment.author.username} id={comment.author._id} avatarUrl={comment.author.avatarUrl} />
                        {isUpdating === comment._id ?
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <textarea
                                    defaultValue={comment.comment}
                                    placeholder="Updated comment"
                                    {...register('updatingComment', {
                                        required: 'This field is required',
                                        minLength: { value: 3, message: 'Comment must contain at least 3 characters' },
                                        maxLength: { value: 1000, message: 'Comment can contain maximum 1000 characters' },
                                    })}
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
                                {user?._id === comment.author._id && <div className={styles.dropdown}>
                                    <p className={`${styles.dropdownBtn} ${styles.answerLink}`}>Actions</p>
                                    <div className={styles.dropdownContent}>
                                        <p onClick={() => setIsUpdating(comment._id)}>Update</p>
                                        <p onClick={() => removeComment(comment._id)}>Remove</p>
                                    </div>
                                </div>}
                            </div>}
                        <LikesComments
                            id={comment._id}
                            commentsCount={comment.answers.length}
                            likesCount={comment.likes}
                            isLiked={(user?.likedComments as string[]).includes(comment._id)}
                            isComment={true}
                            isAnswer={false}
                            like={likeComment}
                        />
                        {handleAnswer(comment._id)}
                        {comment.answers[0] && !comment.answers[0].comment ? <p className={styles.answerLink} onClick={() => getAnswers(comment._id)}>Show answers</p>
                            :
                            comment?.answers?.map((answer, index) => (
                                <Answer answer={answer} key={index} />
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
                        {...register('comment', {
                            required: 'This field is required',
                            minLength: { value: 3, message: 'Comment must contain at least 3 characters' },
                            maxLength: { value: 1000, message: 'Comment can contain maximum 1000 characters' },
                        })}
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