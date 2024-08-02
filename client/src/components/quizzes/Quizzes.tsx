import React from 'react';
import styles from './Quizzes.module.scss';
import Loader from '../loader/Loader';
import { IQuiz } from '../../stores/quizStore';
import QuizComponent from '../quizComponent/QuizComponent';

interface IProps {
    quizzes: IQuiz[]
}

export default function Quizzes({ quizzes }: IProps) {

    return (
        <div>
            <ul className={styles.testList}>
                {quizzes[0]?._id ? quizzes.map(quiz => (
                    <QuizComponent quiz={quiz} />
                )) : <Loader />}
            </ul>
        </div>
    );
}