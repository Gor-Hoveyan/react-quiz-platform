import React from 'react';
import styles from './Tests.module.scss';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { Test } from '../../stores/testStore';
import LikesComments from '../likesComments/LikesComments';
import UserIcon from '../userIcon/UserIcon';

interface IProps {
    tests: Test[]
}

export default function Tests({ tests }: IProps) {
    const like = useUserStore(state => state.like);
    const save = useUserStore(state => state.save);
    const user = useUserStore(state => state.user);
    return (
        <div>
            <ul className={styles.testList}>
                {tests.map(test => (
                    <NavLink key={test._id} className={styles.navLink} to={`/test/review/${test._id}`}>
                        <li className={styles.testItem}>
                            <UserIcon createdAt={test.createdAt} username={test.author.username} id={test.author._id} avatarUrl={test.author.avatarUrl} />
                            <h2 className={styles.testTitle}>{test.name}</h2>
                            <p className={styles.testDescription}>{test.description}</p>
                            <LikesComments
                                id={test._id}
                                commentsCount={test.comments.length + test.commentAnswers?.length}
                                likesCount={test.likes}
                                savesCount={test.saves}
                                isSaved={(user?.savedPosts as string[])?.includes(test._id)}
                                isLiked={(user?.likedPosts as string[])?.includes(test._id)}
                                isComment={false}
                                isAnswer={false}
                                like={like}
                                save={save}
                                views={test.views}
                                passed={test.passed}
                            />
                        </li>
                    </NavLink>
                ))}
            </ul>
        </div>
    );
}