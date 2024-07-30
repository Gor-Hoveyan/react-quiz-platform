import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <p>&copy; {new Date().getFullYear()} Testhetic | All rights reserved.</p>
        </footer>
    );
};

export default Footer;