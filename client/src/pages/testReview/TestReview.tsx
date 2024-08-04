import React, { useEffect } from 'react';
import styles from './TestReview.module.scss';
import { NavLink, useParams } from 'react-router-dom';
import useTestStore from '../../stores/testStore';
import useUserStore from '../../stores/userStore';
import Comments from '../../components/comments/Comments';
import LikesComments from '../../components/likesComments/LikesComments';
import UserIcon from '../../components/userIcon/UserIcon';
import Loader from '../../components/loader/Loader';


export default function TestReview() {
    const params = useParams();
    const testId = params.id;
    const test = useTestStore(state => state.test);
    const getTest = useTestStore(state => state.getTest);
    const like = useUserStore(state => state.like);
    const user = useUserStore(state => state.user);
    const save = useUserStore(state => state.save);

    useEffect(() => {
        if (testId?.length) {
            getTest(testId);
        }
    }, [testId, getTest]);

    return (
        <div className={styles.main}>
            {test ?
                <div className={styles.testContainer}>
                    <UserIcon createdAt={test.createdAt} avatarUrl={test.author.avatarUrl} id={test.author._id} username={test.author.username} />
                    <h1 className={styles.testReviewHeader}><NavLink className={styles.navLink} to={`/test/${test._id}`}>{test.name}</NavLink></h1>
                    <h3 className={styles.testReviewH3}>{test.description}</h3>
                    <h5 className={styles.testReviewH5}>
                        <NavLink className={styles.navLink} to={`/test/${test._id}`}>Go to the test</NavLink>
                    </h5>
                    <h5 className={styles.testReviewH5}>Total questions: {test.questions.length}</h5>

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
                    <Comments />
                </div> : <Loader />}
        </div>
    );
}