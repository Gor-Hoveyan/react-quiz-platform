import React from "react";
import styles from './Answer.module.scss';
import { useForm, SubmitHandler } from "react-hook-form";

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
            <div className={styles.testOtherData}>
                <p className={styles.testLikes}>
                    <span onClick={() => likeAnswer(id)} style={{ color: 'red' }}>&#10084;</span>
                    {likes}
                </p>
            </div>
        </div>
    )
}