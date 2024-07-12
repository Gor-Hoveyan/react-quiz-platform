import React from "react";
import styles from './BurgerMenu.module.scss';
import { NavLink } from "react-router-dom";

interface IProps {
    isLogged: boolean,
    toggleMenu: () => void,
    isMenuOpen: boolean,
    logout: () => void;
}

export default function BurgerMenu({ isLogged, toggleMenu, isMenuOpen, logout }: IProps) {
    return (
        <div className={styles.burgerMenu}>
            <div className={styles.burgerIcon} onClick={toggleMenu}>
                <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
                <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
                <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
            </div>
            <nav className={isMenuOpen ? styles.navMenuOpen : styles.navMenu}>
                <ul className={styles.navList}>
                    <li><NavLink to='/' className={styles.navItem} onClick={toggleMenu}>Home</NavLink></li>
                    {isLogged && <>
                        <li><NavLink to='/profile' className={styles.navItem} onClick={toggleMenu}>My Profile</NavLink></li>
                        <li><NavLink to='/user/myTests' className={styles.navItem} onClick={toggleMenu}>My Tests</NavLink></li>
                        <li><NavLink to='/test/create' className={styles.navItem} onClick={toggleMenu}>Create test</NavLink></li>
                    </>}
                    <div className={styles.authButtons}>
                        {isLogged ?
                            <li><NavLink className={styles.navItem} to={'auth/login'} onClick={() => {logout(); toggleMenu()}}>Log Out</NavLink></li>
                            :
                            <>
                                <li><NavLink className={styles.navItem} to={'auth/login'} onClick={toggleMenu}>Login</NavLink></li>
                                <li><NavLink className={styles.navItem} to={'auth/registration'} onClick={toggleMenu}>Sign Up</NavLink></li>
                            </>

                        }
                    </div>
                </ul>
            </nav>
        </div>
    );
}