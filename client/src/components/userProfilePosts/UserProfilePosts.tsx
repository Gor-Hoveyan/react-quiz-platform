import React from 'react';
import styles from './UserProfilePosts.module.scss';
import { Test } from '../../stores/testStore';
import AddPostBtn from '../addPostBtn/AddPostBtn';
import Posts from '../posts/Posts';
import { IQuiz } from '../../stores/quizStore';

interface IProps {
    posts: (Test | IQuiz)[],
    isLikedPosts?: boolean,
    isSavedPosts?: boolean,
}

export default function UserProfilePosts({ posts, isLikedPosts, isSavedPosts }: IProps) {
    return (
        <>
            <div className={styles.posts} >
                <h3 className={styles.postsHeader}>
                    {isLikedPosts && 'Liked posts'}
                    {isSavedPosts && 'Saved posts'}
                    {!isLikedPosts && !isSavedPosts && 'Created Posts'}
                </h3>
                {posts?.length ? <Posts posts={posts} /> : <h4>No posts yet</h4>}
            </div>
            {!isLikedPosts && !isSavedPosts && <AddPostBtn postType='quiz' />
            }
        </>
    );
}