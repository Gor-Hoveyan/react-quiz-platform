import React from 'react';
import styles from './Verification.module.scss';
import useUserStore from '../../stores/userStore';
import { Navigate } from 'react-router-dom';

export default function Verification() {
    const newVerificationCode = useUserStore(state => state.newVerificationCode);
    const user = useUserStore(state => state.user);

    return (
        !user?.isActivated ?
        <div className={styles.main}>
            <div className={styles.verification}>
                <h1 className={styles.verificationHeader}>
                    You need to confirm your email address to continue
                </h1>
                <p className={styles.verificationLink} onClick={() => newVerificationCode()}>
                    Request for new link
                </p>
            </div>
        </div> 
        :
        <Navigate to={`/`} />
    )
}