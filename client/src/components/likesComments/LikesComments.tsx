import React from "react";
import styles from './LikesComments.module.scss';
import { BiSolidComment } from 'react-icons/bi';
import { BsSuitHeartFill, BsBookmarkFill } from "react-icons/bs";

interface IProps {
    id: string,
    commentsCount?: number,
    isLiked: boolean,
    isSaved?: boolean,
    isComment: boolean,
    isAnswer: boolean,
    likesCount: number,
    savesCount?: number,
    like: (id: string) => void,
    save?: (id: string) => void,
}

export default function LikesComments({ id, isAnswer, commentsCount, isLiked, isSaved, isComment, likesCount, savesCount, like, save }: IProps) {
    return (
        <div className={styles.main}>
            <p className={styles.testLikes}>
                <BsSuitHeartFill color={isLiked ? 'red' : 'rgb(237, 150, 133)'} onClick={(e) => { like(id); e.preventDefault() }} />
                {likesCount}
            </p>
            {!isAnswer &&
            <p className={styles.testComments}>
                <BiSolidComment color='blue' className={styles.testCommentIcon} />
                {commentsCount}
            </p>}
            {!isComment &&
                <p className={styles.Saves}>
                    <BsBookmarkFill color={isSaved ? 'black' : 'gray'} onClick={(e) => {save && save(id); e.preventDefault() }} />
                    {savesCount}
                </p>
            }
        </div>
    )
}