import React, { useEffect, useState } from 'react';
import styles from './UserQuizzes.module.scss';
import { Navigate } from 'react-router-dom';
import useUserStore, { PaginationData } from '../../stores/userStore';
import Loader from '../../components/loader/Loader';
import AddPostBtn from '../../components/addPostBtn/AddPostBtn';
import Posts from '../../components/posts/Posts';

export default function UserQuizzes() {
    const [quizzesQuery, setQuizzesQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const getTests = useUserStore(state => state.getUserQuizzes);
    const quizzes = useUserStore(state => state.quizzes);
    const isLogged = useUserStore(state => state.isLogged);
    const user = useUserStore(state => state.user);
    const getUser = useUserStore(state => state.getUser);
    const isLoading = useUserStore(state => state.isLoading);

    useEffect(() => {
        if (isLogged && user) {
            getTests(user._id, quizzesQuery.page, quizzesQuery.limit);
        } else {
            getUser();
        }
    }, [isLogged, user, getTests, getUser])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        if (isFetching && user) {
            getTests(user._id, quizzesQuery.page, quizzesQuery.limit);
            setQuizzesQuery({ page: quizzesQuery.page + 1, limit: 10 });
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
                {quizzes[0]?._id ? <>
                    <h1>{user?.username}'s quizzes</h1>
                    <Posts posts={quizzes} />
                </> : isLoading ?
                    <>
                        <h1>{user?.username}'s quizzes</h1>
                        <Loader />
                    </> :
                    <h1>You haven't created any quizzes yet</h1>
                }
                <AddPostBtn postType='quiz' />
            </div> : <Navigate to={`/auth/login`} />}</>
    );
};