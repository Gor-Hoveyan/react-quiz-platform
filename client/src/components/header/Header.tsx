import React, { useEffect } from 'react';
import styles from './Header.module.scss';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { isLoggedIn } from '../../services/authService';

const Header = () => {
    const logout = useUserStore(state => state.logout);
    const refresh = useUserStore(state => state.refresh);
    const setIsLogged = useUserStore(state => state.handleIsLogged);
    const isLogged = useUserStore(state => state.isLogged);
    const getUser = useUserStore(state => state.getUser);

    useEffect(() => {
        if(isLoggedIn()) {
            setIsLogged(true);
            getUser();
        } else {
            refresh();
        }
    }, []);

    return (
        <header className={styles.headerContainer}>
            <nav className={styles.nav}>
                <NavLink to='/' className={styles.navItem}>Home</NavLink>
                {isLogged && <>
                <NavLink to='/user/myTests' className={styles.navItem}>My Tests</NavLink>
                <NavLink to='/test/create' className={styles.navItem}>Create test</NavLink>
                </>}
                <div className={styles.authButtons}>
                    {isLogged ?
                        <NavLink to={'auth/login'}><button onClick={() => logout()} className={styles.button}>Logout</button></NavLink>
                        :
                        <>
                            <NavLink to={'auth/login'}><button className={styles.button}>Login</button></NavLink>
                            <NavLink  to={'auth/registration'}><button className={styles.button}>Sign Up</button></NavLink>
                        </>

                    }
                </div>
            </nav>

        </header>
    );
};

export default Header;