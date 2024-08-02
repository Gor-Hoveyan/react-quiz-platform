import React from "react";
import styles from './UserData.module.scss';
import useUserStore from "../../stores/userStore";

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
}

export default function UserData({ tests, followers, followings, likes, savedPosts, likedPosts, passedPosts, setState, id }: IProps) {
    const getLikedPosts = useUserStore(state => state.getLikedPosts);
    const getSavedPosts = useUserStore(state => state.getSavedPosts);
    const getUserPosts = useUserStore(state => state.getUserPosts);
    const getFollowers = useUserStore(state => state.getFollowers);
    const getFollowings = useUserStore(state => state.getFollowings);
    const getPassedPosts = useUserStore(state => state.getPassedPosts);

    function handleSetTests() {
        setState('Tests');
        if(id) {
            getUserPosts(id);
        }
    }

    function handleSetSaves() {
        setState('Saves');
        getSavedPosts();
    }

    function handleSetLikes() {
        setState('Likes');
        if (id) {
            getLikedPosts(id);
        } else {
            getLikedPosts();
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
            getPassedPosts(id);
        } else {
            getPassedPosts();
        }
    }

    return (
        <div className={styles.stats}>
            <div className={styles.likes}>
                Likes <br />{likes}
            </div>
            <div className={styles.tests} onClick={() => handleSetTests()}>
                posts <br />{tests}
            </div>
            <div className={styles.followers} onClick={() => handleSetFollowers()}>
                Followers <br />{followers}
            </div>
            <div className={styles.followings} onClick={() => handleSetFollowings()}>Followings <br />{followings}</div>
            {Number(likedPosts) >= 0 && <div className={styles.likedTests} onClick={() => handleSetLikes()}>
                Liked posts <br /> {likedPosts}
            </div>}
            {Number(passedPosts) >= 0 && <div className={styles.passedTests} onClick={() => handleSetPassed()}>
                Passed tests <br /> {passedPosts}
            </div>}
            {Number(savedPosts) >= 0 && <div className={styles.savedTests} onClick={() => handleSetSaves()}>
                Saved tests <br /> {savedPosts}
            </div>}
        </div>
    );
}