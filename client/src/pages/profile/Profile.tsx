import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import useUserStore, { IUserIcon } from '../../stores/userStore';
import UserData from '../../components/userData/UserData';
import { Navigate, useParams } from 'react-router-dom';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import UsersList from '../../components/usersList/UsersList';
import { Test } from '../../stores/testStore';
import PassedTests from '../../components/passedPosts/PassedPosts';
import Loader from '../../components/loader/Loader';

export default function Profile() {
    const getUserPage = useUserStore(state => state.getUserPage);
    const user = useUserStore(state => state.user);
    const userPage = useUserStore(state => state.userPage);
    const isLogged = useUserStore(state => state.isLogged);
    const params = useParams();
    const follow = useUserStore(state => state.follow);
    const unfollow = useUserStore(state => state.unfollow);
    const [pageState, setPageState] = useState<string>('Tests');
    const posts = useUserStore(state => state.posts);
    const passedPosts = useUserStore(state => state.passedPosts);
    const likedPosts = useUserStore(state => state.likedPosts);

    useEffect(() => {
        if (params.id) {
            getUserPage(params.id);
        }
    }, [getUserPage, params]);

    return (params.id !== user?._id ? <>{userPage ?
        <div className={styles.container}>
            <div >
                <img className={styles.avatar}
                    src={userPage.avatarUrl.trim() ? userPage.avatarUrl : 'https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}
                    alt={`${userPage?.username}'s avatar`}
                />
            </div>
            <div className={styles.details}>
                <p className={styles.username}>{userPage?.username}</p>
            </div>
            <div className={styles.bio}>{userPage?.bio}</div>
            {isLogged &&
                <div className={styles.actions}>
                    {(user?.followings as unknown[]).includes(userPage._id) ?
                        <button className={styles.button} onClick={() => unfollow(userPage._id)}>Unfollow</button>
                        :
                        <button className={styles.button} onClick={() => follow(userPage._id)}>Follow</button>}
                </div>
            }
            <UserData likes={userPage.likes} tests={userPage.createdTests.length + userPage.createdQuizzes.length}
                setState={setPageState} followers={userPage.followers.length}
                followings={userPage.followings.length} id={userPage._id} state={pageState}
                passedPosts={userPage.showPassedPosts ? userPage.passedTests.length + userPage.passedQuizzes.length : undefined}
                likedPosts={userPage?.showLikedPosts ? userPage.likedTests.length + userPage.likedQuizzes.length : undefined}
            />
            {pageState === 'Tests' && <UserProfilePosts posts={(posts as Test[])} />}
            {pageState === 'Likes' && <UserProfilePosts isLikedPosts={true} posts={likedPosts} />}
            {pageState === 'Followers' && <UsersList icons={(userPage.followers as IUserIcon[])} isFollowers={true} />}
            {pageState === 'Followings' && <UsersList icons={(userPage.followings as IUserIcon[])} isFollowers={false} />}
            {pageState === 'Passed' && userPage.showPassedPosts && <PassedTests posts={passedPosts} />}
        </div> : <Loader />}</> : <Navigate to={`/profile`} />
    );
};