import React from "react";
import styles from './QuizResult.module.scss';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar } from "react-circular-progressbar";
import useQuizStore from "../../stores/quizStore";

export default function QuizResult() {
    const result = useQuizStore(state => state.result);
    return (
        <div className={styles.main}>
            <div className={styles.results}>
            <h1>Your result</h1>
            <div className={styles.progressbar}>
                <CircularProgressbar value={result} text={`${result}%`} />
            </div>
            </div>
        </div>
    );
}