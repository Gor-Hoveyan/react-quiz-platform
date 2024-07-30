import React from 'react';
import styles from './TestResult.module.scss';
import useTestStore from '../../stores/testStore';

export default function TestResult() {
    const result = useTestStore(state => state.result);
    return (
        <div className={styles.resultPage}>
            <h1>Your results:</h1>
            <div className={styles.resultText}>
                {result}
            </div>
        </div>
    );
}