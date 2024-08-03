import React, { useState } from "react";
import styles from './SearchFilter.module.scss';
import useHomeStore from "../../stores/homeStore";
import { FaCheckCircle } from "react-icons/fa";
import { BsFilterLeft } from "react-icons/bs";


export default function SearchFilter() {

    const [dropdownState, setDropdownState] = useState<boolean>(false);
    const filter = useHomeStore(state => state.filter);
    const setFilter = useHomeStore(state => state.setFilter);

    function handleTestChange() {
        if (filter === 'test' || filter === 'quiz') {
            setFilter('');
        } else if (filter === '') {
            setFilter('quiz');
        }
    }

    function handleQuizChange() {
        if (filter === 'test' || filter === 'quiz') {
            setFilter('');
        } else if (filter === '') {
            setFilter('test');
        }
    }

    return (

        <div className={styles.main}>
            <div className={dropdownState ? styles.activeDropdownButton : styles.dropdownButton} onClick={() => setDropdownState(!dropdownState)}>
                <p>Filters</p>
                <BsFilterLeft size={15}/>
            </div>
            <div className={dropdownState ? styles.activeDropdown : styles.dropdown}>
                <div onClick={() => handleTestChange()}
                    className={filter === '' || filter === 'test' ? styles.activeFilter : styles.filter}
                >
                    <FaCheckCircle style={{marginRight: '3px', paddingTop: '3px'}}/>
                    Tests
                </div>
                <div onClick={() => handleQuizChange()}
                    className={filter === '' || filter === 'quiz' ? styles.activeFilter : styles.filter}
                >
                    <FaCheckCircle style={{marginRight: '3px', paddingTop: '3px'}}/>
                    Quizzes
                </div>
            </div>
        </div>
    )
}