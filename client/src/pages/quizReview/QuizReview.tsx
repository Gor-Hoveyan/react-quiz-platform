import React, { useEffect } from "react";
import styles from './QuizReview.module.scss';
import { NavLink, useParams } from "react-router-dom";
import useQuizStore from "../../stores/quizStore";
import useUserStore from "../../stores/userStore";
import Comments from "../../components/comments/Comments";
import LikesComments from "../../components/likesComments/LikesComments";
import UserIcon from "../../components/userIcon/UserIcon";
import Loader from "../../components/loader/Loader";


export default function QuizReview() {
    const params = useParams();
    const quizId = params.id;
    const quiz = useQuizStore(state => state.quiz);
    const getQuiz = useQuizStore(state => state.getQuiz);
    const like = useUserStore(state => state.like);
    const user = useUserStore(state => state.user);
    const save = useUserStore(state => state.save);

    useEffect(() => {
        if (quizId?.length) {
            getQuiz(quizId);
        }
    }, [quizId, getQuiz]);

    return (
        <div className={styles.main}>
            {quiz ?
                <div className={styles.testContainer}>
                    <UserIcon createdAt={quiz.createdAt} avatarUrl={quiz.author.avatarUrl} id={quiz.author._id} username={quiz.author.username} />
                    <h1 className={styles.testReviewHeader}><NavLink className={styles.navLink} to={`/quiz/${quiz._id}`}>{quiz.name}</NavLink></h1>
                    <h3 className={styles.testReviewH3}>{quiz.description}</h3>
                    <h5 className={styles.testReviewH5}>
                        <NavLink className={styles.navLink} to={`/quiz/${quiz._id}`}>Go to the quiz</NavLink>
                    </h5>
                    <h5 className={styles.testReviewH5}>Total questions: {quiz.questions.length}</h5>

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
                    <Comments />
                </div> : <Loader />}
        </div>
    );
}