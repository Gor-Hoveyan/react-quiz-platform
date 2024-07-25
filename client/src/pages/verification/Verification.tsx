import React, { useEffect } from 'react';
import styles from './Verification.module.scss';
import useUserStore from '../../stores/userStore';
import { Navigate } from 'react-router-dom';

export default function Verification() {
    const newVerificationCode = useUserStore(state => state.newVerificationCode);
    const user = useUserStore(state => state.user);
    const verificationTimer = useUserStore(state => state.verificationTimer);
    const setVerificationTimer = useUserStore(state => state.setVerificationTimer);

    useEffect(() => {
        if(verificationTimer > 0) {
            setTimeout(() => {
                setVerificationTimer(verificationTimer - 1);
            }, 1000);
        }
    }, [verificationTimer, setVerificationTimer]);

    return (
        !user?.isActivated ?
            <div className={styles.main}>
                <div className={styles.verification}>
                    <h1 className={styles.verificationHeader}>Email verification</h1>
                    <img className={styles.emailImg} alt='' src='https://i.yapx.ru/XyJVX.png' />
                    <p className={styles.content}>Hi, {user?.username},</p>
                    <p className={styles.content}>
                        To start exploring platform, please confirm your email address.
                    </p>
                    <button disabled={verificationTimer > 0} className={styles.button} onClick={() => newVerificationCode()}>
                        Request a new message
                    </button>
                    {verificationTimer ? <p className={styles.timer}> You can send a new request after {Math.floor(verificationTimer / 60)}:{Math.floor(verificationTimer / 60) ? verificationTimer - 60 : verificationTimer}</p> : ''}
                </div>
            </div>
            :
            <Navigate to={`/`} />
    )
}