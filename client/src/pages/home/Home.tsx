import React, { useEffect } from 'react';
import styles from './Home.module.scss';
import useHomeStore from '../../stores/homeStore';
import Search from '../../components/search/Search';
import Pagination from '../../components/pagination/Pagination';
import Loader from '../../components/loader/Loader';
import Posts from '../../components/posts/Posts';


const Home = () => {
    const posts = useHomeStore(state => state.posts);
    const isLoading = useHomeStore(state => state.isLoading);
    const setPagination = useHomeStore(state => state.setPagination);
    const setCurrentPage = useHomeStore(state => state.setCurrentPage);
    const totalPages = useHomeStore(state => state.totalPages);
    const currentPage = useHomeStore(state => state.currentPage)

    useEffect(() => {
        setPagination();
    }, [setPagination])

    function handlePagination(page: number) {
        setCurrentPage(page);
        setPagination();
    }

    return (
        <div className={styles.main}>
            <Search />
            {posts ? <>
                <h1>Some tests for you :D</h1>
                <Posts posts={posts} />
                <Pagination currentPage={currentPage} totalPages={totalPages} handlePagination={handlePagination} />
            </> : isLoading ? <Loader /> : <h1>Posts not found</h1>
            }
        </div>
    );
};

export default Home;