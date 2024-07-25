import React from "react";
import styles from './UserProfilePosts.module.scss';
import { Test } from "../../stores/testStore";
import Tests from "../tests/Tests";
import AddPostBtn from "../addPostBtn/AddPostBtn";

interface IProps {
    tests: Test[],
    isLikedPosts?: boolean,
    isSavedPosts?: boolean,
}

export default function UserProfilePosts({ tests, isLikedPosts, isSavedPosts }: IProps) {
    return (
        <>
            <div className={styles.posts} >
                <h3 className={styles.postsHeader}>
                    {isLikedPosts && 'Liked posts'}
                    {isSavedPosts && 'Saved posts'}
                    {!isLikedPosts && !isSavedPosts && 'Your Posts'}
                </h3>
                {tests.length ? <Tests tests={tests} /> : <h4>No posts yet</h4>}
            </div>
            {!isLikedPosts && !isSavedPosts && <AddPostBtn />
            }
        </>
    );
}