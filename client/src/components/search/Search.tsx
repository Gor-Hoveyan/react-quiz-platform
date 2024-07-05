import styles from './Search.module.scss';
import useHomeStore from '../../stores/homeStore';

export default function Search() {
    const handleSearchVal = useHomeStore(state => state.handleSearchVal);
    const searchTests = useHomeStore(state => state.searchTests);
    const searchVal = useHomeStore(state => state.searchVal);

    function handleChange(val: string) {
        handleSearchVal(val);
        searchTests();
    }
    return (
        <header className={styles.header}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="&#x1F50E;&#xFE0E; Search for tests..."
                value={searchVal}
                onChange={e => handleChange(e.target.value)}
            />
        </header>
    );
}