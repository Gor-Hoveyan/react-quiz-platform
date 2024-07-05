import React from 'react';
import styles from './ResultPage.module.scss';
import useTestStore from '../../stores/testStore';

const ResultPage = () => {
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

export default ResultPage;