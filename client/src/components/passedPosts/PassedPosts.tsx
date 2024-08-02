import React from 'react';
import styles from './PassedPosts.module.scss';
import { IPassedQuiz, IPassedTest } from '../../stores/userStore';
import Loader from '../loader/Loader';
import PassedTest from '../passedTest/PassedTest';
import PassedQuiz from '../passedQuiz/PassedQuiz';

interface IProps {
    posts: (IPassedTest | IPassedQuiz)[]
}

export default function PassedPosts({ posts }: IProps) {

    return (
        <div className={styles.main}>
            <h3 className={styles.header}>Passed tests</h3>
            {posts[0] ? <>{posts[0]?.author ? <div>

                <ul className={styles.testList}>

                    {posts.map(post => (
                        'results' in post ? (<PassedTest test={post} />) : (<PassedQuiz quiz={post} />)
                    ))}
                </ul>
            </div> : <Loader />}</> : <h4 className={styles.header}>No passed tests yet</h4>}</div>
    );
}