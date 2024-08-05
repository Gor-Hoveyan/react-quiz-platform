import React, { useEffect, useState } from 'react';
import styles from './Search.module.scss';
import useHomeStore from '../../stores/homeStore';
import SearchFilter from '../searchFilter/SearchFilter';
import { PaginationData } from '../../stores/userStore';


export default function Search() {
    const [searchQuery, setSearchQuery] = useState<PaginationData>({ page: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const handleSearchVal = useHomeStore(state => state.handleSearchVal);
    const searchPosts = useHomeStore(state => state.searchPosts);
    const searchVal = useHomeStore(state => state.searchVal);
    const filter = useHomeStore(state => state.filter);

    function handleChange(val: string) {
        setSearchQuery({ page: 1, limit: 10 });
        handleSearchVal(val);
        searchPosts(searchQuery.page, searchQuery.limit);
    }

    useEffect(() => {
        searchPosts(searchQuery.page, searchQuery.limit);
    }, [filter, searchPosts]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return function () {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    useEffect(() => {
        if (isFetching) {
            searchPosts(searchQuery.page, searchQuery.limit);
            setSearchQuery({ page: searchQuery.page + 1, limit: 10 });
        }
    }, [isFetching])

    function scrollHandler(e: Event) {
        const target = e.target as Document;
        if (target.documentElement.scrollHeight - (target.documentElement.scrollTop + window.innerHeight) < 100) {
            setIsFetching(true);
        }
    }

    return (
        <header className={styles.header}>
            <input
                type='text'
                className={styles.searchInput}
                placeholder='&#x1F50E;&#xFE0E; Search for some tests...'
                value={searchVal}
                onChange={e => handleChange(e.target.value)}
            />
            <SearchFilter />
        </header>
    );
}