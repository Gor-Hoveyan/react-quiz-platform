import React from "react";
import styles from './UserData.module.scss';

interface IProps {
    tests: number,
    followers: number,
    followings: number,
    likes: number,
    savedTests?: number,
    likedTests?: number
}

export default function UserData({ tests, followers, followings, likes, savedTests, likedTests }: IProps) {
    return (
        <div className={styles.stats}>
            <div className={styles.tests}>Tests <br />{tests}</div>
            <div className={styles.followers}>Followers <br />{followers}</div>
            <div className={styles.likes}>Likes <br />{likes}</div>
            <div className={styles.followings}>Followings <br />{followings}</div>
            {Number(likedTests) >= 0 && <div className={styles.likedTests}>Liked tests <br /> {likedTests}</div>}
            {Number(savedTests) >= 0 && <div className={styles.savedTests}>Saved tests <br /> {savedTests}</div>}
        </div>
    );
}