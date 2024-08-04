import React from 'react';
import styles from './Posts.module.scss';
import { Test } from '../../stores/testStore';
import { IQuiz } from '../../stores/quizStore';
import TestComponent from '../testComponent/TestComponent';
import QuizComponent from '../quizComponent/QuizComponent';
import Loader from '../loader/Loader';

interface IProps {
    posts: (Test | IQuiz)[]
}

export default function Posts({ posts }: IProps) {
    return (
        <div>
            <ul className={styles.testList}>
                {posts[0]?._id ? posts.map((post, index) => (
                    'results' in post ? (<TestComponent test={post} />) :( <QuizComponent quiz={post} />)

                )) : <Loader />}
            </ul>
        </div>
    )
}