import React from "react";
import styles from './Answer.module.scss';
import { useForm, SubmitHandler } from "react-hook-form";
import useUserStore from "../../stores/userStore";
import LikesComments from "../likesComments/LikesComments";
import UserIcon from "../userIcon/UserIcon";
import useCommentStore, { ICommentAnswer } from "../../stores/commentStore";

type FormValues = {
    updatedAnswer: string
}

interface Props {
    answer: ICommentAnswer;
}

export default function Answer({ answer }: Props) {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const user = useUserStore(state => state.user);
    const updateAnswer = useCommentStore(state => state.updateAnswer);
    const setUpdatingAnswer = useCommentStore(state => state.setUpdatingAnswer);
    const removeAnswer = useCommentStore(state => state.removeAnswer);
    const updatingAnswer = useCommentStore(state => state.updatingAnswer);
    const likeAnswer = useCommentStore(state => state.likeAnswer);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.updatedAnswer.length) {
            updateAnswer(data.updatedAnswer, answer._id);
            reset({ updatedAnswer: '' });
            setUpdatingAnswer('')
        }
    }

    function handleRemove() {
        removeAnswer(answer._id, answer.parentComment);
    }

    return (
        <div className={styles.comment}>
            <UserIcon createdAt={answer.createdAt} username={answer.author.username} id={answer.author._id} avatarUrl={answer.author.avatarUrl} />
            <div className={styles.nameAndDropdown}>
                {updatingAnswer === answer._id ?
                    <form className={styles.submitForm} onSubmit={handleSubmit(onSubmit)}>
                        <textarea className={styles.textarea} defaultValue={answer.comment} {...register('updatedAnswer', {
                                        required: 'This field is required',
                                        minLength: { value: 3, message: 'Answer must contain at least 2 characters' },
                                        maxLength: { value: 1000, message: 'Answer can contain maximum 1000 characters' },
                                    })} />
                        <button className={styles.button} type='submit'>
                            Update answer
                        </button>
                        <button onClick={() => setUpdatingAnswer('')} type='button' className={styles.cancelButton}>
                            Cancel
                        </button>
                    </form>
                    :
                    <div className={styles.answer}>
                        <p>{answer.comment}</p>
                    </div>
                }
                {user?._id === answer.author._id && <div className={styles.dropdown}>
                    <p className={`${styles.dropdownBtn} ${styles.answerLink}`}>Actions</p>
                    <div className={styles.dropdownContent}>
                        <p onClick={() => setUpdatingAnswer(answer._id)}>Update</p>
                        <p onClick={() => handleRemove()}>Remove</p>
                    </div>
                </div>}

            </div>
            <LikesComments
                id={answer._id}
                likesCount={answer.likes}
                isLiked={(user?.likedAnswers as string[]).includes(answer._id)}
                isComment={true}
                isAnswer={true}
                like={likeAnswer}
            />
        </div>
    )
}