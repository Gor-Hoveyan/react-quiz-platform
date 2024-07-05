import React, { useEffect } from 'react';
import styles from './Home.module.scss';
import useHomeStore from '../../stores/homeStore';
import Search from '../../components/search/Search';
import Pagination from '../../components/pagination/Pagination';
import Tests from '../../components/tests/Tests';

const Home = () => {
    const getTestIcons = useHomeStore(state => state.getTests);
    const tests = useHomeStore(state => state.tests);
    const isLoading = useHomeStore(state => state.isLoading);
    const setPagination = useHomeStore(state => state.setPagination);
    const setCurrentPage = useHomeStore(state => state.setCurrentPage);
    const totalPages = useHomeStore(state => state.totalPages);
    const currentPage = useHomeStore(state => state.currentPage)

    useEffect(() => {
        getTestIcons();
        setPagination();
    }, [getTestIcons, setPagination])

    function handlePagination(page: number) {
        setCurrentPage(page);
        setPagination();
    }

    return (
        <div className={styles.main}>
            <Search />
            {tests ? <>
                <h1>Some tests for you :D</h1>
                <Tests tests={tests} />
                <Pagination currentPage={currentPage} totalPages={totalPages} handlePagination={handlePagination} />
            </> : <h1>{isLoading ? 'Loading...' : 'Tests not found'}</h1>
            }
        </div>
    );
};

export default Home;