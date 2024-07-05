import React, { useEffect } from "react";
import styles from './TestReview.module.scss';
import { NavLink, useParams } from "react-router-dom";
import useTestStore from "../../stores/testStore";
import { BiSolidComment } from 'react-icons/bi';
import useUserStore from "../../stores/userStore";
import Comments from "../../components/comments/Comments";


export default function TestReview() {
    const params = useParams();
    const testId = params.id;
    const test = useTestStore(state => state.test);
    const getTest = useTestStore(state => state.getTest);
    const like = useUserStore(state => state.like);

    useEffect(() => {
        if (testId?.length) {
            getTest(testId);
        }
    }, []);

    let handleLike = () => {
        if (testId) {
            like(testId);
            handleLike = () => { } //Replace handleLike with empty function to remove event
        }
    }

    return (
        <>
            {test ?
                <div className={styles.testContainer}>
                    <h1 className={styles.testReviewHeader}><NavLink className={styles.navLink} to={`/test/${test._id}`}>{test.name}</NavLink></h1>
                    <h3 className={styles.testReviewH3}>{test.description}</h3>
                    <h6><NavLink className={styles.navLink} to={`/test/${test._id}`}>Go to the test</NavLink></h6>
                    <h5 className={styles.testReviewH5}>Total questions: {test.questions.length}</h5>
                    <h5 className={styles.testReviewH5}>Author: {test.author.username}</h5>
                    <h5 className={styles.testReviewH5}>Passed *** times</h5>
                    <h5 className={styles.testReviewH5}>*** views</h5>
                    <div className={styles.testOtherData}>
                        <p className={styles.testLikes}>
                            <span onClick={() => handleLike()} style={{ color: 'red' }}>&#10084;</span>
                            {test.likes}
                        </p>
                        <p className={styles.testComments}>
                            <BiSolidComment color='#2065ce' className={styles.testCommentIcon} />
                            {test.comments.length + test.commentAnswers?.length}
                        </p>
                    </div>
                    <Comments />
                </div> : <h1>Loading...</h1>}
        </>
    );
}