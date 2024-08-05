import React, { useState } from 'react';
import styles from './UserData.module.scss';
import useUserStore, { PaginationData } from '../../stores/userStore';
import { FaCubes, FaHeart, FaCircleCheck, FaBookmark } from 'react-icons/fa6';

interface IProps {
    tests: number,
    followers: number,
    followings: number,
    likes: number,
    savedPosts?: number,
    likedPosts?: number,
    passedPosts?: number,
    id?: string,
    setState: (val: string) => void,
    state: string,
}

export default function UserData({ tests, followers, followings, likes, savedPosts, likedPosts, passedPosts, setState, state, id }: IProps) {

    function handleSetTests() {
        setState('Tests');
    }

    function handleSetSaves() {
        setState('Saves');
    }

    function handleSetLikes() {
        setState('Likes');
    }

    function handleSetFollowers() {
        setState('Followers');
    }

    function handleSetFollowings() {
        setState('Followings');
    }

    function handleSetPassed() {
        setState('Passed');
    }

    return (
        <div className={styles.stats}>
            <div className={styles.firstLine}>
                <div className={styles.firstLineItem}>
                    <span className={styles.number}>{likes}</span><br />Likes
                </div>
                <div className={styles.firstLineItem} onClick={() => handleSetFollowers()}>
                    <span className={styles.number}>{followers}</span><br />Followers
                </div>
                <div className={styles.firstLineItem} onClick={() => handleSetFollowings()}>
                    <span className={styles.number}>{followings}</span><br />Followings
                </div>
                <div className={styles.firstLineItem} onClick={() => handleSetTests()}>
                    <span className={styles.number}>{tests}</span><br />Posts
                </div>
            </div>

            <div className={styles.secondLine}>
                <div className={state === 'Tests' ? `${styles.secondLineItem} ${styles.active}` : styles.secondLineItem} onClick={() => handleSetTests()}>
                    <FaCubes />
                </div>
                {Number(likedPosts) >= 0 &&
                    <div onClick={() => handleSetLikes()}
                        className={state === 'Likes' ? `${styles.secondLineItem} ${styles.active}` : styles.secondLineItem}
                    >
                        <FaHeart />
                    </div>}
                {Number(passedPosts) >= 0 &&
                    <div onClick={() => handleSetPassed()}
                        className={state === 'Passed' ? `${styles.secondLineItem} ${styles.active}` : styles.secondLineItem}
                    >
                        <FaCircleCheck />
                    </div>}
                {Number(savedPosts) >= 0 &&
                    <div onClick={() => handleSetSaves()}
                        className={state === 'Saves' ? `${styles.secondLineItem} ${styles.active}` : styles.secondLineItem}
                    >
                        <FaBookmark />
                    </div>}
            </div>

        </div>
    );
}