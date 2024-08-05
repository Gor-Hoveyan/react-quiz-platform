import React, { useEffect, useState } from 'react';
import styles from './UserProfile.module.scss';
import useUserStore, { IUserIcon, PaginationData } from '../../stores/userStore';
import { Navigate, NavLink } from 'react-router-dom';
import { MdSettings, MdChangeCircle } from 'react-icons/md';
import DragAndDrop from '../../components/dragAndDrop/DragAndDrop';
import UserData from '../../components/userData/UserData';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import { Test } from '../../stores/testStore';
import UsersList from '../../components/usersList/UsersList';
import PassedTests from '../../components/passedPosts/PassedPosts';
import { IQuiz } from '../../stores/quizStore';


export default function UserProfile() {
    const [userPostsQuery, setUserPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [likedPostsQuery, setLikedPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [savedPostsQuery, setSavedPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [passedPostsQuery, setPassedPostsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [followersQuery, setFollowersQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [followingsQuery, setFollowingsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const getUserPosts = useUserStore(state => state.getUserPosts);
    const posts = useUserStore(state => state.posts);
    const likedPosts = useUserStore(state => state.likedPosts);
    const savedPosts = useUserStore(state => state.savedPosts);
    const passedPosts = useUserStore(state => state.passedPosts);
    const followers = useUserStore(state => state.followers);
    const followings = useUserStore(state => state.followings);
    const user = useUserStore(state => state.user);
    const dropArea = useUserStore(state => state.dropArea);
    const handleDropArea = useUserStore(state => state.handleDropArea);
    const [pageState, setPageState] = useState<string>('Tests');
    const getLikedPosts = useUserStore(state => state.getLikedPosts);
    const getSavedPosts = useUserStore(state => state.getSavedPosts);
    const getPassedPosts = useUserStore(state => state.getPassedPosts);
    const getFollowers = useUserStore(state => state.getFollowers);
    const getFollowings = useUserStore(state => state.getFollowings);
    const postsCount = useUserStore(state => state.postsCount);
    const passedPostsCount = useUserStore(state => state.passedPostsCount);
    const likedPostsCount = useUserStore(state => state.likedPostsCount);
    const savedPostsCount = useUserStore(state => state.savedPostsCount);
    const followersCount = useUserStore(state => state.followersCount);
    const followingsCount = useUserStore(state => state.followingsCount)
    const clearPosts = useUserStore(state => state.clearPosts);

    useEffect(() => {
        clearPosts();
        if (user) {
            getUserPosts(user._id, userPostsQuery.page, userPostsQuery.limit);
        }
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        if (user && isFetching) {
            switch (pageState) {
                case 'Tests':
                    if (postsCount > posts.length) {
                        getUserPosts(user._id, userPostsQuery.page, userPostsQuery.limit);
                        setUserPostsQuery({ page: userPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Likes':
                    if (likedPostsCount > likedPosts.length) {
                        getLikedPosts(user._id, likedPostsQuery.page, likedPostsQuery.limit);
                        setLikedPostsQuery({ page: likedPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Saves':
                    if (savedPostsCount > savedPosts.length) {
                        getSavedPosts(savedPostsQuery.page, savedPostsQuery.limit);
                        setSavedPostsQuery({ page: savedPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Passed':
                    if (passedPostsCount > passedPosts.length) {
                        getPassedPosts(user._id, passedPostsQuery.page, passedPostsQuery.limit);
                        setPassedPostsQuery({ page: passedPostsQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Followers':
                    if (followersCount > followers.length) {
                        getFollowers(user._id, followersQuery.page, followersQuery.limit);
                        setFollowersQuery({ page: followersQuery.page + 1, limit: 10 });
                    }
                    break;
                case 'Followings':
                    if (followingsCount > followings.length) {
                        getFollowings(user._id, followingsQuery.page, followingsQuery.limit);
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

    return (user !== null ?
        <div className={styles.container}>
            {dropArea && <DragAndDrop />}
            <div className={styles.header}>

            </div>
            <div className={styles.avatarContainer}>
                <img className={styles.avatar}
                    src={user.avatarUrl.trim() ? user.avatarUrl : 'https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}
                    alt={`${user?.username}'s avatar`}
                />
                <MdChangeCircle className={styles.updateIcon} size={25} onClick={() => handleDropArea(true)} />
            </div>
            <div className={styles.details}>
                <p className={styles.username}>{user?.username}</p>
                <NavLink to={`/settings`}>
                    <MdSettings size={35} cursor={'pointer'} color='gray'
                        onMouseMove={(target) => target.currentTarget.style.color = 'black'}
                        onMouseOut={(target) => target.currentTarget.style.color = 'gray'}
                        style={{ transitionDuration: '0.4s' }}
                    />
                </NavLink>
            </div>
            <div className={styles.bio}>{user?.bio}</div>
            <UserData tests={user.createdTests.length + user.createdQuizzes.length} followers={user.followers.length}
                likes={user.likes} followings={user.followings.length} setState={setPageState}
                likedPosts={user.likedTests.length + user.likedQuizzes.length}
                savedPosts={user.savedTests.length + user.savedQuizzes.length}
                passedPosts={user.passedTests.length + user.passedQuizzes.length}
                state={pageState}
            />

            {pageState === 'Tests' && <UserProfilePosts posts={posts} />}
            {pageState === 'Likes' && <UserProfilePosts isLikedPosts={true} posts={likedPosts as (Test | IQuiz)[]} />}
            {pageState === 'Followers' && <UsersList icons={followers} isFollowers={true} />}
            {pageState === 'Followings' && <UsersList icons={followings} isFollowers={false} />}

            {pageState === 'Saves' && <UserProfilePosts isSavedPosts={true} posts={savedPosts as (Test | IQuiz)[]} />}
            {pageState === 'Passed' && <PassedTests posts={passedPosts} />}

        </div> : <Navigate to='/auth/login' />
    );
};