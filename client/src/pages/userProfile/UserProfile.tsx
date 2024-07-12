import React, { useEffect } from 'react';
import styles from './UserProfile.module.scss';
import useUserStore from '../../stores/userStore';
import { Navigate, NavLink } from 'react-router-dom';
import Tests from '../../components/tests/Tests';
import { MdSettings, MdChangeCircle } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import DragAndDrop from '../../components/dragAndDrop/DragAndDrop';


export default function UserProfile() {
    const getTests = useUserStore(state => state.getUserTests);
    const tests = useUserStore(state => state.tests);
    const user = useUserStore(state => state.user);
    const dropArea = useUserStore(state => state.dropArea);
    const handleDropArea = useUserStore(state => state.handleDropArea);

    useEffect(() => {
        if (user) {
            getTests(user._id);
        }
    }, [user, getTests]);

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
            <div className={styles.stats}>
                <div className={styles.tests}>Tests <br />{user.createdTests.length}</div>
                <div className={styles.followers}>Followers <br />{user.followers.length}</div>
                <div className={styles.likes}>Likes <br />{user.likes}</div>
                <div className={styles.followings}>Followings <br />{user.followings.length}</div>
            </div>
            <div className={styles.posts}>
                <h3 className={styles.postsHeader}>Your posts</h3>
                {tests.length ? <Tests tests={tests} /> : <h3>You have no posts yet</h3>}
            </div>
            <div className={styles.addPost}>
                <NavLink to='/test/create'><FiPlusCircle size={70} cursor={'pointer'} color='gray'
                    onMouseMove={(target) => target.currentTarget.style.color = 'black'}
                    onMouseOut={(target) => target.currentTarget.style.color = 'gray'}
                    style={{ transitionDuration: '0.4s' }} />
                </NavLink>
            </div>
        </div> : <Navigate to='/auth/login' />
    );
};