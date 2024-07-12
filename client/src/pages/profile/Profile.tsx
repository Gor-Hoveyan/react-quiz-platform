import React, { useEffect } from 'react';
import styles from './Profile.module.scss';
import useUserStore from '../../stores/userStore';
import Tests from '../../components/tests/Tests';
import UserData from '../../components/userData/UserData';
import { Navigate, useParams } from 'react-router-dom';

export default function Profile() {
    const getUserPage = useUserStore(state => state.getUserPage);
    const user = useUserStore(state => state.user);
    const userPage = useUserStore(state => state.userPage);
    const isLogged = useUserStore(state => state.isLogged);
    const tests = userPage?.createdTests;
    const params = useParams();
    const follow = useUserStore(state => state.follow);
    const unfollow = useUserStore(state => state.unfollow);


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
            <div className={styles.bio}>{user?.bio}</div>
            <UserData likes={userPage.likes} tests={userPage.createdTests.length} followers={userPage.followers.length} followings={userPage.followings.length} />
            {isLogged &&
                <div className={styles.actions}>
                    {(user?.followings as unknown[]).includes(userPage._id) ?
                        <button className={styles.button} onClick={() => unfollow(userPage._id)}>Unfollow</button>
                        :
                        <button className={styles.button} onClick={() => follow(userPage._id)}>Follow</button>}
                </div>
            }
            <div className={styles.posts}>
                <h3 className={styles.postsHeader}>{userPage.username}'s posts</h3>
                {tests?.length ? <Tests tests={tests} /> : <h3>{userPage.username} has no posts yet</h3>}
            </div>
        </div> : <h1>Loading...</h1>}</> : <Navigate to={`/profile`} />
    );
};