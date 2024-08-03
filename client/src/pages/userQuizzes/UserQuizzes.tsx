import React, { useEffect } from 'react';
import styles from './UserQuizzes.module.scss';
import { Navigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import Loader from '../../components/loader/Loader';
import AddPostBtn from '../../components/addPostBtn/AddPostBtn';
import Quizzes from '../../components/quizzes/Quizzes';

export default function UserQuizzes() {
    const getTests = useUserStore(state => state.getUserQuizzes);
    const quizzes = useUserStore(state => state.quizzes);
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
                {quizzes[0]?._id ? <>
                    <h1>{user?.username}'s quizzes</h1>
                    <Quizzes quizzes={quizzes} />
                </> : isLoading ? <Loader /> : <h1>You haven't created any quizzes yet</h1>
                }
                <AddPostBtn postType='quiz'/>
            </div> : <Navigate to={`/auth/login`} />}</>
    );
};