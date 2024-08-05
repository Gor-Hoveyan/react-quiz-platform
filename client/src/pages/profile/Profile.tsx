import React, { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import useUserStore, { PaginationData } from '../../stores/userStore';
import UserData from '../../components/userData/UserData';
import { Navigate, useParams } from 'react-router-dom';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import UsersList from '../../components/usersList/UsersList';
import { Test } from '../../stores/testStore';
import PassedTests from '../../components/passedPosts/PassedPosts';
import Loader from '../../components/loader/Loader';

export default function Profile() {
    const [userPostsQuery, setUserPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [likedPostsQuery, setLikedPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [passedPostsQuery, setPassedPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [followersQuery, setFollowersQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [followingsQuery, setFollowingsQuery] = useState<PaginationData>({ page: 1, limit: 10 });

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
    const followers = useUserStore(state => state.followers);
    const followings = useUserStore(state => state.followings);
    const passedPostsCount = useUserStore(state => state.passedPostsCount);
    const likedPostsCount = useUserStore(state => state.likedPostsCount);
    const postsCount = useUserStore(state => state.postsCount);
    const followersCount = useUserStore(state => state.followersCount);
    const followingsCount = useUserStore(state => state.followingsCount)
    const getLikedPosts = useUserStore(state => state.getLikedPosts);
    const getPassedPosts = useUserStore(state => state.getPassedPosts);
    const getUserPosts = useUserStore(state => state.getUserPosts);
    const getFollowers = useUserStore(state => state.getFollowers);
    const getFollowings = useUserStore(state => state.getFollowings);
    const clearPosts = useUserStore(state => state.clearPosts);

    useEffect(() => {
        if (userPage && isFetching) {
            switch (pageState) {
                case 'Tests':
                    if (postsCount > posts.length) {
                        getUserPosts(userPage._id, userPostsQuery.page, userPostsQuery.limit);
                        setUserPostsQuery({ page: userPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Likes':
                    if (likedPostsCount > likedPosts.length) {
                        getLikedPosts(userPage._id, likedPostsQuery.page, likedPostsQuery.limit);
                        setLikedPostsQuery({ page: likedPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Passed':
                    if (passedPostsCount > passedPosts.length) {
                        getPassedPosts(userPage._id, passedPostsQuery.page, passedPostsQuery.limit);
                        setPassedPostsQuery({ page: passedPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                    case 'Followers':
                        if (followersCount >= followers.length) {
                            getFollowers(userPage._id, followersQuery.page, followersQuery.limit);
                            setFollowersQuery({ page: followersQuery.page + 1, limit: 10 });
                        }
                        break;
                    case 'Followings':
                        if (followingsCount >= followings.length) {
                            getFollowings(userPage._id, followingsQuery.page, followingsQuery.limit);
                            setFollowingsQuery({ page: followingsQuery.page + 1, limit: 10 });
                        }
                        break;
            }
        }
        setIsFetching(false);

    }, [isFetching]);

    useEffect(() => {
        setIsFetching(true);
        clearPosts();
    }, [pageState]);

    function scrollHandler(e: Event) {
        const target = e.target as Document;
        if (target.documentElement.scrollHeight - (target.documentElement.scrollTop + window.innerHeight) < 100) {
            setIsFetching(true);
        }
    }

    useEffect(() => {
        if (params.id) {
            getUserPage(params.id);
        }
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        clearPosts();
        if (userPage) {
            getUserPosts(userPage._id, userPostsQuery.page, userPostsQuery.limit);
        }
    }, [userPage]);


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
            {pageState === 'Followers' && <UsersList icons={followers} isFollowers={true} />}
            {pageState === 'Followings' && <UsersList icons={followings} isFollowers={false} />}
            {pageState === 'Passed' && userPage.showPassedPosts && <PassedTests posts={passedPosts} />}
        </div> : <Loader />}</> : <Navigate to={`/profile`} />
    );
};