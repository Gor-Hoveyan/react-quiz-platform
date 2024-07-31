import React from 'react';
import styles from './Quizzes.module.scss';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import LikesComments from '../likesComments/LikesComments';
import UserIcon from '../userIcon/UserIcon';
import Loader from '../loader/Loader';
import { IQuiz } from '../../stores/quizStore';

interface IProps {
    quizzes: IQuiz[]
}

export default function Quizzes({ quizzes }: IProps) {
    const like = useUserStore(state => state.likeQuiz);
    const save = useUserStore(state => state.saveQuiz);
    const user = useUserStore(state => state.user);
    return (
        <div>
            <ul className={styles.testList}>
                {quizzes[0]?._id ? quizzes.map(quiz => (
                    <NavLink key={quiz._id} className={styles.navLink} to={`/quiz/review/${quiz._id}`}>
                        <li className={styles.testItem}>
                            <UserIcon createdAt={quiz.createdAt} username={quiz.author.username} id={quiz.author._id} avatarUrl={quiz.author.avatarUrl} />
                            <h2 className={styles.testTitle}>{quiz.name}</h2>
                            <p className={styles.testDescription}>{quiz.description}</p>
                            <LikesComments
                                id={quiz._id}
                                commentsCount={quiz.comments.length + quiz.commentAnswers?.length}
                                likesCount={quiz.likes}
                                savesCount={quiz.saves}
                                isSaved={(user?.savedPosts as string[])?.includes(quiz._id)}
                                isLiked={(user?.likedPosts as string[])?.includes(quiz._id)}
                                isComment={false}
                                isAnswer={false}
                                like={like}
                                save={save}
                                views={quiz.views}
                                passed={quiz.passed}
                            />
                        </li>
                    </NavLink>
                )) : <Loader />}
            </ul>
        </div>
    );
}