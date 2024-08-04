import React from 'react';
import styles from './TestComponent.module.scss';
import { Test } from '../../stores/testStore';
import { NavLink } from 'react-router-dom';
import UserIcon from '../userIcon/UserIcon';
import LikesComments from '../likesComments/LikesComments';
import useUserStore from '../../stores/userStore';

interface IProps {
    test: Test
}

export default function TestComponent({ test }: IProps) {
    const like = useUserStore(state => state.like);
    const save = useUserStore(state => state.save);
    const user = useUserStore(state => state.user);
    return (
        <div className={styles.main}>
            <NavLink key={test._id} className={styles.navLink} to={`/test/review/${test._id}`}>
                <li className={styles.postItem}>
                    <UserIcon createdAt={test.createdAt} username={test.author.username} id={test.author._id} avatarUrl={test.author.avatarUrl} />
                    <h2 className={styles.postTitle}>{test.name}</h2>
                    <p className={styles.postDescription}>{test.description}</p>
                    <LikesComments
                        id={test._id}
                        commentsCount={test.comments.length + test.commentAnswers?.length}
                        likesCount={test.likes}
                        savesCount={test.saves}
                        isSaved={(user?.savedTests as string[])?.includes(test._id)}
                        isLiked={(user?.likedTests as string[])?.includes(test._id)}
                        isComment={false}
                        isAnswer={false}
                        like={like}
                        save={save}
                        views={test.views}
                        passed={test.passed}
                    />
                </li>
            </NavLink>
        </div>
    )
}