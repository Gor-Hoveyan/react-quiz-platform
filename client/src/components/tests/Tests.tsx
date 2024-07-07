import React from 'react';
import styles from './Tests.module.scss';
import { TestData } from '../../stores/homeStore';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { Test } from '../../stores/testStore';
import LikesComments from '../likesComments/LikesComments';

interface IProps {
    tests: TestData[] | Test[]
}

export default function Tests({ tests }: IProps) {
    const username = useUserStore(state => state.user?.username);
    const like = useUserStore(state => state.like);
    const save = useUserStore(state => state.save);
    const user = useUserStore(state => state.user);

    function getUsername(test: Test | TestData) {
        if ((test as TestData).authorsName !== undefined) {
            return (test as TestData).authorsName
        } else {
            return username;
        }
    }
    return (
        <div>
            <ul className={styles.testList}>
                {tests.map(test => (
                    <NavLink key={test._id} className={styles.navLink} to={`/test/review/${test._id}`}>
                        <li className={styles.testItem}>
                            <div className={styles.titleDateDiv}>
                                <h2 className={styles.testTitle}>{test.name}</h2>
                                <p className={styles.testDate}>{test.createdAt.split('T')[0]}</p>
                            </div>
                            <p className={styles.testAuthor}>{getUsername(test)}</p>
                            <p className={styles.testDescription}>{test.description}</p>
                            <LikesComments
                                id={test._id}
                                commentsCount={test.comments.length + test.commentAnswers?.length}
                                likesCount={test.likes}
                                savesCount={test.saves}
                                isSaved={(user?.savedPosts as string[]).includes(test._id)}
                                isLiked={(user?.likedPosts as string[]).includes(test._id)}
                                isComment={false}
                                isAnswer={false}
                                like={like}
                                save={save}
                            />
                        </li>
                    </NavLink>
                ))}
            </ul>
        </div>
    );
}