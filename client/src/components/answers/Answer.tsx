import React from "react";
import styles from './Answer.module.scss';
import { useForm, SubmitHandler } from "react-hook-form";
import useUserStore from "../../stores/userStore";
import LikesComments from "../likesComments/LikesComments";

type FormValues = {
    updatedAnswer: string
}

interface Props {
    answer: string,
    parent: string,
    author: string,
    id: string,
    likes: number
    likeAnswer: (answerId: string) => void,
    setUpdatingAnswer: (answerId: string) => void,
    removeAnswer: (answerId: string, parentId: string) => void,
    updateAnswer: (newAnswer: string, answerId: string) => void,
    updatingAnswer: string,
}

export default function Answer({ answer, author, id, likes, likeAnswer, removeAnswer, updateAnswer, updatingAnswer, parent, setUpdatingAnswer }: Props) {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const user = useUserStore(state => state.user);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (data.updatedAnswer.length) {
            updateAnswer(data.updatedAnswer, id);
            reset({ updatedAnswer: '' });
            setUpdatingAnswer('')
        }
    }

    function handleRemove() {
        removeAnswer(id, parent);
    }

    return (
        <div className={styles.comment}>
            <div className={styles.nameAndDropdown}>
                {updatingAnswer === id ?
                    <form className={styles.submitForm} onSubmit={handleSubmit(onSubmit)}>
                        <input defaultValue={answer} {...register('updatedAnswer', { required: 'This field is required' })} />
                        <button className={styles.button} type='submit'>
                            Update comment
                        </button>
                        <button onClick={() => setUpdatingAnswer('')} type='button' className={styles.cancelButton}>
                            Cancel
                        </button>
                    </form>
                    :
                    <p>{answer}</p>
                    }
                <div className={styles.dropdown}>
                    <p className={`${styles.dropdownBtn} ${styles.answerLink}`}>Actions</p>
                    <div className={styles.dropdownContent}>
                        <p onClick={() => setUpdatingAnswer(id)}>Update</p>
                        <p onClick={() => handleRemove()}>Remove</p>
                    </div>
                </div>
            </div>
            <span>— {author}</span>
            <LikesComments
                            id={id}
                            likesCount={likes}
                            isLiked={(user?.likedAnswers as string[]).includes(id)}
                            isComment={true}
                            isAnswer={true}
                            like={likeAnswer}
                        />
        </div>
    )
}