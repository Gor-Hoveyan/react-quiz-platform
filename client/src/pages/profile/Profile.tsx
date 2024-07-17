import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import useUserStore, { IPassedTest, IUserIcon } from '../../stores/userStore';
import UserData from '../../components/userData/UserData';
import { Navigate, useParams } from 'react-router-dom';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import UsersList from '../../components/usersList/UsersList';
import { Test } from '../../stores/testStore';
import PassedTests from '../../components/passedTests/PassedTests';
import Loader from '../../components/loader/Loader';

export default function Profile() {
    const getUserPage = useUserStore(state => state.getUserPage);
    const user = useUserStore(state => state.user);
    const userPage = useUserStore(state => state.userPage);
    const isLogged = useUserStore(state => state.isLogged);
    const tests = userPage?.createdTests;
    const params = useParams();
    const follow = useUserStore(state => state.follow);
    const unfollow = useUserStore(state => state.unfollow);
    const [pageState, setPageState] = useState<string>('Tests');


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
            <UserData likes={userPage.likes} tests={userPage.createdTests.length}
                setState={setPageState} followers={userPage.followers.length}
                followings={userPage.followings.length} id={userPage._id} 
                passedTests={userPage.showPassedTests ? userPage.passedTests.length : undefined}
                likedTests={userPage?.showLikedPosts ? userPage.likedPosts.length : undefined}
            />
            {isLogged &&
                <div className={styles.actions}>
                    {(user?.followings as unknown[]).includes(userPage._id) ?
                        <button className={styles.button} onClick={() => unfollow(userPage._id)}>Unfollow</button>
                        :
                        <button className={styles.button} onClick={() => follow(userPage._id)}>Follow</button>}
                </div>
            }
            {pageState === 'Tests' && <UserProfilePosts tests={(tests as Test[])} />}
            {pageState === 'Likes' && <UserProfilePosts isLikedPosts={true} tests={userPage.likedPosts as Test[]} />}
            {pageState === 'Followers' && <UsersList icons={(userPage.followers as IUserIcon[])} isFollowers={true} />}
            {pageState === 'Followings' && <UsersList icons={(userPage.followings as IUserIcon[])} isFollowers={false} />}
            {pageState === 'Passed' && userPage.showPassedTests && <PassedTests tests={(userPage.passedTests as IPassedTest[])} />}
        </div> : <Loader />}</> : <Navigate to={`/profile`} />
    );
};