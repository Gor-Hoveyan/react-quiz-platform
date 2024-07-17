import React from "react";
import styles from './UserData.module.scss';
import useUserStore from "../../stores/userStore";

interface IProps {
    tests: number,
    followers: number,
    followings: number,
    likes: number,
    savedTests?: number,
    likedTests?: number,
    passedTests?: number,
    id?: string,
    setState: (val: string) => void,
}

export default function UserData({ tests, followers, followings, likes, savedTests, likedTests, passedTests, setState, id }: IProps) {
    const getLikedTests = useUserStore(state => state.getLikedPosts);
    const getSavedTests = useUserStore(state => state.getSavedPosts);
    const getFollowers = useUserStore(state => state.getFollowers);
    const getFollowings = useUserStore(state => state.getFollowings);
    const getPassedTests = useUserStore(state => state.getPassedTests);

    function handleSetTests() {
        setState('Tests');
    }

    function handleSetSaves() {
        setState('Saves');
        getSavedTests();
    }

    function handleSetLikes() {
        setState('Likes');
        if (id) {
            getLikedTests(id);
        } else {
            getLikedTests();
        }
    }

    function handleSetFollowers() {
        setState('Followers');
        if (id) {
            getFollowers(id);
        } else {
            getFollowers();
        }
    }

    function handleSetFollowings() {
        setState('Followings');
        if (id) {
            getFollowings(id);
        } else {
            getFollowings();
        }
    }

    function handleSetPassed() {
        setState('Passed');
        if (id) {
            getPassedTests(id);
        } else {
            getPassedTests();
        }
    }

    return (
        <div className={styles.stats}>
            <div className={styles.likes}>
                Likes <br />{likes}
            </div>
            <div className={styles.tests} onClick={() => handleSetTests()}>
                Tests <br />{tests}
            </div>
            <div className={styles.followers} onClick={() => handleSetFollowers()}>
                Followers <br />{followers}
            </div>
            <div className={styles.followings} onClick={() => handleSetFollowings()}>Followings <br />{followings}</div>
            {Number(likedTests) >= 0 && <div className={styles.likedTests} onClick={() => handleSetLikes()}>
                Liked tests <br /> {likedTests}
            </div>}
            {Number(passedTests) >= 0 && <div className={styles.passedTests} onClick={() => handleSetPassed()}>
                Passed tests <br /> {passedTests}
            </div>}
            {Number(savedTests) >= 0 && <div className={styles.savedTests} onClick={() => handleSetSaves()}>
                Saved tests <br /> {savedTests}
            </div>}
        </div>
    );
}