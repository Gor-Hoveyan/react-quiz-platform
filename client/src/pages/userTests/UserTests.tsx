import React, { useEffect } from 'react';
import styles from './UserTests.module.scss';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import Loader from '../../components/loader/Loader';
import AddPostBtn from '../../components/addPostBtn/AddPostBtn';
import Posts from '../../components/posts/Posts';

export default function UserTests() {
    const getTests = useUserStore(state => state.getUserTests);
    const tests = useUserStore(state => state.tests);
    const isLogged = useUserStore(state => state.isLogged);
    const user = useUserStore(state => state.user);
    const getUser = useUserStore(state => state.getUser);
    const isLoading = useUserStore(state => state.isLoading);

    useEffect(() => {
        if (isLogged && user) {
            getTests(user._id);
        } else {
            getUser();
        }
    }, [isLogged, user, getTests, getUser])

    return (
        <>{isLogged ?
            <div className={styles.main}>
                {tests[0]?._id ? <>
                    <h1>{user?.username}'s tests</h1>
                    <Posts posts={tests} />
                </> : isLoading ?
                    <>
                        <h1>{user?.username}'s tests</h1>
                        <Loader />
                    </> :
                    <h1>You haven't created any tests yet</h1>
                }
                <AddPostBtn postType='test' />
            </div> : <Navigate to={`/auth/login`} />}</>
    );
};