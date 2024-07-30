import React, { useEffect } from 'react';
import styles from './Header.module.scss';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { isLoggedIn } from '../../services/authService';
import BurgerMenu from '../burgerMenu/BurgerMenu';

const Header = () => {
    const logout = useUserStore(state => state.logout);
    const refresh = useUserStore(state => state.refresh);
    const setIsLogged = useUserStore(state => state.handleIsLogged);
    const isLogged = useUserStore(state => state.isLogged);
    const getUser = useUserStore(state => state.getUser);
    const isMenuOpen = useUserStore(state => state.isMenuOpen);
    const toggleMenu = useUserStore(state => state.toggleMenu);

    useEffect(() => {
        if (isLoggedIn()) {
            setIsLogged(true);
            getUser();
        } else {
            refresh();
        }
    }, []);

    return (
        <header className={styles.headerContainer}>

            <nav className={styles.nav}>
                <BurgerMenu isLogged={isLogged} toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} logout={logout} />

                <NavLink to='/' className={styles.navItem}>Home</NavLink>
                {isLogged && <>
                    <NavLink to='/profile' className={styles.navItem}>My Profile</NavLink>
                    <NavLink to='/user/myTests' className={styles.navItem}>My Tests</NavLink>
                    <div className={styles.dropdown}>
                        <div className={`${styles.navItem} ${styles.dropdownButton}`}>Create</div>
                        <div className={styles.dropdownContent}>
                            <NavLink to='/test/create' className={styles.navItem}>Create Test</NavLink>
                            <NavLink to='/quiz/create' className={styles.navItem}>Create Quiz</NavLink>
                        </div>
                    </div>

                </>}
                <div className={styles.authButtons}>
                    {isLogged ?
                        <NavLink to={'auth/login'}><button onClick={() => logout()} className={styles.button}>Logout</button></NavLink>
                        :
                        <>
                            <NavLink to={'auth/login'}><button className={styles.button}>Login</button></NavLink>
                            <NavLink to={'auth/registration'}><button className={styles.button}>Sign Up</button></NavLink>
                        </>

                    }

                </div>
            </nav>

        </header >
    );
};

export default Header;