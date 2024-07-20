import React from 'react';
import styles from './PassedTests.module.scss';
import { NavLink } from 'react-router-dom';
import useUserStore, { IPassedTest } from '../../stores/userStore';
import LikesComments from '../likesComments/LikesComments';
import UserIcon from '../userIcon/UserIcon';
import Loader from '../loader/Loader';

interface IProps {
    tests: IPassedTest[]
}

export default function PassedTests({ tests }: IProps) {
    const like = useUserStore(state => state.like);
    const save = useUserStore(state => state.save);
    const user = useUserStore(state => state.user);
    return (
        <div className={styles.main}>
            <h3 className={styles.header}>Passed tests</h3>
            {tests[0] ? <>{tests[0]?.author ? <div>

                <ul className={styles.testList}>

                    {tests.map(test => (
                        <NavLink key={test._id} className={styles.navLink} to={`/test/review/${test._id}`}>
                            <li className={styles.testItem}>
                                <UserIcon createdAt={test.createdAt} username={test.author?.username} id={test.author?._id} avatarUrl={test.author?.avatarUrl} />
                                <h2 className={styles.testTitle}>{test.name}</h2>
                                <p className={styles.testDescription}>{test.description}</p>
                                <LikesComments
                                    id={test._id}
                                    commentsCount={test.comments?.length + test.commentAnswers?.length}
                                    likesCount={test?.likes}
                                    savesCount={test?.saves}
                                    isSaved={(user?.savedPosts as string[])?.includes(test._id)}
                                    isLiked={(user?.likedPosts as string[])?.includes(test._id)}
                                    isComment={false}
                                    isAnswer={false}
                                    like={like}
                                    save={save}
                                    views={test?.views}
                                    passed={test?.passed}
                                />
                                <p className={styles.result}>Result: {test?.finalResult}</p>
                            </li>

                        </NavLink>
                    ))}
                </ul>
            </div> : <Loader />}</> : <h4 className={styles.header}>No passed tests yet</h4>}</div>
    );
}