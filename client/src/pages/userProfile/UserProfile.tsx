import React, { useEffect, useState } from 'react';
import styles from './UserProfile.module.scss';
import useUserStore, { IPassedQuiz, IPassedTest, IUserIcon } from '../../stores/userStore';
import { Navigate, NavLink } from 'react-router-dom';
import { MdSettings, MdChangeCircle } from "react-icons/md";
import DragAndDrop from '../../components/dragAndDrop/DragAndDrop';
import UserData from '../../components/userData/UserData';
import UserProfilePosts from '../../components/userProfilePosts/UserProfilePosts';
import { Test } from '../../stores/testStore';
import UsersList from '../../components/usersList/UsersList';
import PassedTests from '../../components/passedPosts/PassedPosts';
import { IQuiz } from '../../stores/quizStore';


export default function UserProfile() {
    const getUserPosts = useUserStore(state => state.getUserPosts);
    const posts = useUserStore(state => state.posts);
    const likedPosts = useUserStore(state => state.likedPosts);
    const savedPosts = useUserStore(state => state.savedPosts);
    const passedPosts = useUserStore(state => state.passedPosts);
    const user = useUserStore(state => state.user);
    const dropArea = useUserStore(state => state.dropArea);
    const handleDropArea = useUserStore(state => state.handleDropArea);
    const [pageState, setPageState] = useState<string>('Tests');

    useEffect(() => {
        if (user) {
            getUserPosts(user._id);
        }
    }, [user, getUserPosts]);

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
            />

            {pageState === 'Tests' && <UserProfilePosts posts={posts} />}
            {pageState === 'Likes' && <UserProfilePosts isLikedPosts={true} posts={likedPosts as (Test | IQuiz)[]} />}
            {pageState === 'Followers' && <UsersList icons={(user.followers as IUserIcon[])} isFollowers={true}/>}
            {pageState === 'Followings' && <UsersList icons={(user.followings as IUserIcon[])} isFollowers={false}/>}

            {pageState === 'Saves' && <UserProfilePosts isSavedPosts={true} posts={savedPosts  as (Test | IQuiz)[]} />}
            {pageState === 'Passed' && <PassedTests posts={passedPosts} />}
            
        </div> : <Navigate to='/auth/login' />
    );
};