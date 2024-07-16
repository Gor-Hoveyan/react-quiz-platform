import React from "react";
import styles from './ErrorFallback.module.scss';

interface IProps {
    error: Error,
    resetErrorBoundary: () => void,
}

export default function ErrorFallback({error, resetErrorBoundary}: IProps) {
    return (
        <div className={styles.errorFallback} role='alert'>
            <img className={styles.errImage} src='https://i.yapx.cc/Xuivc.png' alt='https://i.yapx.cc/Xuivc.png'
            />
            <h1>Something went wrong:</h1>
            <p className={styles.error}>{error.message}</p>
            <button className={styles.button} onClick={() => resetErrorBoundary()}>Try again</button>
        </div>
    )
}