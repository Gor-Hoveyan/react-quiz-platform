import React, { useEffect, useState } from 'react';
import styles from './UserTests.module.scss';
import { Navigate } from 'react-router-dom';
import useUserStore, { PaginationData } from '../../stores/userStore';
import Loader from '../../components/loader/Loader';
import AddPostBtn from '../../components/addPostBtn/AddPostBtn';
import Posts from '../../components/posts/Posts';

export default function UserTests() {
    const [testsQuery, setTestsQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const getTests = useUserStore(state => state.getUserTests);
    const tests = useUserStore(state => state.tests);
    const isLogged = useUserStore(state => state.isLogged);
    const user = useUserStore(state => state.user);
    const getUser = useUserStore(state => state.getUser);
    const isLoading = useUserStore(state => state.isLoading);

    useEffect(() => {
        if (isLogged && user) {
            getTests(user._id, testsQuery.page, testsQuery.limit);
        } else {
            getUser();
        }
    }, [isLogged, user, getTests, getUser]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        if (isFetching && user) {
            getTests(user._id, testsQuery.page, testsQuery.limit);
            setTestsQuery({ page: testsQuery.page + 1, limit: 10 });
        }
    }, [isFetching])

    function scrollHandler(e: Event) {
        const target = e.target as Document;
        if (target.documentElement.scrollHeight - (target.documentElement.scrollTop + window.innerHeight) < 100) {
            setIsFetching(true);
        }
    }

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