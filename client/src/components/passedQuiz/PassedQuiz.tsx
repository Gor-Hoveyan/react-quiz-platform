import React from 'react';
import styles from './PassedQuiz.module.scss';
import { NavLink } from 'react-router-dom';
import UserIcon from '../userIcon/UserIcon';
import LikesComments from '../likesComments/LikesComments';
import useUserStore, { IPassedQuiz } from '../../stores/userStore';

interface IProps {
    quiz: IPassedQuiz,
}

export default function PassedQuiz({quiz}: IProps) {
    const like = useUserStore(state => state.like);
    const save = useUserStore(state => state.save);
    const user = useUserStore(state => state.user);
    return (
        <div className={styles.main}>
                        <NavLink key={quiz._id} className={styles.navLink} to={`/quiz/review/${quiz._id}`}>
                            <li className={styles.testItem}>
                                <UserIcon createdAt={quiz.createdAt} username={quiz.author?.username} id={quiz.author?._id} avatarUrl={quiz.author?.avatarUrl} />
                                <h2 className={styles.testTitle}>{quiz.name}</h2>
                                <p className={styles.testDescription}>{quiz.description}</p>
                                <LikesComments
                                    id={quiz._id}
                                    commentsCount={quiz.comments?.length + quiz.commentAnswers?.length}
                                    likesCount={quiz?.likes}
                                    savesCount={quiz?.saves}
                                    isSaved={(user?.savedTests as string[])?.includes(quiz._id)}
                                    isLiked={(user?.likedTests as string[])?.includes(quiz._id)}
                                    isComment={false}
                                    isAnswer={false}
                                    like={like}
                                    save={save}
                                    views={quiz?.views}
                                    passed={quiz?.passed}
                                />
                                <div className={styles.result}>
                                <p className={styles.resultParagraph}>Result: {quiz.finalResult}%</p>
                                <div className={styles.resultDisplayContainer}>
                                    <div className={styles.resultDisplay} style={{width: `${quiz.finalResult}%`}}></div>
                                </div>
                                
                                </div>
                                
                            </li>

                        </NavLink>
        </div>
    )
}