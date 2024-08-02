import React from "react";
import styles from './QuizComponent.module.scss';
import { IQuiz } from "../../stores/quizStore";
import { NavLink } from "react-router-dom";
import UserIcon from "../userIcon/UserIcon";
import LikesComments from "../likesComments/LikesComments";
import useUserStore from "../../stores/userStore";

interface IProps {
    quiz: IQuiz,
}

export default function QuizComponent({ quiz }: IProps) {
    const like = useUserStore(state => state.likeQuiz);
    const save = useUserStore(state => state.saveQuiz);
    const user = useUserStore(state => state.user);
    return (
        <div className={styles.main}>
            <NavLink key={quiz._id} className={styles.navLink} to={`/quiz/review/${quiz._id}`}>
                <li className={styles.postItem}>
                    <UserIcon createdAt={quiz.createdAt} username={quiz.author.username} id={quiz.author._id} avatarUrl={quiz.author.avatarUrl} />
                    <h2 className={styles.postTitle}>{quiz.name}</h2>
                    <p className={styles.postDescription}>{quiz.description}</p>
                    <LikesComments
                        id={quiz._id}
                        commentsCount={quiz.comments.length + quiz.commentAnswers?.length}
                        likesCount={quiz.likes}
                        savesCount={quiz.saves}
                        isSaved={(user?.savedQuizzes as string[])?.includes(quiz._id)}
                        isLiked={(user?.likedQuizzes as string[])?.includes(quiz._id)}
                        isComment={false}
                        isAnswer={false}
                        like={like}
                        save={save}
                        views={quiz.views}
                        passed={quiz.passed}
                    />
                </li>
            </NavLink>
        </div>
    )
}