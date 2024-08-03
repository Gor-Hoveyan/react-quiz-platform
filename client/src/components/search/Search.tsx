import React, { useEffect } from 'react';
import styles from './Search.module.scss';
import useHomeStore from '../../stores/homeStore';
import SearchFilter from '../searchFilter/SearchFilter';


export default function Search() {
    const handleSearchVal = useHomeStore(state => state.handleSearchVal);
    const searchPosts = useHomeStore(state => state.searchPosts);
    const searchVal = useHomeStore(state => state.searchVal);
    const filter = useHomeStore(state => state.filter);

    function handleChange(val: string) {
        handleSearchVal(val);
        searchPosts();
    }

    useEffect(() => {
        searchPosts();
    }, [filter, searchPosts]);

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