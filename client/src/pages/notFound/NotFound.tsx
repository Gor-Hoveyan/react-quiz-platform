import React from 'react';
import styles from './NotFound.module.scss'
import { NavLink } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className={styles.main}>
            <img className={styles.img} src='https://i.yapx.cc/X0Gwd.png' alt='404' />
            <h1 className={styles.header}>Page not found</h1>
            <NavLink className={styles.navlink} to={'/'}><button className={styles.button}>Go to main page</button></NavLink>
        </div>
    )
}  